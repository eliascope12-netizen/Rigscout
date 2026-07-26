// ============================================================================
// THE UPGRADE ENGINE
// ----------------------------------------------------------------------------
// Everything the Upgrade Finder knows: how fast every part is, how they limit
// each other, what a given amount of money actually buys, and what the machine
// will draw from the wall afterwards.
//
// Same rule as the compatibility engine: we do the work and state the answer.
// We never tell the customer to go and look something up.
// ============================================================================

import { CPU_SPECS, GPU_SPECS } from "./specs";

// ---------------------------------------------------------------------------
// PERFORMANCE INDEX
// ---------------------------------------------------------------------------
// A single relative gaming number per part, calibrated so that the ratio
// between any two entries matches the ratio you'd measure in real games.
// [ spec key, index, typical street price, still sold new ]
const GPU_ROWS = [
  ["RTX 5090", 200, 1999, true], ["RTX 5080", 128, 999, true], ["RTX 5070 TI", 108, 749, true],
  ["RTX 5070", 86, 549, true], ["RTX 5060 TI", 62, 429, true], ["RTX 5060", 52, 299, true],
  ["RTX 5050", 40, 249, true],
  ["RTX 4090", 140, 1899, false], ["RTX 4080 SUPER", 110, 1099, false], ["RTX 4080", 108, 1099, false],
  ["RTX 4070 TI SUPER", 98, 849, false], ["RTX 4070 TI", 92, 789, false], ["RTX 4070 SUPER", 88, 619, false],
  ["RTX 4070", 78, 549, false], ["RTX 4060 TI", 64, 389, true], ["RTX 4060", 55, 289, true],
  ["RTX 3090 TI", 95, 1099, false], ["RTX 3090", 90, 999, false], ["RTX 3080 TI", 87, 799, false],
  ["RTX 3080", 82, 649, false], ["RTX 3070 TI", 72, 499, false], ["RTX 3070", 68, 429, false],
  ["RTX 3060 TI", 62, 379, false], ["RTX 3060", 50, 269, true], ["RTX 3050", 38, 199, true],
  ["RTX 2080 TI", 66, 399, false], ["RTX 2080 SUPER", 58, 329, false], ["RTX 2070 SUPER", 53, 289, false],
  ["RTX 2060 SUPER", 47, 229, false], ["RTX 2060", 42, 189, false],
  ["GTX 1660 TI", 34, 179, false], ["GTX 1660 SUPER", 33, 169, false], ["GTX 1660", 30, 159, false],
  ["GTX 1650", 20, 139, true], ["GTX 1080 TI", 48, 249, false], ["GTX 1080", 40, 189, false],
  ["GTX 1070", 33, 149, false], ["GTX 1060", 25, 99, false], ["GTX 1050 TI", 15, 89, false],
  ["RX 9070 XT", 105, 649, true], ["RX 9070", 92, 549, true], ["RX 9060 XT", 58, 349, true],
  ["RX 7900 XTX", 112, 899, true], ["RX 7900 XT", 100, 699, true], ["RX 7900 GRE", 90, 549, false],
  ["RX 7800 XT", 84, 479, true], ["RX 7700 XT", 74, 399, true], ["RX 7600 XT", 57, 319, true],
  ["RX 7600", 54, 259, true], ["RX 6950 XT", 92, 599, false], ["RX 6900 XT", 90, 549, false],
  ["RX 6800 XT", 85, 469, false], ["RX 6800", 76, 399, false], ["RX 6750 XT", 70, 329, false],
  ["RX 6700 XT", 66, 299, false], ["RX 6650 XT", 55, 229, false], ["RX 6600 XT", 52, 209, false],
  ["RX 6600", 45, 179, true], ["RX 6500 XT", 25, 129, false], ["RX 5700 XT", 48, 179, false],
  ["RX 580", 25, 89, false],
  ["ARC B580", 56, 249, true], ["ARC B570", 48, 219, true], ["ARC A770", 52, 269, false],
  ["ARC A750", 47, 199, false], ["ARC A580", 42, 159, false], ["ARC A380", 22, 109, false],
];

