// ============================================================================
// THE DEALS RAIL
// ----------------------------------------------------------------------------
// Biggest genuine price drops right now, across the categories people actually
// buy. Deliberately shallow — a handful of queries — because this shows up on
// two different pages and we are not spending real money to decorate a page.
//
// This lives in lib/ rather than in the API route so that BOTH the route and
// the build-time snapshot (getStaticProps) can call it. That's the whole
// point of the caching work: the snapshot pays the API cost once a day, and
// every visitor after that reads the snapshot for free.
// ============================================================================

import { searchAmazon, hasLiveKey, placeholderImage } from "./amazon";
import { CATS, isRelevant, sampleCatalog } from "./catalog";
import { readSpecs } from "./specs";

const PICK = ["gpu", "cpu", "ram", "storage"];

export async function topDeals() {
  if (!hasLiveKey()) {
    const s = sampleCatalog();
    const out = PICK.flatMap((c) =>
      (s[c] || []).map((p) => ({
        ...p,
        cat: c,
        image: placeholderImage(p.title),
        url: "https://www.amazon.com/s?k=" + encodeURIComponent(CATS[c].queries[0]),
        specs: readSpecs(c, p.title),
      }))
    )
      .filter((p) => p.was && p.price && p.was > p.price)
      .sort((a, b) => (1 - a.price / a.was < 1 - b.price / b.was ? 1 : -1))
      .slice(0, 24);
    return { products: out, live: false };
  }

  const batches = await Promise.all(
    PICK.map(async (c) => {
      const qs = CATS[c].queries.slice(0, 3);
      const chunks = await Promise.all(qs.map((q) => searchAmazon(q, { pages: 1 })));
      return chunks
        .flatMap((r) => r.products)
        .map((p) => ({ ...p, cat: c, specs: readSpecs(c, p.title) }))
        .filter((p) => p.price && p.was && p.was > p.price && isRelevant(c, p.title, p.specs));
    })
  );

  const seen = new Set();
  const out = batches
    .flat()
    .filter((p) => (seen.has(p.asin) ? false : (seen.add(p.asin), true)))
    .map((p) => ({ ...p, off: 1 - p.price / p.was }))
    .sort((a, b) => b.off - a.off)
    .slice(0, 24);

  // Nothing live came back — almost always the API quota, not a world with no
  // discounts in it. Show the bundled catalog rather than an empty rail, and
  // mark it honestly so no sample price pretends to be a live one.
  if (!out.length) {
    const s = sampleCatalog();
    const fallback = PICK.flatMap((c) =>
      (s[c] || []).map((p) => ({
        ...p,
        cat: c,
        image: placeholderImage(p.title),
        url: "https://www.amazon.com/s?k=" + encodeURIComponent(CATS[c].queries[0]),
        specs: readSpecs(c, p.title),
      }))
    )
      .filter((p) => p.was && p.price && p.was > p.price)
      .sort((a, b) => (1 - a.price / a.was < 1 - b.price / b.was ? 1 : -1))
      .slice(0, 24);
    return { products: fallback, live: false };
  }

  return { products: out, live: true };
}
