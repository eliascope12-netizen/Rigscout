// ============================================================================
// /api/catalog — one category from the stored catalog.
// ----------------------------------------------------------------------------
// This route used to call Amazon. It doesn't any more, and that is the whole
// point of the free-tier rebuild: there is no API key in production, so there
// is nothing here that can spend a request, run a quota dry, or return an
// empty aisle at the end of the month.
//
// Everything it serves came from data/catalog.json, which was built by hand
// with scripts/build-catalog.mjs. Reading a bundled JSON file is fast enough
// that the cache header below is about saving the function invocation, not
// about saving money.
// ============================================================================
import { browseCategoryStatic, searchInCategoryStatic, catalogAgeDays } from "../../lib/staticCatalog";
import { CATS } from "../../lib/catalog";

export default function handler(req, res) {
  const cat = String(req.query.cat || "gpu");
  if (!CATS[cat]) return res.status(400).json({ error: "Unknown category", products: [] });

  const q = String(req.query.q || "").trim();
  const data = q ? searchInCategoryStatic(cat, q) : browseCategoryStatic(cat);

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).json({ cat, ...data, ageDays: catalogAgeDays() });
}