const CPU_ROWS = [
  ["9950X3D", 136, 699, true], ["9800X3D", 135, 479, true], ["9900X3D", 128, 549, true],
  ["9950X", 118, 549, true], ["9900X", 114, 399, true], ["9700X", 112, 329, true], ["9600X", 106, 249, true],
  ["7950X3D", 124, 599, false], ["7800X3D", 122, 379, true], ["7900X3D", 116, 449, false],
  ["7950X", 108, 479, false], ["7900X", 104, 349, false], ["7700X", 100, 299, true], ["7700", 98, 279, true],
  ["7600X", 94, 209, true], ["7600", 92, 189, true], ["7500F", 88, 159, true],
  ["8700G", 90, 279, true], ["8600G", 82, 189, true],
  ["285K", 112, 589, true], ["265K", 106, 379, true], ["245K", 98, 289, true],
  ["14900K", 116, 499, false], ["14700K", 110, 379, false], ["14600K", 100, 269, true], ["14400F", 82, 179, true],
  ["13900K", 112, 449, false], ["13700K", 104, 329, false], ["13600K", 98, 249, true], ["13400F", 80, 159, true],
  ["12900K", 96, 289, false], ["12700K", 92, 219, false], ["12600K", 86, 179, false],
  ["12400F", 74, 119, true], ["12100F", 60, 79, true],
  ["5800X3D", 100, 279, false], ["5700X3D", 95, 199, true], ["5900X", 88, 249, false], ["5800X", 84, 179, false],
  ["5700X", 82, 149, true], ["5600X", 78, 129, false], ["5600", 76, 109, true], ["5500", 64, 79, true],
  ["3700X", 62, 109, false], ["3600", 58, 89, false], ["2600", 46, 59, false],
  ["10700K", 66, 149, false], ["11600K", 62, 129, false], ["11400F", 58, 99, false], ["10400F", 54, 79, false],
];

const displayName = (s) => (s.n.startsWith(s.brand) ? s.n : `${s.brand} ${s.n}`);

// 8 rungs for graphics, 6 for processors — used to work out which side is
// holding the other back.
const gTier = (s) => (s < 10 ? 1 : s < 30 ? 2 : s < 42 ? 3 : s < 56 ? 4 : s < 72 ? 5 : s < 90 ? 6 : s < 110 ? 7 : 8);
const cTier = (s) => (s < 45 ? 1 : s < 62 ? 2 : s < 78 ? 3 : s < 95 ? 4 : s < 112 ? 5 : 6);

export const GPU_TIER_NAMES = { 1: "Integrated", 2: "Legacy", 3: "Budget", 4: "Entry gaming", 5: "Mid range", 6: "Upper mid range", 7: "High end", 8: "Flagship" };
export const CPU_TIER_NAMES = { 1: "Legacy", 2: "Budget", 3: "Entry gaming", 4: "Mid range", 5: "High end", 6: "Flagship" };

export const GPUS = [
  { name: "Integrated graphics / no dedicated card", score: 5, tier: 1, price: 0, current: false, spec: null, key: null },
  ...GPU_ROWS.map(([k, score, price, current]) => {
    const spec = GPU_SPECS[k];
    return { name: displayName(spec), score, tier: gTier(score), price, current, spec, key: k };
  }),
].sort((a, b) => b.score - a.score);

export const CPUS = [
  { name: "Something older / pre-2018", score: 30, tier: 1, price: 0, current: false, spec: null, key: null },
  ...CPU_ROWS.map(([k, score, price, current]) => {
    const spec = CPU_SPECS[k];
    return { name: displayName(spec), score, tier: cTier(score), price, current, spec, key: k };
  }),
].sort((a, b) => b.score - a.score);

export const GPU_REF = Math.max(...GPUS.map((g) => g.score));
export const CPU_REF = Math.max(...CPUS.map((c) => c.score));

// ---------------------------------------------------------------------------
// THE REST OF THE SYSTEM
// ---------------------------------------------------------------------------
export const RAMS = [
  { label: "8 GB", gb: 8, factor: 0.82 },
  { label: "16 GB", gb: 16, factor: 1 },
  { label: "32 GB", gb: 32, factor: 1.02 },
  { label: "64 GB or more", gb: 64, factor: 1.02 },
];

export const RESOLUTIONS = [
  { label: "1080p (Full HD)", short: "1080p", key: "1080p", gpuNeed: 4, f: 1, px: "1920 × 1080" },
  { label: "1440p (QHD)", short: "1440p", key: "1440p", gpuNeed: 6, f: 0.66, px: "2560 × 1440" },
  { label: "4K (Ultra HD)", short: "4K", key: "4k", gpuNeed: 7, f: 0.42, px: "3840 × 2160" },
];

