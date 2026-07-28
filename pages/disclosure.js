import Head from "next/head";
import Link from "next/link";

export default function Disclosure() {
  return (
    <div className="wrap page">
      <Head>
        <title>How RigScout makes money — RigScout</title>
        <meta
          name="description"
          content="RigScout's affiliate disclosure: which links pay us, how much, and the rules we hold ourselves to about recommendations."
        />
      </Head>

      <span className="eyebrow">Disclosure</span>
      <h1>How this site makes money</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        RigScout is free and there are no adverts. It runs on commission from links, which is worth
        being upfront about, because you should know what a recommendation is worth before you act
        on it.
      </p>

      <div className="doc">
        <h2>Amazon</h2>
        <p>
          RigScout is a participant in the Amazon Services LLC Associates Program. Every product link
          on the site carries our associate tag, and if you buy something within a day or so of
          clicking one, Amazon pays us a percentage of it. On computer components that percentage is
          about two and a half — a few dollars on a graphics card, cents on a fan. You pay the list
          price either way; the commission comes out of Amazon&apos;s margin, not your total.
        </p>
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
        <p>
          The backup, hosting and VPN entries on the{" "}
          <Link href="/extras" className="ilink">Beyond the Build</Link> page are affiliate links
          too, and they pay considerably better than Amazon does — in some cases a share of every
          month you stay subscribed. That&apos;s a real incentive to oversell them, so here are the
          rules we hold ourselves to, and you can hold us to them as well.
        </p>
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
          As an Amazon Associate, RigScout earns from qualifying purchases. Amazon and the Amazon
          logo are trademarks of Amazon.com, Inc. or its affiliates. Last updated July 2026.
        </p>
      </div>
    </div>
  );
}
