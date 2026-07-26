// Serverless backend: the browser calls /api/amazon?q=...  — never Amazon directly.
// Your API key stays on the server. Results are cached at the edge for a day.
import { searchAmazon } from "../../lib/amazon";

export default async function handler(req, res) {
  const q = String(req.query.q || "");
  const pages = req.query.pages ? parseInt(String(req.query.pages), 10) : 4;
  try {
    const result = await searchAmazon(q, { pages });
    res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    res.status(200).json(result);
  } catch (e) {
    res.status(200).json({ products: [], live: false, error: String(e.message || e) });
  }
}
