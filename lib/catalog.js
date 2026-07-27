// ============================================================================
// THE CATALOG
// ----------------------------------------------------------------------------
// One place that describes every part category: how we search Amazon for it,
// what counts as a real result (vs. a cable or a sticker), which spec columns
// the browser shows, and which filters appear down the left-hand side.
//
// Breadth comes from FAN-OUT: instead of one search we run many — by model, by
// brand, by tier — across multiple pages, then merge on ASIN. That is how you
// get hundreds of graphics cards instead of sixteen.
// ============================================================================

import { CPU_SPECS, GPU_SPECS, CHIPSET_SPECS, specLine } from "./specs.js";

const cpuModels = Object.keys(CPU_SPECS);
const gpuModels = Object.keys(GPU_SPECS);

// Queries are grouped into tranches. The browser loads the first tranche
// instantly and pulls deeper ones as the customer scrolls / asks for more,
// so we never burn a hundred API calls to render one screen.
export const TRANCHE_SIZE = 7;

export const CATS = {
  cpu: {
    label: "CPU", plural: "Processors", article: "a CPU",
    blurb: "Every desktop processor on Amazon, with the socket and core count read off the real spec sheet.",
    queries: [
      "desktop processor", "AMD Ryzen processor", "Intel Core processor",
      "Ryzen 7 9800X3D", "Ryzen 9 9950X3D", "Ryzen 5 9600X", "Ryzen 7 7800X3D",
      "Ryzen 5 7600X", "Ryzen 7 5700X3D", "Ryzen 5 5600", "Ryzen 9 7950X",
      "Intel Core i9 14900K", "Intel Core i7 14700K", "Intel Core i5 14600K",
      "Intel Core i5 13400F", "Intel Core i7 12700K", "Intel Core i5 12400F",
      "Intel Core Ultra 9 285K", "Intel Core Ultra 7 265K", "Intel Core Ultra 5 245K",
      "Ryzen 7 8700G", "Ryzen 5 8600G", "unlocked gaming CPU", "Ryzen Threadripper",
    ],
    exclude: /\b(laptop|notebook|cooler|fan|thermal|paste|delid|bracket|mount|sticker|keychain|shirt|poster|refurb|renewed|combo kit|bundle with|motherboard combo|barebone|mini pc|desktop computer|gaming pc|prebuilt|all[- ]in[- ]one)\b/i,
    needSpecs: true,
  },
  cooler: {
    label: "CPU Cooler", plural: "CPU Coolers", article: "a cooler",
    blurb: "Air towers and liquid AIOs. We only show the ones that bolt onto the CPU you picked.",
    queries: [
      "CPU cooler", "AIO liquid CPU cooler 240mm", "air CPU cooler tower",
      "360mm AIO liquid cooler", "Noctua CPU cooler", "be quiet CPU cooler",
      "Thermalright CPU cooler", "Corsair liquid cooler", "ARCTIC Liquid Freezer",
      "DeepCool CPU cooler", "Cooler Master Hyper", "NZXT Kraken",
      "low profile CPU cooler ITX", "AM5 CPU cooler", "LGA1700 CPU cooler",
      "280mm AIO cooler", "ARGB CPU cooler",
    ],
    exclude: /\b(laptop|thermal paste|case fan pack|GPU cooler|chipset|VRM|fan controller|dust filter|bracket|standoff|screw|wrist strap|cable tie|sag holder|support stick)\b/i,
    // See isRelevant(): readSpecs("cooler", …) types every unrecognised title as
    // an air cooler rated for 180W, so "at least one real fact" is satisfied by a
    // wrist strap. This is the positive test — the listing has to say what it is.
    require: /\b(cooler|cooling|AIO|heat[-\s]?sink|water\s*cool(?:er|ing|ed)?|radiator|liquid\s*freez)/i,
  },
  mobo: {
    label: "Motherboard", plural: "Motherboards", article: "a motherboard",
    blurb: "Chipset, socket, memory type and size — all read from the board itself, not guessed.",
    queries: [
      "motherboard", "AM5 motherboard", "LGA1700 motherboard", "B650 motherboard",
      "X670E motherboard", "B850 motherboard", "X870 motherboard", "B760 motherboard",
      "Z790 motherboard", "Z890 motherboard", "B550 motherboard", "X570 motherboard",
      "micro ATX motherboard", "mini ITX motherboard", "ASUS ROG motherboard",
      "MSI MAG motherboard", "GIGABYTE AORUS motherboard", "ASRock motherboard",
      "B650E motherboard WiFi", "B860 motherboard",
    ],
    exclude: /\b(laptop|replacement screen|combo|bundle|CPU included|refurb|renewed|standoff|screw|tray|test bench|riser)\b/i,
    needSpecs: true,
  },
  ram: {
    label: "Memory", plural: "Memory Kits", article: "memory",
    blurb: "DDR5 and DDR4 desktop kits. Only the generation your board actually takes is shown.",
    queries: [
      "desktop RAM memory", "DDR5 6000 32GB kit", "DDR5 desktop memory 16GB",
      "DDR4 3200 16GB desktop memory", "DDR4 3600 32GB kit", "Corsair Vengeance DDR5",
      "G.SKILL Trident Z5", "Kingston Fury Beast DDR5", "Crucial DDR5 desktop",
      "TEAMGROUP T-Force DDR5", "64GB DDR5 kit", "RGB DDR5 memory",
      "DDR5 CL30 memory", "Patriot Viper DDR5", "low profile DDR4 memory",
    ],
    exclude: /\b(laptop|SODIMM|so-dimm|server|ECC registered|RDIMM|Mac|iMac|flash drive|SD card|SSD)\b/i,
  },
  storage: {
    label: "Storage", plural: "Storage Drives", article: "a drive",
    blurb: "NVMe, SATA and hard drives. Capacity and interface pulled straight from the listing.",
    queries: [
      "internal SSD", "M.2 NVMe SSD 1TB", "PCIe Gen4 NVMe SSD 2TB",
      "PCIe Gen5 NVMe SSD", "Samsung 990 PRO", "WD Black SN850X",
      "Crucial P3 Plus NVMe", "4TB NVMe SSD", "SATA SSD 1TB",
      "internal hard drive 4TB", "Seagate Barracuda hard drive", "8TB internal hard drive",
      "heatsink NVMe SSD PS5", "500GB NVMe SSD",
    ],
    exclude: /\b(external|portable|enclosure|USB flash|microSD|memory card|dock|caddy|adapter only|laptop hard drive case)\b/i,
  },
  gpu: {
    label: "Graphics Card", plural: "Graphics Cards", article: "a graphics card",
    blurb: "The full GeForce, Radeon and Arc line-up — with the length and power draw of every card.",
    queries: [
      "graphics card", "gaming graphics card", "GeForce RTX graphics card", "Radeon RX graphics card",
      "RTX 5090 graphics card", "RTX 5080 graphics card", "RTX 5070 Ti graphics card",
      "RTX 5070 graphics card", "RTX 5060 Ti 16GB", "RTX 5060 graphics card",
      "RTX 4090 graphics card", "RTX 4080 SUPER", "RTX 4070 Ti SUPER", "RTX 4070 SUPER",
      "RTX 4060 Ti graphics card", "RTX 4060 graphics card", "RTX 3060 12GB",
      "RTX 3050 graphics card", "RX 9070 XT", "RX 9070 graphics card", "RX 9060 XT",
      "RX 7900 XTX", "RX 7900 XT", "RX 7800 XT", "RX 7700 XT", "RX 7600 graphics card",
      "RX 6600 graphics card", "Intel Arc B580", "Intel Arc A750", "GTX 1650 graphics card",
      "ASUS TUF graphics card", "MSI Gaming X graphics card", "GIGABYTE WINDFORCE graphics card",
      "ZOTAC GAMING graphics card", "Sapphire PULSE Radeon", "XFX Speedster Radeon",
      "PowerColor Hellhound", "PNY GeForce RTX", "ASRock Radeon graphics card",
      "low profile graphics card", "ITX graphics card",
    ],
    exclude: /\b(laptop|notebook|external GPU|eGPU|riser|extension cable|bracket|support|holder|anti[- ]sag|stand|backplate|water block|cooler only|thermal pad|mining|server card|Quadro|Tesla|refurbished|renewed|used|mouse pad|poster|sticker|keychain|shirt|prebuilt|gaming pc|desktop computer)\b/i,
    needSpecs: true,
  },
  psu: {
    label: "Power Supply", plural: "Power Supplies", article: "a power supply",
    blurb: "Wattage, efficiency rating and modularity — checked against what your build actually draws.",
    queries: [
      "power supply PC", "850W power supply 80+ Gold", "750W power supply modular",
      "1000W power supply ATX 3.1", "650W power supply Gold", "1200W power supply",
      "Corsair RM power supply", "EVGA SuperNOVA power supply", "Seasonic Focus power supply",
      "MSI MAG power supply", "Thermaltake Toughpower", "SFX power supply 750W",
      "be quiet Pure Power", "550W power supply", "ATX 3.1 PCIe 5.1 power supply",
    ],
    exclude: /\b(laptop|adapter|UPS|battery backup|surge protector|tester|extension|cable kit|sleeved cable|breakout|bench|bracket|screw|wrist strap)\b/i,
    // Same reason as the cooler shelf: matchPsu() calls everything it doesn't
    // recognise an ATX unit, so the fact test never fails. A power supply always
    // says so somewhere in its title.
    // "80+" can't take a trailing \b — "+" is not a word character, so \b would
    // never match against the space that follows it in "80+ Gold".
    require: /\b(?:power\s*supply|PSU|SFX(?:-L)?)\b|\b80\s*(?:\+|plus)/i,
  },
  case: {
    label: "Case", plural: "PC Cases", article: "a case",
    blurb: "Every tower, with the board sizes it takes and how long a card it swallows.",
    queries: [
      "PC case", "ATX mid tower case", "micro ATX case", "mini ITX case",
      "full tower PC case", "tempered glass PC case", "airflow mesh PC case",
      "Lian Li PC case", "NZXT H series case", "Corsair PC case",
      "Fractal Design case", "Montech PC case", "Phanteks case",
      "white PC case ATX", "vertical GPU case",
    ],
    exclude: /\b(laptop|phone|carrying|storage box|hard drive enclosure|test bench open frame|fan pack|dust filter only)\b/i,
  },
  monitor: {
    label: "Monitor", plural: "Monitors", article: "a monitor",
    blurb: "Panel, resolution and refresh rate, matched to the frame rate your build will actually push.",
    queries: [
      "gaming monitor", "1440p 165Hz gaming monitor", "4K 144Hz gaming monitor",
      "1080p 240Hz monitor", "OLED gaming monitor", "ultrawide gaming monitor",
      "27 inch gaming monitor IPS", "32 inch 4K monitor", "LG UltraGear monitor",
      "Samsung Odyssey monitor", "ASUS TUF gaming monitor", "AOC gaming monitor",
      "Dell gaming monitor", "curved gaming monitor 1440p",
    ],
    exclude: /\b(laptop|portable monitor|mount only|arm only|stand only|screen protector|privacy filter|TV\b|smart tv)\b/i,
  },
};