// cpuMult / gpuMult convert the performance index into frames for that genre.
// CPU frame rate barely moves with resolution; GPU frame rate moves a lot.
// Modelling those separately is what lets us say which part is the ceiling.
export const GAMES = [
  { label: "Competitive / esports (CS2, Valorant, Fortnite)", short: "Esports", key: "competitive", cpuMult: 2.6, gpuMult: 3.4, gpuAdjust: -1, cpuBase: 5 },
  { label: "AAA single-player (Cyberpunk, Elden Ring)", short: "AAA", key: "aaa", cpuMult: 1.8, gpuMult: 1.35, gpuAdjust: 1, cpuBase: 3 },
  { label: "Simulation / strategy (Flight Sim, Cities)", short: "Sim / strategy", key: "sim", cpuMult: 1.05, gpuMult: 1.6, gpuAdjust: -1, cpuBase: 5 },
  { label: "A mix of everything", short: "Mixed", key: "mix", cpuMult: 1.7, gpuMult: 1.7, gpuAdjust: 0, cpuBase: 4 },
];

export const REFRESH = [60, 75, 100, 120, 144, 165, 180, 240, 360];

export const BUDGETS = [
  { key: "100", cap: 130, label: "About $100", blurb: "The cheapest thing worth doing" },
  { key: "300", cap: 340, label: "About $300", blurb: "The sweet spot most people land on" },
  { key: "600", cap: 700, label: "$600 and up", blurb: "As far as it's worth taking this system" },
];

const shortGame = (g) => g.label.split(" (")[0];
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const clampFps = (v) => Math.max(15, Math.min(400, Math.round(v)));

// ---------------------------------------------------------------------------
// FRAME RATE
// ---------------------------------------------------------------------------
// Returns the frame rate AND the two ceilings that produced it, so the page can
// explain exactly which part ran out of road first.
export function estimateFps(cpu, gpu, res, game, ram) {
  const memF = ram ? ram.factor : 1;
  const cpuMax = cpu.score * game.cpuMult * memF;
  const gpuMax = gpu.score * game.gpuMult * res.f * (memF > 1 ? 1 : memF);
  const raw = Math.min(cpuMax, gpuMax);
  const avg = clampFps(raw);
  const limitedBy = cpuMax < gpuMax ? "CPU" : "GPU";
  // How hard each part is working to produce that number. Taken from the raw
  // ceilings so the two bars always agree with the verdict above them.
  const cpuLoad = Math.max(4, Math.min(99, Math.round((raw / cpuMax) * 99)));
  const gpuLoad = Math.max(4, Math.min(99, Math.round((raw / gpuMax) * 99)));
  return {
    avg,
    low: Math.round(avg * 0.82),
    high: Math.round(avg * 1.16),
    cpuCeiling: clampFps(cpuMax),
    gpuCeiling: clampFps(gpuMax),
    cpuLoad, gpuLoad, limitedBy,
  };
}

// Every genre at every resolution — 12 numbers instead of one.
export function fpsMatrix(cpu, gpu, ram) {
  return GAMES.map((g) => ({
    game: g,
    cells: RESOLUTIONS.map((r) => ({ res: r, ...estimateFps(cpu, gpu, r, g, ram) })),
  }));
}

// ---------------------------------------------------------------------------
// POWER — what this pair actually pulls, and the supply we'd fit
// ---------------------------------------------------------------------------
export function systemPower(cpu, gpu) {
  const cpuW = (cpu.spec && cpu.spec.peak) || 110;
  const gpuW = (gpu.spec && gpu.spec.tdp) || 0;
  const platform = 60; // board, memory, drives, fans
  const watts = cpuW + gpuW + platform;
  let recommended = Math.ceil((watts * 1.35) / 50) * 50;
  if (gpu.spec && gpu.spec.psu) recommended = Math.max(recommended, gpu.spec.psu);
  recommended = Math.max(recommended, 450);
  return { watts, recommended, cpuW, gpuW, platform };
}

