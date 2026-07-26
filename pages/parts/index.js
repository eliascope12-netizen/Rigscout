import Link from "next/link";
import { CATS, CAT_ORDER } from "../../lib/catalog";

export default function PartsIndex() {
  return (
    <div className="wrap page">
      <span className="eyebrow">Browse parts</span>
      <h1>Every part, every price</h1>
      <p className="lead" style={{ marginBottom: 30 }}>
        Pick a category and browse the whole Amazon catalog with real specifications on every row —
        sockets, wattage, clearances — and filters that actually narrow things down.
      </p>
      <div className="catgrid">
        {CAT_ORDER.map((k) => (
          <Link key={k} href={`/parts/${k}`} className="catcard">
            <div className="ct">{CATS[k].plural}</div>
            <p>{CATS[k].blurb}</p>
            <span className="go">Browse →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
