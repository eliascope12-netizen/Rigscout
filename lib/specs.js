// ============================================================================
// REAL PART SPECIFICATIONS
// ----------------------------------------------------------------------------
// Live Amazon listings give us a title, a price and a photo — they do not give
// us sockets, memory types or power draw. So we keep those facts here and match
// them to whatever the customer picks.
//
// This is what lets RigScout say "this build works" instead of "go check the
// socket yourself". Every entry below is a real, shipping part.
// ============================================================================

const clean = (s) => String(s || "").replace(/[™®©]/g, " ").replace(/\s+/g, " ");
const key = (s) => String(s || "").toUpperCase().replace(/\s+/g, " ").trim();

// ---------------------------------------------------------------------------
// PROCESSORS  — socket, memory support, real power draw, integrated graphics
// ---------------------------------------------------------------------------
// peak = realistic maximum package power (what a PSU actually has to cover),
// not the marketing TDP. cooler:true means a cooler comes in the box.
const CPU = {
  // ---- AMD, Socket AM5 (DDR5 only) ----
  "9950X3D": { n: "Ryzen 9 9950X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 16, threads: 32, boost: 5.7, tdp: 170, peak: 200, igpu: "Radeon Graphics", gen: "Zen 5" },
  "9950X":   { n: "Ryzen 9 9950X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 16, threads: 32, boost: 5.7, tdp: 170, peak: 200, igpu: "Radeon Graphics", gen: "Zen 5" },
  "9900X3D": { n: "Ryzen 9 9900X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 12, threads: 24, boost: 5.5, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 5" },
  "9900X":   { n: "Ryzen 9 9900X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 12, threads: 24, boost: 5.6, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 5" },
  "9850X3D": { n: "Ryzen 7 9850X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.6, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 5" },
  "9800X3D": { n: "Ryzen 7 9800X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.2, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 5" },
  "9700X":   { n: "Ryzen 7 9700X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.5, tdp: 65,  peak: 88,  igpu: "Radeon Graphics", gen: "Zen 5" },
  "9600X":   { n: "Ryzen 5 9600X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.4, tdp: 65,  peak: 88,  igpu: "Radeon Graphics", gen: "Zen 5" },
  "9600":    { n: "Ryzen 5 9600",    brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.2, tdp: 65,  peak: 88,  igpu: "Radeon Graphics", gen: "Zen 5", cooler: true },
  "8700G":   { n: "Ryzen 7 8700G",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.1, tdp: 65,  peak: 88,  igpu: "Radeon 780M", gen: "Zen 4", cooler: true },
  "8600G":   { n: "Ryzen 5 8600G",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.0, tdp: 65,  peak: 88,  igpu: "Radeon 760M", gen: "Zen 4", cooler: true },
  "8500G":   { n: "Ryzen 5 8500G",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.0, tdp: 65,  peak: 88,  igpu: "Radeon 740M", gen: "Zen 4", cooler: true },
  "8400F":   { n: "Ryzen 5 8400F",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 4.7, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 4", cooler: true },
  "7950X3D": { n: "Ryzen 9 7950X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 16, threads: 32, boost: 5.7, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7950X":   { n: "Ryzen 9 7950X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 16, threads: 32, boost: 5.7, tdp: 170, peak: 230, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7900X3D": { n: "Ryzen 9 7900X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 12, threads: 24, boost: 5.6, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7900X":   { n: "Ryzen 9 7900X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 12, threads: 24, boost: 5.6, tdp: 170, peak: 230, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7900":    { n: "Ryzen 9 7900",    brand: "AMD", socket: "AM5", mem: "DDR5", cores: 12, threads: 24, boost: 5.4, tdp: 65,  peak: 88,  igpu: "Radeon Graphics", gen: "Zen 4", cooler: true },
  "7800X3D": { n: "Ryzen 7 7800X3D", brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.0, tdp: 120, peak: 162, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7700X":   { n: "Ryzen 7 7700X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.4, tdp: 105, peak: 142, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7700":    { n: "Ryzen 7 7700",    brand: "AMD", socket: "AM5", mem: "DDR5", cores: 8,  threads: 16, boost: 5.3, tdp: 65,  peak: 88,  igpu: "Radeon Graphics", gen: "Zen 4", cooler: true },
  "7600X":   { n: "Ryzen 5 7600X",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.3, tdp: 105, peak: 142, igpu: "Radeon Graphics", gen: "Zen 4" },
  "7600":    { n: "Ryzen 5 7600",    brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.1, tdp: 65,  peak: 88,  igpu: "Radeon Graphics", gen: "Zen 4", cooler: true },
  "7500F":   { n: "Ryzen 5 7500F",   brand: "AMD", socket: "AM5", mem: "DDR5", cores: 6,  threads: 12, boost: 5.0, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 4", cooler: true },

  // ---- AMD, Socket AM4 (DDR4 only) ----
  "5950X":   { n: "Ryzen 9 5950X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 16, threads: 32, boost: 4.9, tdp: 105, peak: 142, igpu: null, gen: "Zen 3" },
  "5900X":   { n: "Ryzen 9 5900X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 12, threads: 24, boost: 4.8, tdp: 105, peak: 142, igpu: null, gen: "Zen 3" },
  "5800X3D": { n: "Ryzen 7 5800X3D", brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.5, tdp: 105, peak: 142, igpu: null, gen: "Zen 3" },
  "5800X":   { n: "Ryzen 7 5800X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.7, tdp: 105, peak: 142, igpu: null, gen: "Zen 3" },
  "5700X3D": { n: "Ryzen 7 5700X3D", brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.1, tdp: 105, peak: 142, igpu: null, gen: "Zen 3" },
  "5700X":   { n: "Ryzen 7 5700X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.6, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 3" },
  "5700G":   { n: "Ryzen 7 5700G",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.6, tdp: 65,  peak: 88,  igpu: "Radeon Vega 8", gen: "Zen 3", cooler: true },
  "5700":    { n: "Ryzen 7 5700",    brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.6, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 3", cooler: true },
  "5600X3D": { n: "Ryzen 5 5600X3D", brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 105, peak: 142, igpu: null, gen: "Zen 3" },
  "5600X":   { n: "Ryzen 5 5600X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.6, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 3", cooler: true },
  "5600G":   { n: "Ryzen 5 5600G",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 88,  igpu: "Radeon Vega 7", gen: "Zen 3", cooler: true },
  "5600":    { n: "Ryzen 5 5600",    brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 3", cooler: true },
  "5500":    { n: "Ryzen 5 5500",    brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.2, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 3", cooler: true },
  "5500GT":  { n: "Ryzen 5 5500GT",  brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 88,  igpu: "Radeon Vega 7", gen: "Zen 3", cooler: true },
  "5300G":   { n: "Ryzen 3 5300G",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 4,  threads: 8,  boost: 4.2, tdp: 65,  peak: 88,  igpu: "Radeon Vega 6", gen: "Zen 3", cooler: true },
  "4500":    { n: "Ryzen 5 4500",    brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.1, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 2", cooler: true },
  "3950X":   { n: "Ryzen 9 3950X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 16, threads: 32, boost: 4.7, tdp: 105, peak: 142, igpu: null, gen: "Zen 2" },
  "3900X":   { n: "Ryzen 9 3900X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 12, threads: 24, boost: 4.6, tdp: 105, peak: 142, igpu: null, gen: "Zen 2", cooler: true },
  "3800X":   { n: "Ryzen 7 3800X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.5, tdp: 105, peak: 142, igpu: null, gen: "Zen 2", cooler: true },
  "3700X":   { n: "Ryzen 7 3700X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.4, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 2", cooler: true },
  "3600X":   { n: "Ryzen 5 3600X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 95,  peak: 128, igpu: null, gen: "Zen 2", cooler: true },
  "3600":    { n: "Ryzen 5 3600",    brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 4.2, tdp: 65,  peak: 88,  igpu: null, gen: "Zen 2", cooler: true },
  "2700X":   { n: "Ryzen 7 2700X",   brand: "AMD", socket: "AM4", mem: "DDR4", cores: 8,  threads: 16, boost: 4.3, tdp: 105, peak: 142, igpu: null, gen: "Zen+", cooler: true },
  "2600":    { n: "Ryzen 5 2600",    brand: "AMD", socket: "AM4", mem: "DDR4", cores: 6,  threads: 12, boost: 3.9, tdp: 65,  peak: 88,  igpu: null, gen: "Zen+", cooler: true },

  // ---- Intel, Socket LGA1851 (Core Ultra 200S, DDR5 only) ----
  "285K":  { n: "Core Ultra 9 285K", brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 24, threads: 24, boost: 5.7, tdp: 125, peak: 250, igpu: "Intel Graphics", gen: "Arrow Lake" },
  "265K":  { n: "Core Ultra 7 265K", brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 20, threads: 20, boost: 5.5, tdp: 125, peak: 250, igpu: "Intel Graphics", gen: "Arrow Lake" },
  "265KF": { n: "Core Ultra 7 265KF",brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 20, threads: 20, boost: 5.5, tdp: 125, peak: 250, igpu: null, gen: "Arrow Lake" },
  "245K":  { n: "Core Ultra 5 245K", brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 14, threads: 14, boost: 5.2, tdp: 125, peak: 159, igpu: "Intel Graphics", gen: "Arrow Lake" },
  "245KF": { n: "Core Ultra 5 245KF",brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 14, threads: 14, boost: 5.2, tdp: 125, peak: 159, igpu: null, gen: "Arrow Lake" },
  "235":   { n: "Core Ultra 5 235",  brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 14, threads: 14, boost: 5.0, tdp: 65,  peak: 121, igpu: "Intel Graphics", gen: "Arrow Lake", cooler: true },
  "225":   { n: "Core Ultra 5 225",  brand: "Intel", socket: "LGA1851", mem: "DDR5", cores: 10, threads: 10, boost: 4.9, tdp: 65,  peak: 121, igpu: "Intel Graphics", gen: "Arrow Lake", cooler: true },

  // ---- Intel, Socket LGA1700 (12th–14th gen; the BOARD decides DDR4 vs DDR5) ----
  "14900KS": { n: "Core i9-14900KS", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 24, threads: 32, boost: 6.2, tdp: 150, peak: 320, igpu: "UHD 770", gen: "Raptor Lake" },
  "14900K":  { n: "Core i9-14900K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 24, threads: 32, boost: 6.0, tdp: 125, peak: 253, igpu: "UHD 770", gen: "Raptor Lake" },
  "14900KF": { n: "Core i9-14900KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 24, threads: 32, boost: 6.0, tdp: 125, peak: 253, igpu: null, gen: "Raptor Lake" },
  "14700K":  { n: "Core i7-14700K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 20, threads: 28, boost: 5.6, tdp: 125, peak: 253, igpu: "UHD 770", gen: "Raptor Lake" },
  "14700KF": { n: "Core i7-14700KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 20, threads: 28, boost: 5.6, tdp: 125, peak: 253, igpu: null, gen: "Raptor Lake" },
  "14600K":  { n: "Core i5-14600K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 14, threads: 20, boost: 5.3, tdp: 125, peak: 181, igpu: "UHD 770", gen: "Raptor Lake" },
  "14600KF": { n: "Core i5-14600KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 14, threads: 20, boost: 5.3, tdp: 125, peak: 181, igpu: null, gen: "Raptor Lake" },
  "14500":   { n: "Core i5-14500",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 14, threads: 20, boost: 5.0, tdp: 65,  peak: 154, igpu: "UHD 770", gen: "Raptor Lake", cooler: true },
  "14400":   { n: "Core i5-14400",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 10, threads: 16, boost: 4.7, tdp: 65,  peak: 148, igpu: "UHD 730", gen: "Raptor Lake", cooler: true },
  "14400F":  { n: "Core i5-14400F",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 10, threads: 16, boost: 4.7, tdp: 65,  peak: 148, igpu: null, gen: "Raptor Lake", cooler: true },
  "14100":   { n: "Core i3-14100",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 4,  threads: 8,  boost: 4.7, tdp: 60,  peak: 110, igpu: "UHD 730", gen: "Raptor Lake", cooler: true },
  "14100F":  { n: "Core i3-14100F",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 4,  threads: 8,  boost: 4.7, tdp: 58,  peak: 110, igpu: null, gen: "Raptor Lake", cooler: true },
  "13900KS": { n: "Core i9-13900KS", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 24, threads: 32, boost: 6.0, tdp: 150, peak: 320, igpu: "UHD 770", gen: "Raptor Lake" },
  "13900K":  { n: "Core i9-13900K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 24, threads: 32, boost: 5.8, tdp: 125, peak: 253, igpu: "UHD 770", gen: "Raptor Lake" },
  "13900KF": { n: "Core i9-13900KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 24, threads: 32, boost: 5.8, tdp: 125, peak: 253, igpu: null, gen: "Raptor Lake" },
  "13700K":  { n: "Core i7-13700K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 16, threads: 24, boost: 5.4, tdp: 125, peak: 253, igpu: "UHD 770", gen: "Raptor Lake" },
  "13700KF": { n: "Core i7-13700KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 16, threads: 24, boost: 5.4, tdp: 125, peak: 253, igpu: null, gen: "Raptor Lake" },
  "13600K":  { n: "Core i5-13600K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 14, threads: 20, boost: 5.1, tdp: 125, peak: 181, igpu: "UHD 770", gen: "Raptor Lake" },
  "13600KF": { n: "Core i5-13600KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 14, threads: 20, boost: 5.1, tdp: 125, peak: 181, igpu: null, gen: "Raptor Lake" },
  "13500":   { n: "Core i5-13500",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 14, threads: 20, boost: 4.8, tdp: 65,  peak: 154, igpu: "UHD 770", gen: "Raptor Lake", cooler: true },
  "13400":   { n: "Core i5-13400",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 10, threads: 16, boost: 4.6, tdp: 65,  peak: 148, igpu: "UHD 730", gen: "Raptor Lake", cooler: true },
  "13400F":  { n: "Core i5-13400F",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 10, threads: 16, boost: 4.6, tdp: 65,  peak: 148, igpu: null, gen: "Raptor Lake", cooler: true },
  "13100":   { n: "Core i3-13100",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 4,  threads: 8,  boost: 4.5, tdp: 60,  peak: 110, igpu: "UHD 730", gen: "Raptor Lake", cooler: true },
  "13100F":  { n: "Core i3-13100F",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 4,  threads: 8,  boost: 4.5, tdp: 58,  peak: 110, igpu: null, gen: "Raptor Lake", cooler: true },
  "12900K":  { n: "Core i9-12900K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 16, threads: 24, boost: 5.2, tdp: 125, peak: 241, igpu: "UHD 770", gen: "Alder Lake" },
  "12900KF": { n: "Core i9-12900KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 16, threads: 24, boost: 5.2, tdp: 125, peak: 241, igpu: null, gen: "Alder Lake" },
  "12700K":  { n: "Core i7-12700K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 12, threads: 20, boost: 5.0, tdp: 125, peak: 190, igpu: "UHD 770", gen: "Alder Lake" },
  "12700KF": { n: "Core i7-12700KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 12, threads: 20, boost: 5.0, tdp: 125, peak: 190, igpu: null, gen: "Alder Lake" },
  "12600K":  { n: "Core i5-12600K",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 10, threads: 16, boost: 4.9, tdp: 125, peak: 150, igpu: "UHD 770", gen: "Alder Lake" },
  "12600KF": { n: "Core i5-12600KF", brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 10, threads: 16, boost: 4.9, tdp: 125, peak: 150, igpu: null, gen: "Alder Lake" },
  "12400":   { n: "Core i5-12400",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 117, igpu: "UHD 730", gen: "Alder Lake", cooler: true },
  "12400F":  { n: "Core i5-12400F",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 117, igpu: null, gen: "Alder Lake", cooler: true },
  "12100":   { n: "Core i3-12100",   brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 4,  threads: 8,  boost: 4.3, tdp: 60,  peak: 89,  igpu: "UHD 730", gen: "Alder Lake", cooler: true },
  "12100F":  { n: "Core i3-12100F",  brand: "Intel", socket: "LGA1700", mem: "DDR4/DDR5", cores: 4,  threads: 8,  boost: 4.3, tdp: 58,  peak: 89,  igpu: null, gen: "Alder Lake", cooler: true },

  // ---- Intel, Socket LGA1200 (10th/11th gen, DDR4) ----
  "11900K": { n: "Core i9-11900K", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 8,  threads: 16, boost: 5.3, tdp: 125, peak: 250, igpu: "UHD 750", gen: "Rocket Lake" },
  "11700K": { n: "Core i7-11700K", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 8,  threads: 16, boost: 5.0, tdp: 125, peak: 250, igpu: "UHD 750", gen: "Rocket Lake" },
  "11600K": { n: "Core i5-11600K", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 6,  threads: 12, boost: 4.9, tdp: 125, peak: 180, igpu: "UHD 750", gen: "Rocket Lake" },
  "11400":  { n: "Core i5-11400",  brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 154, igpu: "UHD 730", gen: "Rocket Lake", cooler: true },
  "11400F": { n: "Core i5-11400F", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 6,  threads: 12, boost: 4.4, tdp: 65,  peak: 154, igpu: null, gen: "Rocket Lake", cooler: true },
  "10900K": { n: "Core i9-10900K", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 10, threads: 20, boost: 5.3, tdp: 125, peak: 250, igpu: "UHD 630", gen: "Comet Lake" },
  "10700K": { n: "Core i7-10700K", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 8,  threads: 16, boost: 5.1, tdp: 125, peak: 229, igpu: "UHD 630", gen: "Comet Lake" },
  "10600K": { n: "Core i5-10600K", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 6,  threads: 12, boost: 4.8, tdp: 125, peak: 182, igpu: "UHD 630", gen: "Comet Lake" },
  "10400":  { n: "Core i5-10400",  brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 6,  threads: 12, boost: 4.3, tdp: 65,  peak: 134, igpu: "UHD 630", gen: "Comet Lake", cooler: true },
  "10400F": { n: "Core i5-10400F", brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 6,  threads: 12, boost: 4.3, tdp: 65,  peak: 134, igpu: null, gen: "Comet Lake", cooler: true },
  "10100":  { n: "Core i3-10100",  brand: "Intel", socket: "LGA1200", mem: "DDR4", cores: 4,  threads: 8,  boost: 4.3, tdp: 65,  peak: 90,  igpu: "UHD 630", gen: "Comet Lake", cooler: true },
};

// ---------------------------------------------------------------------------
// GRAPHICS CARDS — power draw, VRAM, typical length, PSU the vendor asks for
// ---------------------------------------------------------------------------
const GPU = {
  "RTX 5090":         { n: "GeForce RTX 5090",        brand: "NVIDIA", tdp: 575, vram: 32, psu: 1000, len: 340, slots: 3 },
  "RTX 5080":         { n: "GeForce RTX 5080",        brand: "NVIDIA", tdp: 360, vram: 16, psu: 850,  len: 320, slots: 3 },
  "RTX 5070 TI":      { n: "GeForce RTX 5070 Ti",     brand: "NVIDIA", tdp: 300, vram: 16, psu: 750,  len: 305, slots: 3 },
  "RTX 5070":         { n: "GeForce RTX 5070",        brand: "NVIDIA", tdp: 250, vram: 12, psu: 650,  len: 300, slots: 2 },
  "RTX 5060 TI":      { n: "GeForce RTX 5060 Ti",     brand: "NVIDIA", tdp: 180, vram: 16, psu: 600,  len: 250, slots: 2 },
  "RTX 5060":         { n: "GeForce RTX 5060",        brand: "NVIDIA", tdp: 145, vram: 8,  psu: 550,  len: 245, slots: 2 },
  "RTX 5050":         { n: "GeForce RTX 5050",        brand: "NVIDIA", tdp: 130, vram: 8,  psu: 550,  len: 230, slots: 2 },
  "RTX 4090":         { n: "GeForce RTX 4090",        brand: "NVIDIA", tdp: 450, vram: 24, psu: 850,  len: 336, slots: 3 },
  "RTX 4080 SUPER":   { n: "GeForce RTX 4080 SUPER",  brand: "NVIDIA", tdp: 320, vram: 16, psu: 750,  len: 310, slots: 3 },
  "RTX 4080":         { n: "GeForce RTX 4080",        brand: "NVIDIA", tdp: 320, vram: 16, psu: 750,  len: 310, slots: 3 },
  "RTX 4070 TI SUPER":{ n: "GeForce RTX 4070 Ti SUPER",brand:"NVIDIA", tdp: 285, vram: 16, psu: 700,  len: 305, slots: 3 },
  "RTX 4070 TI":      { n: "GeForce RTX 4070 Ti",     brand: "NVIDIA", tdp: 285, vram: 12, psu: 700,  len: 305, slots: 3 },
  "RTX 4070 SUPER":   { n: "GeForce RTX 4070 SUPER",  brand: "NVIDIA", tdp: 220, vram: 12, psu: 650,  len: 285, slots: 2 },
  "RTX 4070":         { n: "GeForce RTX 4070",        brand: "NVIDIA", tdp: 200, vram: 12, psu: 650,  len: 285, slots: 2 },
  "RTX 4060 TI":      { n: "GeForce RTX 4060 Ti",     brand: "NVIDIA", tdp: 160, vram: 8,  psu: 550,  len: 245, slots: 2 },
  "RTX 4060":         { n: "GeForce RTX 4060",        brand: "NVIDIA", tdp: 115, vram: 8,  psu: 550,  len: 245, slots: 2 },
  "RTX 3090 TI":      { n: "GeForce RTX 3090 Ti",     brand: "NVIDIA", tdp: 450, vram: 24, psu: 850,  len: 320, slots: 3 },
  "RTX 3090":         { n: "GeForce RTX 3090",        brand: "NVIDIA", tdp: 350, vram: 24, psu: 750,  len: 313, slots: 3 },
  "RTX 3080 TI":      { n: "GeForce RTX 3080 Ti",     brand: "NVIDIA", tdp: 350, vram: 12, psu: 750,  len: 300, slots: 2 },
  "RTX 3080":         { n: "GeForce RTX 3080",        brand: "NVIDIA", tdp: 320, vram: 10, psu: 750,  len: 285, slots: 2 },
  "RTX 3070 TI":      { n: "GeForce RTX 3070 Ti",     brand: "NVIDIA", tdp: 290, vram: 8,  psu: 750,  len: 267, slots: 2 },
  "RTX 3070":         { n: "GeForce RTX 3070",        brand: "NVIDIA", tdp: 220, vram: 8,  psu: 650,  len: 242, slots: 2 },
  "RTX 3060 TI":      { n: "GeForce RTX 3060 Ti",     brand: "NVIDIA", tdp: 200, vram: 8,  psu: 600,  len: 242, slots: 2 },
  "RTX 3060":         { n: "GeForce RTX 3060",        brand: "NVIDIA", tdp: 170, vram: 12, psu: 550,  len: 242, slots: 2 },
  "RTX 3050":         { n: "GeForce RTX 3050",        brand: "NVIDIA", tdp: 130, vram: 8,  psu: 550,  len: 200, slots: 2 },
  "RTX 2080 TI":      { n: "GeForce RTX 2080 Ti",     brand: "NVIDIA", tdp: 250, vram: 11, psu: 650,  len: 267, slots: 2 },
  "RTX 2080 SUPER":   { n: "GeForce RTX 2080 SUPER",  brand: "NVIDIA", tdp: 250, vram: 8,  psu: 650,  len: 267, slots: 2 },
  "RTX 2070 SUPER":   { n: "GeForce RTX 2070 SUPER",  brand: "NVIDIA", tdp: 215, vram: 8,  psu: 650,  len: 267, slots: 2 },
  "RTX 2060 SUPER":   { n: "GeForce RTX 2060 SUPER",  brand: "NVIDIA", tdp: 175, vram: 8,  psu: 550,  len: 229, slots: 2 },
  "RTX 2060":         { n: "GeForce RTX 2060",        brand: "NVIDIA", tdp: 160, vram: 6,  psu: 500,  len: 229, slots: 2 },
  "GTX 1660 TI":      { n: "GeForce GTX 1660 Ti",     brand: "NVIDIA", tdp: 120, vram: 6,  psu: 450,  len: 229, slots: 2 },
  "GTX 1660 SUPER":   { n: "GeForce GTX 1660 SUPER",  brand: "NVIDIA", tdp: 125, vram: 6,  psu: 450,  len: 229, slots: 2 },
  "GTX 1660":         { n: "GeForce GTX 1660",        brand: "NVIDIA", tdp: 120, vram: 6,  psu: 450,  len: 229, slots: 2 },
  "GTX 1650":         { n: "GeForce GTX 1650",        brand: "NVIDIA", tdp: 75,  vram: 4,  psu: 350,  len: 180, slots: 2 },
  "GTX 1080 TI":      { n: "GeForce GTX 1080 Ti",     brand: "NVIDIA", tdp: 250, vram: 11, psu: 600,  len: 267, slots: 2 },
  "GTX 1080":         { n: "GeForce GTX 1080",        brand: "NVIDIA", tdp: 180, vram: 8,  psu: 500,  len: 267, slots: 2 },
  "GTX 1070":         { n: "GeForce GTX 1070",        brand: "NVIDIA", tdp: 150, vram: 8,  psu: 500,  len: 267, slots: 2 },
  "GTX 1060":         { n: "GeForce GTX 1060",        brand: "NVIDIA", tdp: 120, vram: 6,  psu: 400,  len: 250, slots: 2 },
  "GTX 1050 TI":      { n: "GeForce GTX 1050 Ti",     brand: "NVIDIA", tdp: 75,  vram: 4,  psu: 300,  len: 180, slots: 2 },

  "RX 9070 XT": { n: "Radeon RX 9070 XT", brand: "AMD", tdp: 304, vram: 16, psu: 750, len: 320, slots: 3 },
  "RX 9070":    { n: "Radeon RX 9070",    brand: "AMD", tdp: 220, vram: 16, psu: 650, len: 300, slots: 2 },
  "RX 9060 XT": { n: "Radeon RX 9060 XT", brand: "AMD", tdp: 160, vram: 16, psu: 550, len: 250, slots: 2 },
  "RX 7900 XTX":{ n: "Radeon RX 7900 XTX",brand: "AMD", tdp: 355, vram: 24, psu: 800, len: 320, slots: 3 },
  "RX 7900 XT": { n: "Radeon RX 7900 XT", brand: "AMD", tdp: 315, vram: 20, psu: 750, len: 320, slots: 3 },
  "RX 7900 GRE":{ n: "Radeon RX 7900 GRE",brand: "AMD", tdp: 260, vram: 16, psu: 700, len: 300, slots: 3 },
  "RX 7800 XT": { n: "Radeon RX 7800 XT", brand: "AMD", tdp: 263, vram: 16, psu: 700, len: 290, slots: 2 },
  "RX 7700 XT": { n: "Radeon RX 7700 XT", brand: "AMD", tdp: 245, vram: 12, psu: 700, len: 280, slots: 2 },
  "RX 7600 XT": { n: "Radeon RX 7600 XT", brand: "AMD", tdp: 190, vram: 16, psu: 600, len: 250, slots: 2 },
  "RX 7600":    { n: "Radeon RX 7600",    brand: "AMD", tdp: 165, vram: 8,  psu: 550, len: 240, slots: 2 },
  "RX 6950 XT": { n: "Radeon RX 6950 XT", brand: "AMD", tdp: 335, vram: 16, psu: 850, len: 320, slots: 3 },
  "RX 6900 XT": { n: "Radeon RX 6900 XT", brand: "AMD", tdp: 300, vram: 16, psu: 750, len: 320, slots: 2 },
  "RX 6800 XT": { n: "Radeon RX 6800 XT", brand: "AMD", tdp: 300, vram: 16, psu: 750, len: 300, slots: 2 },
  "RX 6800":    { n: "Radeon RX 6800",    brand: "AMD", tdp: 250, vram: 16, psu: 650, len: 300, slots: 2 },
  "RX 6750 XT": { n: "Radeon RX 6750 XT", brand: "AMD", tdp: 250, vram: 12, psu: 650, len: 280, slots: 2 },
  "RX 6700 XT": { n: "Radeon RX 6700 XT", brand: "AMD", tdp: 230, vram: 12, psu: 650, len: 270, slots: 2 },
  "RX 6650 XT": { n: "Radeon RX 6650 XT", brand: "AMD", tdp: 180, vram: 8,  psu: 550, len: 250, slots: 2 },
  "RX 6600 XT": { n: "Radeon RX 6600 XT", brand: "AMD", tdp: 160, vram: 8,  psu: 500, len: 250, slots: 2 },
  "RX 6600":    { n: "Radeon RX 6600",    brand: "AMD", tdp: 132, vram: 8,  psu: 450, len: 240, slots: 2 },
  "RX 6500 XT": { n: "Radeon RX 6500 XT", brand: "AMD", tdp: 107, vram: 4,  psu: 400, len: 200, slots: 2 },
  "RX 6400":    { n: "Radeon RX 6400",    brand: "AMD", tdp: 53,  vram: 4,  psu: 350, len: 170, slots: 1 },
  "RX 5700 XT": { n: "Radeon RX 5700 XT", brand: "AMD", tdp: 225, vram: 8,  psu: 600, len: 270, slots: 2 },
  "RX 580":     { n: "Radeon RX 580",     brand: "AMD", tdp: 185, vram: 8,  psu: 500, len: 240, slots: 2 },

  "ARC B580": { n: "Intel Arc B580", brand: "Intel", tdp: 190, vram: 12, psu: 600, len: 272, slots: 2 },
  "ARC B570": { n: "Intel Arc B570", brand: "Intel", tdp: 150, vram: 10, psu: 550, len: 272, slots: 2 },
  "ARC A770": { n: "Intel Arc A770", brand: "Intel", tdp: 225, vram: 16, psu: 650, len: 280, slots: 2 },
  "ARC A750": { n: "Intel Arc A750", brand: "Intel", tdp: 225, vram: 8,  psu: 650, len: 270, slots: 2 },
  "ARC A580": { n: "Intel Arc A580", brand: "Intel", tdp: 185, vram: 8,  psu: 600, len: 270, slots: 2 },
  "ARC A380": { n: "Intel Arc A380", brand: "Intel", tdp: 75,  vram: 6,  psu: 450, len: 200, slots: 2 },
};

// ---------------------------------------------------------------------------
// MOTHERBOARD CHIPSETS — the socket and memory generation each one carries
// ---------------------------------------------------------------------------
// mem:null on LGA1700 means the individual board decides (both DDR4 and DDR5
// boards exist), so we read it out of the listing title instead.
const CHIPSET = {
  X870E: { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "enthusiast" },
  X870:  { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "enthusiast" },
  X670E: { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "enthusiast" },
  X670:  { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "enthusiast" },
  B850:  { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "mainstream" },
  B840:  { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "budget" },
  B650E: { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "mainstream" },
  B650:  { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "mainstream" },
  A620:  { socket: "AM5", mem: "DDR5", brand: "AMD", tier: "budget" },
  X570:  { socket: "AM4", mem: "DDR4", brand: "AMD", tier: "enthusiast" },
  B550:  { socket: "AM4", mem: "DDR4", brand: "AMD", tier: "mainstream" },
  A520:  { socket: "AM4", mem: "DDR4", brand: "AMD", tier: "budget" },
  X470:  { socket: "AM4", mem: "DDR4", brand: "AMD", tier: "enthusiast" },
  B450:  { socket: "AM4", mem: "DDR4", brand: "AMD", tier: "mainstream" },
  A320:  { socket: "AM4", mem: "DDR4", brand: "AMD", tier: "budget" },
  Z890:  { socket: "LGA1851", mem: "DDR5", brand: "Intel", tier: "enthusiast" },
  B860:  { socket: "LGA1851", mem: "DDR5", brand: "Intel", tier: "mainstream" },
  H810:  { socket: "LGA1851", mem: "DDR5", brand: "Intel", tier: "budget" },
  Z790:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "enthusiast" },
  Z690:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "enthusiast" },
  B760:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "mainstream" },
  B660:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "mainstream" },
  H770:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "mainstream" },
  H670:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "mainstream" },
  H610:  { socket: "LGA1700", mem: null, brand: "Intel", tier: "budget" },
  Z590:  { socket: "LGA1200", mem: "DDR4", brand: "Intel", tier: "enthusiast" },
  Z490:  { socket: "LGA1200", mem: "DDR4", brand: "Intel", tier: "enthusiast" },
  B560:  { socket: "LGA1200", mem: "DDR4", brand: "Intel", tier: "mainstream" },
  B460:  { socket: "LGA1200", mem: "DDR4", brand: "Intel", tier: "mainstream" },
  H510:  { socket: "LGA1200", mem: "DDR4", brand: "Intel", tier: "budget" },
  H410:  { socket: "LGA1200", mem: "DDR4", brand: "Intel", tier: "budget" },
};

// Which board sizes physically drop into which case size.
export const FORM_FACTORS = ["Mini-ITX", "Micro-ATX", "ATX", "E-ATX"];
const CASE_FITS = {
  "Mini-ITX": ["Mini-ITX"],
  "Micro-ATX": ["Mini-ITX", "Micro-ATX"],
  "Mid Tower": ["Mini-ITX", "Micro-ATX", "ATX"],
  "Full Tower": ["Mini-ITX", "Micro-ATX", "ATX", "E-ATX"],
};

// ---------------------------------------------------------------------------
// CPU COOLERS — which sockets the mounting hardware in the box actually covers
// ---------------------------------------------------------------------------
// Amazon cooler listings hardly ever print the socket list in the title. Left
// to title-scraping alone, every cooler on the site came back with "sockets
// unknown", which meant the cooler↔CPU check silently never ran — the build
// page would say "this build works" while quietly skipping the one check that
// decides whether the cooler screws down at all. So the real mounting data for
// the coolers people actually buy lives here, the same as processors and cards.
//
//   h     = installed height in mm, i.e. what the side panel has to clear.
//           Null on liquid coolers, where the radiator is the constraint.
//   rated = the sustained package power it holds without pulling back clocks.
//
// LGA1851 (Arrow Lake) kept the LGA1700 mounting pattern, so anything that
// bolts to LGA1700 bolts to LGA1851 — that's why they travel together below.
const ALL = ["AM5", "AM4", "LGA1851", "LGA1700", "LGA1200", "LGA1151"];
const AMD = ["AM5", "AM4"];
const INTEL = ["LGA1851", "LGA1700", "LGA1200", "LGA1151"];

const COOLER = {
  // ---- Thermalright air ----
  "PHANTOM SPIRIT 120 SE":   { n: "Thermalright Phantom Spirit 120 SE", sockets: ALL, type: "Air", h: 154, rated: 265 },
  "PHANTOM SPIRIT 120 EVO":  { n: "Thermalright Phantom Spirit 120 EVO", sockets: ALL, type: "Air", h: 154, rated: 265 },
  "PEERLESS ASSASSIN 140":   { n: "Thermalright Peerless Assassin 140", sockets: ALL, type: "Air", h: 158, rated: 265 },
  "PEERLESS ASSASSIN 120 SE":{ n: "Thermalright Peerless Assassin 120 SE", sockets: ALL, type: "Air", h: 155, rated: 250 },
  "PEERLESS ASSASSIN 120":   { n: "Thermalright Peerless Assassin 120", sockets: ALL, type: "Air", h: 155, rated: 250 },
  "FROST COMMANDER 140":     { n: "Thermalright Frost Commander 140", sockets: ALL, type: "Air", h: 158, rated: 265 },
  "BURST ASSASSIN 120":      { n: "Thermalright Burst Assassin 120", sockets: ALL, type: "Air", h: 155, rated: 220 },
  "ASSASSIN X 120 R SE":     { n: "Thermalright Assassin X 120 R SE", sockets: ALL, type: "Air", h: 151, rated: 180 },
  "ASSASSIN X 120":          { n: "Thermalright Assassin X 120", sockets: ALL, type: "Air", h: 151, rated: 180 },
  "AXP90-X53":               { n: "Thermalright AXP90-X53", sockets: ALL, type: "Air", h: 53, rated: 110 },
  "AXP90-X47":               { n: "Thermalright AXP90-X47", sockets: ALL, type: "Air", h: 47, rated: 100 },

  // ---- Noctua air ----
  "NH-D15 G2":      { n: "Noctua NH-D15 G2", sockets: ALL, type: "Air", h: 168, rated: 280 },
  "NH-D15 CHROMAX": { n: "Noctua NH-D15 chromax.black", sockets: ALL, type: "Air", h: 165, rated: 250 },
  "NH-D15S":        { n: "Noctua NH-D15S", sockets: ALL, type: "Air", h: 160, rated: 220 },
  "NH-D15":         { n: "Noctua NH-D15", sockets: ALL, type: "Air", h: 165, rated: 250 },
  "NH-D12L":        { n: "Noctua NH-D12L", sockets: ALL, type: "Air", h: 145, rated: 180 },
  "NH-U14S":        { n: "Noctua NH-U14S", sockets: ALL, type: "Air", h: 165, rated: 200 },
  "NH-U12A":        { n: "Noctua NH-U12A", sockets: ALL, type: "Air", h: 158, rated: 220 },
  "NH-U12S REDUX":  { n: "Noctua NH-U12S redux", sockets: ALL, type: "Air", h: 158, rated: 160 },
  "NH-U12S":        { n: "Noctua NH-U12S", sockets: ALL, type: "Air", h: 158, rated: 180 },
  "NH-U9S":         { n: "Noctua NH-U9S", sockets: ALL, type: "Air", h: 125, rated: 140 },
  "NH-L12S":        { n: "Noctua NH-L12S", sockets: ALL, type: "Air", h: 70, rated: 100 },
  "NH-L9I":         { n: "Noctua NH-L9i", sockets: INTEL, type: "Air", h: 37, rated: 65 },
  "NH-L9A":         { n: "Noctua NH-L9a", sockets: AMD, type: "Air", h: 37, rated: 65 },

  // ---- be quiet! air ----
  "DARK ROCK ELITE": { n: "be quiet! Dark Rock Elite", sockets: ALL, type: "Air", h: 168, rated: 280 },
  "DARK ROCK PRO 5": { n: "be quiet! Dark Rock Pro 5", sockets: ALL, type: "Air", h: 168, rated: 270 },
  "DARK ROCK PRO 4": { n: "be quiet! Dark Rock Pro 4", sockets: ALL, type: "Air", h: 163, rated: 250 },
  "DARK ROCK 5":     { n: "be quiet! Dark Rock 5", sockets: ALL, type: "Air", h: 159, rated: 210 },
  "DARK ROCK 4":     { n: "be quiet! Dark Rock 4", sockets: ALL, type: "Air", h: 159, rated: 200 },
  "SHADOW ROCK 3":   { n: "be quiet! Shadow Rock 3", sockets: ALL, type: "Air", h: 163, rated: 190 },
  "PURE ROCK SLIM 2":{ n: "be quiet! Pure Rock Slim 2", sockets: ALL, type: "Air", h: 128, rated: 130 },
  "PURE ROCK 2":     { n: "be quiet! Pure Rock 2", sockets: ALL, type: "Air", h: 155, rated: 150 },

  // ---- DeepCool air ----
  "ASSASSIN IV": { n: "DeepCool Assassin IV", sockets: ALL, type: "Air", h: 164, rated: 280 },
  "AK620":       { n: "DeepCool AK620", sockets: ALL, type: "Air", h: 160, rated: 260 },
  "AK500":       { n: "DeepCool AK500", sockets: ALL, type: "Air", h: 158, rated: 240 },
  "AK400":       { n: "DeepCool AK400", sockets: ALL, type: "Air", h: 155, rated: 220 },
  "AG620":       { n: "DeepCool AG620", sockets: ALL, type: "Air", h: 157, rated: 260 },
  "AG400":       { n: "DeepCool AG400", sockets: ALL, type: "Air", h: 150, rated: 220 },

  // ---- Cooler Master air ----
  "MASTERAIR MA824":       { n: "Cooler Master MasterAir MA824 Stealth", sockets: ALL, type: "Air", h: 167, rated: 280 },
  "MASTERAIR MA612":       { n: "Cooler Master MasterAir MA612 Stealth", sockets: ALL, type: "Air", h: 163, rated: 250 },
  "HYPER 622 HALO":        { n: "Cooler Master Hyper 622 Halo", sockets: ALL, type: "Air", h: 154, rated: 250 },
  "HYPER 212 HALO":        { n: "Cooler Master Hyper 212 Halo", sockets: ALL, type: "Air", h: 154, rated: 150 },
  "HYPER 212 BLACK":       { n: "Cooler Master Hyper 212 Black Edition", sockets: ALL, type: "Air", h: 159, rated: 150 },
  "HYPER 212 EVO V2":      { n: "Cooler Master Hyper 212 EVO V2", sockets: ALL, type: "Air", h: 159, rated: 150 },
  "HYPER 212 SPECTRUM":    { n: "Cooler Master Hyper 212 Spectrum", sockets: ALL, type: "Air", h: 159, rated: 150 },
  "HYPER 212":             { n: "Cooler Master Hyper 212", sockets: ALL, type: "Air", h: 159, rated: 150 },

  // ---- ARCTIC / ID-COOLING / Scythe air ----
  "FREEZER 36":            { n: "ARCTIC Freezer 36", sockets: ALL, type: "Air", h: 159, rated: 200 },
  "FREEZER 34 ESPORTS DUO":{ n: "ARCTIC Freezer 34 eSports DUO", sockets: ALL, type: "Air", h: 157, rated: 200 },
  "FREEZER 34 ESPORTS":    { n: "ARCTIC Freezer 34 eSports", sockets: ALL, type: "Air", h: 157, rated: 180 },
  "FREEZER 7X":            { n: "ARCTIC Freezer 7X", sockets: ALL, type: "Air", h: 116, rated: 130 },
  "FROZN A620":            { n: "ID-COOLING FROZN A620", sockets: ALL, type: "Air", h: 154, rated: 260 },
  "FROZN A410":            { n: "ID-COOLING FROZN A410", sockets: ALL, type: "Air", h: 150, rated: 180 },
  "SE-224-XT":             { n: "ID-COOLING SE-224-XT", sockets: ALL, type: "Air", h: 154, rated: 180 },
  "SE-214":                { n: "ID-COOLING SE-214", sockets: ALL, type: "Air", h: 150, rated: 150 },
  "FUMA 3":                { n: "Scythe Fuma 3", sockets: ALL, type: "Air", h: 154, rated: 250 },
  "MUGEN 6":               { n: "Scythe Mugen 6", sockets: ALL, type: "Air", h: 154, rated: 250 },

  // ---- Stock coolers that come in a processor box ----
  "WRAITH PRISM":  { n: "AMD Wraith Prism", sockets: ["AM4"], type: "Air", h: 85, rated: 105 },
  "WRAITH SPIRE":  { n: "AMD Wraith Spire", sockets: ["AM4"], type: "Air", h: 71, rated: 95 },
  "WRAITH STEALTH":{ n: "AMD Wraith Stealth", sockets: AMD, type: "Air", h: 55, rated: 70 },
  "LAMINAR RM1":   { n: "Intel Laminar RM1", sockets: INTEL, type: "Air", h: 48, rated: 80 },

  // ---- All-in-one liquid ----
  "LIQUID FREEZER III PRO 420": { n: "ARCTIC Liquid Freezer III Pro 420", sockets: ALL, type: "Liquid", rad: 420, rated: 380 },
  "LIQUID FREEZER III PRO 360": { n: "ARCTIC Liquid Freezer III Pro 360", sockets: ALL, type: "Liquid", rad: 360, rated: 350 },
  "LIQUID FREEZER III 420":     { n: "ARCTIC Liquid Freezer III 420", sockets: ALL, type: "Liquid", rad: 420, rated: 350 },
  "LIQUID FREEZER III 360":     { n: "ARCTIC Liquid Freezer III 360", sockets: ALL, type: "Liquid", rad: 360, rated: 320 },
  "LIQUID FREEZER III 280":     { n: "ARCTIC Liquid Freezer III 280", sockets: ALL, type: "Liquid", rad: 280, rated: 300 },
  "LIQUID FREEZER III 240":     { n: "ARCTIC Liquid Freezer III 240", sockets: ALL, type: "Liquid", rad: 240, rated: 260 },
  "LIQUID FREEZER II 420":      { n: "ARCTIC Liquid Freezer II 420", sockets: ALL, type: "Liquid", rad: 420, rated: 330 },
  "LIQUID FREEZER II 360":      { n: "ARCTIC Liquid Freezer II 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "LIQUID FREEZER II 280":      { n: "ARCTIC Liquid Freezer II 280", sockets: ALL, type: "Liquid", rad: 280, rated: 280 },
  "LIQUID FREEZER II 240":      { n: "ARCTIC Liquid Freezer II 240", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "KRAKEN ELITE 360": { n: "NZXT Kraken Elite 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "KRAKEN ELITE 280": { n: "NZXT Kraken Elite 280", sockets: ALL, type: "Liquid", rad: 280, rated: 280 },
  "KRAKEN ELITE 240": { n: "NZXT Kraken Elite 240", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "KRAKEN 360":       { n: "NZXT Kraken 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "KRAKEN 280":       { n: "NZXT Kraken 280", sockets: ALL, type: "Liquid", rad: 280, rated: 280 },
  "KRAKEN 240":       { n: "NZXT Kraken 240", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "ICUE LINK TITAN 360": { n: "Corsair iCUE LINK TITAN 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "ICUE LINK TITAN 240": { n: "Corsair iCUE LINK TITAN 240", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "H170I": { n: "Corsair iCUE H170i", sockets: ALL, type: "Liquid", rad: 420, rated: 320 },
  "H150I": { n: "Corsair iCUE H150i", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "H115I": { n: "Corsair iCUE H115i", sockets: ALL, type: "Liquid", rad: 280, rated: 280 },
  "H100I": { n: "Corsair iCUE H100i", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "MASTERLIQUID 360 ATMOS": { n: "Cooler Master MasterLiquid 360 Atmos", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "MASTERLIQUID 240 ATMOS": { n: "Cooler Master MasterLiquid 240 Atmos", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "MASTERLIQUID 360L":      { n: "Cooler Master MasterLiquid 360L Core", sockets: ALL, type: "Liquid", rad: 360, rated: 280 },
  "MASTERLIQUID 240L":      { n: "Cooler Master MasterLiquid 240L Core", sockets: ALL, type: "Liquid", rad: 240, rated: 240 },
  "MASTERLIQUID ML360":     { n: "Cooler Master MasterLiquid ML360", sockets: ALL, type: "Liquid", rad: 360, rated: 280 },
  "MPG CORELIQUID 360": { n: "MSI MPG CORELIQUID 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "MAG CORELIQUID 360": { n: "MSI MAG CORELIQUID 360R", sockets: ALL, type: "Liquid", rad: 360, rated: 280 },
  "MAG CORELIQUID 240": { n: "MSI MAG CORELIQUID 240R", sockets: ALL, type: "Liquid", rad: 240, rated: 240 },
  "GALAHAD II TRINITY 360": { n: "Lian Li Galahad II Trinity 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "GALAHAD II 360":         { n: "Lian Li Galahad II 360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "GALAHAD II 240":         { n: "Lian Li Galahad II 240", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "FROZEN NOTTE 360": { n: "Thermalright Frozen Notte 360", sockets: ALL, type: "Liquid", rad: 360, rated: 290 },
  "FROZEN NOTTE 240": { n: "Thermalright Frozen Notte 240", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "FROZEN PRISM 360": { n: "Thermalright Frozen Prism 360", sockets: ALL, type: "Liquid", rad: 360, rated: 290 },
  "AQUA ELITE 360":   { n: "Thermalright Aqua Elite 360", sockets: ALL, type: "Liquid", rad: 360, rated: 280 },
  "AQUA ELITE 240":   { n: "Thermalright Aqua Elite 240", sockets: ALL, type: "Liquid", rad: 240, rated: 240 },
  "NUCLEUS AIO CR360": { n: "EK Nucleus AIO CR360", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "LT720": { n: "DeepCool LT720", sockets: ALL, type: "Liquid", rad: 360, rated: 300 },
  "LT520": { n: "DeepCool LT520", sockets: ALL, type: "Liquid", rad: 240, rated: 250 },
  "LE720": { n: "DeepCool LE720", sockets: ALL, type: "Liquid", rad: 360, rated: 280 },
  "LE520": { n: "DeepCool LE520", sockets: ALL, type: "Liquid", rad: 240, rated: 240 },
};

// ---------------------------------------------------------------------------
// MATCHERS — read a real Amazon listing title and pull the facts out of it
// ---------------------------------------------------------------------------

const CPU_KEYS = Object.keys(CPU).sort((a, b) => b.length - a.length);
const GPU_KEYS = Object.keys(GPU).sort((a, b) => b.length - a.length);

export function matchCpu(title) {
  const t = clean(title);
  // Intel Core Ultra reads as "Core Ultra 9 285K" — pull the model number out.
  const ultra = t.match(/\bUltra\s*[3579]\s*(?:Processor\s*)?(\d{3})\s*(KF|K|F|T)?/i);
  if (ultra) {
    const k = key(ultra[1] + (ultra[2] || ""));
    if (CPU[k]) return { ...CPU[k], model: k };
  }
  for (const k of CPU_KEYS) {
    if (new RegExp("(?:^|[^A-Z0-9])" + k + "(?![A-Z0-9])", "i").test(t)) return { ...CPU[k], model: k };
  }
  return null;
}

export function matchGpu(title) {
  const t = clean(title);
  let m =
    t.match(/\bRTX\s*(\d{4})\s*(Ti\s*SUPER|SUPER|Ti)?/i) ||
    t.match(/\bGTX\s*(\d{3,4})\s*(Ti\s*SUPER|SUPER|Ti)?/i);
  if (m) {
    const fam = /GTX/i.test(m[0]) ? "GTX" : "RTX";
    const k = key(`${fam} ${m[1]} ${m[2] || ""}`);
    if (GPU[k]) return { ...GPU[k], model: k };
  }
  m = t.match(/\bRX\s*(\d{3,4})\s*(XTX|XT|GRE)?/i);
  if (m) {
    const k = key(`RX ${m[1]} ${m[2] || ""}`);
    if (GPU[k]) return { ...GPU[k], model: k };
  }
  m = t.match(/\bArc\s*(?:Graphics\s*)?([AB]\d{3})\b/i);
  if (m) {
    const k = key(`ARC ${m[1]}`);
    if (GPU[k]) return { ...GPU[k], model: k };
  }
  for (const k of GPU_KEYS) {
    if (new RegExp("(?:^|[^A-Z0-9])" + k.replace(/ /g, "\\s*") + "(?![A-Z0-9])", "i").test(t)) return { ...GPU[k], model: k };
  }
  return null;
}

function formFactorOf(t) {
  if (/\bE[-\s]?ATX\b|\bExtended ATX\b/i.test(t)) return "E-ATX";
  if (/\bMini[-\s]?ITX\b|\bITX\b/i.test(t)) return "Mini-ITX";
  if (/\bMicro[-\s]?ATX\b|\bmATX\b|\bM[-\s]ATX\b|\buATX\b/i.test(t)) return "Micro-ATX";
  if (/\bATX\b/i.test(t)) return "ATX";
  return null;
}

export function matchBoard(title) {
  const t = clean(title);
  // Board listings almost never write the chipset on its own: it's "B760M-A",
  // "B650M DS3H", "Z790-P WIFI". The trailing M / I is the board size, not part
  // of the chipset name, so it has to be allowed for or every Micro-ATX and
  // Mini-ITX board on Amazon goes unrecognised — and an unrecognised board is a
  // socket check we quietly fail to run. Longer names (X670E, B650E) are listed
  // first so they win the alternation before their shorter siblings.
  const cs = t.match(
    /\b(X870E|X670E|B650E|X870|X670|B850|B840|B650|A620|X570|B550|A520|X470|B450|A320|Z890|B860|H810|Z790|Z690|B760|B660|H770|H670|H610|Z590|Z490|B560|B460|H510|H410)(?:M|I)?(?![0-9A-Z])/i
  );
  if (!cs) return null;
  const c = CHIPSET[key(cs[1])];
  if (!c) return null;
  // On LGA1700 both DDR4 and DDR5 boards exist. The listing says which — often
  // as the "D4"/"D5" suffix board makers use rather than the full word.
  let mem = c.mem;
  if (!mem) mem = /\bDDR5\b|\bD5\b/i.test(t) ? "DDR5" : /\bDDR4\b|\bD4\b/i.test(t) ? "DDR4" : null;
  const wifi = /\bWi[-\s]?Fi\b|\bWIFI\b/i.test(t);
  return { chipset: key(cs[1]), socket: c.socket, mem, brand: c.brand, tier: c.tier, form: formFactorOf(t) || "ATX", wifi };
}

export function matchRam(title) {
  const t = clean(title);
  const gen = t.match(/\bDDR\s?([345])\b/i);
  const cap = t.match(/\b(\d{1,3})\s?GB\b/i);
  const kit = t.match(/\((\d)\s?x\s?(\d{1,3})\s?GB\)/i) || t.match(/\b(\d)\s?x\s?(\d{1,3})\s?GB\b/i);
  const spd = t.match(/\b(?:DDR[45][-\s])?(\d{4,5})\s?(?:MHz|MT\/s|CL\d+)?/i);
  const speedNum = spd ? parseInt(spd[1], 10) : null;
  return {
    mem: gen ? "DDR" + gen[1] : null,
    gb: kit ? parseInt(kit[1], 10) * parseInt(kit[2], 10) : cap ? parseInt(cap[1], 10) : null,
    sticks: kit ? parseInt(kit[1], 10) : null,
    speed: speedNum && speedNum >= 1600 && speedNum <= 9000 ? speedNum : null,
  };
}

export function matchPsu(title) {
  const t = clean(title);
  const w = t.match(/\b(\d{3,4})\s?(?:W\b|Watt)/i);
  const eff = t.match(/80\+?\s*(?:PLUS\s*)?(Titanium|Platinum|Gold|Silver|Bronze|White)/i);
  const mod = /\bfully\s*modular\b|\bfull\s*modular\b/i.test(t) ? "Full" : /\bsemi[-\s]?modular\b/i.test(t) ? "Semi" : /\bnon[-\s]?modular\b/i.test(t) ? "No" : null;
  const ff = /\bSFX\b/i.test(t) ? "SFX" : "ATX";
  return { watts: w ? parseInt(w[1], 10) : null, efficiency: eff ? eff[1] : null, modular: mod, form: ff };
}

export function matchCase(title) {
  const t = clean(title);
  let size = null;
  if (/\bfull[-\s]?tower\b/i.test(t)) size = "Full Tower";
  else if (/\bmid[-\s]?tower\b/i.test(t)) size = "Mid Tower";
  else if (/\bmini[-\s]?itx\b|\bITX\b/i.test(t)) size = "Mini-ITX";
  else if (/\bmicro[-\s]?atx\b|\bmATX\b/i.test(t)) size = "Micro-ATX";
  else if (/\bE[-\s]?ATX\b/i.test(t)) size = "Full Tower";
  else if (/\bATX\b/i.test(t)) size = "Mid Tower";
  const gpuLen = t.match(/\b(\d{3})\s?mm\s?(?:GPU|graphics)/i);
  // Cooler clearance, taken from the listing when it says so. The fallbacks are
  // deliberately conservative and stop at Micro-ATX: small-form-factor cases
  // range from 70mm to 170mm, so guessing one would mean either hiding coolers
  // that fit or blessing coolers that don't. Null means we say nothing.
  const coolH = t.match(/\b(\d{2,3})\s?mm\s?(?:CPU\s?)?cooler/i);
  return {
    size,
    supports: size ? CASE_FITS[size] || null : null,
    maxGpu: gpuLen ? parseInt(gpuLen[1], 10) : size === "Full Tower" ? 400 : size === "Mid Tower" ? 360 : size === "Micro-ATX" ? 330 : size === "Mini-ITX" ? 300 : null,
    maxCooler: coolH ? parseInt(coolH[1], 10) : size === "Full Tower" ? 185 : size === "Mid Tower" ? 170 : size === "Micro-ATX" ? 160 : null,
    glass: /\btempered glass\b/i.test(t),
    fans: (t.match(/\b(\d)\s?(?:x\s?)?(?:pre[-\s]?installed\s*)?(?:ARGB|RGB)?\s?fans?\b/i) || [])[1] || null,
  };
}

// Cooler model names carry spaces and hyphens that listings write inconsistently
// ("NH-D15", "NH D15", "Hyper 212 Black Edition"), so whitespace and dashes are
// treated as interchangeable. Longest names are tested first, or "Hyper 212"
// would win before "Hyper 212 Black" and hand back the wrong height.
const COOLER_KEYS = Object.keys(COOLER).sort((a, b) => b.length - a.length);
const coolerRx = (k) =>
  new RegExp(
    "(?:^|[^A-Z0-9])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[-\s]+/g, "[\\s-]*") + "(?![A-Z0-9])",
    "i"
  );

export function matchCooler(title) {
  const t = clean(title);

  // A known cooler beats anything guessed from the title: the socket list and
  // the height are facts we hold, and they're the two things that decide
  // whether the part actually goes in.
  for (const k of COOLER_KEYS) {
    if (coolerRx(k).test(t)) {
      const c = COOLER[k];
      return {
        n: c.n, model: k, sockets: c.sockets, type: c.type,
        radiator: c.type === "Liquid" ? c.rad || null : null,
        height: c.h || null,
        rated: c.rated,
      };
    }
  }

  // Unrecognised cooler. Read what the title will give up, and leave sockets
  // null rather than guessing — an unknown mount is something we stay quiet
  // about, never something we claim.
  const sockets = [];
  for (const s of ["AM5", "AM4", "LGA1851", "LGA1700", "LGA1200", "LGA1151"]) {
    if (new RegExp("\\b" + s.replace("LGA", "LGA\\s?") + "\\b", "i").test(t)) sockets.push(s);
  }
  const liquid = /\bAIO\b|\bliquid\b|\bwater\s*cool/i.test(t);
  // Radiator size is usually written bare — "Liquid Freezer III 360", "Kraken
  // 280", "CORELIQUID 360R" — so the "mm" can't be required or the cooler comes
  // back rated for 180W when it's really a 300W radiator.
  const rad = liquid
    ? t.match(/\b(120|140|240|280|360|420)(?:\s?mm)?(?![0-9])/i)
    : t.match(/\b(120|140|240|280|360|420)\s?mm\b/i);
  const h = t.match(/\b(\d{2,3})\s?mm\s?(?:tall|height)\b/i);
  return {
    sockets: sockets.length ? sockets : null,
    type: liquid ? "Liquid" : "Air",
    radiator: liquid && rad ? parseInt(rad[1], 10) : null,
    height: !liquid && h ? parseInt(h[1], 10) : null,
    // A 240mm+ AIO or large tower cooler handles a high-power chip; small ones don't.
    rated: liquid ? (rad && +rad[1] >= 280 ? 300 : rad && +rad[1] >= 240 ? 250 : 180) : /\bdual\s*tower\b|\bD15\b|\bNH-D15\b|\bPA120\b|\bAK620\b|\bPeerless\b/i.test(t) ? 250 : /\blow[-\s]?profile\b|\bstock\b/i.test(t) ? 95 : 180,
  };
}

export function matchStorage(title) {
  const t = clean(title);
  const tb = t.match(/\b(\d(?:\.\d)?)\s?TB\b/i);
  const gb = t.match(/\b(\d{3,4})\s?GB\b/i);
  const nvme = /\bNVMe\b|\bM\.?2\b/i.test(t);
  const gen = t.match(/\bGen\s?([345])\b|\bPCIe\s?([345])\.0/i);
  return {
    gb: tb ? Math.round(parseFloat(tb[1]) * 1000) : gb ? parseInt(gb[1], 10) : null,
    type: nvme ? "M.2 NVMe" : /\bSSD\b/i.test(t) ? "2.5\" SATA SSD" : /\bHDD\b|\bhard drive\b/i.test(t) ? "Hard drive" : null,
    gen: gen ? parseInt(gen[1] || gen[2], 10) : null,
  };
}

export function matchMonitor(title) {
  const t = clean(title);
  const inch = t.match(/\b(\d{2}(?:\.\d)?)\s?(?:inch|"|-inch)\b/i);
  const hz = t.match(/\b(\d{2,3})\s?Hz\b/i);
  let res = null;
  if (/\b(?:3840\s?x\s?2160|4K|UHD)\b/i.test(t)) res = "4K";
  else if (/\b(?:3440\s?x\s?1440)\b/i.test(t)) res = "Ultrawide 1440p";
  else if (/\b(?:2560\s?x\s?1440|1440p|QHD|2K)\b/i.test(t)) res = "1440p";
  else if (/\b(?:1920\s?x\s?1080|1080p|FHD|Full HD)\b/i.test(t)) res = "1080p";
  const panel = (t.match(/\b(OLED|QD-OLED|IPS|VA|TN)\b/i) || [])[1];
  return { size: inch ? parseFloat(inch[1]) : null, hz: hz ? parseInt(hz[1], 10) : null, res, panel: panel ? panel.toUpperCase() : null };
}

// One entry point: give it a category and a listing title, get facts back.
export function readSpecs(category, title) {
  switch (category) {
    case "cpu": return matchCpu(title) || {};
    case "gpu": return matchGpu(title) || {};
    case "mobo": return matchBoard(title) || {};
    case "ram": return matchRam(title);
    case "psu": return matchPsu(title);
    case "case": return matchCase(title);
    case "cooler": return matchCooler(title);
    case "storage": return matchStorage(title);
    case "monitor": return matchMonitor(title);
    default: return {};
  }
}

// Short spec line shown under a part in the browser, e.g. "AM5· 8 cores · 120W"
export function specLine(category, s) {
  if (!s) return "";
  const bits = [];
  if (category === "cpu") {
    if (s.socket) bits.push(s.socket);
    if (s.cores) bits.push(`${s.cores} cores`);
    if (s.boost) bits.push(`${s.boost} GHz`);
    if (s.tdp) bits.push(`${s.tdp}W`);
  } else if (category === "gpu") {
    if (s.vram) bits.push(`${s.vram} GB`);
    if (s.tdp) bits.push(`${s.tdp}W`);
    if (s.psu) bits.push(`${s.psu}W PSU`);
  } else if (category === "mobo") {
    if (s.chipset) bits.push(s.chipset);
    if (s.socket) bits.push(s.socket);
    if (s.mem) bits.push(s.mem);
    if (s.form) bits.push(s.form);
  } else if (category === "ram") {
    if (s.gb) bits.push(`${s.gb} GB`);
    if (s.mem) bits.push(s.mem);
    if (s.speed) bits.push(`${s.speed} MT/s`);
  } else if (category === "psu") {
    if (s.watts) bits.push(`${s.watts}W`);
    if (s.efficiency) bits.push(`80+ ${s.efficiency}`);
    if (s.modular) bits.push(`${s.modular} modular`);
  } else if (category === "case") {
    if (s.size) bits.push(s.size);
    if (s.maxGpu) bits.push(`${s.maxGpu}mm GPU`);
    if (s.glass) bits.push("Tempered glass");
  } else if (category === "cooler") {
    bits.push(s.type === "Liquid" ? (s.radiator ? `${s.radiator}mm liquid` : "Liquid cooler") : "Air cooler");
    if (s.height) bits.push(`${s.height}mm tall`);
    if (s.rated) bits.push(`${s.rated}W`);
    if (s.sockets) bits.push(s.sockets.length >= 6 ? "Fits AMD & Intel" : s.sockets.slice(0, 3).join("/"));
  } else if (category === "storage") {
    if (s.gb) bits.push(s.gb >= 1000 ? `${(s.gb / 1000).toFixed(s.gb % 1000 ? 1 : 0)} TB` : `${s.gb} GB`);
    if (s.type) bits.push(s.type);
    if (s.gen) bits.push(`Gen ${s.gen}`);
  } else if (category === "monitor") {
    if (s.size) bits.push(`${s.size}"`);
    if (s.res) bits.push(s.res);
    if (s.hz) bits.push(`${s.hz} Hz`);
    if (s.panel) bits.push(s.panel);
  }
  return bits.join(" · ");
}

export { CPU as CPU_SPECS, GPU as GPU_SPECS, CHIPSET as CHIPSET_SPECS, COOLER as COOLER_SPECS, CASE_FITS };