// ---------------------------------------------------------------------------
// DIAGNOSIS — which part is the ceiling, and how badly
// ---------------------------------------------------------------------------
// Two separate questions, both answered from the SAME frame-rate model so the
// verdict at the top of the page can never disagree with the bars printed
// underneath it:
//
//   limiter — which part runs out of road first at the exact settings given.
//             This falls straight out of the two ceilings, and it is what
//             every upgrade suggestion on the page targets.
//   balance — whether the gap between the two parts is wider than it ought to
//             be for this kind of game at this resolution.
//
// That second question needs care. Being GPU-limited in a modern AAA game at
// 1440p is the normal, healthy state of a gaming PC — the card is meant to be
// the busy one. Judging balance against a flat ratio would mark almost every
// sensible high-resolution build as broken and push people toward parts they
// don't need. So we compare against what a healthy CPU:GPU ratio actually
// looks like for that workload.
const RES_BAL = { "1080p": 1, "1440p": 0.78, "4k": 0.58 };
const GAME_BAL = { competitive: 1.25, aaa: 0.85, sim: 1.6, mix: 1 };
const BAL_LOW = 0.72;
const BAL_HIGH = 1.4;

// Is there anything meaningfully faster still on sale? If not, the part isn't
// a weakness — it's the end of the road, and we should say so rather than
// nagging someone about a chip nothing beats.
function hasHeadroom(kind, current) {
  const pool = kind === "GPU" ? GPUS : CPUS;
  return pool.some((p) => p.spec && p.current && p.price > 0 && p.score > current.score * 1.12);
}

export function diagnose(cpu, gpu, ram, res, game) {
  const fps = estimateFps(cpu, gpu, res, game, ram);

  if (ram.gb <= 8) {
    return {
      part: "RAM", limiter: "RAM", balanced: false, severity: "cheap fix", fps,
      headline: "Memory is the first thing to fix.",
      explanation: `Modern games expect 16 GB. On 8 GB the system runs out of memory mid-level and stutters no matter how strong the ${cpu.name} or ${gpu.name} are. The ${fps.limitedBy === "CPU" ? cpu.name : gpu.name} is what sets your average frame rate — the memory is what makes it lurch. Fixing the memory costs less than any other part here and it's the one you'll feel most.`,
    };
  }
  if (!gpu.spec) {
    return {
      part: "GPU", limiter: "GPU", balanced: false, severity: "severe", fps,
      headline: "A dedicated graphics card is the upgrade.",
      explanation: `Integrated graphics share system memory with the ${cpu.name} and were never built for games. Almost any dedicated card multiplies your frame rate several times over — this is the single biggest jump available to you.`,
    };
  }

  const limiter = fps.limitedBy;
  const strongName = limiter === "CPU" ? gpu.name : cpu.name;
  const weakName = limiter === "CPU" ? cpu.name : gpu.name;
  const strongCeil = limiter === "CPU" ? fps.gpuCeiling : fps.cpuCeiling;
  const idle = Math.max(0, strongCeil - fps.avg);

  const target = 1.35 * (RES_BAL[res.key] || 1) * (GAME_BAL[game.key] || 1);
  const r = cpu.score / gpu.score / target;

  const flaggedGpu = r > BAL_HIGH && limiter === "GPU";
  const flaggedCpu = r < BAL_LOW && limiter === "CPU";
  const roomToGrow = hasHeadroom(limiter, limiter === "CPU" ? cpu : gpu);

  // Top of the range. Not a fault — a finish line.
  if ((flaggedGpu || flaggedCpu) && !roomToGrow) {
    return {
      part: "Balanced", limiter, balanced: true, toppedOut: true, severity: null, fps,
      headline: `The ${weakName} is already as fast as this part gets.`,
      explanation: `At ${res.label} playing ${shortGame(game)} the ${weakName} is what sets your ${fps.avg} FPS — and there's nothing meaningfully quicker on sale to replace it with. That isn't a weakness in your machine, it's the top of the range. Put the money into a screen that can show these frames, or into settings you'd actually notice.`,
    };
  }

  if (!flaggedGpu && !flaggedCpu) {
    const thinCpu = r < BAL_LOW; // the card is the ceiling, but the chip is lean
    return {
      part: "Balanced", limiter, balanced: true, severity: null, fps,
      headline: "Your CPU and graphics card are well matched.",
      explanation:
        `At ${res.label} playing ${shortGame(game)} the ${weakName} sets the pace at about ${fps.avg} FPS and the ${strongName} stays comfortably ahead of it — which is exactly how a healthy gaming PC behaves at this resolution. Neither part is being wasted, and buying a single component would move this number very little.` +
        (thinCpu
          ? ` Worth knowing for later: the ${cpu.name} is on the lean side for a card this strong. It costs you nothing at ${res.label} today, but drop to a lower resolution or fit a much faster card and the processor becomes the limit.`
          : ""),
    };
  }

  const excess = flaggedGpu ? r / BAL_HIGH : BAL_LOW / r;
  const severity = excess >= 1.45 ? "severe" : excess >= 1.2 ? "moderate" : "mild";

  if (flaggedGpu) {
    return {
      part: "GPU", limiter: "GPU", balanced: false, severity, fps,
      headline: "Your graphics card is the ceiling.",
      explanation: `At ${res.label} playing ${shortGame(game)} the ${gpu.name} tops out around ${fps.gpuCeiling} FPS, while the ${cpu.name} has enough headroom to feed about ${fps.cpuCeiling} — roughly ${idle} frames a second sitting unused. Every frame you're missing is coming from the card, so a faster card is the only thing that raises this number.`,
    };
  }
  return {
    part: "CPU", limiter: "CPU", balanced: false, severity, fps,
    headline: "Your processor is the ceiling.",
    explanation: `At ${res.label} playing ${shortGame(game)} the ${gpu.name} could push about ${fps.gpuCeiling} FPS, but the ${cpu.name} only prepares frames fast enough for around ${fps.cpuCeiling} — roughly ${idle} frames a second the card never gets asked for. You feel that as stutter in busy scenes and as a frame rate that won't climb even when you drop the settings. A faster processor is the fix.`,
  };
}

