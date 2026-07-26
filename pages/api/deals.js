// Biggest genuine price drops right now, across the categories people buy most.
// Deliberately shallow (a handful of queries) so the deals rail is cheap to
// render — the full catalog lives behind /api/catalog.
import { searchAmazon, hasLiveKey, placeholderImage } from "../../lib/amazon";
import { CATS, isRelevant, sampleCatalog } from "../../lib/catalog";
import { readSpecs } from "../../lib/specs";

const PICK = ["gpu", "cpu", "ram", "storage"];

export default async function handler(req, res) {
  try {
    if (!hasLiveKey()) {
      const s = sampleCatalog();
      const out = PICK.flatMap((c) => (s[c] || []).map((p) => ({ ...p, cat: c, image: placeholderImage(p.title), url: "https://www.amazon.com/s?k=" + encodeURIComponent(CATS[c].queries[0]), specs: readSpecs(c, p.title) })))
        .filter((p) => p.was && p.price && p.was > p.price)
        .sort((a, b) => (1 - a.price / a.was < 1 - b.price / b.was ? 1 : -1))
        .slice(0, 24);
      res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
      return res.status(200).json({ products: out, live: false });
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

    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json({ products: out, live: true });
  } catch (e) {
    res.status(200).json({ products: [], live: false, error: String(e.message || e) });
  }
}
