// ============================================================================
// WHAT A ROW LOOKS LIKE WHEN THERE IS NO REAL LISTING BEHIND IT
// ----------------------------------------------------------------------------
// Two tiny helpers, in their own file for one reason: both the server-side
// catalog reader and the browser components need them, and lib/staticCatalog.js
// imports the whole catalog JSON. Importing that into a client component to get
// at a six-line function would ship the entire product database to every
// visitor's browser.
//
// Nothing here touches fs, the network, or the catalog. It is safe everywhere.
// ============================================================================

// ---------------------------------------------------------------------------
// A real Amazon product identifier is ten characters, and effectively
// everything Amazon currently lists begins "B0". This is the same test the
// build script uses to decide whether the catalog it just wrote deserves to be
// called real (see scripts/build-catalog.mjs), kept here so that the *rendering*
// side can make the same judgement one row at a time.
//
// Why per-row and not just the catalog-wide `sample` flag: the flag governs the
// wording on the page, but a fake ASIN causes two things no amount of wording
// fixes — an <img> pointing at an Amazon CDN path that does not exist, which
// draws a broken-image icon, and a Buy button that lands on Amazon's "we
// couldn't find that page". Both look like the site is broken rather than like
// the site is honest. So a row that cannot be verified gets a drawn tile and no
// link at all, and earns both back automatically the moment real data arrives.
// ---------------------------------------------------------------------------
export const REAL_ASIN = /^B0[A-Z0-9]{8}$/i;

export function isRealAsin(asin) {
  return Boolean(asin && REAL_ASIN.test(String(asin)));
}

// A drawn stand-in, as a data URI so it needs no network request and cannot
// itself fail to load. Used for products with no photo, for rows that aren't
// real listings, and as the fallback when a real Amazon image 404s.
export function placeholderImage(label) {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='230'>` +
    `<rect width='100%' height='100%' fill='#eef2fb'/>` +
    `<g fill='#8aa0c8' font-family='system-ui' text-anchor='middle'>` +
    `<text x='150' y='110' font-size='40'>🖥️</text>` +
    `<text x='150' y='150' font-size='13'>${escapeXml((label || "Product").slice(0, 22))}</text>` +
    `</g></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

// Product titles contain & and < often enough to matter, and an unescaped one
// makes the SVG unparseable — which would replace the fallback image with a
// broken image, i.e. exactly the thing this file exists to prevent.
function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
