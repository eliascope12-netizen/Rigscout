// ============================================================================
// THE STORED CATALOG — where every product on this site actually comes from.
// ----------------------------------------------------------------------------
// data/catalog.json is written by scripts/build-catalog.mjs, by hand, a few
// times a month. It is committed to the repository and shipped with the site.
// This module is the only thing that reads it.
//
// The consequence worth understanding: serving a page costs zero API requests.
// Not "usually zero", not "zero after the cache warms" — zero. There is no key
// in production and nothing to call. Ten visitors and ten million visitors
// cost the same, and the monthly quota cannot run dry because nothing on the
// live site spends it.
//
// What that buys, and what it costs:
//
//   + Every price is a real price from a real Amazon listing, and every Buy
//     button goes to that exact product by ASIN. Nothing is invented.
//   + The site cannot break because a quota ran out mid-month.
//   - Prices are as old as the last rebuild — up to about ten days.
//   - Search looks through what is on our shelf, not all of Amazon.
//
// Both of those are stated on the page, next to the date. A price that might
// be a week old is fine. A price that might be a week old while the page says
// "live" is not, and that is the line this file exists to hold.
// ============================================================================

import catalog from "../data/catalog.json" with { type: "json" };
import { CATS, CAT_ORDER, isRelevant } from "./catalog.js";
import { readSpecs } from "./specs.js";
import { isRealAsin, placeholderImage } from "./placeholder.js";

// ---------------------------------------------------------------------------
// Deliberately re-declared here rather than imported from lib/amazon.js. That
// module reaches for fs, os and crypto to run its caches; this one is a pure
// reader of a JSON file, and keeping it free of those imports means it can
// never accidentally drag Node built-ins into a browser bundle. Four duplicated
// lines is a fair price for that guarantee.
// ---------------------------------------------------------------------------
function withTag(url) {
  const tag = process.env.AMAZON_ASSOCIATE_TAG;
  if (!url || !tag) return url;
  return url + (url.includes("?") ? "&" : "?") + "tag=" + encodeURIComponent(tag);
}

// ---------------------------------------------------------------------------
// Hydration.
//
// The stored record is deliberately lean: a bare Amazon URL, a null image
// where there was no photo, and no specs. All three are filled in here, at
// render time, and the reason is the affiliate tag.
//
// If the tag were baked into the URLs when the catalog was built, it would be
// frozen at whatever it was that day. Changing it — or adding it for the first
// time, which is exactly where this site is — would mean rebuilding the whole
// catalog and spending a rebuild's worth of API requests to change a query
// string. Applying it here means the tag is read fresh from the environment on
// every render, and a catalog built before the Associates account existed
// starts earning the moment the variable is set.
// ---------------------------------------------------------------------------
//
// The second thing that happens here is the one that keeps the site from
// looking broken while the catalog is placeholder data.
//
// A stored row carries an ASIN, an image URL and a product URL. If the ASIN is
// not a real Amazon identifier then neither of those URLs points at anything:
// the image draws a broken-image icon, and the buy link lands on Amazon's
// "sorry, we couldn't find that page". A visitor reads both of those as a
// broken site, not as an honest one — the caveat we print underneath doesn't
// undo the impression the broken thumbnail already made.
//
// So an unverifiable row gets a drawn tile and no link at all. Note that this
// is a per-row test, not the catalog-wide `sample` flag: it means a single dead
// listing in an otherwise real catalog degrades to the same safe state, and it
// means every row earns its photo and its link back automatically the moment
// the catalog is rebuilt against the real API. Nothing to remember to switch.
// ---------------------------------------------------------------------------
function hydrate(p, cat) {
  const real = isRealAsin(p.asin);
  return {
    ...p,
    cat,
    real,
    image: (real && p.image) || placeholderImage(p.title),
    url: real ? withTag(p.url || "https://www.amazon.com/dp/" + p.asin) : null,
    specs: readSpecs(cat, p.title),
  };
}

// --- provenance, for the "prices from ..." line on every page ---------------
export function catalogMeta() {
  return {
    builtAt: catalog.builtAt || null,
    shelf: catalog.shelf || 0,
    balanced: catalog.balanced !== false,
    // Set by the build script when the ASINs don't look like real Amazon
    // stock. Every surface that prints a price reads this and says "sample"
    // instead of "real" — see components/PriceStamp.js. Defaults to true when
    // the field is absent, because an unmarked catalog is an unverified one.
    sample: catalog.sample !== false,
    counts: catalog.counts || {},
    total: Object.values(catalog.counts || {}).reduce((a, b) => a + b, 0),
  };
}

// How stale, in whole days. Used to word the freshness line honestly rather
// than printing a raw timestamp at someone.
export function catalogAgeDays() {
  if (!catalog.builtAt) return null;
  const ms = Date.now() - new Date(catalog.builtAt).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
}

function rows(cat) {
  return (catalog.categories && catalog.categories[cat]) || [];
}

