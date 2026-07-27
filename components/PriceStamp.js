// ============================================================================
// THE PRICE STAMP
// ----------------------------------------------------------------------------
// One small line, and the most important honest thing on the site.
//
// This site does not show live prices. It shows real prices, checked on a real
// date, from real Amazon listings — and then it tells you which date. Those
// are different claims, and only the second one is true here, so only the
// second one gets made.
//
// The temptation to write "live prices" on a page serving week-old data is
// exactly the kind of small lie regulators have started fining people for. The
// New York Attorney General's $2.6M penalty against Fareportal was for invented
// countdown timers and viewer counts — a site saying something about urgency
// that wasn't so. A stale price honestly labelled costs a customer nothing. A
// stale price labelled "live" costs their trust the first time they click
// through and find a different number.
//
// ---------------------------------------------------------------------------
// WHY THE "6 DAYS AGO" PART IS COMPUTED IN THE BROWSER
// ---------------------------------------------------------------------------
// This is the subtle bit, and getting it wrong would quietly reintroduce the
// exact dishonesty the component exists to prevent.
//
// The pages are static HTML, built when the site is deployed. Anything
// calculated during that build is frozen into the file forever. If the age in
// days were worked out there, it would say "checked today" on the day of the
// deploy — and go on saying "checked today" a fortnight later, because nothing
// recalculates it.
//
// So the fixed date, which never changes and is always true, is rendered on
// the server. The relative phrase, which depends on when someone is actually
// looking, is filled in by the browser after the page loads. It arrives a
// fraction of a second late and it is always right, which is the correct trade
// for a claim about freshness.
// ============================================================================

import { useEffect, useState } from "react";

function wordDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function relative(iso) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const days = Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

export default function PriceStamp({ builtAt, count, compact, sample }) {
  const [rel, setRel] = useState(null);

  useEffect(() => {
    if (builtAt) setRel(relative(builtAt));
  }, [builtAt]);

  const when = wordDate(builtAt);

  // -------------------------------------------------------------------------
  // SAMPLE CATALOG
  // -------------------------------------------------------------------------
  // The build script flags the catalog when the ASINs in it aren't real Amazon
  // identifiers — which is what happens before anyone has run a real build.
  // Everything else on the site works normally in that state, so the only
  // thing that must not happen is this badge claiming the prices are real.
  //
  // It would be easy to leave the badge alone and rely on remembering to
  // rebuild before launch. That is precisely the sort of thing nobody
  // remembers, so the page says it out loud instead, in the same spot the real
  // claim would go, where it cannot be missed.
  if (sample) {
    if (compact) {
      return (
        <span className="faint" style={{ fontSize: 12.5 }}>
          Example prices — not live listings
        </span>
      );
    }
    return (
      <div className="badge-live" title="This catalog has not been built against Amazon yet">
        <span className="dot" />
        <span>
          <strong>Example data.</strong> These are placeholder prices for layout, not real Amazon
          listings, and the buy links won&apos;t reach a product.{" "}
          <span className="faint">Real prices appear once the catalog is built.</span>
        </span>
      </div>
    );
  }

  if (!when) return null;

  if (compact) {
    return (
      <span className="faint" style={{ fontSize: 12.5 }}>
        Prices checked {when}
        {rel ? ` — ${rel}` : ""}
      </span>
    );
  }

  return (
    <div className="badge-live" title={`Catalog built ${when}`}>
      <span className="dot on" />
      <span>
        Real Amazon prices, checked <strong>{when}</strong>
        {rel ? ` (${rel})` : ""}
        {count ? ` · ${count.toLocaleString()} products` : ""}
        {" · "}
        <span className="faint">they may have moved since</span>
      </span>
    </div>
  );
}