export const CAT_ORDER = ["cpu", "cooler", "mobo", "ram", "storage", "gpu", "psu", "case", "monitor"];

// ---------------------------------------------------------------------------
// BALANCED QUERIES — the free-tier catalog
// ---------------------------------------------------------------------------
// The `queries` lists above are for the paid plan, where breadth is the point.
// They are deliberately lopsided: graphics cards get forty-one searches, the
// storage list gets fourteen. On a plan with ten thousand requests a month
// that is fine. On the free plan's hundred it is not — and it produces exactly
// the imbalance you can see on the site, five hundred cards next to a handful
// of drives.
//
// So the free tier uses THIS list instead. Every category gets the same three
// searches. Not similar — the same number, every time. That makes the counts
// comparable across categories by construction rather than by luck.
//
// The three are chosen to span each market rather than to name products: one
// broad term that Amazon answers with its best sellers, plus one per major
// brand family so nothing gets shut out. Naming individual models would bias
// the catalog toward whatever we happened to think of in July 2026, which is
// the opposite of what "most popular" should mean.
//
// Nine categories x three searches x one page = 27 requests for a complete
// rebuild of the entire site. See scripts/build-catalog.mjs.
// ---------------------------------------------------------------------------
export const BALANCED_QUERIES = {
  cpu: ["desktop processor", "AMD Ryzen desktop processor", "Intel Core desktop processor"],
  cooler: ["CPU cooler", "AIO liquid CPU cooler", "air CPU cooler tower"],
  mobo: ["motherboard", "AM5 motherboard", "LGA1700 motherboard"],
  ram: ["desktop RAM memory", "DDR5 desktop memory kit", "DDR4 desktop memory kit"],
  storage: ["internal SSD", "M.2 NVMe SSD", "internal hard drive"],
  gpu: ["graphics card", "GeForce RTX graphics card", "Radeon RX graphics card"],
  psu: ["power supply PC", "80 Plus Gold modular power supply", "ATX power supply 750W"],
  case: ["PC case", "ATX mid tower case", "mini ITX PC case"],
  monitor: ["gaming monitor", "1440p gaming monitor", "4K gaming monitor"],
};

