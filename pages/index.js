import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "../components/ProductCard";
import DiscordCTA from "../components/DiscordCTA";
import { CATS, CAT_ORDER } from "../lib/catalog";
import PriceStamp from "../components/PriceStamp";
import { topDealsStatic, catalogMeta } from "../lib/staticCatalog";

const POPULAR = [
  { q: "RTX 5070", cat: "gpu" },
  { q: "RTX 5060 Ti", cat: "gpu" },
  { q: "RX 9070 XT", cat: "gpu" },
  { q: "9800X3D", cat: "cpu" },
  { q: "7800X3D", cat: "cpu" },
  { q: "14600K", cat: "cpu" },
  { q: "32GB DDR5", cat: "ram" },
  { q: "2TB NVMe", cat: "storage" },
  { q: "850W", cat: "psu" },
  { q: "1440p 180Hz", cat: "monitor" },
];

export default function Home({ deals: snapshot, builtAt, shelf, total, sample }) {
  // The deals rail arrives with the page, from a snapshot regenerated once a
  // day (see getStaticProps at the bottom). Only fall back to fetching it in
  // the browser if that snapshot somehow didn't come through.
  const [deals, setDeals] = useState(snapshot || { products: [], live: false });

  useEffect(() => {
    if (snapshot) return;
    fetch("/api/deals").then((r) => r.json()).then(setDeals).catch(() => {});
  }, [snapshot]);

  const top = (deals.products || []).slice(0, 8);

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">Real-priced PC platform</span>
          <h1>Stop guessing.<br />Start upgrading.</h1>
          <p className="lead">
            RigScout works out exactly which part is holding your frame rate back, plans a build where every
            component is checked against every other one, and prices it against real Amazon listings —
            every one of them checked by hand, dated on the page, and linked straight to the product.
          </p>
          <div className="btns">
            <Link href="/upgrade" className="btn">Analyze my build →</Link>
            <Link href="/parts" className="btn ghost">Browse every part</Link>
          </div>
          <div className="trust">
            <span>✓ Real Amazon listings, dated</span>
            <span>✓ Equal depth in every category</span>
            <span>✓ Compatibility checked for you</span>
            <span>✓ Always free</span>
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* ================= WHAT IT DOES ================= */}
        <div className="feat">
          <div>
            <div className="k">Diagnose</div>
            <h3>Find the real bottleneck</h3>
            <p>
              Enter two parts. We estimate your frame rate, show you which component runs out of road first and
              how hard each one is working, then price the fix in real frames per dollar.
            </p>
            <Link href="/upgrade" className="ilink">Run the Upgrade Finder →</Link>
          </div>
          <div>
            <div className="k">Build</div>
            <h3>A build that just works</h3>
            <p>
              Socket, memory generation, case clearance, cooler height, power draw — checked automatically as you
              add parts. Anything that wouldn&apos;t fit never even appears in your list.
            </p>
            <Link href="/builder" className="ilink">Open the PC Builder →</Link>
          </div>
          <div>
            <div className="k">Buy</div>
            <h3>Straight to the right product</h3>
            <p>
              Every row is a real Amazon listing with its price, rating and photo from the day we checked, and
              every link opens that exact product page — never a search results page, never a guess at which
              variant you meant.
            </p>
            <Link href="/products" className="ilink">See today&apos;s deals →</Link>
          </div>
        </div>

        {/* ================= HOW IT WORKS ================= */}
        <section className="home-sec">
          <h2>How it works</h2>
          <p className="usub" style={{ maxWidth: 720 }}>
            Three minutes from &ldquo;my games feel slow&rdquo; to a cart you can actually trust.
          </p>
          <div className="steps">
            <div className="step">
              <span className="sn">1</span>
              <h3>Tell us what you already have</h3>
              <p>Your processor and graphics card is enough. Type a model number — we&apos;ll find it.</p>
            </div>
            <div className="step">
              <span className="sn">2</span>
              <h3>We do the maths</h3>
              <p>Frame rate at your resolution, which part is the ceiling, what the machine draws from the wall, and whether your monitor is throwing frames away.</p>
            </div>
            <div className="step">
              <span className="sn">3</span>
              <h3>We price the fix</h3>
              <p>Every budget gets real parts with the new frame rate worked out — plus the part you should <em>not</em> buy.</p>
            </div>
            <div className="step">
              <span className="sn">4</span>
              <h3>You buy with confidence</h3>
              <p>Compatibility is confirmed before you click. If it&apos;s on your list, it fits.</p>
            </div>
          </div>
        </section>

        {/* ================= DEALS ================= */}
        <section className="home-sec">
          <div className="sec-head">
            <div>
              <h2>Price drops</h2>
              <p className="usub">
                Parts Amazon was listing below their usual price when we last checked the catalog.
              </p>
            </div>
            <Link href="/products" className="ilink">See all deals →</Link>
          </div>
          <div style={{ marginBottom: 16 }}><PriceStamp builtAt={builtAt} count={total} sample={sample} /></div>
          {top.length ? (
            <div className="prodgrid">{top.map((p, i) => <ProductCard key={p.asin + i} p={p} />)}</div>
          ) : (
            <p className="muted">
              Nothing on the shelf was meaningfully discounted when the catalog was last built. We
              would rather show you an empty row than dress up a two-percent price change as a deal.
            </p>
          )}
        </section>

        {/* ================= CATEGORIES ================= */}
        <section className="home-sec">
          <div className="sec-head">
            <div>
              <h2>Browse the catalog</h2>
              <p className="usub">
                The {shelf} most-bought products in every category — the same {shelf} in each, so no aisle looks
                emptier than another. Filters down the side, real specifications on every row.
              </p>
            </div>
            <Link href="/parts" className="ilink">All categories →</Link>
          </div>
          <div className="catgrid">
            {CAT_ORDER.map((k) => (
              <Link key={k} href={`/parts/${k}`} className="catcard">
                <div className="ct">{CATS[k].plural}</div>
                <p>{CATS[k].blurb}</p>
                <span className="go">Browse →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ================= POPULAR SEARCHES ================= */}
        <section className="home-sec">
          <h2>What people are looking for</h2>
          <p className="usub">Jump straight into the catalog with the filters already open.</p>
          <div className="chips">
            {POPULAR.map((p) => (
              <Link key={p.q} href={`/parts/${p.cat}?q=${encodeURIComponent(p.q)}`} className="chip">{p.q}</Link>
            ))}
          </div>
        </section>

        {/* ================= PROMISE ================= */}
        <section className="home-sec">
          <h2>Why you can trust the list</h2>
          <div className="promise">
            <div>
              <h3>We check it, you don&apos;t</h3>
              <p>
                RigScout holds the real specifications for hundreds of processors, boards, cards, coolers and cases —
                sockets, memory generations, lengths, heights and power draw. Every part you add is measured against
                everything else in your build. We never hand the homework back to you.
              </p>
            </div>
            <div>
              <h3>Real prices, and we date them</h3>
              <p>
                Every price, photo, rating and review count here came from an actual Amazon listing, and every buy
                link opens that exact product. What we will not do is call them live when they are not: the catalog
                is rebuilt by hand every week or so, and the date it was last checked is printed on every page that
                shows a price. Check it against Amazon before you buy — the link is right there.
              </p>
            </div>
            <div>
              <h3>We&apos;ll tell you not to spend money</h3>
              <p>
                If your processor is already fast enough, we say so. If your monitor is the thing wasting your frames,
                we say that too. Advice that only ever says &ldquo;buy more&rdquo; isn&apos;t advice.
              </p>
            </div>
          </div>
        </section>

        {/* ================= DISCORD ================= */}
        <section className="home-sec">
          <DiscordCTA />
        </section>

        {/* ================= BEYOND THE BUILD ================= */}
        <section className="home-sec">
          <div className="sec-head">
            <div>
              <h2>Beyond the build</h2>
              <p className="usub">
                The three services people ask us about once the machine boots — backup, game
                hosting, VPNs — written up with the case for <em>not</em> buying each one. One of
                them is on the list mainly so we can tell you what it won&apos;t do.
              </p>
            </div>
            <Link href="/extras" className="ilink">Read the rundown →</Link>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="home-cta">
          <h2>Find out what&apos;s holding your PC back</h2>
          <p>It takes about thirty seconds and costs nothing.</p>
          <div className="btns">
            <Link href="/upgrade" className="btn">Analyze my build →</Link>
            <Link href="/builder" className="btn ghost">Plan a new build</Link>
          </div>
        </section>
      </div>
    </>
  );
}

// The deals rail costs twelve API requests to build. Building it once a day
// and letting every visitor read the result is the difference between a fixed
// monthly bill and one that grows with traffic.
// Nothing here calls Amazon. The rail is derived from the catalog file that
// ships with the site, so the home page costs nothing to serve and renders
// identically on the first day of the month and the last.
export async function getStaticProps() {
  const meta = catalogMeta();
  return {
    props: {
      deals: topDealsStatic(8),
      builtAt: meta.builtAt,
      shelf: meta.shelf,
      total: meta.total,
      sample: meta.sample,
    },
  };
}
