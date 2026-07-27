// ============================================================================
// /parts/[cat] — the category browser
// ----------------------------------------------------------------------------
// This page is the reason the API bill stays flat.
//
// The first tranche of every category is rendered as a STATIC SNAPSHOT and
// regenerated at most once a day (see revalidate below). The host stores that
// snapshot durably and serves it to everyone, so ten visitors and ten thousand
// visitors cost exactly the same: fourteen API requests per category per day.
//
// Only the things a person actively asks for — "show me more", or a search
// they typed — go to /api/catalog at request time.
//
// fallback:"blocking" with an empty paths list is deliberate: a category is
// built the first time someone actually opens it, not on every deploy. A push
// that changes the CSS shouldn't cost API requests.
// ============================================================================

import { useRouter } from "next/router";
import Link from "next/link";
import PartBrowser from "../../components/PartBrowser";
import { CATS, CAT_ORDER } from "../../lib/catalog";
import { browseCategory } from "../../lib/amazon";

export default function PartsCategory({ cat, initial }) {
  const router = useRouter();
  const initialQ = router.query.q ? String(router.query.q) : "";
  const meta = CATS[cat];

  if (router.isFallback) return <div className="wrap page"><p className="muted">Loading…</p></div>;
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
      <PartBrowser cat={cat} initialQ={initialQ} initial={initial} />
    </div>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const cat = String(params.cat || "");
  if (!CATS[cat]) return { notFound: true };

  let initial = null;
  try {
    initial = await browseCategory(cat, { tranche: 0 });
  } catch (e) {
    // A failed snapshot must never take the page down. PartBrowser falls back
    // to fetching client-side, exactly as it did before this change.
    initial = null;
  }

  return {
    props: { cat, initial },
    revalidate: 86400, // once a day is as often as prices meaningfully move
  };
}
