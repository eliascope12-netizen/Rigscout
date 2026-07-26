// ============================================================================
// THE UPGRADE FINDER
// ----------------------------------------------------------------------------
// Tell us two parts and we give you the whole picture: what your frame rate is
// now, which part is the ceiling and by how much, what every genre and
// resolution looks like on this machine, what it draws from the wall, whether
// your monitor is wasting frames, exactly what each budget buys you — and what
// you should NOT spend money on.
//
// Same rule as everywhere else on RigScout: we do the work and state the
// answer. Nothing here is homework for the customer.
// ============================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CPUS, GPUS, RAMS, RESOLUTIONS, GAMES, REFRESH,
  CPU_REF, GPU_REF, CPU_TIER_NAMES, GPU_TIER_NAMES,
  analyze,
} from "../lib/benchmarks";

// ---------------------------------------------------------------------------
// Forgiving part matching — people type "5600", "3060 ti", "i5 12400".
// ---------------------------------------------------------------------------
const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

function resolve(list, val) {
  const raw = String(val || "").trim();
  if (!raw) return null;
  const n = norm(raw);
  if (!n) return null;

  const exact = list.find((i) => norm(i.name) === n);
  if (exact) return exact;

  const byKey = list.find((i) => i.key && norm(i.key) === n);
  if (byKey) return byKey;

  // Contains — shortest name wins, so "5600" lands on the 5600 and not the
  // 5600X3D, and a tie breaks toward the faster part.
  const hits = list.filter((i) => norm(i.name).includes(n));
  if (hits.length) {
    return [...hits].sort((a, b) => a.name.length - b.name.length || b.score - a.score)[0];
  }
  return null;
}

const fpsClass = (v) => (v >= 100 ? "good" : v >= 60 ? "mid" : "low");
const money = (v) => "$" + Math.round(v).toLocaleString();