// ---------------------------------------------------------------------------
// WHAT YOUR MONEY BUYS
// ---------------------------------------------------------------------------
// For each budget: find the best part that money buys, then run the frame rate
// model again with that part fitted so the customer sees the real difference
// before spending anything.

function candidates(part, current, cap) {
  const pool = part === "GPU" ? GPUS : CPUS;
  // Everything on sale, inside the budget, and genuinely faster than what's
  // already fitted. Deliberately NO socket preference at this stage — a drop-in
  // that adds nothing isn't a bargain, and sorting by socket first is what used
  // to put a $199 chip at the top of the $600 tier. Preference is applied later,
  // on the frames a part actually wins.
  return pool
    .filter((p) => p.spec && p.current && p.price > 0 && p.price <= cap && p.score > current.score * 1.12)
    .sort((a, b) => b.score - a.score);
}

// Value has to be judged on the share of frames gained, not the raw count.
// A frame is worth far more to someone sitting at 48 FPS than to someone
// sitting at 250, so a flat dollars-per-frame scale calls a $649 card that
// nearly doubles a slow machine "top-end pricing" — which is both wrong and
// the opposite of helpful. This measures how much faster the machine gets per
// $100 spent, which behaves the same way at either end of the range.
const valueWord = (price, pctGain) => {
  if (!price || !pctGain || pctGain <= 0) return null;
  const per100 = pctGain / (price / 100);
  return per100 >= 20
    ? "Outstanding value"
    : per100 >= 12
    ? "Strong value"
    : per100 >= 7
    ? "Fair for what it adds"
    : "You're paying for the last few frames";
};

