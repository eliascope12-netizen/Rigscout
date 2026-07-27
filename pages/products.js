import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { CATS, CAT_ORDER } from "../lib/catalog";
import PriceStamp from "../components/PriceStamp";
import { topDealsStatic, catalogMeta } from "../lib/staticCatalog";

const STEP = 32;

export default function Products({ deals: snapshot, builtAt, shelf, total, sample }) {
  const router = useRouter();
  const [q, setQ] = useState("");              // starts empty — always
  const [typed, setTyped] = useState("");
  const [data, setData] = useState({ products: [], live: false });
  const [deals, setDeals] = useState(snapshot || { products: [], live: false });
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(STEP);
  const [sort, setSort] = useState("relevance");

  const run = useCallback(async (query) => {
    if (!query || !query.trim()) { setData({ products: [], live: false }); setQ(""); return; }
    setLoading(true); setQ(query); setShown(STEP);
    try {
      const r = await fetch("/api/amazon?q=" + encodeURIComponent(query) + "&pages=3");
      setData(await r.json());
    } catch (e) { setData({ products: [], live: false, error: String(e) }); }
    setLoading(false);
  }, []);

  // A query in the URL (the Upgrade Finder links here) still works — but we
  // never invent one for the customer.
  useEffect(() => {
    if (!router.isReady) return;
    const initial = router.query.q ? String(router.query.q) : "";
    if (initial) { setTyped(initial); run(initial); }
  }, [router.isReady, router.query.q, run]);

  // Same once-a-day snapshot the home page uses. Only fetch if it's missing.
  useEffect(() => {
    if (snapshot) return;
    fetch("/api/deals").then((r) => r.json()).then(setDeals).catch(() => {});
  }, [snapshot]);

  const sorted = [...data.products].sort(
    sort === "price" ? (a, b) => (a.price ?? 1e9) - (b.price ?? 1e9)
      : sort === "-price" ? (a, b) => (b.price ?? -1) - (a.price ?? -1)
        : sort === "-rating" ? (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
          : () => 0
  );

  return (
    <div className="wrap page">
      <span className="eyebrow">Deals &amp; search</span>
      <h1>Search the catalog</h1>
      <p className="lead" style={{ marginBottom: 24 }}>
        Type a model number, a brand, a capacity — “RTX 5070”, “7800X3D”, “850W”, “2TB”. You are
        searching {total ? total.toLocaleString() : "a few hundred"}{" "}
        {sample ? "example listings" : "real Amazon listings"}: the {shelf} most-bought products in
        each of the nine categories, not all of Amazon.
      </p>

      <form className="searchbar" onSubmit={(e) => { e.preventDefault(); run(typed); }}>
        <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Search any part…" autoComplete="off" />
        <button className="btn" type="submit">Search</button>
      </form>

      <PriceStamp builtAt={builtAt} count={total} sample={sample} />

      {q ? (
        <>
          <div className="resbar">
            <div><strong>{data.products.length.toLocaleString()}</strong> results for “{q}”</div>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">Most relevant</option>
              <option value="price">Price: low to high</option>
              <option value="-price">Price: high to low</option>
              <option value="-rating">Best rated</option>
            </select>
          </div>

          {loading ? <p className="muted">Searching for “{q}”…</p> : (
            sorted.length ? (
              <>
                <div className="prodgrid">{sorted.slice(0, shown).map((p, i) => <ProductCard key={p.asin + i} p={p} />)}</div>
                {sorted.length > shown && (
                  <div className="bx-more"><button className="btn ghost" onClick={() => setShown((s) => s + STEP)}>Show more ({sorted.length - shown} left)</button></div>
                )}
              </>
            ) : (
              <div className="muted">
                <p style={{ marginBottom: 6 }}>Nothing on the shelf matches “{q}”.</p>
                <p style={{ marginTop: 0, fontSize: 14.5 }}>
                  This searches the {total ? total.toLocaleString() : ""} products in our catalog, not the whole
                  of Amazon — so a part can be perfectly real and still not be here. Try a broader
                  term (“RTX 5070” rather than a specific board partner), or{" "}
                  <a className="ilink" href={"https://www.amazon.com/s?k=" + encodeURIComponent(q)} target="_blank" rel="noopener noreferrer nofollow">
                    search Amazon directly for “{q}”
                  </a>.
                </p>
              </div>
            )
          )}

          <p className="faint" style={{ marginTop: 34, fontSize: 13.5 }}>
            Looking for a whole category with filters and spec columns? Try the{" "}
            <Link href="/parts" className="ilink">parts browser</Link> instead.
          </p>
        </>
      ) : (
        <>
          <h2 style={{ marginTop: 34 }}>Browse a category</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 18, fontSize: 15 }}>
            The full catalog, with filters and real specifications on every row.
          </p>
          <div className="cattabs big">
            {CAT_ORDER.map((k) => <Link key={k} href={`/parts/${k}`} className="cattab">{CATS[k].plural}</Link>)}
          </div>

          <h2 style={{ marginTop: 44 }}>Price drops</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 15 }}>
            Parts Amazon was listing below their usual price when we last checked. No countdowns, no
            “only 2 left” — just the gap between the two numbers Amazon showed.
          </p>
          {deals.products.length ? (
            <div className="prodgrid">{deals.products.map((p, i) => <ProductCard key={p.asin + i} p={p} />)}</div>
          ) : (
            <p className="muted">
              Nothing on the shelf was meaningfully discounted when the catalog was last built. Rather
              than pad this out with two-percent “deals”, it stays empty.
            </p>
          )}
        </>
      )}
    </div>
  );
}

// Everything on this page — the rail and the search box — reads the catalog
// that shipped with the site. No API key, no requests, nothing to run dry.
export async function getStaticProps() {
  const meta = catalogMeta();
  return {
    props: {
      deals: topDealsStatic(24),
      builtAt: meta.builtAt,
      shelf: meta.shelf,
      total: meta.total,
      sample: meta.sample,
    },
  };
}
