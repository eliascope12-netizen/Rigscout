import { browseCategory, searchInCategory } from "../../lib/amazon";
import { CATS } from "../../lib/catalog";

export default async function handler(req, res) {
  const cat = String(req.query.cat || "gpu");
  if (!CATS[cat]) return res.status(400).json({ error: "Unknown category", products: [] });

  const tranche = parseInt(String(req.query.tranche || "0"), 10) || 0;
  const q = String(req.query.q || "").trim();

  const data = q
    ? await searchInCategory(cat, q, { tranche })
    : await browseCategory(cat, { tranche });

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.status(200).json({ cat, ...data });
}
