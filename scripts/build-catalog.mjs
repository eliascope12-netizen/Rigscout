#!/usr/bin/env node
// ============================================================================
// BUILD THE CATALOG — run this by hand, a few times a month.
// ----------------------------------------------------------------------------
//   npm run catalog
//
// What it does, and why it exists.
//
// The free RapidAPI plan gives a hundred requests a month. A site that calls
// Amazon while a visitor is waiting will burn through that in an afternoon and
// then show everyone an empty page. So this site does not call Amazon while a
// visitor is waiting. Ever.
//
// Instead this script runs on a laptop, spends a fixed twenty-seven requests,
// and writes everything it learned to data/catalog.json. That file is committed
// to the repository and shipped with the site. From then on the live site reads
// a local file: no API key in production, no per-visit cost, no quota to run
// dry, and the same page for every visitor in every region.
//
// The arithmetic, in full:
//
//     9 categories x 3 searches each x 1 page = 27 requests per rebuild
//     100 free requests a month / 27          = 3 rebuilds a month
//
// Three rebuilds a month means prices are at most ten days old. That is the
// honest trade and the site says so on the page, next to the date this file
// was written.
//
// ---------------------------------------------------------------------------
// "THE FORTY MOST POPULAR GRAPHICS CARDS" — how the ranking works
// ---------------------------------------------------------------------------
// Showing thirty of something is easy. Showing the RIGHT thirty is the job.
// Keeping whichever thirty happened to come back first would be arbitrary, and
// arbitrary is what makes a parts site feel untrustworthy.
//
// So every candidate is ranked before anything is thrown away, and the ranking
// signal is the review count. On Amazon that number is the closest thing to a
// public sales figure: you cannot buy it, it accumulates only when people
// actually purchase, and it is roughly proportional to units sold over the
// product's life. It beats every other signal available to us for free — star
// rating alone rewards a five-star product with four reviews, and price says
// nothing about popularity at all.
//
// Review count on its own would still let a popular-but-bad product through,
// so the ranking runs in bands (see rank() below): well-reviewed and genuinely
// popular first, then merely well-reviewed, then everything else. Within each
// band, most-reviewed wins. We only reach into a lower band if the one above
// it could not fill the quota — so a category with plenty of good products
// never shows a bad one, and a thin category still fills its shelf.
//
// Then each category keeps exactly the same number. Not roughly the same —
// the same, by construction. See equalise() at the bottom of this file, and
// BALANCED_KEEP in lib/catalog.js.
// ============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { BALANCED_QUERIES, BALANCED_KEEP, CATS, CAT_ORDER, isRelevant } from "../lib/catalog.js";
import { readSpecs } from "../lib/specs.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const OUT = path.join(ROOT, "data", "catalog.json");

const HOST = "real-time-amazon-data.p.rapidapi.com";

// ---------------------------------------------------------------------------
// THE TOP-UP BUDGET
// ---------------------------------------------------------------------------
// Sometimes three searches do not turn up thirty usable products in a category
// — Amazon pads its results with accessories, and the relevance filter throws
// those out. When that happens we buy a second page for the thinnest
// categories only, cheapest problem first.
//
// Six is not an arbitrary cap. The month has to fit:
//
//     27 base + 6 top-up = 33 requests, worst case, per rebuild
//     33 x 3 rebuilds    = 99 of the 100 free requests
//
// So even a run that needs every top-up still leaves room for three rebuilds a
// month. Raise this and you get two.
// ---------------------------------------------------------------------------
const TOPUP_MAX = 6;

// If one category is genuinely broken, levelling every other category down to
// match it would gut the whole site to fix one shelf. Below this floor we stop
// levelling and report the imbalance instead. See equalise().
const MIN_SHELF = 12;

// ---------------------------------------------------------------------------
// The key. Read from the environment, or from .env.local if you keep it there.
// It is never written into data/catalog.json and never shipped to the browser.
// ---------------------------------------------------------------------------
function readKey() {
  if (process.env.RAPIDAPI_KEY) return process.env.RAPIDAPI_KEY.trim();
  try {
    const raw = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*RAPIDAPI_KEY\s*=\s*(.*)$/);
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — fall through to the error below */
  }
  return "";
}

