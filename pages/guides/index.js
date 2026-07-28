// ============================================================================
// /guides — the written guides index, plus the install video shelf underneath.
// ----------------------------------------------------------------------------
// This used to be a page of ten embedded videos made by other people and no
// original writing at all. That is a problem twice over: Amazon Associates
// wants to see original content before approving an account, and a page of
// other people's embeds gives a search engine nothing to rank.
//
// So the written guides lead, and the install videos stay on as a section —
// they are genuinely useful and there is no point pretending we filmed them.
// ============================================================================
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import DiscordCTA from "../../components/DiscordCTA";
import { GUIDES } from "../../lib/guides";

// Only the card fields cross into the page, never the article bodies. Importing
// GUIDES directly in the component would ship all ten articles — every word of
// them — to the browser just to print ten titles. Next strips module imports
// that are only used inside getStaticProps, so keeping the read in here is what
// keeps this page small.
export async function getStaticProps() {
  return {
    props: {
      cards: GUIDES.map(({ slug, title, dek, tag, minutes }) => ({ slug, title, dek, tag, minutes })),
    },
  };
}

const VIDEOS = [
  { label: "Graphics card (GPU)", terms: "gpu graphics card rtx radeon", video: "GoX-6rGZPiI" },
  { label: "Processor (CPU)", terms: "cpu processor intel amd ryzen", video: "oVWS4tVQfaY" },
  { label: "Memory (RAM)", terms: "ram memory ddr4 ddr5", video: "IsI0Odurngg" },
  { label: "M.2 NVMe SSD", terms: "m2 nvme ssd storage", video: "rEfGN9ANcbQ" },
  { label: "2.5\" SATA SSD / HDD", terms: "sata ssd hard drive", video: "Q4X7AdjNnKA" },
  { label: "Power supply (PSU)", terms: "psu power supply", video: "HsxpogMgTso" },
  { label: "CPU cooler / AIO", terms: "cooler aio air heatsink", video: "lrySu4Alwk4" },
  { label: "Thermal paste", terms: "thermal paste", video: "Sog0M9OrlME" },
  { label: "Motherboard", terms: "motherboard standoffs", video: "iTkGuioG5RU" },
  { label: "Case fans / airflow", terms: "case fans airflow", video: "EBqA91ZtdQ4" },
];

export default function GuidesIndex({ cards }) {
  const [q, setQ] = useState("");
  const [playing, setPlaying] = useState(null);
  const ql = q.trim().toLowerCase();
  const list = ql ? VIDEOS.filter((g) => (g.label + " " + g.terms).toLowerCase().includes(ql)) : VIDEOS;

  return (
    <div className="wrap page">
      <Head>
        <title>Guides — RigScout</title>
        <meta
          name="description"
          content="Plain-English guides to choosing PC parts: finding your bottleneck, sizing a power supply, whether a graphics card fits, and what memory actually costs in 2026."
        />
      </Head>

      <span className="eyebrow">Guides</span>
      <h1>Work out what to buy before you buy it</h1>
      <p className="lead" style={{ maxWidth: 720 }}>
        Written here, not scraped from anywhere. Each one is meant to be worth reading even if you
        buy nothing at the end of it — and each one says plainly who should skip the purchase.
      </p>

      <div className="g-index">
        {cards.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="g-card">
            <span className="tag">{g.tag}</span>
            <h3>{g.title}</h3>
            <p>{g.dek}</p>
            <span className="g-meta">{g.minutes} min read</span>
          </Link>
        ))}
      </div>

      <section className="home-sec">
        <h2 style={{ marginBottom: 6 }}>Already bought it — how do I install it?</h2>
        <p className="faint" style={{ fontSize: 14, maxWidth: 720, marginTop: 0 }}>
          Search the part you&apos;re fitting and watch a step-by-step video. These are other
          people&apos;s videos, chosen because they&apos;re the clearest ones we could find.
        </p>
        <form className="searchbar" onSubmit={(e) => e.preventDefault()}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a part… e.g. graphics card, RAM, SSD"
          />
        </form>

        <div className="prodgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
          {list.length ? (
            list.map((g) => (
              <div key={g.video}>
                {playing === g.video ? (
                  <div style={{ aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }}>
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube-nocookie.com/embed/${g.video}?autoplay=1`}
                      title={g.label}
                      frameBorder="0"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => setPlaying(g.video)}
                    style={{
                      aspectRatio: "16/9",
                      borderRadius: 12,
                      overflow: "hidden",
                      cursor: "pointer",
                      position: "relative",
                      background: "#0f1728",
                    }}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${g.video}/hqdefault.jpg`}
                      alt={g.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                      <span
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          background: "rgba(0,0,0,.6)",
                          display: "grid",
                          placeItems: "center",
                          color: "#fff",
                          fontSize: 20,
                        }}
                      >
                        ▶
                      </span>
                    </span>
                  </div>
                )}
                <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 10 }}>Install: {g.label}</div>
                <a
                  className="link"
                  style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }}
                  href={`https://www.youtube.com/watch?v=${g.video}`}
                  target="_blank"
                  rel="noopener"
                >
                  Open on YouTube ↗
                </a>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1" }}>
              <a
                className="btn ghost"
                href={`https://www.youtube.com/results?search_query=how+to+install+${encodeURIComponent(q)}+pc`}
                target="_blank"
                rel="noopener"
              >
                ▶ Search YouTube for “how to install {q}”
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="home-sec">
        <DiscordCTA />
      </section>

      <p className="faint" style={{ fontSize: 13, maxWidth: 720 }}>
        Machine already assembled and booting? <Link href="/extras" className="ilink">Beyond the Build</Link>{" "}
        covers the handful of services worth paying for afterwards — and who should skip each one.
      </p>
    </div>
  );
}
