// ============================================================================
// /about
// ----------------------------------------------------------------------------
// Amazon's Associates reviewers look for this page, and so do readers deciding
// whether to trust a recommendation. Both are better served by saying what the
// site actually is — including its limits — than by the usual "we are
// passionate about technology" filler.
//
// Everything claimed here is checkable against the repository. If the way the
// site works changes, this page changes with it.
// ============================================================================
import Head from "next/head";
import Link from "next/link";
import { AMAZON_AFFILIATE_LIVE, HAS_AFFILIATE_LINKS } from "../lib/partners";

export default function About() {
  return (
    <div className="wrap page">
      <Head>
        <title>About RigScout — RigScout</title>
        <meta
          name="description"
          content="What RigScout is, how it picks and prices parts, how it makes money, and the things it deliberately won't do."
        />
      </Head>

      <span className="eyebrow">About</span>
      <h1>What this site is</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        RigScout helps you work out which PC part is actually worth buying — and, often enough, that
        you shouldn&apos;t buy one at all. It is a small independent site, not a magazine and not a
        shop.
      </p>

      <div className="doc">
        <h2>Why it exists</h2>
        <p>
          PC upgrade advice has a structural problem: almost everyone giving it is paid when you
          buy something. That doesn&apos;t make the advice wrong, but it does mean the answer
          &ldquo;your machine is fine, don&apos;t spend anything&rdquo; is rarely the one you get,
          even when it&apos;s the correct one.
        </p>
        <p>
          The most common expensive mistake in this hobby is buying a faster graphics card for a
          machine that was never limited by its graphics card. That is the specific problem the{" "}
          <Link href="/upgrade" className="ilink">Upgrade Finder</Link> exists to solve, and it is
          why the first thing our guides tell you to do is spend ten free minutes diagnosing before
          you spend anything at all.
        </p>

        <h2>How the parts and prices work</h2>
        <p>
          Every product on the site is a real Amazon listing. We fetch a fixed number of the most
          popular products in each of nine categories, keep the same number in every category so no
          one section looks better stocked than another, and store the result as a dated snapshot.
        </p>
        <p>
          That snapshot is rebuilt on a schedule, not at the moment you load the page. It means a
          price here can be a little behind Amazon&apos;s, and every page that shows a price says
          when it was taken. We would rather tell you that plainly than print &ldquo;live
          prices&rdquo; over something that updates monthly, which is what most sites in this
          category do. The price on Amazon at checkout is always the one that counts.
        </p>
        <p>
          The compatibility checks — whether a card fits a case, whether a cooler clears your
          memory, whether a supply has the right connector — are computed from published
          manufacturer specifications, not from anyone&apos;s opinion.
        </p>

        <h2>How it makes money</h2>
        {AMAZON_AFFILIATE_LIVE || HAS_AFFILIATE_LINKS ? (
          <p>
            Commission on Amazon links, and on a handful of services listed under{" "}
            <Link href="/extras" className="ilink">Beyond the Build</Link>. You pay exactly the same
            price either way. There are no adverts anywhere on the site and no sponsored placements
            — nobody can pay to appear here or to rank higher, and no manufacturer has any input
            into what gets listed. The full detail is on the{" "}
            <Link href="/disclosure" className="ilink">disclosure page</Link>.
          </p>
        ) : (
          <p>
            Right now, it doesn&apos;t. Nothing on the site earns us anything — we haven&apos;t
            joined Amazon&apos;s affiliate program or any of the ones run by the services under{" "}
            <Link href="/extras" className="ilink">Beyond the Build</Link>, so every link here is a
            plain link. The intention is to add commission later, and when that happens this page
            and the <Link href="/disclosure" className="ilink">disclosure page</Link> will say so
            before a single link changes. There are no adverts and no sponsored placements either —
            nobody can pay to appear here or to rank higher.
          </p>
        )}

        <h2>Things this site won&apos;t do</h2>
        <p>
          These are commitments, not aspirations, and you can hold us to them.
        </p>
        <ul className="doclist">
          <li>
            <strong>No invented urgency.</strong> No countdown timers, no &ldquo;12 people are
            viewing this&rdquo;, no &ldquo;price expires tonight&rdquo;. Those are fabrications, and
            regulators have started treating them as exactly that.
          </li>
          <li>
            <strong>No fake or borrowed social proof.</strong> Ratings and review counts shown here
            are Amazon&apos;s own numbers, unedited. We don&apos;t write reviews and we don&apos;t
            solicit them.
          </li>
          <li>
            <strong>No pretending prices are live when they aren&apos;t.</strong> Dated, always,
            everywhere a price appears.
          </li>
          <li>
            <strong>Guides that are worth reading if you buy nothing.</strong> Every one names the
            people who should skip the purchase. If an article only makes sense as a route to a Buy
            button, it doesn&apos;t belong on the site.
          </li>
          <li>
            <strong>No accounts, no newsletter wall, no tracking you around the internet.</strong>{" "}
            The site sets no cookies of its own. See the{" "}
            <Link href="/privacy" className="ilink">privacy page</Link> for the specifics.
          </li>
        </ul>

        <h2>What it isn&apos;t</h2>
        <p>
          RigScout doesn&apos;t benchmark hardware, and it isn&apos;t a review site — we don&apos;t
          have a lab and we&apos;re not going to pretend otherwise. What it does is compatibility,
          diagnosis and pricing: the boring, checkable parts of buying a component, which is where
          most of the money gets wasted.
        </p>
        <p>
          It is also not a substitute for reading the product page. Our{" "}
          <Link href="/guides/listing-traps" className="ilink">guide to reading a parts listing</Link>{" "}
          covers what to check on Amazon before you commit, and we&apos;d rather you did that than
          took our word for it.
        </p>

        <h2>Getting in touch</h2>
        <p>
          If something on the site is wrong — a spec, a compatibility call, a price that looks
          impossible — we want to know, and corrections get made rather than argued about. The{" "}
          <Link href="/contact" className="ilink">contact page</Link> has the ways to reach us.
        </p>
      </div>
    </div>
  );
}