export function upgradePaths(cpu, gpu, ram, res, game, diag) {
  const now = estimateFps(cpu, gpu, res, game, ram);
  const out = [];

  // Spend on whatever is actually capping the frame rate. Money put anywhere
  // else cannot move the number, so we don't offer it.
  const part = diag.limiter === "RAM" ? "GPU" : diag.limiter;
  const current = part === "GPU" ? gpu : cpu;

  // Score every faster part on sale once, at any price, then slice by budget
  // below. Doing it this way round means a bracket that can't afford anything
  // can still name the part worth saving for, instead of a dead end.
  const scoredAll = candidates(part, current, Infinity)
    .map((p) => {
      const after = part === "GPU" ? estimateFps(cpu, p, res, game, ram) : estimateFps(p, gpu, res, game, ram);
      const gain = after.avg - now.avg;
      const pctGain = Math.round((gain / now.avg) * 100);
      const dropIn = part === "CPU" && !!cpu.spec && p.spec.socket === cpu.spec.socket;
      const needsBoard = part === "CPU" && !!cpu.spec && p.spec.socket !== cpu.spec.socket;
      const needsMem = needsBoard && p.spec.mem !== cpu.spec.mem;
      const perFrame = gain > 0 ? p.price / gain : null;
      // Did this upgrade overshoot? If the other part becomes the ceiling
      // afterwards, say so plainly — that's the number they'd otherwise have
      // to discover after the money was already spent.
      const flips = after.limitedBy !== now.limitedBy;
      return {
        ...p,
        after: after.avg, gain, pctGain, perFrame,
        value: valueWord(p.price, pctGain),
        dropIn, needsBoard, needsMem,
        capNote: flips
          ? part === "GPU"
            ? `This is as far as your ${cpu.name} can go at these settings — at ${after.avg} FPS the processor becomes the ceiling, so a more expensive card than this one would sit partly idle.`
            : `This is as far as your ${gpu.name} can go at these settings — at ${after.avg} FPS the card becomes the ceiling, so a more expensive processor than this one would sit partly idle.`
          : null,
        // The hidden cost, stated before they click — not after they buy.
        platformNote: needsMem
          ? `Different socket to your ${cpu.name}: this one also needs an ${p.spec.socket} motherboard and ${p.spec.mem} memory. Count that in before you decide.`
          : needsBoard
          ? `Different socket to your ${cpu.name}: this one also needs an ${p.spec.socket} motherboard. Your ${cpu.spec ? cpu.spec.mem : "existing"} memory carries over.`
          : part === "CPU"
          ? `Drops straight into your existing board — same ${p.spec.socket} socket, same memory, nothing else to buy.`
          : null,
        power: part === "GPU" ? systemPower(cpu, p) : systemPower(p, gpu),
      };
    })
    // Never recommend a part that doesn't change what you see. Anything worth
    // under 3 frames, or under 5%, is a part you shouldn't be sold.
    .filter((p) => p.gain >= 3 && p.pctGain >= 5)
    .sort((x, y) => y.gain - x.gain || x.price - y.price);

  // The cheapest part anywhere on sale that genuinely moves this machine. Used
  // by brackets that can't reach it, so "nothing here" comes with a target.
  const cheapestReal = scoredAll.reduce((a, p) => (!a || p.price < a.price ? p : a), null);

  // The best frame rate a cheaper bracket has already reached. Once a smaller
  // budget runs into the other part's ceiling, every dearer bracket lands on
  // exactly the same number — and reprinting the same three parts under a
  // bigger heading is how a site quietly implies that more money buys more
  // frames. Tracked here so the dearer bracket can say so instead.
  let reached = null;
  // Label of the bracket that already spelled out the save-up target, so the
  // brackets underneath it don't print the same paragraph a second and third
  // time. Three identical notes down a page read like a broken site.
  let told = null;

  for (const b of BUDGETS) {
    // 8 GB of memory beats everything else at the cheap end.
    if (ram.gb <= 8 && b.key === "100") {
      const better = { ...ram, gb: 32, factor: 1.02 };
      const after = estimateFps(cpu, gpu, res, game, better);
      out.push({
        budget: b, part: "RAM", picks: [],
        search: `32GB ${cpu.spec && cpu.spec.mem === "DDR5" ? "DDR5" : "DDR4"} desktop memory`,
        cat: "ram", price: 85,
        now: now.avg, after: after.avg, gain: after.avg - now.avg,
        note: "A 32 GB kit ends the stuttering and costs less than any other part here. Do this one first.",
        dropIn: true,
      });
      continue;
    }

    const scored = scoredAll.filter((p) => p.price <= b.cap);

    // Once an upgrade hits the other part's ceiling, everything above it lands
    // on exactly the same frame rate for more money. Showing a $699 chip beside
    // a $479 one that produces the identical number is how people get sold the
    // difference. Keep the cheapest of each outcome and drop the rest.
    const byResult = new Map();
    for (const p of scored) if (!byResult.has(p.after)) byResult.set(p.after, p);
    const ranked = [...byResult.values()].sort((x, y) => y.gain - x.gain || x.price - y.price);

    // And drop anything beaten outright: costs more, delivers less. Listing a
    // $699 card underneath a $649 one that's faster isn't choice, it's a trap
    // for whoever assumes the dearer part must be the better part. The one
    // exception is a chip that keeps your motherboard when the faster one
    // doesn't — that's a real advantage worth paying for, so it stays.
    const distinct = ranked.filter(
      (p, i) => !ranked.some((q, j) => j < i && q.price <= p.price && q.gain >= p.gain && (q.dropIn || !p.dropIn))
    );

    if (!distinct.length) {
      // "Nothing here" on its own is a dead end. Either there is genuinely
      // nothing faster on sale — worth knowing, and worth being told plainly —
      // or the step up simply starts above this bracket, in which case the
      // useful answer is the price to save toward and what it buys.
      const other = part === "GPU" ? cpu : gpu;
      const word = part === "GPU" ? "graphics card" : "processor";
      const otherCeil = part === "GPU" ? now.cpuCeiling : now.gpuCeiling;
      let note;
      if (!cheapestReal) {
        note = told
          ? `Same here — there is nothing faster on sale, at any price.`
          : `There is no faster ${word} on sale than your ${current.name}, at any price. That's a good problem to have: no bracket on this page has anything to offer you, and a higher-refresh screen is where the improvement lives now.`;
      } else {
        note = told
          ? `Same answer as the ${told} bracket — nothing is worth fitting until the ${cheapestReal.name} at ${money(cheapestReal.price)}.`
          : `The step up from your ${current.name} starts at ${money(cheapestReal.price)}, with the ${cheapestReal.name} — above this bracket, and worth ${now.avg} → ${cheapestReal.after} FPS. Nothing cheaper is worth fitting; it would only add frames you'd never see. Save toward that one rather than spending here.` +
            (cheapestReal.after >= otherCeil - 2
              ? ` Do bear in mind your ${other.name} caps this machine at about ${otherCeil} FPS whatever you fit.`
              : "");
      }
      told = told || b.label.toLowerCase();
      out.push({
        budget: b, part, picks: [], now: now.avg, after: now.avg, gain: 0,
        savingFor: cheapestReal || null, note, dropIn: true,
      });
      continue;
    }

    // A bigger budget that lands on exactly the same frame rate isn't a bigger
    // budget — it's the same advice at a worse price. Say so plainly rather
    // than reprinting the list and letting someone assume the dearer bracket
    // must be the better one.
    if (reached && distinct[0].after <= reached.after) {
      const other = part === "GPU" ? cpu : gpu;
      const word = part === "GPU" ? "card" : "processor";
      out.push({
        budget: b, part, picks: [], now: now.avg, after: now.avg, gain: 0, cappedBy: reached,
        note: `Spending more than this doesn't buy you anything. Your ${other.name} sets a hard ceiling of about ${reached.after} FPS at these settings, and the ${reached.name} in the ${reached.budget.label.toLowerCase()} bracket already reaches it — every ${word} above that one lands on the identical number for more money. Keep the difference, or put it toward ${part === "GPU" ? "a faster processor" : "the graphics card"} if you want the ceiling itself to move.`,
        dropIn: true,
      });
      continue;
    }

    // Now the drop-in preference, and only now: a same-socket chip that lands
    // within 10% of the best result for less money is the better buy once you
    // count the motherboard you don't have to buy.
    let ordered = distinct;
    const best = distinct[0];
    const di = distinct.findIndex((p) => p.dropIn && p.gain >= best.gain * 0.9 && p.price < best.price);
    if (di > 0) ordered = [distinct[di], ...distinct.filter((_, i) => i !== di)];

    const picks = ordered.slice(0, 3);
    const top = picks[0];
    // Record the *best* result this bracket can reach, not the one we led with —
    // the drop-in preference can put a slightly slower part first, and the next
    // bracket up has to be measured against the real ceiling.
    reached = { after: distinct[0].after, name: distinct[0].name, budget: b };
    out.push({
      budget: b, part, picks, now: now.avg, after: top.after, gain: top.gain,
      cat: part === "GPU" ? "gpu" : "cpu",
      search: top.spec.n,
      dropIn: top.dropIn,
      note: null,
    });
  }

  return out;
}

