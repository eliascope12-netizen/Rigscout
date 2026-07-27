// ============================================================================
// /api/amazon — free-text search.
// ----------------------------------------------------------------------------
// By default this searches the stored catalog: the products already in
// data/catalog.json, which is every product this site shows anywhere. Zero API
// requests, no key required, and it cannot break.
//
// The trade is real and worth naming. Searching a shelf of a few hundred parts
// is not searching Amazon. Someone hunting an obscure part will not find it
// here, and the page says so rather than returning nothing and letting them
// assume it doesn't exist.
//
// ---------------------------------------------------------------------------
// THE UPGRADE PATH
// ---------------------------------------------------------------------------
// Search is the one surface where breadth genuinely matters, so it is the one
// surface wired to switch. Set LIVE_SEARCH=1 and RAPIDAPI_KEY in the hosting
// environment and this route starts querying Amazon directly again — nothing
// else about the site changes, and the browse pages stay free.
//
// It is deliberately off unless BOTH are set. A key on its own does nothing:
// on the hundred-request free plan a single curious visitor with a search box
// can spend a week's quota in a minute, and discovering that from a billing
// page is worse than never having switched it on. Turning it on has to be a
// decision, not an accident.
// ============================================================================
import { searchStatic, catalogAgeDays } from "../../lib/staticCatalog";

const LIVE = process.env.LIVE_SEARCH === "1" && Boolean(process.env.RAPIDAPI_KEY);

export default async function handler(req, res) {
  const q = String(req.query.q || "");

  if (LIVE) {
    try {
      const { searchAmazon } = await import("../../lib/amazon");
      const pages = req.query.pages ? parseInt(String(req.query.pages), 10) : 3;
      const result = await searchAmazon(q, { pages });
      if (result.products && result.products.length) {
        res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
        return res.status(200).json(result);
      }
      // Live came back empty — quota, key, or a genuinely odd query. Fall
      // through to the shelf rather than showing a blank page.
    } catch (e) {
      /* fall through */
    }
  }

  const data = searchStatic(q);
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).json({ ...data, ageDays: catalogAgeDays() });
}
