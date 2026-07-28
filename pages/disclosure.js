// ============================================================================
// /disclosure
// ----------------------------------------------------------------------------
// This page used to describe an Amazon Associates membership and three partner
// affiliate deals that did not exist. That is a false statement about money on
// the one page whose entire job is to be true about money — and Amazon's
// operating agreement specifically bars misrepresenting the relationship, so it
// would also have been a problem at review time.
//
// So every claim here is now gated on the same flags the rest of the site uses:
//
//   AMAZON_AFFILIATE_LIVE  — set by next.config.js from AMAZON_ASSOCIATE_TAG,
//                            which stays server-only; only a yes/no is inlined
//   HAS_AFFILIATE_LINKS    — true once any NEXT_PUBLIC_*_URL partner link is set
//
// Set the tag, redeploy, and the page turns itself back into the participating-
// Associate version. Until then it says the site earns nothing, because it
// doesn't. Rule for anyone editing this file later: no sentence about income
// goes outside one of these branches.
// ============================================================================
import Head from "next/head";
import Link from "next/link";
import { AMAZON_AFFILIATE_LIVE, HAS_AFFILIATE_LINKS } from "../lib/partners";

export default function Disclosure() {
  const anyLive = AMAZON_AFFILIATE_LIVE || HAS_AFFILIATE_LINKS;

  return (
    <div className="wrap page">
      <Head>
        <title>How RigScout makes money — RigScout</title>
        <meta
          name="description"
          content="RigScout's affiliate disclosure: what the site earns today, which links pay us, how much, and the rules we hold ourselves to about recommendations."
        />
      </Head>

      <span className="eyebrow">Disclosure</span>
      <h1>How this site makes money</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        {anyLive ? (
          <>
            RigScout is free and there are no adverts. It runs on commission from links, which is
            worth being upfront about, because you should know what a recommendation is worth
            before you act on it.
          </>
        ) : (
          <>
            RigScout is free and there are no adverts. At the moment it also makes no money at all,
            which is worth saying plainly, because you should know what a recommendation is worth
            before you act on it.
          </>
        )}
      </p>

      {!anyLive && (
        <div className="honestbox">
          <span className="hb-mark">i</span>
          <div>
            <strong>Today, this site earns nothing.</strong>
            <p>
              We are not in Amazon&apos;s Associates program and not in any of the partner
              programs for the services on{" "}
              <Link href="/extras" className="ilink">Beyond the Build</Link>. Every link on the site
              is a plain link with nothing attached to it. We do intend to apply, and this page will
              change in the same commit that adds the first tag — not afterwards, and not quietly.
            </p>
          </div>
        </div>
      )}

      <div className="doc">
        <h2>Amazon</h2>
        {AMAZON_AFFILIATE_LIVE ? (
          <p>
            RigScout is a participant in the Amazon Services LLC Associates Program. Every product
            link on the site carries our associate tag, and if you buy something within a day or so
            of clicking one, Amazon pays us a percentage of it. On computer components that
            percentage is about two and a half — a few dollars on a graphics card, cents on a fan.
            You pay the list price either way; the commission comes out of Amazon&apos;s margin,
            not your total.
          </p>
        ) : (
          <p>
            We are not an Amazon Associate. Product links here point at Amazon with no tag on them,
            so if you buy something we are paid nothing — the link is the same one you&apos;d get by
            searching Amazon yourself. If we are accepted into the program later, the tag gets
            added and this paragraph will say so: commission of roughly two and a half percent on
            components, taken out of Amazon&apos;s margin rather than added to your total, so the
            price you pay wouldn&apos;t change either way.
          </p>
        )}
        {/*
          This paragraph used to say prices were "pulled live from Amazon". That
          stopped being true when the site moved to a committed catalog snapshot,
          and a disclosure page that overstates its own accuracy is the worst
          possible place to leave a stale sentence.
        */}
        <p>
          Prices, photos, ratings and review counts on this site come straight from Amazon rather
          than being typed in by hand — but from a dated snapshot, rebuilt on a schedule, not from a
          live feed. We don&apos;t set those numbers and we can&apos;t change them. Every page that
          shows a price also shows when it was taken, and if a price here disagrees with the Amazon
          page, the Amazon page is right.
        </p>

        <h2>The services on Beyond the Build</h2>
        {HAS_AFFILIATE_LINKS ? (
          <p>
            The backup, hosting and VPN entries on the{" "}
            <Link href="/extras" className="ilink">Beyond the Build</Link> page are affiliate links,
            and they pay considerably better than Amazon does — in some cases a share of every month
            you stay subscribed. That&apos;s a real incentive to oversell them, so here are the
            rules we hold ourselves to, and you can hold us to them as well.
          </p>
        ) : (
          <p>
            The backup, hosting and VPN entries on the{" "}
            <Link href="/extras" className="ilink">Beyond the Build</Link> page are plain links to
            those companies today — we&apos;re not in their affiliate programs. We expect to join
            them, and those programs pay considerably better than Amazon does, in some cases a
            share of every month you stay subscribed. That would be a real incentive to oversell,
            which is why the rules below were written now, before any money was attached, rather
            than after.
          </p>
        )}
        <ul className="doclist">
          <li>
            Every entry names the people who should <em>not</em> buy it, in the same type size as the
            pitch.
          </li>
          <li>
            Every entry names the free way to do the same job, where one exists. Two of the three
            currently do.
          </li>
          <li>
            We don&apos;t repeat a vendor&apos;s claim we can&apos;t back up. The clearest example is
            the widespread &ldquo;a VPN lowers your ping&rdquo; line. It doesn&apos;t — routing your
            traffic through an extra machine adds distance rather than removing it — and our VPN
            entry says so in bold, above the pitch, even though saying it costs us sign-ups.
          </li>
          <li>
            Nobody pays for placement. No company on this site has been given editorial input, seen
            their write-up in advance, or paid to appear.
          </li>
          <li>
            No manufactured urgency. No countdown timers, no invented stock levels, no
            &ldquo;fourteen people are looking at this&rdquo;. If something is marked as discounted,
            that is the gap between the two numbers Amazon itself showed when the catalog was last
            built — and the date it was built is printed on every page that shows a price.
          </li>
        </ul>

        <h2>What we don&apos;t do</h2>
        <p>
          We don&apos;t sell your data, we don&apos;t run display ads, and we don&apos;t take payment
          to rank a part higher. The Upgrade Finder will tell you your processor is fine and to keep
          your money, which is the least profitable sentence on the site and also the reason
          it&apos;s worth reading.
        </p>

        <h2>Questions</h2>
        <p>
          If something here reads like a sales pitch rather than advice, say so — that&apos;s a fair
          complaint and we&apos;d rather hear it. The{" "}
          <Link href="/contact" className="ilink">contact page</Link> has the ways to reach us, and
          the <Link href="/about" className="ilink">about page</Link> covers how the site picks and
          prices what it lists.
        </p>

        <p className="faint" style={{ fontSize: 13, marginTop: 26 }}>
          {AMAZON_AFFILIATE_LIVE ? (
            <>
              As an Amazon Associate, RigScout earns from qualifying purchases. Amazon and the
              Amazon logo are trademarks of Amazon.com, Inc. or its affiliates. Last updated July
              2026.
            </>
          ) : (
            <>
              Amazon and the Amazon logo are trademarks of Amazon.com, Inc. or its affiliates.
              RigScout is not affiliated with, endorsed by, or a participant in any program run by
              the companies whose products it lists. Last updated July 2026.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
