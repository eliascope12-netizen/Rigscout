// ============================================================================
// /api/deals — the price-drop rail.
// ----------------------------------------------------------------------------
// Derived from products already in data/catalog.json, so it costs nothing to
// serve. A deal is a real struck-through Amazon list price with a real gap
// under it, from the day the catalog was built — not a countdown, not a
// "only 3 left", not anything we made up to create a hurry.
//
// If nothing on the shelf is genuinely discounted, this returns an empty list
// and the page shows something else. That is the correct behaviour and it is
// worth stating plainly, because the alternative — loosening the threshold
// until the rail fills — is how a parts site quietly turns into a pressure
// tactic.
// ============================================================================
import { topDealsStatic, catalogAgeDays } from "../../lib/staticCatalog";

export default function handler(req, res) {
  const data = topDealsStatic(24);
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).json({ ...data, ageDays: catalogAgeDays() });
}
