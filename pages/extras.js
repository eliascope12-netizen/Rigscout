import Head from "next/head";
import Link from "next/link";
import DiscordCTA from "../components/DiscordCTA";
import { PARTNERS } from "../lib/partners";

export default function Extras() {
  return (
    <div className="wrap page">
      <Head>
        <title>Beyond the build — RigScout</title>
        <meta
          name="description"
          content="The handful of services worth paying for after the PC is finished — backup, game hosting, VPNs — with an honest note on who should skip each one."
        />
      </Head>

      <span className="eyebrow">Beyond the build</span>
      <h1>The parts aren&apos;t the whole bill</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        Once the machine boots, there are three services people ask us about constantly. Here&apos;s
        what each one actually does, what it costs, and — the part nobody else writes down — who
        should not bother.
      </p>

      <div className="honestbox">
        <span className="hb-mark">i</span>
        <div>
          <strong>These are affiliate links.</strong>
          <p>
            If you sign up through one, we get paid and you pay exactly the same price. That&apos;s
            the whole arrangement. It doesn&apos;t buy anyone a better write-up — every entry below
            includes the case for not buying it, and one of them is here mostly so we can tell you
            what it <em>won&apos;t</em> do. More on how we handle this in the{" "}
            <Link href="/disclosure" className="ilink">disclosure</Link>.
          </p>
        </div>
      </div>

      {PARTNERS.map((p) => (
        <article className="pfull" key={p.key} id={p.key}>
          <header className="pf-head">
            <span className={"pf-ico " + p.accent}>{p.icon}</span>
            <div className="pf-title">
              <span className="pf-tag">{p.tag}</span>
              <h2>{p.name}</h2>
              <p className="pf-one">{p.oneline}</p>
            </div>
            <a className="btn sm" href={p.href} target="_blank" rel="nofollow sponsored noopener">
              Visit {p.name} ↗
            </a>
          </header>

          {p.warning && (
            <div className="pf-warn">
              <span className="pw-mark">!</span>
              <p>{p.warning}</p>
            </div>
          )}

          <div className="pf-grid">
            <div>
              <h3>What it is</h3>
              <p>{p.what}</p>
            </div>
            <div>
              <h3>Why people buy it</h3>
              <p>{p.why}</p>
            </div>
            <div>
              <h3>Don&apos;t buy it if…</h3>
              <p>{p.skipIf}</p>
            </div>
            <div>
              <h3>The free way to do it</h3>
              <p>{p.freeAlternative}</p>
            </div>
          </div>

          <div className="pf-price">
            <span>Roughly what it costs</span>
            <em>{p.price}</em>
          </div>
        </article>
      ))}

      <section className="home-sec" style={{ borderTop: "none", paddingBottom: 0 }}>
        <DiscordCTA />
      </section>

      <p className="faint" style={{ marginTop: 34, fontSize: 13, maxWidth: 720 }}>
        Still choosing parts? The <Link href="/upgrade" className="ilink">Upgrade Finder</Link> works
        out which component is actually holding your frame rate back, and the{" "}
        <Link href="/builder" className="ilink">PC Builder</Link> checks everything against
        everything else as you add it.
      </p>
    </div>
  );
}
