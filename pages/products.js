import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import { CATS, CAT_ORDER } from "../lib/catalog";

const STEP = 32;

export default function Products() {
  const router = useRouter();
  const [q, setQ] = useState("");              // starts empty — always
  const [typed, setTyped] = useState("");
  const [data, setData] = useState({ products: [], live: false });
  const [deals, setDeals] = useState({ products: [], live: false });
  const [loading, setLoading] = useState(false);
  const [shown, setShown] = useState(STEP);
  const [sort, setSort] = useState("relevance");

  const run = useCallback(async (query) => {
    if (!query || !query.trim()) { setData({ products: [], live: false }); setQ(""); return; }
    setLoading(true); setQ(query); setShown(STEP);
    try {
      const r = await fetch("/api/amazon?q=" + encodeURIComponent(query) + "&pages=5");
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

  useEffect(() => {
    fetch("/api/deals").then((r) => r.json()).then(setDeals).catch(() => {});
  }, []);

  const sorted = [...data.products].sort(
    sort === "price" ? (a, b) => (a.price ?? 1e9) - (b.price ?? 1e9)
      : sort === "-price" ? (a, b) => (b.price ?? -1) - (a.price ?? -1)
        : sort === "-rating" ? (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
          : () => 0
  );

  return (
    <div className="wrap page">
      <span className="eyebrow">Deals &amp; live search</span>
      <h1>Search Amazon, live</h1>
      <p className="lead" style={{ marginBottom: 24 }}>
        Type anything — a model number, a brand, a budget part. Prices and photos come straight from Amazon, right now.
      </p>

      <form className="searchbar" onSubmit={(e) => { e.preventDefault(); run(typed); }}>
        <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Search any part…" autoComplete="off" />
        <button className="btn" type="submit">Search</button>
      </form>

      <div className="badge-live">
        <span className={"dot " + ((q ? data.live : deals.live) ? "on" : "off")} />
        {(q ? data.live : deals.live)
          ? "Live prices from Amazon"
          : "Sample catalog — add your RapidAPI key to switch on live prices (see README)"}
      </div>

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

          {loading ? <p className="muted">Searching Amazon for “{q}”…</p> : (
            sorted.length ? (
              <>
                <div className="prodgrid">{sorted.slice(0, shown).map((p, i) => <ProductCard key={p.asin + i} p={p} />)}</div>
                {sorted.length > shown && (
                  <div className="bx-more"><button className="btn ghost" onClick={() => setShown((s) => s + STEP)}>Show more ({sorted.length - shown} left)</button></div>
                )}
              </>
            ) : <p className="muted">Nothing came back for that. Try a model number — “RTX 5070 Ti”, “7800X3D”, “850W”.</p>
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

          <h2 style={{ marginTop: 44 }}>Biggest price drops right now</h2>
          <p className="muted" style={{ marginTop: 0, marginBottom: 20, fontSize: 15 }}>
            Live discounts on the parts people buy most — refreshed automatically.
          </p>
          {deals.products.length ? (
            <div className="prodgrid">{deals.products.map((p, i) => <ProductCard key={p.asin + i} p={p} />)}</div>
          ) : <p className="muted">Loading today&apos;s deals…</p>}
        </>
      )}
    </div>
  );
}