export default function Upgrade() {
  const [cpuVal, setCpuVal] = useState("");
  const [gpuVal, setGpuVal] = useState("");
  const [ram, setRam] = useState(1);
  const [res, setRes] = useState(0);
  const [game, setGame] = useState(3);
  const [refresh, setRefresh] = useState(144);
  const [picked, setPicked] = useState(null);
  const [err, setErr] = useState("");

  function run(e) {
    e && e.preventDefault();
    const cpu = resolve(CPUS, cpuVal);
    const gpu = resolve(GPUS, gpuVal);
    if (!cpu && !gpu) { setErr("Pick your processor and your graphics card from the lists — start typing and they'll appear."); return; }
    if (!cpu) { setErr("We didn't recognise that processor. Try the model number on its own — “5600”, “12400F”, “14700K”."); return; }
    if (!gpu) { setErr("We didn't recognise that graphics card. Try the model number on its own — “3060”, “6700 XT”, “RTX 5070”."); return; }
    setErr("");
    setCpuVal(cpu.name);
    setGpuVal(gpu.name);
    setPicked({ cpu, gpu });
  }

  // Once you've analysed, changing resolution / genre / monitor updates the
  // whole report live. No re-clicking.
  const r = useMemo(() => {
    if (!picked) return null;
    return analyze({
      cpu: picked.cpu, gpu: picked.gpu,
      ram: RAMS[ram], res: RESOLUTIONS[res], game: GAMES[game],
      refresh,
    });
  }, [picked, ram, res, game, refresh]);

  return (
    <div className="widewrap page">
      <span className="eyebrow">Upgrade Finder</span>
      <h1 style={{ fontSize: 38 }}>Find out what&apos;s actually holding you back.</h1>
      <p className="lead" style={{ maxWidth: 740 }}>
        Two parts is all we need. We&apos;ll work out your frame rate, which component runs out of road first,
        what every upgrade is worth in real frames, and what you shouldn&apos;t waste money on.
      </p>

      {/* ================= INPUT ================= */}
      <form className="uform" onSubmit={run}>
        <div className="ufield wide">
          <label htmlFor="cpu">Your processor</label>
          <input id="cpu" list="cpus" value={cpuVal} onChange={(e) => setCpuVal(e.target.value)}
            placeholder="Start typing — “5600”, “i5 12400”, “7800X3D”" autoComplete="off" />
          <datalist id="cpus">{CPUS.map((c) => <option key={c.name} value={c.name} />)}</datalist>
        </div>
        <div className="ufield wide">
          <label htmlFor="gpu">Your graphics card</label>
          <input id="gpu" list="gpus" value={gpuVal} onChange={(e) => setGpuVal(e.target.value)}
            placeholder="Start typing — “3060”, “6700 XT”, “RTX 5070”" autoComplete="off" />
          <datalist id="gpus">{GPUS.map((g) => <option key={g.name} value={g.name} />)}</datalist>
        </div>
        <div className="ufield">
          <label htmlFor="ram">Memory</label>
          <select id="ram" value={ram} onChange={(e) => setRam(+e.target.value)}>
            {RAMS.map((x, i) => <option key={i} value={i}>{x.label}</option>)}
          </select>
        </div>
        <div className="ufield">
          <label htmlFor="res">You play at</label>
          <select id="res" value={res} onChange={(e) => setRes(+e.target.value)}>
            {RESOLUTIONS.map((x, i) => <option key={i} value={i}>{x.label}</option>)}
          </select>
        </div>
        <div className="ufield">
          <label htmlFor="game">Mostly playing</label>
          <select id="game" value={game} onChange={(e) => setGame(+e.target.value)}>
            {GAMES.map((x, i) => <option key={i} value={i}>{x.label}</option>)}
          </select>
        </div>
        <div className="ufield">
          <label htmlFor="hz">Your monitor</label>
          <select id="hz" value={refresh} onChange={(e) => setRefresh(+e.target.value)}>
            {REFRESH.map((h) => <option key={h} value={h}>{h} Hz</option>)}
          </select>
        </div>
        <div className="uform-go">
          <button className="btn" type="submit">{picked ? "Update my report" : "Analyze my build →"}</button>
          {picked && <span className="faint">Change anything above and the report updates instantly.</span>}
        </div>
        {err && <p className="uerr">{err}</p>}
      </form>

      {/* ================= REPORT ================= */}
      {r && (
        <div className="report">

          {/* ---- headline facts ---- */}
          <div className="factstrip">
            {r.facts.map((f) => (
              <div className="factcard" key={f.k}>
                <div className="fk">{f.k}</div>
                <div className="fv">{f.v}</div>
                <div className="fd">{f.d}</div>
              </div>
            ))}
          </div>

          {/* ---- the verdict ---- */}
          <div className={"diagbox " + (r.diag.balanced ? "balanced" : r.diag.severity === "cheap fix" ? "cheap" : r.diag.severity)}>
            <div className="dg-mark">{r.diag.balanced ? "✓" : r.diag.severity === "severe" ? "!" : "→"}</div>
            <div>
              <div className="dg-tag">
                {r.diag.toppedOut ? "Top of the range"
                  : r.diag.balanced ? "Nothing is holding you back"
                    : r.diag.severity === "cheap fix" ? "Quick win"
                      : `${r.diag.severity} bottleneck · ${r.diag.part}`}
              </div>
              <h2>{r.diag.headline}</h2>
              <p>{r.diag.explanation}</p>
            </div>
          </div>

          {/* ---- where the frames come from ---- */}
          <h2 className="usec">Where your frames are coming from</h2>
          <p className="usub">
            Each part has its own frame-rate ceiling. Whichever ceiling is lower is the one you actually get —
            at {r.res.label} in {r.game.short.toLowerCase()} that&apos;s the{" "}
            <strong>{r.fps.limitedBy === "CPU" ? r.cpu.name : r.gpu.name}</strong>.
          </p>

          <div className="ceilings">
            <div className={"ceil" + (r.fps.limitedBy === "CPU" ? " limit" : "")}>
              <div className="cl-top">
                <div>
                  <span className="cl-part">Processor</span>
                  <strong>{r.cpu.name}</strong>
                </div>
                <div className="cl-num">{r.fps.cpuCeiling}<em> FPS ceiling</em></div>
              </div>
              <div className="track"><div className="fill" style={{ width: r.fps.cpuLoad + "%" }} /></div>
              <div className="cl-foot">
                <span>Working at <strong>{r.fps.cpuLoad}%</strong> to make {r.fps.avg} FPS</span>
                <span className="faint">{CPU_TIER_NAMES[r.cpu.tier]} · {Math.round((r.cpu.score / CPU_REF) * 100)}% of the fastest chip you can buy</span>
              </div>
              {r.fps.limitedBy === "CPU"
                ? <div className="cl-flag">This is your ceiling — the card is waiting on it</div>
                : <div className="cl-ok">{r.fps.cpuCeiling - r.fps.avg} FPS of headroom left in this chip</div>}
            </div>

            <div className={"ceil" + (r.fps.limitedBy === "GPU" ? " limit" : "")}>
              <div className="cl-top">
                <div>
                  <span className="cl-part">Graphics card</span>
                  <strong>{r.gpu.name}</strong>
                </div>
                <div className="cl-num">{r.fps.gpuCeiling}<em> FPS ceiling</em></div>
              </div>
              <div className="track"><div className="fill" style={{ width: r.fps.gpuLoad + "%" }} /></div>
              <div className="cl-foot">
                <span>Working at <strong>{r.fps.gpuLoad}%</strong> to make {r.fps.avg} FPS</span>
                <span className="faint">{GPU_TIER_NAMES[r.gpu.tier]} · {Math.round((r.gpu.score / GPU_REF) * 100)}% of the fastest card you can buy</span>
              </div>
              {r.fps.limitedBy === "GPU"
                ? <div className="cl-flag">This is your ceiling — the processor is waiting on it</div>
                : <div className="cl-ok">{r.fps.gpuCeiling - r.fps.avg} FPS of headroom left in this card</div>}
            </div>
          </div>

          {/* ---- the matrix ---- */}
          <h2 className="usec">This machine, in every game and every resolution</h2>
          <p className="usub">
            Average frames per second. Your own setting is highlighted — the rest shows you where else this build is happy.
          </p>
          <div className="matrix">
            <div className="mx-row head">
              <span className="mx-lab" />
              {RESOLUTIONS.map((x) => (
                <span className="mx-cell" key={x.key}>{x.short}<em>{x.px}</em></span>
              ))}
            </div>
            {r.matrix.map((row) => (
              <div className="mx-row" key={row.game.key}>
                <span className="mx-lab">{row.game.short}</span>
                {row.cells.map((c) => {
                  const mine = row.game.key === r.game.key && c.res.key === r.res.key;
                  return (
                    <span className={"mx-cell val " + fpsClass(c.avg) + (mine ? " on" : "")} key={c.res.key}>
                      {c.avg}
                      <em>{c.limitedBy === "CPU" ? "CPU limited" : "GPU limited"}</em>
                      {mine && <span className="mx-you">You</span>}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="usub" style={{ marginTop: 12 }}>
            {r.sweet ? (
              <>
                For the games you play, the highest resolution this build still holds above {r.sweet.bar} FPS is{" "}
                <strong>{r.sweet.res.short}</strong>, at about {r.sweet.avg} FPS. That&apos;s the setting to aim your
                monitor at.
              </>
            ) : (
              <>
                In {r.game.short.toLowerCase()} this pair doesn&apos;t reach 60 FPS even at 1080p. Turning settings down
                helps, but the fixes priced below are what actually move it.
              </>
            )}
          </p>

          {/* ---- monitor + power ---- */}
          <div className="tworow">
            <div className={"monbox " + r.monitor.state}>
              <div className="mb-tag">Your screen</div>
              <h3>{r.monitor.headline}</h3>
              <p>{r.monitor.text}</p>
              {r.monitor.search && (
                <Link className="btn ghost sm" href={`/parts/monitor?q=${encodeURIComponent(r.monitor.search)}`}>
                  See {r.monitor.search} →
                </Link>
              )}
            </div>

            <div className="powbox">
              <div className="mb-tag">Power</div>
              <div className="pw-row"><span>{r.cpu.name}</span><em>{r.power.cpuW} W</em></div>
              <div className="pw-row"><span>{r.gpu.name}</span><em>{r.power.gpuW ? r.power.gpuW + " W" : "—"}</em></div>
              <div className="pw-row"><span>Board, memory, drives, fans</span><em>{r.power.platform} W</em></div>
              <div className="pw-row total"><span>Under full load</span><strong>{r.power.watts} W</strong></div>
              <div className="pw-rec">
                <span>Power supply that covers it</span>
                <strong>{r.power.recommended} W</strong>
              </div>
              <p className="faint" style={{ fontSize: 12.5, margin: "10px 0 0" }}>
                Sized with headroom for spikes, so it stays quiet and doesn&apos;t trip under load.
              </p>
            </div>
          </div>

          {/* ---- what your money buys ---- */}
          <h2 className="usec">What your money actually buys</h2>
          <p className="usub">
            Real parts at real prices, with your frame rate recalculated as if each one were already fitted.
            Nothing here is a guess about “up to” performance — it&apos;s the same model that produced the numbers above.
          </p>

          <div className="paths">
            {r.paths.map((p) => (
              <div className={"path" + (p.picks && p.picks.length ? "" : " quiet")} key={p.budget.key}>
                <div className="pa-head">
                  <div>
                    <strong>{p.budget.label}</strong>
                    <span className="faint">{p.budget.blurb}</span>
                  </div>
                  {p.gain > 0 && (
                    <div className="pa-gain">
                      {p.now} → <strong>{p.after}</strong> FPS
                      <em>+{Math.round(((p.after - p.now) / p.now) * 100)}%</em>
                    </div>
                  )}
                </div>

                {p.note && <p className="pa-note">{p.note}</p>}

                {p.part === "RAM" && p.search && (
                  <Link className="btn sm" href={`/parts/ram?q=${encodeURIComponent(p.search)}`}>
                    Browse {p.search} →
                  </Link>
                )}

                {p.picks && p.picks.length > 0 && (
                  <div className="picks">
                    {p.picks.map((k, i) => (
                      <div className={"pick" + (i === 0 ? " top" : "")} key={k.name}>
                        <div className="pk-l">
                          <div className="pk-name">
                            {k.name}
                            {i === 0 && <span className="tag best">Best of this budget</span>}
                            {k.dropIn && <span className="tag prime">Drop-in — keeps your board &amp; memory</span>}
                            {k.needsBoard && <span className="tag warn">New motherboard needed</span>}
                          </div>
                          <div className="pk-stats">
                            <span className="stat"><em>New frame rate</em><b>{k.after} FPS</b></span>
                            <span className="stat"><em>You gain</em><b className="up">+{k.gain} FPS ({k.pctGain}%)</b></span>
                            <span className="stat"><em>Cost per frame</em><b>{k.perFrame ? "$" + k.perFrame.toFixed(2) : "—"}</b></span>
                            <span className="stat"><em>Supply needed</em><b>{k.power.recommended} W</b></span>
                          </div>
                          {k.platformNote && <p className="pk-note">{k.platformNote}</p>}
                          {k.capNote && <p className="pk-note cap">{k.capNote}</p>}
                        </div>
                        <div className="pk-r">
                          <div className="pk-price">{money(k.price)}<em>typical</em></div>
                          {k.value && <div className="pk-value">{k.value}</div>}
                          <Link className="btn sm" href={`/parts/${p.cat}?q=${encodeURIComponent(k.spec.n)}`}>
                            See prices →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ---- what not to buy ---- */}
          {r.avoid && (
            <div className="avoidbox">
              <div className="av-mark">✕</div>
              <div>
                <div className="mb-tag">Don&apos;t buy {r.avoid.part}</div>
                <p>{r.avoid.text}</p>
              </div>
            </div>
          )}

          <div className="uclose">
            <h3>Want to see the whole thing side by side?</h3>
            <p className="muted">
              Drop these parts into the <Link href="/builder" className="ilink">PC Builder</Link> and it checks socket,
              memory, clearance and power for you automatically — or go straight to{" "}
              <Link href="/parts" className="ilink">Browse Parts</Link> and see every option Amazon has, with the specs on every row.
            </p>
            <div className="ubtns">
              <Link className="btn" href="/builder">Open the PC Builder →</Link>
              <Link className="btn ghost" href={`/parts/${r.diag.limiter === "CPU" ? "cpu" : r.diag.limiter === "RAM" ? "ram" : "gpu"}`}>
                Browse {r.diag.limiter === "CPU" ? "processors" : r.diag.limiter === "RAM" ? "memory" : "graphics cards"} →
              </Link>
            </div>
          </div>
        </div>
      )}

      {!r && (
        <div className="uhint">
          <div className="uh-item"><strong>We estimate the frame rate</strong><span>For your parts, your resolution and the kind of games you actually play.</span></div>
          <div className="uh-item"><strong>We find the ceiling</strong><span>Which part runs out first, how hard each one is working, and how much is left in the other.</span></div>
          <div className="uh-item"><strong>We price the fix</strong><span>Every budget, with the new frame rate worked out before you spend a penny.</span></div>
          <div className="uh-item"><strong>We tell you what to skip</strong><span>Half of good advice is knowing which part is already fast enough.</span></div>
        </div>
      )}
    </div>
  );
}
