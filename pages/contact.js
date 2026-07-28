// ============================================================================
// /contact
// ----------------------------------------------------------------------------
// Discord only, by choice.
//
// No contact FORM: a form means a server endpoint accepting arbitrary input
// from anyone on the internet, somewhere to store it, and a spam problem — and
// it would make the privacy page's "we collect nothing" claim untrue.
//
// No email address either. Publishing one in public source gets it scraped
// within days, and Discord is a real, staffed, faster channel. Associates only
// requires a working way to reach the site's operator, not specifically email.
// If an address is ever wanted, add it here and to /privacy in the same commit.
// ============================================================================
import Head from "next/head";
import Link from "next/link";
import DiscordCTA from "../components/DiscordCTA";

export default function Contact() {
  return (
    <div className="wrap page">
      <Head>
        <title>Contact — RigScout</title>
        <meta
          name="description"
          content="How to reach RigScout: join the Discord to report a wrong spec or price, ask a build question, or raise anything about privacy or affiliate disclosure."
        />
      </Head>

      <span className="eyebrow">Contact</span>
      <h1>Get in touch</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        Everything goes through our Discord — questions, corrections, complaints, anything about
        privacy or how the site makes money. It&apos;s free to join, you don&apos;t need an account
        on this site, and you&apos;ll usually get an answer faster than an inbox would manage.
      </p>

      <DiscordCTA />

      <div className="doc">
        <h2>Especially tell us if something&apos;s wrong</h2>
        <p>
          Specs and compatibility calls here are computed from published figures, and published
          figures occasionally disagree with reality. When they do, we&apos;d rather fix it than
          defend it. The most useful thing you can include is a link to the page on our site and a
          link to the manufacturer&apos;s specification that contradicts it — that turns a
          correction from a debate into a two-minute fix.
        </p>
        <ul className="doclist">
          <li>
            <strong>A price looks wrong.</strong> Our prices come from a dated snapshot rather than
            a live feed, so a gap of a few dollars is expected and the Amazon page is always right.
            A gap of a few hundred is a bug and we want to hear about it.
          </li>
          <li>
            <strong>A compatibility call looks wrong.</strong> Tell us the two parts and what
            actually happened. Physical fitment in particular has edge cases that published
            dimensions don&apos;t capture.
          </li>
          <li>
            <strong>A guide is out of date or mistaken.</strong> Hardware advice ages. If something
            we&apos;ve written has stopped being true, say so and we&apos;ll change it.
          </li>
        </ul>

        <h2>What we can&apos;t help with</h2>
        <p>
          We&apos;re not Amazon and we can&apos;t see, change or cancel your order — anything about
          a purchase, delivery, return or refund has to go through Amazon directly, since that is
          who you bought from. We also can&apos;t offer warranty support for a part; that&apos;s the
          manufacturer.
        </p>

        <h2>Partnerships and sponsorship</h2>
        <p>
          We don&apos;t take paid placements. Nobody can pay to be listed on the site, to rank
          higher, or to be described more favourably, and we&apos;d rather say that here than field
          the pitches. How the site does make money is set out on the{" "}
          <Link href="/disclosure" className="ilink">disclosure page</Link>, and how it picks and
          prices what it lists is on the <Link href="/about" className="ilink">about page</Link>.
        </p>
      </div>
    </div>
  );
}
