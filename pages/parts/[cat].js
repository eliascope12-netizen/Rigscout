// ============================================================================
// /parts/[cat] — the category browser
// ----------------------------------------------------------------------------
// Nine categories, all nine built into plain HTML when the site is deployed,
// every one of them exactly the same size.
//
// This page used to regenerate itself once a day against the live Amazon API,
// which was the cheap way to do it while there was a paid plan behind it. On
// the free plan it is not cheap enough — a hundred requests a month does not
// survive nine categories refreshing daily, and a category page that returns
// nothing because the quota ran out on the 20th is worse than one showing a
// price from the 12th.
//
// So there is no revalidate here and no API call. The products come from
// data/catalog.json, which ships with the site. Serving this page costs
// nothing, cannot fail, and looks identical on the last day of the month.
//
// The date the prices were checked is shown on the page. See PriceStamp.
// ============================================================================

import { useRouter } from "next/router";
import Link from "next/link";
import PartBrowser from "../../components/PartBrowser";
import PriceStamp from "../../components/PriceStamp";
import { CATS, CAT_ORDER } from "../../lib/catalog";
import { browseCategoryStatic, catalogMeta } from "../../lib/staticCatalog";

export default function PartsCategory({ cat, initial, builtAt, shelf, sample }) {
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
      <p className="lead" style={{ marginBottom: 14, maxWidth: 760 }}>{meta.blurb}</p>

      {/* The same number in every category, on purpose — see the build script. */}
      <p className="muted" style={{ marginTop: 0, marginBottom: 16, fontSize: 14.5, maxWidth: 760 }}>
        {sample ? (
          <>
            {shelf} {meta.plural.toLowerCase()}, ranked most-reviewed first. Every category on this
            site shows the same {shelf} — no aisle is deeper than another. Once the catalog has been
            built from Amazon, these are the {shelf} most-bought.
          </>
        ) : (
          <>
            The {shelf} most-bought {meta.plural.toLowerCase()} on Amazon, ranked by how many people
            have actually reviewed them. Every category on this site shows the same {shelf} — no
            aisle is deeper than another.
          </>
        )}
      </p>

      <PriceStamp builtAt={builtAt} sample={sample} />

      <div className="cattabs" style={{ marginTop: 16 }}>
        {CAT_ORDER.map((k) => (
          <Link key={k} href={`/parts/${k}`} className={"cattab" + (k === cat ? " on" : "")}>{CATS[k].plural}</Link>
        ))}
      </div>
      <PartBrowser cat={cat} initialQ={initialQ} initial={initial} />
    </div>
  );
}

// All nine, built at deploy time. The data is a file in the repository, so
// there is no reason to defer any of them and no cost to doing them all.
export async function getStaticPaths() {
  return { paths: CAT_ORDER.map((cat) => ({ params: { cat } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const cat = String(params.cat || "");
  if (!CATS[cat]) return { notFound: true };

  return {
    props: {
      cat,
      initial: browseCategoryStatic(cat),
      builtAt: catalogMeta().builtAt,
      shelf: catalogMeta().shelf,
      sample: catalogMeta().sample,
    },
  };
}
