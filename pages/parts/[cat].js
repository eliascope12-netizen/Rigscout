import { useRouter } from "next/router";
import Link from "next/link";
import PartBrowser from "../../components/PartBrowser";
import { CATS, CAT_ORDER } from "../../lib/catalog";

export default function PartsCategory() {
  const router = useRouter();
  const cat = String(router.query.cat || "");
  const initialQ = router.query.q ? String(router.query.q) : "";
  const meta = CATS[cat];

  if (!router.isReady) return <div className="wrap page"><p className="muted">Loading…</p></div>;
  if (!meta) {
    return (
      <div className="wrap page">
        <h1>Pick a category</h1>
        <div className="cattabs">{CAT_ORDER.map((k) => <Link key={k} href={`/parts/${k}`} className="cattab">{CATS[k].plural}</Link>)}</div>
      </div>
    );
  }

  return (
    <div className="widewrap page">
      <span className="eyebrow">Browse parts</span>
      <h1 style={{ fontSize: 34, marginBottom: 8 }}>{meta.plural}</h1>
      <p className="lead" style={{ marginBottom: 18, maxWidth: 760 }}>{meta.blurb}</p>
      <div className="cattabs">
        {CAT_ORDER.map((k) => (
          <Link key={k} href={`/parts/${k}`} className={"cattab" + (k === cat ? " on" : "")}>{CATS[k].plural}</Link>
        ))}
      </div>
      <PartBrowser cat={cat} initialQ={initialQ} />
    </div>
  );
}