// How many products each category keeps after ranking. Equal for every
// category — that is the whole point. Three searches return roughly 48 raw
// rows, and after junk and duplicates are dropped there is enough left to
// choose a genuine top 30 rather than just keeping whatever arrived.
export const BALANCED_KEEP = 30;

// ---------------------------------------------------------------------------
// SPEC COLUMNS — the PCPartPicker-style table headers for each category
// ---------------------------------------------------------------------------
export const COLUMNS = {
  cpu: [
    { k: "socket", label: "Socket", get: (s) => s.socket },
    { k: "cores", label: "Cores", get: (s) => (s.cores ? `${s.cores}C / ${s.threads}T` : null) },
    { k: "boost", label: "Boost", get: (s) => (s.boost ? `${s.boost} GHz` : null) },
    { k: "tdp", label: "TDP", get: (s) => (s.tdp ? `${s.tdp} W` : null) },
    { k: "igpu", label: "Graphics", get: (s) => s.igpu || (s.socket ? "None" : null) },
  ],
  cooler: [
    { k: "type", label: "Type", get: (s) => s.type },
    { k: "rad", label: "Radiator", get: (s) => (s.radiator ? `${s.radiator} mm` : s.type === "Air" ? "—" : null) },
    { k: "sockets", label: "Sockets", get: (s) => (s.sockets ? s.sockets.slice(0, 3).join(", ") : null) },
    { k: "rated", label: "Handles", get: (s) => (s.rated ? `≈${s.rated} W` : null) },
  ],
  mobo: [
    { k: "chipset", label: "Chipset", get: (s) => s.chipset },
    { k: "socket", label: "Socket", get: (s) => s.socket },
    { k: "mem", label: "Memory", get: (s) => s.mem },
    { k: "form", label: "Form factor", get: (s) => s.form },
    { k: "wifi", label: "Wi-Fi", get: (s) => (s.chipset ? (s.wifi ? "Yes" : "No") : null) },
  ],
  ram: [
    { k: "gb", label: "Capacity", get: (s) => (s.gb ? `${s.gb} GB` : null) },
    { k: "mem", label: "Type", get: (s) => s.mem },
    { k: "speed", label: "Speed", get: (s) => (s.speed ? `${s.speed} MT/s` : null) },
    { k: "sticks", label: "Modules", get: (s) => (s.sticks ? `${s.sticks} ×` : null) },
  ],
  storage: [
    { k: "gb", label: "Capacity", get: (s) => (s.gb ? (s.gb >= 1000 ? `${(s.gb / 1000).toFixed(s.gb % 1000 ? 1 : 0)} TB` : `${s.gb} GB`) : null) },
    { k: "type", label: "Type", get: (s) => s.type },
    { k: "gen", label: "Interface", get: (s) => (s.gen ? `PCIe ${s.gen}.0` : null) },
  ],
  gpu: [
    { k: "chip", label: "Chipset", get: (s) => s.n },
    { k: "vram", label: "VRAM", get: (s) => (s.vram ? `${s.vram} GB` : null) },
    { k: "tdp", label: "Power", get: (s) => (s.tdp ? `${s.tdp} W` : null) },
    { k: "len", label: "Length", get: (s) => (s.len ? `${s.len} mm` : null) },
    { k: "psu", label: "PSU needed", get: (s) => (s.psu ? `${s.psu} W` : null) },
  ],
  psu: [
    { k: "watts", label: "Wattage", get: (s) => (s.watts ? `${s.watts} W` : null) },
    { k: "eff", label: "Efficiency", get: (s) => (s.efficiency ? `80+ ${s.efficiency}` : null) },
    { k: "mod", label: "Modular", get: (s) => s.modular },
    { k: "form", label: "Form", get: (s) => s.form },
  ],
  case: [
    { k: "size", label: "Size", get: (s) => s.size },
    { k: "supports", label: "Takes boards", get: (s) => (s.supports ? s.supports.join(", ") : null) },
    { k: "maxGpu", label: "GPU clearance", get: (s) => (s.maxGpu ? `${s.maxGpu} mm` : null) },
    { k: "glass", label: "Side panel", get: (s) => (s.size ? (s.glass ? "Tempered glass" : "Solid") : null) },
  ],
  monitor: [
    { k: "size", label: "Size", get: (s) => (s.size ? `${s.size}"` : null) },
    { k: "res", label: "Resolution", get: (s) => s.res },
    { k: "hz", label: "Refresh", get: (s) => (s.hz ? `${s.hz} Hz` : null) },
    { k: "panel", label: "Panel", get: (s) => s.panel },
  ],
};