// --- counters ---------------------------------------------------------------
let requests = 0;
let failures = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------------------------------------------------------------------------
// One search. One request. Deliberately not parallel: the free plan rate-limits
// hard, and losing a request to a 429 is losing real money from a hundred-a-
// month budget. Twenty-seven requests at a quarter-second apart is seven
// seconds. There is no hurry.
// ---------------------------------------------------------------------------
async function search(key, query, page = 1) {
  const url =
    `https://${HOST}/search?query=${encodeURIComponent(query)}` +
    `&country=US&page=${page}&sort_by=RELEVANCE`;

  requests += 1;
  const r = await fetch(url, {
    headers: { "x-rapidapi-key": key, "x-rapidapi-host": HOST },
  });

  if (r.status === 429) {
    // Rate limited, not out of quota. Wait and let the caller retry.
    throw new Error("rate limited (429) — slow down");
  }
  if (r.status === 403) {
    throw new Error("403 — key rejected, or the monthly quota is spent");
  }
  if (!r.ok) throw new Error("HTTP " + r.status);

  const json = await r.json();
  return (json && json.data && json.data.products) || [];
}

async function searchWithRetry(key, query, page = 1) {
  try {
    return await search(key, query, page);
  } catch (e) {
    // One retry, and only for the transient case. A 403 means the key or the
    // quota is the problem, and asking again just spends another request to be
    // told the same thing.
    if (/403/.test(e.message)) throw e;
    console.log(`      retrying after: ${e.message}`);
    await sleep(3000);
    try {
      return await search(key, query, page);
    } catch (e2) {
      failures += 1;
      console.log(`      gave up on "${query}": ${e2.message}`);
      return [];
    }
  }
}

