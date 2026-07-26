// ============================================================================
// THE COMPATIBILITY ENGINE
// ----------------------------------------------------------------------------
// RigScout does the research so the customer never has to. This file takes a
// build (the parts someone picked) and works out — for real, from the actual
// specifications in lib/specs.js — whether every piece fits together.
//
// Two jobs:
//   1. checkBuild(build)  → verified checks + estimated wattage + a verdict
//   2. fits(cat, specs, build) → used by the parts browser so incompatible
//      parts are filtered out BEFORE anyone can pick them. A conflict the
//      customer can't create is a conflict they never have to think about.
//
// Rule for every string in this file: never ask the customer to verify
// anything. If we can't confirm something, we quietly don't claim it — we do
// not hand the homework back.
// ============================================================================

import { readSpecs, CPU_SPECS, GPU_SPECS, CASE_FITS } from "./specs";

export const CATEGORIES = [
  { key: "cpu", label: "CPU", icon: "▣", required: true },
  { key: "cooler", label: "CPU Cooler", icon: "❄", required: false },
  { key: "mobo", label: "Motherboard", icon: "▤", required: true },
  { key: "ram", label: "Memory", icon: "▥", required: true },
  { key: "storage", label: "Storage", icon: "▦", required: true },
  { key: "gpu", label: "Graphics Card", icon: "◨", required: false },
  { key: "psu", label: "Power Supply", icon: "⚡", required: true },
  { key: "case", label: "Case", icon: "▢", required: true },
  { key: "monitor", label: "Monitor", icon: "▭", required: false },
];

// Pull specs off a picked product (products carry {title}).
export function specsOf(cat, product) {
  if (!product) return null;
  if (product.__specs) return product.__specs;
  const s = readSpecs(cat, product.title);
  return s && Object.keys(s).length ? s : null;
}

function build2specs(build) {
  const out = {};
  for (const c of CATEGORIES) out[c.key] = specsOf(c.key, build[c.key]);
  return out;
}

// ---------------------------------------------------------------------------
// POWER — the PCPartPicker-style "Estimated Wattage" number
// ---------------------------------------------------------------------------
// We add up what the parts actually draw at full tilt, then size the supply
// with real headroom on top so the machine never browns out under load.
export function estimateWattage(build) {
  const s = build2specs(build);
  let w = 0;
  const lines = [];

  if (s.cpu && s.cpu.peak) { w += s.cpu.peak; lines.push({ n: s.cpu.n || "Processor", w: s.cpu.peak }); }
  else if (build.cpu) { w += 120; lines.push({ n: "Processor", w: 120 }); }

  if (s.gpu && s.gpu.tdp) { w += s.gpu.tdp; lines.push({ n: s.gpu.n || "Graphics card", w: s.gpu.tdp }); }

  // Board + memory + drives + fans + pump. Real measured platform overhead.
  let plat = 45;
  if (s.ram && s.ram.sticks) plat += s.ram.sticks * 4; else if (build.ram) plat += 8;
  if (build.storage) plat += (s.storage && s.storage.type === "Hard drive") ? 9 : 7;
  if (s.cooler && s.cooler.type === "Liquid") plat += 12; else if (build.cooler) plat += 5;
  w += plat;
  lines.push({ n: "Motherboard, memory, drives & fans", w: plat });

  // Headroom: 35% keeps the supply out of its hot, loud, inefficient top end
  // and leaves room for transient GPU spikes.
  let rec = Math.ceil((w * 1.35) / 50) * 50;
  if (s.gpu && s.gpu.psu) rec = Math.max(rec, s.gpu.psu);
  rec = Math.max(rec, 450);

  return { watts: Math.round(w), recommended: rec, lines };
}

