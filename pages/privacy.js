// ============================================================================
// /privacy
// ----------------------------------------------------------------------------
// Written from what the code actually does, not from a generator template. Each
// claim below corresponds to something checkable in this repository:
//
//   "no accounts, no forms"      — there is no auth and no POST endpoint that
//                                  accepts personal data anywhere in pages/api
//   "no analytics"               — no gtag, plausible, pixel or similar exists
//   "no cookies of our own"      — nothing in the codebase sets one
//   "builder saves locally"      — pages/builder.js uses window.localStorage
//   "YouTube thumbnails"         — pages/guides/index.js loads images from
//                                  img.youtube.com on page load, which is a
//                                  request to Google whether or not you click
//   "embeds use nocookie"        — youtube-nocookie.com is the embed host
//
// If any of those change, this page has to change in the same commit. A privacy
// policy that quietly stops being true is worse than not having one.
// ============================================================================
import Head from "next/head";
import Link from "next/link";
import { AMAZON_AFFILIATE_LIVE } from "../lib/partners";

export default function Privacy() {
  return (
    <div className="wrap page">
      <Head>
        <title>Privacy — RigScout</title>
        <meta
          name="description"
          content="What RigScout collects (almost nothing), what third parties see when you use it, and where your saved build actually lives."
        />
      </Head>

      <span className="eyebrow">Privacy</span>
      <h1>What we collect, in plain terms</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        Short version: we don&apos;t ask you for anything and we don&apos;t store anything about
        you. There are no accounts, no sign-up, no newsletter, no contact form, and no adverts. The
        longer version below is about the third parties involved, because that&apos;s where the
        honest detail is.
      </p>

      <div className="honestbox">
        <span className="hb-mark">i</span>
        <div>
          <strong>Last updated 28 July 2026.</strong>
          <p>
            This describes how the site works today. If we ever add analytics or anything that
            collects data, this page gets updated in the same change — not afterwards.
          </p>
        </div>
      </div>

      <div className="doc">
        <h2>What RigScout itself collects</h2>
        <p>
          Nothing that identifies you. There is no login, no form that asks for your name or email,
          and no tracking script — no Google Analytics, no advertising pixel, no session recorder.
          The site sets no cookies of its own.
        </p>

        <h2>Your saved build stays on your device</h2>
        <p>
          The <Link href="/builder" className="ilink">PC Builder</Link> remembers the parts
          you&apos;ve picked so the list survives a page refresh. That is stored in your own
          browser&apos;s local storage. It never leaves your machine, we never receive it, and
          clearing your browser data deletes it permanently. Nobody else can see it, including us.
        </p>

        <h2>Server logs</h2>
        <p>
          The site is served by a hosting provider, and like every web server theirs records
          requests — the page requested, the time, your IP address and browser user-agent. That is
          standard infrastructure logging, kept by the host under their own policy, and we
          don&apos;t use it to build any profile of you.
        </p>

        <h2>Amazon links</h2>
        {AMAZON_AFFILIATE_LIVE ? (
          <>
            <p>
              Product links carry our Amazon Associates tag. When you follow one, Amazon knows the
              visit came from us and, if you buy something, credits us a commission. What Amazon
              records about you at that point is governed by Amazon&apos;s privacy notice, not this
              one — we receive only anonymous, aggregated earnings figures, never who bought what.
            </p>
            <p>
              Clicking through also sets a cookie on Amazon&apos;s side that lasts around a day.
              Nothing about that is unusual for affiliate links; it is simply how the crediting
              works. We explain the money side in full on the{" "}
              <Link href="/disclosure" className="ilink">disclosure page</Link>.
            </p>
          </>
        ) : (
          <p>
            Product links go to Amazon and carry no tracking parameter of ours — we aren&apos;t in
            Amazon&apos;s affiliate program yet, so there is nothing to credit and nothing added
            to the link. Following one is the same as typing the address yourself, and from that
            point Amazon&apos;s own privacy notice applies rather than this one. If we do join, this
            paragraph and the <Link href="/disclosure" className="ilink">disclosure page</Link> get
            updated in the same change that adds the tag.
          </p>
        )}

        <h2>YouTube on the guides page</h2>
        <p>
          The install-video section of the{" "}
          <Link href="/guides" className="ilink">guides page</Link> shows thumbnails loaded from
          YouTube. Those images are fetched from Google&apos;s servers when the page loads, which
          means Google sees a request from your browser even if you never press play — that is worth
          knowing, and most sites don&apos;t mention it.
        </p>
        <p>
          If you do press play, the video is embedded through YouTube&apos;s privacy-enhanced
          domain, which is designed not to set tracking cookies unless you actually watch. From the
          moment the player loads, Google&apos;s privacy policy applies to what happens inside it.
        </p>

        <h2>Discord and the partner links</h2>
        <p>
          Our Discord invite and the services listed under{" "}
          <Link href="/extras" className="ilink">Beyond the Build</Link> are links to other
          companies. Following one hands you over to them, and their policies apply from that point.
          We don&apos;t pass them anything about you — a link is just a link.
        </p>

        <h2>Children</h2>
        <p>
          The site isn&apos;t directed at children and doesn&apos;t knowingly collect anything from
          anyone. Since we collect no personal information from any visitor of any age, there is
          nothing here for us to delete on request — but if you believe otherwise, get in touch and
          we&apos;ll look into it.
        </p>

        <h2>Your rights</h2>
        <p>
          Rules like the GDPR and the CCPA give you the right to see, correct, or delete personal
          data a site holds about you, and to opt out of it being sold. We hold none, and we sell
          none — there is no database of visitors to query. If you want to check that for yourself,
          ask us and we&apos;ll answer specifically rather than pointing at this paragraph.
        </p>

        <h2>Questions</h2>
        <p>
          Anything on this page, or anything you want checked, goes through our Discord — the{" "}
          <Link href="/contact" className="ilink">contact page</Link> has the link. We don&apos;t
          publish an email address, partly because a published address gets scraped within days and
          partly because there is no inbox holding anything about you in the first place.
        </p>
      </div>
    </div>
  );
}