function parsePrice(str) {
  if (str == null) return null;
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

// ---------------------------------------------------------------------------
// Shape one API row into the record the site stores.
//
// Note what is NOT here: the affiliate tag. lib/amazon.js appends it at fetch
// time, which is right for live data and wrong for a file that sits in a
// repository for weeks — it would freeze whatever tag existed on the day this
// ran, and changing the tag later would mean rebuilding the catalog to collect
// commission. So the stored URL is bare, and the tag is applied when the page
// renders. See lib/staticCatalog.js.
//
// Same reasoning for the placeholder image: a data-URI SVG repeated across
// hundreds of records would bloat the file for no reason. A missing photo is
// stored as null and the placeholder is drawn at render time.
// ---------------------------------------------------------------------------
function shape(p) {
  if (!p || !p.product_title || !p.asin) return null;
  const price = parsePrice(p.product_price);
  if (!price) return null; // no price means nothing to compare or link to

  return {
    asin: String(p.asin),
    title: String(p.product_title).slice(0, 220),
    price,
    was: parsePrice(p.product_original_price),
    image: p.product_photo || null,
    url: p.product_url || "https://www.amazon.com/dp/" + p.asin,
    rating: p.product_star_rating ? parseFloat(p.product_star_rating) : null,
    reviews: p.product_num_ratings ? parseInt(p.product_num_ratings, 10) : null,
    prime: Boolean(p.is_prime),
    bestSeller: Boolean(p.is_best_seller),
  };
}

// ---------------------------------------------------------------------------
// The popularity bands. Lower number sorts first.
//
//   0  Amazon's own best-seller flag. Their data, not our guess.
//   1  Well reviewed and widely bought — the main body of any healthy shelf.
//   2  Well reviewed, fewer buyers. Newer parts live here.
//   3  Decent, unremarkable.
//   4  Everything left. Reached only when a category cannot fill its quota.
// ---------------------------------------------------------------------------
function band(p) {
  const stars = p.rating || 0;
  const n = p.reviews || 0;
  if (p.bestSeller && stars >= 4.0) return 0;
  if (stars >= 4.3 && n >= 100) return 1;
  if (stars >= 4.3) return 2;
  if (stars >= 3.9) return 3;
  return 4;
}

function rank(a, b) {
  const ba = band(a);
  const bb = band(b);
  if (ba !== bb) return ba - bb;
  // Within a band: most-reviewed first. That is the popularity ordering.
  const na = a.reviews || 0;
  const nb = b.reviews || 0;
  if (na !== nb) return nb - na;
  // Tie-break on rating, then price, so the order is stable between builds
  // rather than depending on which search happened to return the row.
  if ((b.rating || 0) !== (a.rating || 0)) return (b.rating || 0) - (a.rating || 0);
  return a.price - b.price;
}

// The same product turns up in more than one search. Keep the copy with the
// most information — a later row often carries a review count or a list price
// the first one was missing.
function absorb(byAsin, rows) {
  for (const row of rows) {
    const p = shape(row);
    if (!p) continue;
    const prev = byAsin.get(p.asin);
    if (!prev) {
      byAsin.set(p.asin, p);
      continue;
    }
    byAsin.set(p.asin, {
      ...prev,
      was: prev.was || p.was,
      image: prev.image || p.image,
      rating: prev.rating ?? p.rating,
      reviews: Math.max(prev.reviews || 0, p.reviews || 0) || null,
      prime: prev.prime || p.prime,
      bestSeller: prev.bestSeller || p.bestSeller,
      price: Math.min(prev.price, p.price),
    });
  }
}

// Drop anything that is not actually this kind of part, then rank. isRelevant
// is the same filter the live site used — accessories, cables, sag brackets
// and "compatible with" listings do not belong on a parts shelf.
function usable(cat, byAsin) {
  return [...byAsin.values()]
    .filter((p) => isRelevant(cat, p.title, readSpecs(cat, p.title)))
    .sort(rank);
}

// ---------------------------------------------------------------------------
async function buildCategory(key, cat) {
  const byAsin = new Map();

  for (const q of BALANCED_QUERIES[cat]) {
    process.stdout.write(`   "${q}" ... `);
    const rows = await searchWithRetry(key, q);
    absorb(byAsin, rows);
    console.log(`${rows.length} rows`);
    await sleep(250);
  }

  return { byAsin, ranked: usable(cat, byAsin) };
}

// ---------------------------------------------------------------------------
// TOP-UP — buy a second page, but only where it is actually needed.
//
// Spend the small reserve on the thinnest categories first, and stop the
// moment every category can fill the shelf. On a good run this loop makes zero
// requests.
// ---------------------------------------------------------------------------
async function topUp(key, pools) {
  let spent = 0;

  while (spent < TOPUP_MAX) {
    // The thinnest category that is still short, and still has an unused page.
    const short = CAT_ORDER.map((cat) => ({ cat, have: pools[cat].ranked.length }))
      .filter((x) => x.have < BALANCED_KEEP && pools[x.cat].page < BALANCED_QUERIES[x.cat].length)
      .sort((a, b) => a.have - b.have);

    if (!short.length) break;

    const { cat, have } = short[0];
    const q = BALANCED_QUERIES[cat][pools[cat].page];
    pools[cat].page += 1;

    console.log(`   top-up: ${cat} has ${have} of ${BALANCED_KEEP} — page 2 of "${q}"`);
    const rows = await searchWithRetry(key, q, 2);
    spent += 1;
    absorb(pools[cat].byAsin, rows);
    pools[cat].ranked = usable(cat, pools[cat].byAsin);
    await sleep(250);
  }

  return spent;
}

// ---------------------------------------------------------------------------
// EQUALISE — the part that keeps the promise.
//
// The whole point of the free-tier catalog is that no category dwarfs another.
// Ranking gives us the best candidates; this decides how many of them each
// shelf gets, and the answer is the same number for everybody.
//
// The shelf is the smallest category, capped at the target. If graphics cards
// could fill fifty and power supplies could only fill twenty-six, everything
// shows twenty-six — the twenty-six most popular of each. Trimming the deep
// categories costs us some products; it buys a site where every aisle is the
// same size, which is what was asked for and is the more honest presentation
// anyway. A category that looks thin next to a huge one reads as "we don't
// have these", when the truth is only that we searched harder for the other.
//
// The one exception is a genuinely broken category. Levelling everything down
// to match a shelf with four products on it would destroy the site to tidy up
// one corner, so below MIN_SHELF we stop levelling and say so loudly.
// ---------------------------------------------------------------------------
function equalise(pools) {
  const depths = CAT_ORDER.map((cat) => pools[cat].ranked.length);
  const floor = Math.min(...depths);

  if (floor < MIN_SHELF) {
    return { shelf: BALANCED_KEEP, levelled: false, floor };
  }
  return { shelf: Math.min(BALANCED_KEEP, floor), levelled: true, floor };
}

// ---------------------------------------------------------------------------
async function main() {
  const key = readKey();
  if (!key) {
    console.error(
      "\nNo RAPIDAPI_KEY found.\n\n" +
        "Put it in .env.local (which is gitignored and must never be committed):\n" +
        "    RAPIDAPI_KEY=your_key_here\n\n" +
        "or pass it for one run:\n" +
        "    RAPIDAPI_KEY=your_key_here npm run catalog\n"
    );
    process.exit(1);
  }

  const planned = CAT_ORDER.length * BALANCED_QUERIES[CAT_ORDER[0]].length;
  console.log("\nBuilding the catalog.");
  console.log(`Budget: ${planned} requests, plus up to ${TOPUP_MAX} held in reserve.`);
  console.log(`Target: the ${BALANCED_KEEP} most popular of every category, equal across all nine.\n`);

  const pools = {};
  for (const cat of CAT_ORDER) {
    console.log(`${CATS[cat].plural}`);
    const { byAsin, ranked } = await buildCategory(key, cat);
    pools[cat] = { byAsin, ranked, page: 0 };
    console.log(`   -> ${ranked.length} usable of ${byAsin.size} unique\n`);
  }

  const toppedUp = await topUp(key, pools);
  if (toppedUp) console.log(`   (${toppedUp} top-up request${toppedUp === 1 ? "" : "s"} used)\n`);

  // -------------------------------------------------------------------------
  // Refuse to ship a broken catalog.
  //
  // If a category came back empty the run failed — a dead key, a spent quota,
  // an API change. Writing the file anyway would replace a good catalog with
  // an empty shelf, and cost a whole rebuild's worth of requests to find out.
  // So we write nothing, leave the committed catalog exactly as it was, and
  // say why.
  // -------------------------------------------------------------------------
  const empty = CAT_ORDER.filter((cat) => pools[cat].ranked.length === 0);
  if (empty.length) {
    console.error(
      `\nABORTED — nothing written.\n` +
        `These categories came back empty: ${empty.join(", ")}\n` +
        `The existing data/catalog.json is untouched.\n` +
        `Usual cause: the monthly quota is spent, or the key is wrong.\n` +
        `Requests used this run: ${requests}\n`
    );
    process.exit(1);
  }

  const { shelf, levelled, floor } = equalise(pools);

  const categories = {};
  const counts = {};
  const report = [];
  for (const cat of CAT_ORDER) {
    const kept = pools[cat].ranked.slice(0, shelf);
    categories[cat] = kept;
    counts[cat] = kept.length;
    report.push({ cat, kept: kept.length, pool: pools[cat].ranked.length, unique: pools[cat].byAsin.size });
  }

  // -------------------------------------------------------------------------
  // IS THIS REAL DATA?
  // -------------------------------------------------------------------------
  // The site prints "Real Amazon prices, checked <date>" over whatever is in
  // this file. That sentence has to be *earned*, not assumed, so the build
  // script decides here rather than leaving it to whoever deploys.
  //
  // The test is the ASIN. Every real Amazon product has a 10-character
  // identifier, and effectively everything currently listed begins "B0". The
  // mock harness emits things like SAMPLE0231, which fails instantly. So if
  // most of the shelf doesn't look like real Amazon stock, the catalog gets
  // flagged and the site downgrades its own claim to "sample data" on every
  // page — without anyone having to remember to do it.
  //
  // Erring toward flagging is the right bias: a real catalog wrongly labelled
  // sample is an embarrassment, a fake one labelled real is a lie.
  const asins = Object.values(categories).flat().map((p) => p.asin);
  const realLooking = asins.filter((a) => /^B0[A-Z0-9]{8}$/.test(a)).length;
  const sample = !asins.length || realLooking / asins.length < 0.8;

  const payload = {
    builtAt: new Date().toISOString(),
    shelf,
    target: BALANCED_KEEP,
    balanced: levelled,
    sample,
    requests,
    counts,
    categories,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 1));

  const kb = Math.round(fs.statSync(OUT).size / 1024);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  console.log("---------------------------------------------------------");
  if (sample) {
    console.log("!! SAMPLE DATA — these are not real Amazon listings.");
    console.log("!! The site will label every price as sample until you rebuild");
    console.log("!! this with a real RAPIDAPI_KEY. Buy links will not work.\n");
  }
  console.log(`Wrote data/catalog.json — ${total} products, ${kb} KB`);
  console.log(`Requests used: ${requests}${failures ? ` (${failures} searches failed)` : ""}`);
  console.log(`Shelf size: ${shelf} per category\n`);
  for (const r of report) {
    const spare = r.pool - r.kept;
    console.log(
      `   ${r.cat.padEnd(8)} ${String(r.kept).padStart(3)} shown` +
        (spare > 0 ? `   (${spare} more found, trimmed to keep the shelves equal)` : "")
    );
  }

  if (levelled) {
    console.log(`\nAll nine categories show exactly ${shelf} products.`);
    if (shelf < BALANCED_KEEP) {
      console.log(
        `That is ${shelf} rather than ${BALANCED_KEEP} because the thinnest category could\n` +
          `only fill ${floor}, and every shelf matches the thinnest one on purpose.`
      );
    }
  } else {
    const worst = report.reduce((a, b) => (a.pool < b.pool ? a : b));
    console.log(
      `\nWARNING — the shelves are NOT equal this run.\n` +
        `"${worst.cat}" could only fill ${worst.pool}, below the floor of ${MIN_SHELF}. Levelling\n` +
        `every category down to ${worst.pool} would gut the site to tidy one shelf, so it was\n` +
        `left alone. Check that category's searches in lib/catalog.js, then rebuild.`
    );
  }
  console.log("\nNow commit data/catalog.json and redeploy.\n");
}

main().catch((e) => {
  console.error("\nFailed: " + (e && e.message ? e.message : e));
  console.error(`Requests used before the failure: ${requests}`);
  console.error("data/catalog.json is untouched.\n");
  process.exit(1);
});
