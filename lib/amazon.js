// ============================================================================
// Live Amazon data — server-side only (your API key never leaves the server).
// ----------------------------------------------------------------------------
// Uses the "Real-Time Amazon Data" API on RapidAPI when RAPIDAPI_KEY is set.
// With NO key it falls back to a full built-in catalog built from the real
// spec database, so every page of the site still works.
//
// Breadth is the whole point here: a single Amazon search returns about
// sixteen usable results. To show hundreds we fan out across many queries and
// several pages per query, then merge everything on ASIN.
// ============================================================================

import { readSpecs } from "./specs";
import { CATS, TRANCHE_SIZE, isRelevant, sampleCatalog } from "./catalog";

const HOST = "real-time-amazon-data.p.rapidapi.com";

// One page of one query is cached on its own, so overlapping searches reuse
// each other's work instead of spending another API call.
const PAGE_CACHE = new Map();
const PAGE_TTL = 1000 * 60 * 60 * 24; // 24h — prices refresh daily on their own

const PAGES_PER_QUERY = Math.max(1, parseInt(process.env.CATALOG_PAGES || "2", 10));

function parsePrice(str) {
  if (str == null) return null;
  const n = parseFloat(String(str).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function withTag(url) {
  const tag = process.env.AMAZON_ASSOCIATE_TAG;
  if (!url || !tag) return url;
  return url + (url.includes("?") ? "&" : "?") + "tag=" + encodeURIComponent(tag);
}

export function placeholderImage(label) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='230'><rect width='100%' height='100%' fill='#eef2fb'/><g fill='#8aa0c8' font-family='system-ui' text-anchor='middle'><text x='150' y='110' font-size='40'>🖥️</text><text x='150' y='150' font-size='13'>${(label || "Product").slice(0, 22)}</text></g></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

export function hasLiveKey() {
  return Boolean(process.env.RAPIDAPI_KEY);
}

function normalise(p) {
  if (!p || !p.product_title) return null;
  return {
    asin: p.asin,
    title: p.product_title,
    price: parsePrice(p.product_price),
    was: parsePrice(p.product_original_price),
    image: p.product_photo || placeholderImage(p.product_title),
    url: withTag(p.product_url || (p.asin ? "https://www.amazon.com/dp/" + p.asin : "https://www.amazon.com")),
    rating: p.product_star_rating ? parseFloat(p.product_star_rating) : null,
    reviews: p.product_num_ratings ? parseInt(p.product_num_ratings, 10) : null,
    prime: Boolean(p.is_prime),
    bestSeller: Boolean(p.is_best_seller),
  };
}

// --- one page of one query, cached -----------------------------------------
async function fetchPage(query, page) {
  const ck = query + "::" + page;
  const hit = PAGE_CACHE.get(ck);
  if (hit && Date.now() - hit.t < PAGE_TTL) return hit.v;

  const key = process.env.RAPIDAPI_KEY;
  if (!key) return [];

  try {
    const url = `https://${HOST}/search?query=${encodeURIComponent(query)}&country=US&page=${page}&sort_by=RELEVANCE`;
    const r = await fetch(url, { headers: { "x-rapidapi-key": key, "x-rapidapi-host": HOST } });
    if (!r.ok) throw new Error("API " + r.status);
    const json = await r.json();
    const items = ((json && json.data && json.data.products) || []).map(normalise).filter(Boolean);
    PAGE_CACHE.set(ck, { t: Date.now(), v: items });
    return items;
  } catch (e) {
    // Cache the miss briefly so a broken key doesn't hammer the API.
    PAGE_CACHE.set(ck, { t: Date.now() - PAGE_TTL + 60000, v: [] });
    return [];
  }
}

// Run a batch of fetches without stampeding the API.
async function inBatches(jobs, size = 5) {
  const out = [];
  for (let i = 0; i < jobs.length; i += size) {
    const chunk = await Promise.all(jobs.slice(i, i + size).map((f) => f()));
    for (const c of chunk) out.push(...c);
  }
  return out;
}

function dedupe(items) {
  const seen = new Map();
  for (const p of items) {
    if (!p || !p.asin) continue;
    const prev = seen.get(p.asin);
    // Keep the copy with the most information / lowest price.
    if (!prev || (p.price && (!prev.price || p.price < prev.price))) seen.set(p.asin, prev ? { ...prev, ...p } : p);
  }
  return [...seen.values()];
}

// ---------------------------------------------------------------------------
// FREE-TEXT SEARCH — the Deals & Search page
// ---------------------------------------------------------------------------
export async function searchAmazon(query, opts = {}) {
  const q = (query || "").trim();
  if (!q) return { products: [], live: false, total: 0 };

  const pages = Math.max(1, Math.min(7, opts.pages || 4));
  if (!hasLiveKey()) {
    const all = Object.values(sampleCatalog()).flat();
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = all
      .filter((p) => words.every((w) => p.title.toLowerCase().includes(w)))
      .map((p) => ({ ...p, image: placeholderImage(p.title), url: withTag("https://www.amazon.com/s?k=" + encodeURIComponent(q)) }));
    return { products: hits.slice(0, 300), live: false, total: hits.length, sample: true };
  }

  const jobs = [];
  for (let p = 1; p <= pages; p++) jobs.push(() => fetchPage(q, p));
  const products = dedupe(await inBatches(jobs));
  return { products, live: products.length > 0, total: products.length };
}

// ---------------------------------------------------------------------------
// CATEGORY BROWSE — the parts browser. This is where the depth comes from.
// ---------------------------------------------------------------------------
export async function browseCategory(cat, opts = {}) {
  const c = CATS[cat];
  if (!c) return { products: [], live: false, total: 0, more: false };

  const tranche = Math.max(0, parseInt(opts.tranche || 0, 10));
  const pages = Math.max(1, Math.min(5, opts.pages || PAGES_PER_QUERY));

  // Sample mode: hand back the whole built-in catalog for this category.
  if (!hasLiveKey()) {
    const list = (sampleCatalog()[cat] || []).map((p) => ({
      ...p,
      image: placeholderImage(p.title),
      url: withTag("https://www.amazon.com/s?k=" + encodeURIComponent(c.queries[0])),
      specs: readSpecs(cat, p.title),
    }));
    return { products: list, live: false, total: list.length, more: false, sample: true };
  }

  // Every tranche up to and including the requested one, so "show more" grows
  // the list instead of replacing it.
  const queries = c.queries.slice(0, (tranche + 1) * TRANCHE_SIZE);
  const jobs = [];
  for (const q of queries) for (let p = 1; p <= pages; p++) jobs.push(() => fetchPage(q, p));

  const raw = dedupe(await inBatches(jobs));
  const products = raw
    .map((p) => ({ ...p, specs: readSpecs(cat, p.title) }))
    .filter((p) => p.price && isRelevant(cat, p.title, p.specs));

  return {
    products,
    live: raw.length > 0,
    total: products.length,
    scanned: raw.length,
    more: queries.length < c.queries.length,
    tranche,
  };
}

// Category browse plus a customer's own keyword, merged. Used when someone
// types in the browser's search box — their words win, the category keeps the
// results honest.
export async function searchInCategory(cat, query, opts = {}) {
  const q = (query || "").trim();
  if (!q) return browseCategory(cat, opts);
  const c = CATS[cat];

  if (!hasLiveKey()) {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = (sampleCatalog()[cat] || [])
      .filter((p) => words.every((w) => p.title.toLowerCase().includes(w)))
      .map((p) => ({ ...p, image: placeholderImage(p.title), url: withTag("https://www.amazon.com/s?k=" + encodeURIComponent(q)), specs: readSpecs(cat, p.title) }));
    return { products: list, live: false, total: list.length, more: false, sample: true };
  }

  const variants = [q, `${q} ${c ? c.label.toLowerCase() : ""}`.trim()];
  const jobs = [];
  for (const v of variants) for (let p = 1; p <= 3; p++) jobs.push(() => fetchPage(v, p));
  const raw = dedupe(await inBatches(jobs));
  const products = raw
    .map((p) => ({ ...p, specs: readSpecs(cat, p.title) }))
    .filter((p) => p.price && (!c || !c.exclude || !c.exclude.test(p.title)));
  return { products, live: raw.length > 0, total: products.length, more: false, searched: q };
}