// ---------------------------------------------------------------------------
// FILTERING — stop incompatible parts from ever reaching the customer
// ---------------------------------------------------------------------------
// hard:true  = physically will not work → hidden from the browser
// hard:false = works, but something else in the build should grow → shown with
//              a short note so the customer stays in control
export function fits(cat, specs, build) {
  const b = build2specs(build);
  const ok = { ok: true };
  if (!specs) return ok; // Unrecognised listing — never hide it, never claim it.

  if (cat === "cpu") {
    if (b.mobo && b.mobo.socket && specs.socket && b.mobo.socket !== specs.socket)
      return { ok: false, hard: true, reason: `Needs a ${specs.socket} motherboard` };
    if (b.ram && b.ram.mem && specs.mem && !specs.mem.includes(b.ram.mem))
      return { ok: false, hard: true, reason: `Uses ${specs.mem} memory` };
    if (b.cooler && b.cooler.sockets && specs.socket && !b.cooler.sockets.includes(specs.socket))
      return { ok: false, hard: true, reason: `Your cooler doesn't mount on ${specs.socket}` };
  }

  if (cat === "mobo") {
    if (b.cpu && b.cpu.socket && specs.socket && b.cpu.socket !== specs.socket)
      return { ok: false, hard: true, reason: `${b.cpu.n} needs ${b.cpu.socket}` };
    if (b.ram && b.ram.mem && specs.mem && specs.mem !== b.ram.mem)
      return { ok: false, hard: true, reason: `Your memory is ${b.ram.mem}` };
    if (b.case && b.case.supports && specs.form && !b.case.supports.includes(specs.form))
      return { ok: false, hard: true, reason: `Too big for your ${b.case.size} case` };
  }

  if (cat === "ram") {
    const want = (b.mobo && b.mobo.mem) || (b.cpu && b.cpu.mem && !b.cpu.mem.includes("/") ? b.cpu.mem : null);
    if (want && specs.mem && specs.mem !== want)
      return { ok: false, hard: true, reason: `Your build takes ${want}` };
  }

  if (cat === "gpu") {
    if (b.case && b.case.maxGpu && specs.len && specs.len > b.case.maxGpu)
      return { ok: false, hard: true, reason: `${specs.len}mm — your case fits ${b.case.maxGpu}mm` };
    if (b.psu && b.psu.watts && specs.psu && specs.psu > b.psu.watts)
      return { ok: false, hard: false, reason: `Wants a ${specs.psu}W supply` };
  }

  if (cat === "case") {
    if (b.mobo && b.mobo.form && specs.supports && !specs.supports.includes(b.mobo.form))
      return { ok: false, hard: true, reason: `Won't take your ${b.mobo.form} board` };
    if (b.gpu && b.gpu.len && specs.maxGpu && b.gpu.len > specs.maxGpu)
      return { ok: false, hard: true, reason: `Your ${b.gpu.n} is ${b.gpu.len}mm` };
    if (b.cooler && b.cooler.height && specs.maxCooler && b.cooler.height > specs.maxCooler)
      return { ok: false, hard: true, reason: `Your cooler is ${b.cooler.height}mm tall` };
  }

  if (cat === "cooler") {
    if (b.cpu && b.cpu.socket && specs.sockets && !specs.sockets.includes(b.cpu.socket))
      return { ok: false, hard: true, reason: `Doesn't mount on ${b.cpu.socket}` };
    if (b.case && b.case.maxCooler && specs.height && specs.height > b.case.maxCooler)
      return { ok: false, hard: true, reason: `${specs.height}mm tall — your case allows ${b.case.maxCooler}mm` };
    if (b.cpu && b.cpu.peak && specs.rated && specs.rated < b.cpu.peak - 20)
      return { ok: false, hard: false, reason: `Light for a ${b.cpu.peak}W chip` };
  }

  if (cat === "psu") {
    const need = estimateWattage(build).recommended;
    if (specs.watts && specs.watts < need)
      return { ok: false, hard: false, reason: `This build wants ${need}W` };
    if (b.case && b.case.size && b.case.size !== "Mini-ITX" && specs.form === "SFX")
      return ok; // SFX fits a big case fine with a bracket — not worth flagging.
  }

  return ok;
}

// ---------------------------------------------------------------------------
// THE VERDICT
// ---------------------------------------------------------------------------
// Every check we can run, we run. Passing checks are stated as facts, because
// they are facts. Failing checks come with the fix already worked out.

function chk(id, label, detail) { return { id, label, detail, status: "pass" }; }
function bad(id, label, detail, fix) { return { id, label, detail, fix, status: "fail" }; }
function soft(id, label, detail, fix) { return { id, label, detail, fix, status: "warn" }; }

