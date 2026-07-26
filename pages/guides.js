import { useState } from "react";

const GUIDES = [
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

export default function Guides() {
  const [q, setQ] = useState("");
  const [playing, setPlaying] = useState(null);
  const ql = q.trim().toLowerCase();
  const list = ql ? GUIDES.filter((g) => (g.label + " " + g.terms).toLowerCase().includes(ql)) : GUIDES;

  return (
    <div className="wrap page">
      <span className="eyebrow">Install guides</span>
      <h1>How do I install it?</h1>
      <p className="lead" style={{ marginBottom: 20 }}>Search the part you're installing and watch a step-by-step video.</p>
      <form className="searchbar" onSubmit={(e) => e.preventDefault()}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a part… e.g. graphics card, RAM, SSD" />
      </form>

      <div className="prodgrid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        {list.length ? list.map((g) => (
          <div key={g.video}>
            {playing === g.video ? (
              <div style={{ aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }}>
                <iframe width="100%" height="100%" src={`https://www.youtube-nocookie.com/embed/${g.video}?autoplay=1`} title={g.label} frameBorder="0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen style={{ border: 0 }} />
              </div>
            ) : (
              <div onClick={() => setPlaying(g.video)} style={{ aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", cursor: "pointer", position: "relative", background: "#0f1728" }}>
                <img src={`https://img.youtube.com/vi/${g.video}/hqdefault.jpg`} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}><span style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(0,0,0,.6)", display: "grid", placeItems: "center", color: "#fff", fontSize: 20 }}>▶</span></span>
              </div>
            )}
            <div style={{ fontWeight: 700, fontSize: 14.5, marginTop: 10 }}>Install: {g.label}</div>
            <a className="link" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600 }} href={`https://www.youtube.com/watch?v=${g.video}`} target="_blank" rel="noopener">Open on YouTube ↗</a>
          </div>
        )) : (
          <div style={{ gridColumn: "1/-1" }}>
            <a className="btn ghost" href={`https://www.youtube.com/results?search_query=how+to+install+${encodeURIComponent(q)}+pc`} target="_blank" rel="noopener">▶ Search YouTube for “how to install {q}”</a>
          </div>
        )}
      </div>
    </div>
  );
}