// ---------------------------------------------------------------------------
// FILTERS — the sidebar, PCPartPicker style
// ---------------------------------------------------------------------------
const num = (v) => (typeof v === "number" ? v : null);

export const FACETS = {
  cpu: [
    { k: "brand", label: "Manufacturer", get: (s) => s.brand },
    { k: "socket", label: "Socket", get: (s) => s.socket },
    { k: "cores", label: "Core count", get: (s) => (s.cores ? `${s.cores} cores` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "igpu", label: "Integrated graphics", get: (s) => (s.socket ? (s.igpu ? "Yes" : "No") : null) },
    { k: "gen", label: "Series", get: (s) => s.gen },
  ],
  cooler: [
    { k: "type", label: "Type", get: (s) => s.type },
    { k: "radiator", label: "Radiator size", get: (s) => (s.radiator ? `${s.radiator} mm` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "sockets", label: "Fits socket", get: (s) => s.sockets || null, multi: true },
  ],
  mobo: [
    { k: "socket", label: "Socket", get: (s) => s.socket },
    { k: "chipset", label: "Chipset", get: (s) => s.chipset },
    { k: "mem", label: "Memory type", get: (s) => s.mem },
    { k: "form", label: "Form factor", get: (s) => s.form, sort: (a, b) => ["Mini-ITX", "Micro-ATX", "ATX", "E-ATX"].indexOf(a) - ["Mini-ITX", "Micro-ATX", "ATX", "E-ATX"].indexOf(b) },
    { k: "wifi", label: "Wi-Fi", get: (s) => (s.chipset ? (s.wifi ? "Built in" : "None") : null) },
  ],
  ram: [
    { k: "mem", label: "Type", get: (s) => s.mem },
    { k: "gb", label: "Capacity", get: (s) => (s.gb ? `${s.gb} GB` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "sticks", label: "Modules", get: (s) => (s.sticks ? `${s.sticks} sticks` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "speed", label: "Speed", get: (s) => (s.speed ? `${s.speed} MT/s` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
  ],
  storage: [
    { k: "type", label: "Type", get: (s) => s.type },
    { k: "gb", label: "Capacity", get: (s) => (s.gb ? (s.gb >= 1000 ? `${(s.gb / 1000).toFixed(s.gb % 1000 ? 1 : 0)} TB` : `${s.gb} GB`) : null), sort: (a, b) => parseFloat(a) * (a.includes("TB") ? 1000 : 1) - parseFloat(b) * (b.includes("TB") ? 1000 : 1) },
    { k: "gen", label: "Interface", get: (s) => (s.gen ? `PCIe ${s.gen}.0` : null) },
  ],
  gpu: [
    { k: "brand", label: "Chipset maker", get: (s) => s.brand },
    { k: "n", label: "Chipset", get: (s) => s.n },
    { k: "vram", label: "VRAM", get: (s) => (s.vram ? `${s.vram} GB` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "slots", label: "Slot width", get: (s) => (s.slots ? `${s.slots} slot` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
  ],
  psu: [
    { k: "watts", label: "Wattage", get: (s) => (s.watts ? `${s.watts} W` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "efficiency", label: "Efficiency", get: (s) => (s.efficiency ? `80+ ${s.efficiency}` : null) },
    { k: "modular", label: "Modular", get: (s) => (s.modular ? `${s.modular} modular` : null) },
    { k: "form", label: "Form factor", get: (s) => s.form },
  ],
  case: [
    { k: "size", label: "Size", get: (s) => s.size },
    { k: "supports", label: "Takes board", get: (s) => s.supports || null, multi: true },
    { k: "glass", label: "Side panel", get: (s) => (s.size ? (s.glass ? "Tempered glass" : "Solid") : null) },
  ],
  monitor: [
    { k: "res", label: "Resolution", get: (s) => s.res },
    { k: "hz", label: "Refresh rate", get: (s) => (s.hz ? `${s.hz} Hz` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "size", label: "Screen size", get: (s) => (s.size ? `${Math.round(s.size)}"` : null), sort: (a, b) => parseInt(a) - parseInt(b) },
    { k: "panel", label: "Panel type", get: (s) => s.panel },
  ],
};

// ---------------------------------------------------------------------------
// RELEVANCE — keep the junk out
// ---------------------------------------------------------------------------
export function isRelevant(cat, title, specs) {
  const c = CATS[cat];
  if (!c) return true;
  const t = String(title || "");
  if (!t) return false;
  if (c.exclude && c.exclude.test(t)) return false;
  // Categories that carry a `require` can't be identified from specs alone —
  // readSpecs() gives every cooler a type and every PSU a form factor, so the
  // fact test below is satisfied by a bag of screws. The listing has to name
  // what it is. A part we positively recognised outranks the keyword test:
  // knowing the model, or reading a socket off the title, is stronger evidence
  // than a word, and it's what keeps an oddly-named real cooler on the shelf.
  if (c.require && !c.require.test(t)) {
    const identified = specs && (specs.n || (Array.isArray(specs.sockets) && specs.sockets.length));
    if (!identified) return false;
  }
  if (c.needSpecs) {
    // Categories where we can positively identify the part: if we can't name
    // the chip, it isn't the thing the customer asked to see.
    if (!specs || (!specs.socket && !specs.chipset && !specs.n)) return false;
  } else {
    // Otherwise require at least one real fact so the spec columns stay full.
    if (!specs) return false;
    const facts = Object.values(specs).filter((v) => v !== null && v !== undefined && v !== false && !(Array.isArray(v) && !v.length));
    if (!facts.length) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// SAMPLE CATALOG — used when there's no API key, or the live call is down.
// Built from the real spec database so the site is fully usable offline.
// Prices are approximate street prices, clearly labelled in the UI.
// ---------------------------------------------------------------------------
const GPU_PRICE = { 5090: 1999, 5080: 999, 5070: 549, 5060: 299, 5050: 249, 4090: 1599, 4080: 999, 4070: 549, 4060: 299, 3090: 999, 3080: 599, 3070: 399, 3060: 279, 3050: 199, 2080: 399, 2070: 299, 2060: 199, 1660: 179, 1650: 149, 1080: 199, 1070: 149, 1060: 99, 1050: 89 };
const AMD_PRICE = { 9070: 599, 9060: 349, 7900: 699, 7800: 479, 7700: 419, 7600: 259, 6950: 549, 6900: 499, 6800: 399, 6750: 319, 6700: 289, 6650: 229, 6600: 189, 6500: 139, 6400: 109, 5700: 179, 580: 99 };
const VENDORS = { NVIDIA: ["ASUS TUF Gaming", "MSI Gaming X Slim", "GIGABYTE WINDFORCE OC", "ZOTAC GAMING Twin Edge", "PNY VERTO"], AMD: ["Sapphire PULSE", "XFX Speedster QICK", "PowerColor Hellhound", "ASRock Challenger", "GIGABYTE GAMING OC"], Intel: ["Intel Limited Edition", "ASRock Challenger", "Sparkle TITAN OC"] };

function priceOfGpu(k, g) {
  const num4 = parseInt((k.match(/\d{3,4}/) || [0])[0], 10);
  const base = (g.brand === "AMD" ? AMD_PRICE[num4] : GPU_PRICE[num4]) || Math.round(g.vram * 22 + g.tdp * 1.4);
  let p = base;
  if (/ XTX| TI SUPER/.test(k)) p = Math.round(p * 1.28);
  else if (/ TI| XT| SUPER/.test(k)) p = Math.round(p * 1.16);
  else if (/ GRE/.test(k)) p = Math.round(p * 1.08);
  return p;
}

function priceOfCpu(c) {
  let p = 60 + c.cores * 18 + (c.boost - 3.5) * 40;
  if (/X3D/.test(c.n)) p += 140;
  if (c.gen === "Zen 5" || c.gen === "Arrow Lake") p *= 1.25;
  else if (c.gen === "Zen 3" || /10th|11th/.test(c.gen || "")) p *= 0.6;
  return Math.round(p / 5) * 5 - 0.01 + 0.01;
}

function mk(asin, title, price, was, rating, cat) {
  return { asin, title, price: Math.round(price * 100) / 100, was: was ? Math.round(was * 100) / 100 : null, rating, sample: true, cat };
}

let SAMPLE_CACHE = null;
export function sampleCatalog() {
  if (SAMPLE_CACHE) return SAMPLE_CACHE;
  const out = { cpu: [], gpu: [], mobo: [], ram: [], storage: [], psu: [], case: [], cooler: [], monitor: [] };
  let n = 0;
  const id = () => "SAMPLE" + String(++n).padStart(4, "0");

  // Processors — boxed and tray listings
  for (const k of cpuModels) {
    const c = CPU_SPECS[k];
    const p = priceOfCpu(c);
    out.cpu.push(mk(id(), `AMD ${c.n} ${c.cores}-Core, ${c.threads}-Thread Unlocked Desktop Processor${c.cooler ? " with Wraith Cooler" : ""}`.replace(/^AMD (Core|Intel)/, "Intel $1"), p, p * 1.18, 4.7, "cpu"));
    out.cpu.push(mk(id(), `${c.brand} ${c.n} Gaming Desktop Processor — ${c.socket}, up to ${c.boost} GHz`, p * 1.05, null, 4.6, "cpu"));
  }
  // Graphics cards — several board partners each
  for (const k of gpuModels) {
    const g = GPU_SPECS[k];
    const base = priceOfGpu(k, g);
    (VENDORS[g.brand] || VENDORS.NVIDIA).forEach((v, i) => {
      const p = Math.round(base * (1 + i * 0.045));
      out.gpu.push(mk(id(), `${v} ${g.n} ${g.vram}GB GDDR Graphics Card, ${g.slots}-Slot, ${g.len}mm, PCIe 4.0`, p, i === 0 ? p * 1.15 : null, 4.5 + (i % 3) * 0.1, "gpu"));
    });
  }
  // Motherboards
  const BOARD_V = ["ASUS ROG STRIX", "ASUS TUF GAMING", "MSI MAG TOMAHAWK", "GIGABYTE AORUS ELITE", "ASRock Steel Legend"];
  for (const cs of Object.keys(CHIPSET_SPECS)) {
    const c = CHIPSET_SPECS[cs];
    BOARD_V.forEach((v, i) => {
      const form = i === 4 ? "Micro-ATX" : i === 3 ? "Mini-ITX" : "ATX";
      const mem = c.mem || (i % 2 ? "DDR5" : "DDR4");
      const price = (c.tier === "enthusiast" ? 289 : c.tier === "mainstream" ? 179 : 109) + i * 12;
      out.mobo.push(mk(id(), `${v} ${cs} ${form === "ATX" ? "ATX" : form} Gaming Motherboard (${c.socket}, ${mem}, PCIe 4.0, M.2, ${i % 2 ? "WiFi 6E, " : ""}USB 3.2)`, price, i === 0 ? price * 1.2 : null, 4.6, "mobo"));
    });
  }
  // Memory
  for (const gen of ["DDR5", "DDR4"]) {
    for (const gb of [16, 32, 64, 96]) {
      for (const sp of gen === "DDR5" ? [5600, 6000, 6400, 7200] : [3200, 3600]) {
        for (const v of ["Corsair Vengeance", "G.SKILL Trident Z5 RGB", "Kingston FURY Beast", "TEAMGROUP T-Force"]) {
          const price = Math.round((gen === "DDR5" ? gb * 3.4 : gb * 2.1) + (sp - 3000) * 0.006 * gb);
          out.ram.push(mk(id(), `${v} ${gb}GB (2 x ${gb / 2}GB) ${gen} ${sp} CL${gen === "DDR5" ? 30 : 16} Desktop Memory Kit`, price, price * 1.14, 4.8, "ram"));
        }
      }
    }
  }
  // Storage
  for (const [gb, label] of [[500, "500GB"], [1000, "1TB"], [2000, "2TB"], [4000, "4TB"], [8000, "8TB"]]) {
    for (const [v, gen] of [["Samsung 990 PRO", 4], ["WD_BLACK SN850X", 4], ["Crucial T705", 5], ["Kingston NV3", 4], ["SK hynix Platinum P41", 4]]) {
      const price = Math.round(gb * (gen === 5 ? 0.115 : 0.075));
      out.storage.push(mk(id(), `${v} ${label} PCIe Gen${gen} NVMe M.2 Internal SSD, up to ${gen === 5 ? 14900 : 7450} MB/s`, price, price * 1.2, 4.8, "storage"));
    }
    if (gb >= 2000) out.storage.push(mk(id(), `Seagate BarraCuda ${label} Internal Hard Drive HDD 3.5 Inch SATA 6Gb/s 7200 RPM`, Math.round(gb * 0.019), null, 4.5, "storage"));
    out.storage.push(mk(id(), `Crucial MX500 ${label} 3D NAND SATA 2.5 Inch Internal SSD`, Math.round(gb * 0.058), null, 4.7, "storage"));
  }
  // Power supplies
  for (const w of [550, 650, 750, 850, 1000, 1200, 1600]) {
    for (const [v, eff, mod] of [["Corsair RM" + w + "e", "Gold", "Fully Modular"], ["EVGA SuperNOVA " + w + " G7", "Gold", "Fully Modular"], ["Seasonic FOCUS GX-" + w, "Gold", "Fully Modular"], ["MSI MAG A" + w + "GL", "Gold", "Fully Modular"], ["Thermaltake Smart " + w + "W", "Bronze", "Non-Modular"]]) {
      const price = Math.round(w * (eff === "Gold" ? 0.135 : 0.09) + 25);
      out.psu.push(mk(id(), `${v} ${w}W 80+ ${eff} ${mod} ATX 3.1 Power Supply, PCIe 5.1 12V-2x6`, price, price * 1.16, 4.7, "psu"));
    }
  }
  // Cases
  for (const [v, size, gpu] of [["Lian Li LANCOOL 216", "Mid Tower", 392], ["NZXT H7 Flow", "Mid Tower", 400], ["Corsair 4000D AIRFLOW", "Mid Tower", 360], ["Fractal Design North", "Mid Tower", 355], ["Montech AIR 903 MAX", "Mid Tower", 400], ["Phanteks Eclipse G360A", "Mid Tower", 400], ["Cooler Master MasterBox TD500", "Mid Tower", 410], ["Lian Li O11 Dynamic EVO", "Full Tower", 420], ["Corsair 7000D AIRFLOW", "Full Tower", 450], ["Fractal Design Torrent", "Full Tower", 461], ["Cooler Master MasterBox Q300L", "Micro-ATX", 360], ["Thermaltake Versa H18", "Micro-ATX", 350], ["Fractal Design Terra", "Mini-ITX", 322], ["NZXT H1 V2", "Mini-ITX", 324], ["Lian Li A4-H2O", "Mini-ITX", 322]]) {
    for (const col of ["Black", "White"]) {
      const price = size === "Full Tower" ? 169 : size === "Mid Tower" ? 99 : 119;
      out.case.push(mk(id(), `${v} ${col} ${size === "Mini-ITX" ? "Mini ITX" : size === "Micro-ATX" ? "Micro ATX" : size === "Full Tower" ? "E-ATX Full Tower" : "ATX Mid Tower"} PC Case, Tempered Glass, ${gpu}mm GPU clearance`, price, price * 1.15, 4.7, "case"));
    }
  }
  // Coolers
  for (const [v, type, rad] of [["Thermalright Peerless Assassin 120 SE", "Air", 0], ["Noctua NH-D15 chromax.black", "Air", 0], ["DeepCool AK620", "Air", 0], ["be quiet! Dark Rock Pro 5", "Air", 0], ["Cooler Master Hyper 212", "Air", 0], ["Noctua NH-L9i low profile", "Air", 0], ["ARCTIC Liquid Freezer III 240", "AIO", 240], ["Corsair iCUE H150i ELITE", "AIO", 360], ["NZXT Kraken 280 RGB", "AIO", 280], ["Thermalright Frozen Notte 360", "AIO", 360], ["Lian Li GALAHAD II 240", "AIO", 240], ["DeepCool LS520 SE", "AIO", 240]]) {
    const price = type === "AIO" ? 70 + rad * 0.25 : rad === 0 && /Noctua|be quiet/.test(v) ? 109 : 39;
    out.cooler.push(mk(id(), `${v} ${type === "AIO" ? `${rad}mm AIO Liquid CPU Cooler` : "Air CPU Cooler"} for AM5 AM4 LGA1851 LGA1700 LGA1200`, Math.round(price), null, 4.8, "cooler"));
  }
  // Monitors
  for (const [v, inch, res, hz, panel] of [["LG UltraGear 27GR93U", 27, "4K", 144, "IPS"], ["Samsung Odyssey G7", 32, "4K", 165, "VA"], ["ASUS TUF Gaming VG27AQ", 27, "1440p", 170, "IPS"], ["LG UltraGear 27GP850", 27, "1440p", 180, "IPS"], ["AOC 24G2", 24, "1080p", 165, "IPS"], ["Samsung Odyssey OLED G8", 34, "Ultrawide 1440p", 175, "OLED"], ["Dell Alienware AW2725DF", 27, "1440p", 360, "OLED"], ["MSI MAG 274QRF", 27, "1440p", 180, "IPS"], ["Gigabyte M32U", 32, "4K", 144, "IPS"], ["ViewSonic XG2405", 24, "1080p", 144, "IPS"]]) {
    const price = Math.round((res === "4K" ? 420 : res.includes("Ultrawide") ? 700 : res === "1440p" ? 260 : 160) * (panel === "OLED" ? 1.9 : 1) + hz * 0.3);
    out.monitor.push(mk(id(), `${v} ${inch}" ${res === "4K" ? "4K UHD 3840x2160" : res === "1440p" ? "QHD 2560x1440" : res.includes("Ultrawide") ? "UWQHD 3440x1440" : "FHD 1920x1080"} ${hz}Hz ${panel} Gaming Monitor, 1ms, HDR, FreeSync`, price, price * 1.13, 4.6, "monitor"));
  }

  SAMPLE_CACHE = out;
  return out;
}

export { specLine };
