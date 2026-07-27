// ============================================================================
// THE TWO PIECES OF A PRODUCT ROW THAT CAN FAIL IN PUBLIC
// ----------------------------------------------------------------------------
// A product photo and a buy link are the only two things on this site that
// depend on something outside it still being there. When they break they break
// visibly — a broken-image icon, or Amazon's "sorry, we couldn't find that
// page" dog — and both read to a visitor as "this site is broken", which is a
// worse impression than the truth in either case.
//
// So every product photo and every buy link on the site goes through here.
// ============================================================================

import { placeholderImage } from "../lib/placeholder";

// ---------------------------------------------------------------------------
// The photo.
//
// Two failure modes, one fallback. Either the row never had a photo (handled
// upstream in lib/staticCatalog.js, which substitutes a drawn tile), or the URL
// was fine when the catalog was built and has since stopped resolving — Amazon
// re-hosts images, listings get pulled. That second case can only be caught
// here, in the browser, when the load actually fails.
//
// The `data-fell` guard matters: setting src from inside onError can retrigger
// onError, and without the flag a genuinely unloadable image spins forever.
// ---------------------------------------------------------------------------
export function ProductImage({ p, alt = "", className }) {
  return (
    <img
      className={className}
      src={p.image}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        const el = e.currentTarget;
        if (el.dataset.fell) return;
        el.dataset.fell = "1";
        el.src = placeholderImage(p.title);
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// The link.
//
// lib/staticCatalog.js sets `url` to null for any row whose ASIN doesn't look
// like real Amazon stock. That is the whole signal this component needs: no
// URL means there is nothing honest to link to, so it renders the same content
// as plain text rather than as a link that goes somewhere useless.
//
// Deliberately not a disabled <a href="#">: a link that looks clickable and
// does nothing is more annoying than one that was never a link.
// ---------------------------------------------------------------------------
export function ProductLink({ p, className, children, title }) {
  if (!p.url) {
    return (
      <span
        className={(className ? className + " " : "") + "unlinked"}
        title={title || "Example data — there is no real Amazon listing behind this row yet"}
      >
        {children}
      </span>
    );
  }
  return (
    <a className={className} href={p.url} target="_blank" rel="nofollow sponsored noopener" title={title}>
      {children}
    </a>
  );
}

// The buy button specifically. When there is no listing it says so, in the
// space where the button would have been, rather than leaving a gap that looks
// like a rendering bug.
export function BuyButton({ p, className = "btn sm amazon", label = "Buy" }) {
  if (!p.url) {
    return (
      <span className="examplechip" title="Example data — a real link appears here once the catalog is built from Amazon">
        Example
      </span>
    );
  }
  return (
    <a className={className} href={p.url} target="_blank" rel="nofollow sponsored noopener">
      {label}
    </a>
  );
}
