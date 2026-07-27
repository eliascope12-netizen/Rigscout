import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PartBrowser from "../components/PartBrowser";
import PartnerStrip from "../components/PartnerStrip";
import DiscordCTA from "../components/DiscordCTA";
import { CATEGORIES, checkBuild, nextStep } from "../lib/compat";
import { specLine } from "../lib/specs";
import { CATS } from "../lib/catalog";

const STORE = "rigscout.build.v2";

function loadBuild() {
  try { const s = window.localStorage.getItem(STORE); return s ? JSON.parse(s) : {}; } catch { return {}; }
}
function saveBuild(b) {
  try { window.localStorage.setItem(STORE, JSON.stringify(b)); } catch { /* private mode — fine */ }
}

export default function Builder() {
  const [build, setBuild] = useState({});
  const [open, setOpen] = useState(null);   // category key currently being browsed
  const [ready, setReady] = useState(false);

  useEffect(() => { setBuild(loadBuild()); setReady(true); }, []);
  useEffect(() => { if (ready) saveBuild(build); }, [build, ready]);

  // Lock the page behind the picker so the overlay scrolls on its own.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const pick = useCallback((cat, product) => {
    setBuild((b) => ({ ...b, [cat]: product }));
    setOpen(null);
  }, []);
  const remove = (cat) => setBuild((b) => { const n = { ...b }; delete n[cat]; return n; });
  const clear = () => setBuild({});

  const report = useMemo(() => checkBuild(build), [build]);
  const total = useMemo(
    () => CATEGORIES.reduce((s, c) => s + (build[c.key] && build[c.key].price ? build[c.key].price : 0), 0),
    [build]
  );
  const next = nextStep(build);
  const chosen = CATEGORIES.filter((c) => build[c.key]).length;

  return (
    <div className="widewrap page">
      <span className="eyebrow">PC Builder</span>
      <h1 style={{ fontSize: 38 }}>Build it. We make sure it works.</h1>
      <p className="lead" style={{ maxWidth: 730 }}>
        Add parts in any order. RigScout checks every one against everything else you&apos;ve picked —
        socket, memory, clearance, power — and only shows you parts that fit.
      </p>

      <div className="buildgrid2">
        {/* ---------------- parts list ---------------- */}
        <div>
          <div className="blist">
            {CATEGORIES.map((c) => {
              const p = build[c.key];
              const line = p ? specLine(c.key, p.specs || {}) : "";
              return (
                <div className={"brow2" + (p ? " filled" : "")} key={c.key}>
                  <div className="bcat">
                    <span className="bico">{c.icon}</span>
                    <span>{c.label}{!c.required && <em className="opt">optional</em>}</span>
                  </div>

                  {p ? (
                    <>
                      <a className="bthumb" href={p.url} target="_blank" rel="nofollow sponsored noopener">
                        <img src={p.image} alt="" loading="lazy" />
                      </a>
                      <div className="bmid">
                        <a className="bname" href={p.url} target="_blank" rel="nofollow sponsored noopener">{p.title}</a>
                        {line && <div className="bspec">{line}</div>}
                      </div>
                      <div className="bprice">{p.price != null ? "$" + p.price.toFixed(2) : "—"}</div>
                      <div className="bacts">
                        <button className="linkbtn" onClick={() => setOpen(c.key)}>Change</button>
                        <button className="linkbtn danger" onClick={() => remove(c.key)}>Remove</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bthumb empty">{c.icon}</div>
                      <div className="bmid">
                        <button className="bchoose" onClick={() => setOpen(c.key)}>
                          Choose {CATS[c.key] ? CATS[c.key].article : "a part"}
                        </button>
                        <div className="bspec faint">
                          {chosen > 0 ? "Filtered to parts that fit what you've already picked" : "Browse the full Amazon catalog"}
                        </div>
                      </div>
                      <div className="bprice faint">—</div>
                      <div className="bacts" />
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="btotal">
            <span>Total</span>
            <strong>${total.toFixed(2)}</strong>
          </div>
          {chosen > 0 && (
            <div style={{ marginTop: 14, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <button className="linkbtn danger" onClick={clear}>Start over</button>
              <span className="faint" style={{ fontSize: 13 }}>Your build is saved in this browser — it&apos;ll still be here tomorrow.</span>
            </div>
          )}
        </div>

        {/* ---------------- verdict sidebar ---------------- */}
        <aside className="verdictcol">
          <div className={"verdictbox " + report.state}>
            <div className="vstate">
              {report.state === "fail" ? "✕" : report.state === "warn" ? "!" : report.state === "empty" ? "＋" : "✓"}
            </div>
            <h2>{report.headline}</h2>
            <p>{report.body}</p>
            {report.state === "great" && <div className="stamp">Verified by RigScout · {report.verified} checks</div>}
          </div>

          {report.power.watts > 0 && (
            <div className="wattbox">
              <div className="wrow head"><span>Estimated wattage</span><strong>{report.power.watts} W</strong></div>
              {report.power.lines.map((l, i) => (
                <div className="wrow" key={i}><span>{l.n}</span><em>{l.w} W</em></div>
              ))}
              <div className="wrow rec"><span>Power supply we&apos;d fit</span><strong>{report.power.recommended} W</strong></div>
            </div>
          )}

          {report.checks.length > 0 && (
            <div className="checks">
              <div className="cheadline">
                {report.failures.length
                  ? "What to change"
                  : `${report.verified} compatibility ${report.verified === 1 ? "check" : "checks"} passed`}
              </div>
              {[...report.failures, ...report.warnings, ...report.passes].map((c) => (
                <div className={"check " + c.status} key={c.id}>
                  <span className="mark">{c.status === "pass" ? "✓" : c.status === "warn" ? "!" : "✕"}</span>
                  <div>
                    <div className="clabel">{c.label}</div>
                    <div className="cdetail">{c.detail}</div>
                    {c.fix && <button className="fixbtn" onClick={() => setOpen(c.fix.cat)}>{c.fix.text} →</button>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {next && (
            <button className="btn nextbtn" onClick={() => setOpen(next.key)}>Add {next.label.toLowerCase()} →</button>
          )}

          {report.complete && !report.failures.length && (
            <div className="buyall">
              <div className="ba-h">Ready to order</div>
              <p className="faint" style={{ margin: "2px 0 10px", fontSize: 13 }}>Every part opens straight on Amazon at the price shown.</p>
              {CATEGORIES.filter((c) => build[c.key]).map((c) => (
                <a key={c.key} className="ba-row" href={build[c.key].url} target="_blank" rel="nofollow sponsored noopener">
                  <span>{c.label}</span><em>Open →</em>
                </a>
              ))}
            </div>
          )}

          {/* Once there's something real in the list, offer the second opinion —
              and only after that, the things that aren't parts. */}
          {chosen > 1 && <DiscordCTA variant="box" />}
          {report.complete && !report.failures.length && <PartnerStrip />}
        </aside>
      </div>

      <p className="faint" style={{ marginTop: 40, fontSize: 13, maxWidth: 730 }}>
        Not sure where to start? The <Link href="/upgrade" className="ilink">Upgrade Finder</Link> works out which part is
        actually holding your frame rate back, and <Link href="/parts" className="ilink">Browse Parts</Link> puts the whole
        catalog in front of you.
      </p>

      {/* ---------------- the open picker ---------------- */}
      {open && (
        <div className="picker">
          <div className="pk-head">
            <div>
              <span className="eyebrow">Choose {CATS[open] ? CATS[open].article : "a part"}</span>
              <h2 style={{ margin: "2px 0 0", fontSize: 22 }}>{CATS[open] ? CATS[open].plural : "Parts"}</h2>
            </div>
            <button className="pk-close" onClick={() => setOpen(null)} aria-label="Close">✕</button>
          </div>
          <div className="pk-body">
            <PartBrowser cat={open} build={build} embedded onPick={(p) => pick(open, p)} />
          </div>
        </div>
      )}
    </div>
  );
}