// ---------------------------------------------------------------------------
// THE THING YOU SHOULD NOT BUY
// ---------------------------------------------------------------------------
export function dontBuy(cpu, gpu, diag) {
  const fps = diag.fps;
  if (diag.toppedOut) {
    return {
      part: "another part for this machine",
      text: `Both halves of this system sit at the top of what's sold today. More money spent inside the case buys almost nothing. A higher-refresh monitor — or simply turning the settings up — is where the improvement actually is.`,
    };
  }
  if (diag.limiter === "GPU" && fps.cpuLoad <= 80) {
    return {
      part: "a processor",
      text: `Leave the ${cpu.name} exactly where it is. It's running at about ${fps.cpuLoad}% and still finishing early — a faster chip would only wait for the graphics card slightly quicker. Every dollar here belongs in the card.`,
    };
  }
  if (diag.limiter === "CPU" && fps.gpuLoad <= 80) {
    return {
      part: "a graphics card",
      text: `Don't touch the ${gpu.name}. It's only working at about ${fps.gpuLoad}% because the processor can't ask it for more — a faster card would change nothing at all until the CPU moves.`,
    };
  }
  if (diag.balanced) {
    return {
      part: "one part on its own",
      text: `Because nothing here is the weak link, swapping any single part gets you very little. A real jump takes the processor and the card together — or a higher-refresh monitor to show the frames you already make.`,
    };
  }
  return null;
}

