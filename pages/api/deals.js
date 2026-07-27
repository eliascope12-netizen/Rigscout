// Thin wrapper. The real work lives in lib/deals.js so the once-a-day page
// snapshot can call it too — see pages/index.js and pages/products.js.
import { topDeals } from "../../lib/deals";

export default async function handler(req, res) {
  try {
    const data = await topDeals();
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json({ products: [], live: false, error: String(e.message || e) });
  }
}
