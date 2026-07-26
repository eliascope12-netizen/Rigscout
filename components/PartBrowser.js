// ============================================================================
// THE PARTS BROWSER
// ----------------------------------------------------------------------------
// Wide open layout: filters down the left, a real spec table on the right,
// hundreds of rows, nothing crammed into a little box. Used both as its own
// page (/parts/gpu) and inside the PC Builder.
//
// The search box starts EMPTY. We show the whole category and let people type
// whatever they're actually looking for.
// ============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATS, COLUMNS, FACETS } from "../lib/catalog";
import { fits } from "../lib/compat";

const SORTS = [
  { k: "price", label: "Price: low to high" },
  { k: "-price", label: "Price: high to low" },
  { k: "-rating", label: "Best rated" },
  { k: "name", label: "Name A–Z" },
];

const PAGE = 40;

export default function PartBrowser({ cat, build, onPick, onClose, embedded, initialQ }) {
  const meta = CATS[cat] || {};
  const cols = COLUMNS[cat] || [];
  const facets = FACETS[cat] || [];

  // Starts empty unless the customer themselves asked for something specific
  // (e.g. they clicked "See prices" on an RTX 5070 in the Upgrade Finder).
  // We never invent a search term on their behalf.
  const [q, setQ] = useState(initialQ || "");
  const [typed, setTyped] = useState(initialQ || "");
  const [data, setData] = useState({ products: [], live: false, total: 0, more: false });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [tranche, setTranche] = useState(0);
  const [sel, setSel] = useState({});           // active filters
  const [sort, setSort] = useState("price");
  const [shown, setShown] = useState(PAGE);
  const [onlyFits, setOnlyFits] = useState(true);
  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const seen = useRef(new Set());

  const load = useCallback(async (opts) => {
    const { t = 0, query = "", append = false } = opts || {};
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const url = `/api/catalog?cat=${cat}&tranche=${t}` + (query ? `&q=${encodeURIComponent(query)}` : "");
      const r = await fetch(url);
      const j = await r.json();
      setData((prev) => {
        if (!append) { seen.current = new Set((j.products || []).map((p) => p.asin)); return j; }
        const add = (j.products || []).filter((p) => !seen.current.has(p.asin));
        add.forEach((p) => seen.current.add(p.asin));
        return { ...j, products: [...prev.products, ...add] };
      });
    } catch (e) {
      setData({ products: [], live: false, total: 0, more: false, error: String(e) });
    }
    append ? setLoadingMore(false) : setLoading(false);
  }, [cat]);

  useEffect(() => {
    const start = initialQ || "";
    setQ(start); setTyped(start); setSel({}); setShown(PAGE); setTranche(0);
    load({ t: 0, query: start });
  }, [cat, initialQ, load]);

  const submit = (e) => {
    e && e.preventDefault();
    setQ(typed); setShown(PAGE); setTranche(0); setSel({});
    load({ t: 0, query: typed });
  };

  const more = () => { const t = tranche + 1; setTranche(t); load({ t, query: q, append: true }); };

  // ---- facet values, counted -------------------------------------------
  const facetValues = useMemo(() => {
    const out = {};
    for (const f of facets) {
      const counts = new Map();
      for (const p of data.products) {
        const v = f.get(p.specs || {});
        const arr = v == null ? [] : Array.isArray(v) ? v : [v];
        for (const x of arr) counts.set(x, (counts.get(x) || 0) + 1);
      }
      let vals = [...counts.entries()].filter(([v]) => v != null && v !== "");
      vals.sort(f.sort ? (a, b) => f.sort(a[0], b[0]) : (a, b) => b[1] - a[1]);
      out[f.k] = vals.slice(0, 14);
    }
    return out;
  }, [data.products, facets]);

  // ---- filter + sort ----------------------------------------------------
  const rows = useMemo(() => {
    const lo = parseFloat(minPrice), hi = parseFloat(maxPrice);
    let list = data.products.filter((p) => {
      if (Number.isFinite(lo) && (p.price == null || p.price < lo)) return false;
      if (Number.isFinite(hi) && (p.price == null || p.price > hi)) return false;
      for (const f of facets) {
        const picked = sel[f.k];
        if (!picked || !picked.length) continue;
        const v = f.get(p.specs || {});
        const arr = v == null ? [] : Array.isArray(v) ? v : [v];
        if (!arr.some((x) => picked.includes(x))) return false;
      }
      return true;
    });

    if (build) {
      list = list.map((p) => ({ ...p, fit: fits(cat, p.specs, build) }));
      if (onlyFits) list = list.filter((p) => p.fit.ok || !p.fit.hard);
      list.sort((a, b) => (a.fit.ok === b.fit.ok ? 0 : a.fit.ok ? -1 : 1));
    }

    const by = {
      price: (a, b) => (a.price ?? 1e9) - (b.price ?? 1e9),
      "-price": (a, b) => (b.price ?? -1) - (a.price ?? -1),
      "-rating": (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.reviews ?? 0) - (a.reviews ?? 0),
      name: (a, b) => a.title.localeCompare(b.title),
    }[sort];
    const sorted = [...list].sort(by);
    if (build) sorted.sort((a, b) => (a.fit.ok === b.fit.ok ? 0 : a.fit.ok ? -1 : 1));
    return sorted;
  }, [data.products, sel, sort, minPrice, maxPrice, facets, build, cat, onlyFits]);

  const toggle = (fk, v) => {
    setShown(PAGE);
    setSel((s) => {
      const cur = s[fk] || [];
      return { ...s, [fk]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] };
    });
  };
  const clearAll = () => { setSel({}); setMinPrice(""); setMaxPrice(""); setShown(PAGE); };
  const activeCount = Object.values(sel).reduce((n, a) => n + a.length, 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const hiddenByFit = build && onlyFits
    ? data.products.filter((p) => { const f = fits(cat, p.specs, build); return !f.ok && f.hard; }).length
    : 0;

  return (
    <div className={"browser" + (embedded ? " embedded" : "")}>
      {/* ---------------- sidebar ---------------- */}
      <aside className="bx-side">
        <div className="bx-sidehead">
          <strong>Filters</strong>
          {activeCount > 0 && <button className="linkbtn" onClick={clearAll}>Clear {activeCount}</button>}
        </div>

        <div className="facet">
          <div className="fname">Price</div>
          <div className="prange">
            <input inputMode="decimal" placeholder="Min" value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setShown(PAGE); }} />
            <span>–</span>
            <input inputMode="decimal" placeholder="Max" value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setShown(PAGE); }} />
          </div>
        </div>

        {facets.map((f) => (
          (facetValues[f.k] || []).length ? (
            <div className="facet" key={f.k}>
              <div className="fname">{f.label}</div>
              {facetValues[f.k].map(([v, n]) => (
                <label className="fopt" key={String(v)}>
                  <input type="checkbox" checked={(sel[f.k] || []).includes(v)} onChange={() => toggle(f.k, v)} />
                  <span className="fv">{String(v)}</span>
                  <span className="fn">{n}</span>
                </label>
              ))}
            </div>
          ) : null
        ))}
      </aside>

      {/* ---------------- main ---------------- */}
      <div className="bx-main">
        <div className="bx-top">
          <form className="bx-search" onSubmit={submit}>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder={`Search ${meta.plural ? meta.plural.toLowerCase() : "parts"}…`}
            />
            <button className="btn sm" type="submit">Search</button>
            {q && <button type="button" className="linkbtn" onClick={() => { setTyped(""); setQ(""); setShown(PAGE); load({ t: 0 }); }}>Clear</button>}
          </form>
          <div className="bx-tools">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}
            </select>
            {onClose && <button className="linkbtn close" onClick={onClose}>Close ✕</button>}
          </div>
        </div>

        <div className="bx-count">
          {loading ? "Loading the catalog…" : (
            <>
              <strong>{rows.length.toLocaleString()}</strong> {rows.length === 1 ? (meta.label || "part").toLowerCase() : (meta.plural || "parts").toLowerCase()}
              {q ? <> matching “{q}”</> : null}
              {build && hiddenByFit > 0 && (
                <span className="fitnote"> · {hiddenByFit} that don&apos;t fit your build are hidden{" "}
                  <button className="linkbtn" onClick={() => setOnlyFits(false)}>show them anyway</button>
                </span>
              )}
              {build && !onlyFits && (
                <span className="fitnote"> · <button className="linkbtn" onClick={() => setOnlyFits(true)}>only show parts that fit</button></span>
              )}
              {!data.live && !loading && <span className="fitnote"> · sample catalog</span>}
            </>
          )}
        </div>

        <div className="ptable">
          <div className="phead">
            <span className="c-img" />
            <span className="c-name">Product</span>
            {cols.map((c) => <span className="c-spec" key={c.k}>{c.label}</span>)}
            <span className="c-rate">Rating</span>
            <span className="c-price">Price</span>
            <span className="c-act" />
          </div>

          {!loading && rows.slice(0, shown).map((p) => {
            const bad = p.fit && !p.fit.ok;
            return (
              <div className={"prow" + (bad ? (p.fit.hard ? " no" : " warn") : "")} key={p.asin}>
                <a className="c-img" href={p.url} target="_blank" rel="nofollow sponsored noopener">
                  <img src={p.image} alt="" loading="lazy" />
                </a>
                <div className="c-name">
                  <a href={p.url} target="_blank" rel="nofollow sponsored noopener" className="pname">{p.title}</a>
                  <div className="psub">
                    {p.prime && <span className="tag prime">Prime</span>}
                    {p.bestSeller && <span className="tag best">Best seller</span>}
                    {bad && <span className={"tag " + (p.fit.hard ? "nofit" : "softfit")}>{p.fit.reason}</span>}
                  </div>
                </div>
                {cols.map((c) => {
                  const v = c.get(p.specs || {});
                  return <span className="c-spec" key={c.k} data-l={c.label}>{v == null || v === "" ? "—" : String(v)}</span>;
                })}
                <span className="c-rate">{p.rating ? <>★ {p.rating.toFixed(1)}{p.reviews ? <em> ({p.reviews.toLocaleString()})</em> : null}</> : "—"}</span>
                <span className="c-price">
                  {p.price != null ? "$" + p.price.toFixed(2) : "—"}
                  {p.was && p.price && p.was > p.price ? <em className="was">${p.was.toFixed(2)}</em> : null}
                </span>
                <span className="c-act">
                  {onPick
                    ? <button className="btn sm" onClick={() => onPick(p)}>Add</button>
                    : <a className="btn sm amazon" href={p.url} target="_blank" rel="nofollow sponsored noopener">Buy</a>}
                </span>
              </div>
            );
          })}

          {loading && <div className="skeletons">{Array.from({ length: 8 }).map((_, i) => <div className="skel" key={i} />)}</div>}
          {!loading && !rows.length && (
            <div className="empty">
              <p>Nothing matched those filters.</p>
              <button className="btn sm ghost" onClick={clearAll}>Clear filters</button>
            </div>
          )}
        </div>

        {!loading && rows.length > shown && (
          <div className="bx-more"><button className="btn ghost" onClick={() => setShown((s) => s + PAGE)}>Show more ({(rows.length - shown).toLocaleString()} left)</button></div>
        )}
        {!loading && rows.length <= shown && data.more && (
          <div className="bx-more">
            <button className="btn ghost" disabled={loadingMore} onClick={more}>
              {loadingMore ? "Pulling more from Amazon…" : "Load more from Amazon"}
            </button>
            <div className="faint" style={{ fontSize: 12.5, marginTop: 8 }}>Searches deeper across the catalog — model by model, brand by brand.</div>
          </div>
        )}
      </div>
    </div>
  );
}