// ---------------------------------------------------------------------------
// THE MONITOR — the upgrade nobody thinks of
// ---------------------------------------------------------------------------
export function monitorVerdict(fps, refresh, res) {
  if (fps.avg > refresh * 1.25) {
    const target = REFRESH.find((r) => r >= fps.avg * 0.85) || 240;
    return {
      state: "capped",
      headline: `Your screen is throwing frames away.`,
      text: `This system makes about ${fps.avg} FPS and your ${refresh} Hz monitor can only show ${refresh} of them. Roughly ${fps.avg - refresh} frames a second are being rendered and discarded. A ${target} Hz ${res.short} monitor turns performance you have already paid for into something you can actually see — and it's usually cheaper than a graphics card.`,
      cat: "monitor",
      search: `${res.short === "4K" ? "4K" : res.short} ${target}Hz gaming monitor`,
    };
  }
  if (fps.avg < refresh * 0.6) {
    return {
      state: "under",
      headline: `You're not filling your ${refresh} Hz screen yet.`,
      text: `At about ${fps.avg} FPS you're using roughly ${Math.round((fps.avg / refresh) * 100)}% of what your monitor can display. The good news is the screen isn't the limit — everything you gain from the upgrades below shows up on it immediately.`,
    };
  }
  return {
    state: "matched",
    headline: `Your monitor and your machine are a good match.`,
    text: `About ${fps.avg} FPS against a ${refresh} Hz panel is close to ideal — you're filling the screen without wasting frames on the floor.`,
  };
}

// ---------------------------------------------------------------------------
// ONE CALL, WHOLE REPORT
// ---------------------------------------------------------------------------
export function analyze({ cpu, gpu, ram, res, game, refresh }) {
  const fps = estimateFps(cpu, gpu, res, game, ram);
  const diag = diagnose(cpu, gpu, ram, res, game);
  const matrix = fpsMatrix(cpu, gpu, ram);
  const power = systemPower(cpu, gpu);
  const monitor = monitorVerdict(fps, refresh, res);
  const paths = upgradePaths(cpu, gpu, ram, res, game, diag);
  const avoid = dontBuy(cpu, gpu, diag);

  // The best this machine really does — read off the customer's OWN genre row,
  // not the easiest game in the list. Scanning all four genres for the fastest
  // cell is how a GTX 1650 build ends up being told it's a 4K machine.
  const myRow = matrix.find((row) => row.game.key === game.key) || matrix[0];
  const backwards = [...myRow.cells].reverse(); // 4K first, then 1440p, then 1080p
  const smooth = backwards.find((c) => c.avg >= 90);
  const playable = smooth || backwards.find((c) => c.avg >= 60);
  const sweet = playable ? { ...playable, game: myRow.game, bar: smooth ? 90 : 60 } : null;

  const facts = [];
  facts.push({
    k: "Frame rate",
    v: `${fps.avg} FPS`,
    d: `${fps.low}–${fps.high} FPS in ${shortGame(game)} at ${res.label}`,
  });
  facts.push({
    k: "Held back by",
    v: diag.balanced ? "Nothing out of place" : diag.part,
    d: diag.balanced
      ? `The ${diag.limiter === "CPU" ? cpu.name : gpu.name} sets the pace, which is normal at ${res.short}`
      : `${diag.part === "RAM" ? "Memory" : diag.part === "CPU" ? cpu.name : gpu.name} runs out first`,
  });
  facts.push({
    k: "Power draw",
    v: `${power.watts} W`,
    d: `A ${power.recommended} W supply covers it with headroom`,
  });
  facts.push({
    k: "Best fit",
    v: sweet ? `${sweet.res.short} ${shortGame(sweet.game)}` : `${res.short}, turned down`,
    d: sweet
      ? `${sweet.avg} FPS — the highest resolution this pair holds above ${sweet.bar} FPS in ${shortGame(sweet.game)}`
      : `This pair doesn't reach 60 FPS in ${shortGame(game)} even at 1080p — that's what the upgrades below are for`,
  });

  return { cpu, gpu, ram, res, game, refresh, fps, diag, matrix, power, monitor, paths, avoid, facts, sweet };
}