// ---------------------------------------------------------------------------
// CATEGORY BROWSE
// ---------------------------------------------------------------------------
// Every category returns the same number of products, because the build script
// already guaranteed that. There is no "load more from Amazon" any more — the
// shelf is the shelf, and it is the same size in every aisle.
// ---------------------------------------------------------------------------
export function browseCategoryStatic(cat) {
  if (!CATS[cat]) return { products: [], total: 0, more: false, stored: true };
  const products = rows(cat).map((p) => hydrate(p, cat));
  return {
    products,
    total: products.length,
    more: false,
    stored: true,
    live: false,
    builtAt: catalog.builtAt || null,
    sample: catalog.sample !== false,
  };
}

// ---------------------------------------------------------------------------
// SEARCH
// ---------------------------------------------------------------------------
// Searches the shelf, not all of Amazon. Every word has to appear somewhere in
// the title, which is a blunt rule but a predictable one — "rtx 5070 ti" finds
// the Ti cards and not the plain ones, which is what a person typing that
// means.
//
// Results are returned in catalog order, which is popularity order, so the
// most-bought match comes first rather than the alphabetically luckiest.
// ---------------------------------------------------------------------------
export function searchStatic(query, opts = {}) {
  const q = String(query || "").trim().toLowerCase();
  if (q.length < 2) return { products: [], total: 0, stored: true, live: false };

  const words = q.split(/\s+/).filter(Boolean);
  const only = opts.cat && CATS[opts.cat] ? [opts.cat] : CAT_ORDER;

  const hits = [];
  for (const cat of only) {
    for (const p of rows(cat)) {
      const t = p.title.toLowerCase();
      if (words.every((w) => t.includes(w))) hits.push(hydrate(p, cat));
    }
  }

  return {
    products: hits,
    total: hits.length,
    stored: true,
    live: false,
    searched: query,
    builtAt: catalog.builtAt || null,
    sample: catalog.sample !== false,
  };
}

export function searchInCategoryStatic(cat, query) {
  if (!query || !String(query).trim()) return browseCategoryStatic(cat);
  return { ...searchStatic(query, { cat }), more: false };
}

// ---------------------------------------------------------------------------
// THE DEALS RAIL
// ---------------------------------------------------------------------------
// Derived entirely from products already in the catalog, so it costs nothing
// at all — not a request, not a rebuild, nothing. A "deal" here means exactly
// one thing: Amazon listed a price and a higher was-price on the day we
// looked, and the gap was at least five percent.
//
// The floor matters. Amazon shows a struck-through list price on a great many
// products where the discount is a rounding error, and a rail full of "2% off"
// is the kind of manufactured urgency this site is built not to do. If nothing
// clears the bar, the rail comes back empty and the page shows something else.
// It does not invent a discount to fill the space.
// ---------------------------------------------------------------------------
const MIN_DISCOUNT = 0.05;

export function topDealsStatic(limit = 24) {
  const all = [];
  for (const cat of CAT_ORDER) {
    for (const p of rows(cat)) {
      if (!p.price || !p.was || p.was <= p.price) continue;
      const off = 1 - p.price / p.was;
      if (off < MIN_DISCOUNT) continue;
      all.push({ ...hydrate(p, cat), off });
    }
  }

  all.sort((a, b) => b.off - a.off);

  // Spread the rail across categories rather than letting one aisle with a
  // sale on it fill the whole thing. Round-robin by category, best deal first.
  const byCat = new Map();
  for (const p of all) {
    if (!byCat.has(p.cat)) byCat.set(p.cat, []);
    byCat.get(p.cat).push(p);
  }
  const queues = [...byCat.values()];
  const out = [];
  let i = 0;
  while (out.length < limit && queues.some((q) => q.length)) {
    const q = queues[i % queues.length];
    if (q.length) out.push(q.shift());
    i += 1;
  }

  return {
    products: out,
    total: out.length,
    stored: true,
    live: false,
    builtAt: catalog.builtAt || null,
    sample: catalog.sample !== false,
  };
}

// ---------------------------------------------------------------------------
// A sanity check the build can run. Exported so a test — or a curious person —
// can confirm the promise rather than take it on faith.
// ---------------------------------------------------------------------------
export function auditCatalog() {
  const counts = {};
  const problems = [];

  for (const cat of CAT_ORDER) {
    const list = rows(cat);
    counts[cat] = list.length;
    for (const p of list) {
      if (!p.asin || !/^[A-Z0-9]{10}$/i.test(p.asin)) problems.push(`${cat}: suspicious ASIN "${p.asin}"`);
      if (!p.price) problems.push(`${cat}: ${p.asin} has no price`);
      if (/[?&]tag=/.test(p.url || "")) problems.push(`${cat}: ${p.asin} has an affiliate tag baked into storage`);
      if (!isRelevant(cat, p.title, readSpecs(cat, p.title))) problems.push(`${cat}: ${p.asin} is not a ${cat}`);
    }
  }

  const sizes = [...new Set(Object.values(counts))];
  if (sizes.length > 1) problems.push(`categories are not equal: ${JSON.stringify(counts)}`);

  return { counts, equal: sizes.length === 1, problems };
}
