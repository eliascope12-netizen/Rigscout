// ============================================================================
// /guides/<slug> — one written guide.
// ----------------------------------------------------------------------------
// Fully static. getStaticPaths enumerates the articles at build time and
// getStaticProps hands one to the page, so every article is a plain HTML file
// on the CDN with no server work and nothing to rate limit. That matters for a
// site whose whole point is that it makes zero API calls at request time.
//
// fallback: false is deliberate — an unknown slug should 404 rather than
// render an empty shell, because an empty shell is what gets indexed.
// ============================================================================
import Head from "next/head";
import Link from "next/link";
import GuideBlocks from "../../components/GuideBlocks";
import DiscordCTA from "../../components/DiscordCTA";
import { getGuide, guideSlugs, otherGuides } from "../../lib/guides";
import { AMAZON_AFFILIATE_LIVE } from "../../lib/partners";

export async function getStaticPaths() {
  return { paths: guideSlugs().map((slug) => ({ params: { slug } })), fallback: false };
}

export async function getStaticProps({ params }) {
  const guide = getGuide(params.slug);
  if (!guide) return { notFound: true };
  return { props: { guide, more: otherGuides(params.slug, 3) } };
}

// Long-form dates read better than ISO in a byline, and the machine-readable
// form still goes in the dateTime attribute for anything parsing the page.
function pretty(iso) {
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export default function Guide({ guide, more }) {
  return (
    <div className="wrap page">
      <Head>
        <title>{guide.title} — RigScout</title>
        <meta name="description" content={guide.dek} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.dek} />
      </Head>

      <p className="g-crumb">
        <Link href="/guides" className="ilink">← All guides</Link>
      </p>

      <article className="g-article">
        <span className="eyebrow">{guide.tag}</span>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.dek}</p>
        <p className="g-byline">
          {guide.minutes} min read · Updated <time dateTime={guide.updated}>{pretty(guide.updated)}</time>
        </p>

        <GuideBlocks blocks={guide.blocks} />

        {/*
          Disclosure sits at the foot of the article as well as in the site
          footer. Associates requires it to be prominent, and "prominent" on a
          long page means where the reader actually is when they reach a link,
          not two thousand words above it.
        */}
        <div className="honestbox" style={{ marginTop: 26 }}>
          <span className="hb-mark">i</span>
          <div>
            {AMAZON_AFFILIATE_LIVE ? (
              <>
                <strong>How this site makes money.</strong>
                <p>
                  As an Amazon Associate we earn from qualifying purchases. If you buy through a
                  link here, the price you pay is exactly the same and we get a small commission.
                  Prices on our shelves come from a dated snapshot, not a live feed, so check the
                  figure on Amazon before you commit — that&apos;s the one that counts.
                </p>
              </>
            ) : (
              <>
                <strong>Nobody is paying us for this.</strong>
                <p>
                  We aren&apos;t in Amazon&apos;s affiliate program yet, so the product links here
                  earn us nothing — this article was written with no commission attached to it. If
                  that changes, this box changes with it. Prices on our shelves come from a dated
                  snapshot, not a live feed, so check the figure on Amazon before you commit —
                  that&apos;s the one that counts.
                </p>
              </>
            )}
          </div>
        </div>
      </article>

      {more && more.length ? (
        <section className="home-sec">
          <h2 style={{ marginBottom: 12 }}>Keep reading</h2>
          <div className="g-index">
            {more.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="g-card">
                <span className="tag">{g.tag}</span>
                <h3>{g.title}</h3>
                <span className="g-meta">{g.minutes} min read</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="home-sec">
        <DiscordCTA />
      </section>
    </div>
  );
}