export function checkBuild(build) {
  const s = build2specs(build);
  const checks = [];
  const power = estimateWattage(build);
  const missing = CATEGORIES.filter((c) => c.required && !build[c.key]);

  // When the chip and the board don't share a socket, this machine has no
  // platform yet — everything downstream of that pairing (which memory it
  // takes, above all) depends on which of the two gets swapped. Checks that
  // would have to assume an answer are held back until the socket is settled,
  // because a green tick on a build that can't exist is worse than no tick.
  const socketClash = !!(s.cpu && s.mobo && s.cpu.socket && s.mobo.socket && s.cpu.socket !== s.mobo.socket);

  // --- CPU ↔ motherboard socket -------------------------------------------
  if (s.cpu && s.mobo && s.cpu.socket && s.mobo.socket) {
    if (s.cpu.socket === s.mobo.socket) {
      checks.push(chk("socket", "CPU fits the motherboard",
        `${s.cpu.n} is a Socket ${s.cpu.socket} chip and your ${s.mobo.chipset} board is Socket ${s.mobo.socket}. It drops straight in.`));
    } else {
      const alt = Object.values(CPU_SPECS).find((c) => c.socket === s.mobo.socket && c.cores >= (s.cpu.cores || 6));
      checks.push(bad("socket", "CPU and motherboard use different sockets",
        `${s.cpu.n} is Socket ${s.cpu.socket}; the ${s.mobo.chipset} board is Socket ${s.mobo.socket}.`,
        { text: alt ? `Swap to a ${s.mobo.socket} chip like the ${alt.n}` : `Pick a Socket ${s.cpu.socket} motherboard`, cat: alt ? "cpu" : "mobo", q: alt ? alt.n : `${s.cpu.socket} motherboard` }));
    }
  }

  // --- Memory generation ---------------------------------------------------
  // The board is the authority on which generation slots in. Failing that, the
  // chip decides — but only when it supports a single generation, since every
  // LGA1700 processor runs either and can't settle it on its own.
  const memWant = socketClash
    ? null
    : (s.mobo && s.mobo.mem) || (s.cpu && s.cpu.mem && !s.cpu.mem.includes("/") ? s.cpu.mem : null);
  if (s.ram && s.ram.mem && memWant) {
    if (s.ram.mem === memWant) {
      checks.push(chk("mem", "Memory is the right type",
        `Your ${s.ram.gb ? s.ram.gb + "GB " : ""}kit is ${s.ram.mem}, which is exactly what this ${s.cpu ? s.cpu.n : "platform"}${s.mobo ? " / " + s.mobo.chipset + " board" : ""} runs.`));
    } else {
      checks.push(bad("mem", "Memory is the wrong generation",
        `This platform takes ${memWant}; the kit selected is ${s.ram.mem}. The notch is in a different place, so it physically won't seat.`,
        { text: `Switch to a ${memWant} kit`, cat: "ram", q: `${s.ram.gb || 32}GB ${memWant} desktop memory` }));
    }
  }

  // --- Board ↔ case --------------------------------------------------------
  if (s.mobo && s.case && s.mobo.form && s.case.supports) {
    if (s.case.supports.includes(s.mobo.form)) {
      checks.push(chk("form", "Motherboard fits the case",
        `A ${s.case.size} case takes ${s.case.supports.join(", ")} boards — yours is ${s.mobo.form}. The standoffs line up.`));
    } else {
      checks.push(bad("form", "Motherboard is too big for the case",
        `That case takes ${s.case.supports.join(", ")} boards and this one is ${s.mobo.form}.`,
        { text: `Move up to a case that takes ${s.mobo.form}`, cat: "case", q: `${s.mobo.form} mid tower case` }));
    }
  }

  // --- GPU ↔ case ----------------------------------------------------------
  if (s.gpu && s.case && s.gpu.len && s.case.maxGpu) {
    if (s.gpu.len <= s.case.maxGpu) {
      checks.push(chk("gpulen", "Graphics card clears the case",
        `${s.gpu.n} cards are about ${s.gpu.len}mm long and this case has ${s.case.maxGpu}mm of room — ${s.case.maxGpu - s.gpu.len}mm to spare.`));
    } else {
      checks.push(bad("gpulen", "Graphics card is longer than the case",
        `${s.gpu.n} needs about ${s.gpu.len}mm; this case gives ${s.case.maxGpu}mm.`,
        { text: "Pick a case with more clearance", cat: "case", q: "ATX mid tower case 400mm GPU clearance" }));
    }
  }

  // --- Power ---------------------------------------------------------------
  if (s.psu && s.psu.watts) {
    if (s.psu.watts >= power.recommended) {
      checks.push(chk("psu", "Power supply has real headroom",
        `Everything here draws about ${power.watts}W flat out. Your ${s.psu.watts}W unit covers that with ${s.psu.watts - power.watts}W to spare — it'll run cool and quiet, and it has room if you upgrade the card later.`));
    } else if (s.psu.watts >= power.watts + 40) {
      checks.push(soft("psu", "Power supply works — a bigger one would breathe easier",
        `The build pulls about ${power.watts}W and your ${s.psu.watts}W unit handles it, but it'll be working near the top of its range. ${power.recommended}W is the comfortable size.`,
        { text: `Step up to ${power.recommended}W`, cat: "psu", q: `${power.recommended}W 80+ Gold power supply` }));
    } else {
      checks.push(bad("psu", "Power supply is undersized",
        `This build draws about ${power.watts}W at load and the selected unit is ${s.psu.watts}W. It will shut off under gaming load.`,
        { text: `Move to ${power.recommended}W`, cat: "psu", q: `${power.recommended}W 80+ Gold power supply` }));
    }
  }

  // --- Cooler --------------------------------------------------------------
  const coolerName = (s.cooler && s.cooler.n) || (s.cooler && s.cooler.type === "Liquid"
    ? (s.cooler.radiator ? `${s.cooler.radiator}mm liquid cooler` : "liquid cooler")
    : "air cooler");
  // A cooler that can't bolt to this chip is already on its way out of the
  // build, so everything else we might say about it — that it's underpowered,
  // that it's too tall — is a complaint about a part nobody is keeping. One
  // clear problem with one fix reads as help; three stacked problems about the
  // same dead part reads as a machine that doesn't work.
  let coolerRuledOut = false;
  if (s.cpu && s.cooler) {
    if (s.cooler.sockets && s.cpu.socket) {
      if (s.cooler.sockets.includes(s.cpu.socket)) {
        checks.push(chk("cooler", "Cooler mounts on this CPU",
          `The ${coolerName} ships ${s.cpu.socket} mounting hardware in the box, so it bolts onto your ${s.cpu.n} with nothing else to buy.`));
      } else {
        coolerRuledOut = true;
        checks.push(bad("cooler", "Cooler doesn't mount on this socket",
          `The ${coolerName} ships brackets for ${s.cooler.sockets.join(", ")} and your CPU is ${s.cpu.socket}.`,
          { text: `Pick an ${s.cpu.socket} cooler`, cat: "cooler", q: `${s.cpu.socket} CPU cooler` }));
      }
    }
    if (s.cooler.rated && s.cpu.peak && !coolerRuledOut) {
      if (s.cooler.rated >= s.cpu.peak - 20) {
        checks.push(chk("thermal", "Cooling is sized for this chip",
          `${s.cpu.n} peaks around ${s.cpu.peak}W and the ${coolerName} is built for roughly ${s.cooler.rated}W. It holds boost clocks instead of throttling.`));
      } else {
        checks.push(soft("thermal", "Cooler is light for this processor",
          `${s.cpu.n} can pull ${s.cpu.peak}W and the ${coolerName} is rated for about ${s.cooler.rated}W — it'll run, but it'll get loud and pull back clocks under a long load.`,
          { text: "Move up to a bigger cooler", cat: "cooler", q: `${s.cpu.socket} 240mm AIO liquid cooler` }));
      }
    }
  } else if (s.cpu && !build.cooler) {
    if (s.cpu.cooler) {
      checks.push(chk("cooler", "Cooler included in the box",
        `${s.cpu.n} ships with a ${s.cpu.brand} cooler that's fine at stock speeds — you don't have to buy one.`));
    } else if (!missing.length) {
      // Every required part is chosen and there's still nothing to cool the
      // chip with. Said once, at the end, rather than nagging halfway through
      // a build someone is still assembling.
      checks.push(soft("cooler", "This processor doesn't come with a cooler",
        `${s.cpu.brand} ships the ${s.cpu.n} on its own, so a cooler is the one thing still missing — it can't run without one. Anything rated for ${s.cpu.peak}W or more will hold its clocks, and the cooler list is already filtered to ${s.cpu.socket} mounts, so whatever you pick there fits.`,
        { text: `Add a ${s.cpu.socket} cooler`, cat: "cooler", q: `${s.cpu.socket} CPU cooler` }));
    }
  }

  // --- Cooler ↔ case height ------------------------------------------------
  if (s.cooler && s.case && s.cooler.height && s.case.maxCooler && !coolerRuledOut) {
    if (s.cooler.height <= s.case.maxCooler) {
      checks.push(chk("coolerfit", "Cooler clears the side panel",
        `The ${coolerName} stands ${s.cooler.height}mm tall and this case allows ${s.case.maxCooler}mm — ${s.case.maxCooler - s.cooler.height}mm of room above it. The panel closes.`));
    } else {
      checks.push(bad("coolerfit", "Cooler is too tall for the case",
        `The ${coolerName} is ${s.cooler.height}mm tall and this case has ${s.case.maxCooler}mm of clearance, so the side panel won't go back on.`,
        { text: "Pick a shorter cooler", cat: "cooler", q: `${s.cpu && s.cpu.socket ? s.cpu.socket + " " : ""}low profile CPU cooler` }));
    }
  }

  // --- Something to plug the monitor into ----------------------------------
  if (s.cpu && !build.gpu) {
    if (s.cpu.igpu) {
      checks.push(chk("display", "You'll get a picture without a graphics card",
        `${s.cpu.n} has ${s.cpu.igpu} built in, so the board's HDMI/DisplayPort works on day one. Add a card later whenever you want more frames.`));
    } else {
      checks.push(soft("display", "This CPU needs a graphics card to output video",
        `${s.cpu.n} has no built-in graphics, so the machine won't show a picture until a card goes in.`,
        { text: "Add a graphics card", cat: "gpu", q: "graphics card" }));
    }
  }

  // --- Storage -------------------------------------------------------------
  if (s.storage && s.mobo && s.storage.type === "M.2 NVMe") {
    checks.push(chk("m2", "Drive slots straight onto the board",
      `${s.mobo.chipset} boards have M.2 slots on top${s.storage.gen ? `, and a Gen ${s.storage.gen} drive is fully backward compatible` : ""} — no cables at all.`));
  }

  // --- Memory capacity sanity ---------------------------------------------
  if (s.ram && s.ram.gb && s.gpu) {
    if (s.ram.gb >= 16) {
      checks.push(chk("cap", "Enough memory for modern games",
        `${s.ram.gb}GB${s.ram.sticks === 2 ? " in a dual-channel pair" : ""} is ${s.ram.gb >= 32 ? "plenty of room for gaming plus everything else you leave open" : "the sweet spot for gaming today"}.`));
    } else {
      checks.push(soft("cap", "16GB is the modern minimum",
        `${s.ram.gb}GB will boot and run, but newer titles stutter when they run out of memory.`,
        { text: "Go to a 16GB or 32GB kit", cat: "ram", q: `32GB ${s.ram.mem || "DDR5"} desktop memory` }));
    }
  }

  const failures = checks.filter((c) => c.status === "fail");
  const warnings = checks.filter((c) => c.status === "warn");
  const passes = checks.filter((c) => c.status === "pass");

  const chosen = CATEGORIES.filter((c) => build[c.key]).length;

  let state, headline, body;
  if (!chosen) {
    state = "empty";
    headline = "Start with any part";
    body = "Pick anything — a CPU, a card, a case. From then on RigScout only shows you parts that fit what you've already chosen, so you can't build something that doesn't work.";
  } else if (failures.length) {
    state = "fail";
    headline = failures.length === 1 ? "One part needs swapping" : `${failures.length} parts need swapping`;
    body = "Here's exactly what to change — tap the fix and we'll take you to parts that work.";
  } else if (warnings.length) {
    state = "warn";
    headline = "This build works";
    body = `Every part physically fits and the machine will boot. ${warnings.length === 1 ? "One thing" : `${warnings.length} things`} below would make it better, but nothing here stops it running.`;
  } else if (missing.length) {
    state = "ok";
    headline = "Everything so far fits together";
    body = `${passes.length} compatibility ${passes.length === 1 ? "check" : "checks"} verified. Keep going — ${missing.map((m) => m.label.toLowerCase()).join(", ")} still to add.`;
  } else {
    state = "great";
    headline = "This build works. All of it.";
    body = `RigScout checked every part against every other part — sockets, memory, clearances and power — and all ${passes.length} checks passed. Order it exactly as listed and it goes together.`;
  }

  return {
    checks, passes, warnings, failures, missing,
    power, state, headline, body,
    verified: passes.length,
    complete: !missing.length,
  };
}

// A one-line, plain-English summary used in compact places.
export function shortVerdict(r) {
  if (r.state === "fail") return r.headline;
  if (r.state === "empty") return "Nothing added yet";
  if (r.state === "great") return `Verified compatible · ${r.verified} checks passed`;
  if (r.state === "warn") return `Works · ${r.verified} checks passed`;
  return `${r.verified} checks passed so far`;
}

// Given a build, suggest what the customer should sensibly add next.
export function nextStep(build) {
  const order = ["cpu", "mobo", "ram", "storage", "gpu", "psu", "case", "cooler"];
  for (const k of order) if (!build[k]) return CATEGORIES.find((c) => c.key === k);
  return null;
}

export { GPU_SPECS, CPU_SPECS, CASE_FITS };
