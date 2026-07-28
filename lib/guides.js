// ============================================================================
// GUIDE ARTICLES
// ----------------------------------------------------------------------------
// Original written content, stored as structured blocks rather than markdown so
// the site needs no parser dependency and every article renders through the
// same audited components.
//
// Block types the renderer understands:
//   { h }                 section heading
//   { p }                 paragraph
//   { list: [] }          bullets
//   { steps: [] }         numbered
//   { note }              aside, for a caveat worth interrupting for
//   { warn }              stronger aside, for something that costs money
//   { table: {head,rows}} comparison table
//   { shelf, text }       inline link through to a parts shelf
//
// HOUSE RULES FOR ANYTHING ADDED HERE
//   1. No invented numbers. If a figure isn't verifiable, describe the shape of
//      the answer instead of inventing a decimal place.
//   2. No manufactured urgency. No "prices won't last", no countdowns.
//   3. Every article has to be worth reading by someone who buys nothing. If it
//      only makes sense as a path to a Buy button, it doesn't belong here.
//   4. Say who should not buy. That is the part readers remember.
// ============================================================================

export const GUIDES = [
  // ==========================================================================
  {
    slug: "find-your-bottleneck",
    title: "How to find the one part actually holding your PC back",
    dek: "Most upgrade advice starts with the part you want to buy. Start with the part that's costing you frames instead — it is usually cheaper than you think, and about a third of the time it isn't a part at all.",
    tag: "Upgrading",
    minutes: 6,
    updated: "2026-07-28",
    shelves: ["gpu", "cpu", "ram"],
    blocks: [
      { p: "There is a specific kind of disappointment that comes from spending six hundred dollars on a graphics card and getting eight more frames per second. It happens constantly, and it happens because the card was never the problem. Something else in the machine was already setting the ceiling, and buying a faster card just raised a limit that wasn't being hit." },
      { p: "The useful question is never 'what should I upgrade?' It is 'what is the slowest thing in the chain right now, under the specific thing I actually do with this computer?' Those are different questions, and the second one has an answer you can find in about ten minutes without spending anything." },

      { h: "The chain, and where it breaks" },
      { p: "A game frame gets built in a rough sequence. The CPU works out what exists in the world this instant — where everything is, what the AI is doing, what physics happened. It hands that to the GPU, which does the actual drawing. Both of them need to pull textures and level data off storage, and both need working room in memory. The frame arrives on your monitor at whatever rate the slowest link in that chain allows." },
      { p: "This is why the fix depends entirely on what you run. A competitive shooter at 1080p on low settings asks very little of the GPU and hammers the CPU, because the drawing is simple but the world state updates hundreds of times a second. The same machine running a modern single-player game at 1440p with everything turned up flips it completely: the CPU is coasting and the GPU is pinned. Same computer, opposite bottleneck, opposite correct upgrade." },
      { note: "This is the single most common reason upgrade advice from a forum doesn't work for you. The person answering was picturing their workload, not yours." },

      { h: "The ten-minute diagnosis" },
      { p: "You do not need a benchmarking suite. You need to watch two numbers while doing the thing that feels slow." },
      { steps: [
        "Open Task Manager (Ctrl+Shift+Esc), go to Performance, and leave it on a second monitor — or just alt-tab to it after a minute of play.",
        "Turn on your GPU driver's overlay instead if you have one. NVIDIA and AMD both ship a performance overlay that shows GPU utilisation, and it is more accurate than Task Manager for this.",
        "Run the game or application that feels slow, at the settings you actually use, for a couple of minutes. Not a menu screen — the busiest thing you do.",
        "Read GPU utilisation. That single number does most of the work.",
      ] },
      { p: "If GPU utilisation sits at 95–100% during play, the graphics card is the limit. It is working flat out and everything else is waiting on it. A faster card will help, and almost nothing else will." },
      { p: "If GPU utilisation sits meaningfully below that — say bouncing around 60–80% while your frame rate is lower than you want — the card is idling because something upstream can't feed it. That is a CPU limit, or occasionally a memory or storage one. Buying a faster card here is the six-hundred-dollar mistake at the top of this page." },
      { p: "Then check memory. In Task Manager, if committed memory is at or near your installed total during play, you are swapping to disk and the stutter you feel is that, not your GPU. This is the cheapest problem on this list to have." },

      { h: "The answer that isn't a part" },
      { p: "Before buying anything, rule out the free fixes, because a genuine share of 'my PC got slow' has no hardware cause at all." },
      { list: [
        "Thermal throttling. If the machine is fast for two minutes and then isn't, it is overheating and reducing its own clock speed to survive. Dust in the heatsink and old thermal paste both do this, and both cost nothing or nearly nothing to fix. A part swap will not fix it — the new part will throttle too.",
        "A drive with no room left. SSDs slow down markedly when close to full, and Windows needs scratch space. Getting back to roughly 15–20% free is a real performance fix.",
        "Memory running at its default speed. A DDR4 or DDR5 kit rated well above the board's fallback speed will run at the slow fallback until you enable its profile — XMP on Intel, EXPO on AMD — in the BIOS. People run for years on memory they paid extra for and never switched on.",
        "Background software. Not the usual advice about startup programs, but specifically: overlays, RGB control suites, and launcher clients each taking a slice while you play.",
      ] },
      { warn: "Check thermals before you buy anything. A throttling machine mimics almost every hardware bottleneck on this page, and it is the one case where an upgrade genuinely changes nothing." },

      { h: "What each bottleneck actually feels like" },
      { table: {
        head: ["Symptom", "Usually means", "Where to look"],
        rows: [
          ["Frame rate low but steady, GPU at 99%", "GPU limited", "A faster graphics card"],
          ["Frame rate low, GPU well under 90%", "CPU limited", "Processor, or the memory feeding it"],
          ["Smooth, then sharp stutters, then smooth", "Running out of memory, or storage", "More RAM, or an SSD"],
          ["Fast at first, degrades after minutes", "Thermal throttling", "Cleaning and paste — not a new part"],
          ["Long loading screens, gameplay fine", "Storage", "An NVMe drive"],
          ["Frame rate fine, feels stuttery anyway", "Display or frame pacing", "Check refresh rate and VRR are on"],
        ],
      } },

      { h: "Why the cheap answer is so often the right one" },
      { p: "When people find out their machine is CPU limited, the instinct is to plan a full platform change — new processor, new motherboard, new memory, because a modern CPU rarely drops into an older board. That is a genuinely expensive project and it is sometimes correct." },
      { p: "It is also frequently unnecessary. A drop-in processor upgrade on the socket you already own — a better chip on the same motherboard, no other changes — covers a lot of ground for a fraction of the money. AM4 in particular had an unusually long life, so a large number of machines can take a substantially faster chip without touching anything else. Checking whether that path exists for your board takes seconds and it is the first thing our Upgrade Finder looks for, precisely because it is the answer people most often don't know they have." },
      { p: "The same logic applies to memory. If you are stuttering because 16 GB isn't enough for what you now run, adding memory is dramatically cheaper than a new platform — with the important caveat, in 2026, that memory is no longer the cheap upgrade it was for a decade. More on why in the pricing guide." },

      { h: "A note on 'bottleneck calculators'" },
      { p: "Sites that ask for your CPU and GPU and return a percentage are entertainment. They cannot know your resolution, your settings, your frame rate target, or which of the hundreds of things a game does your particular game leans on. A pairing that is badly mismatched at 1080p can be perfectly balanced at 4K, because moving to 4K shifts work onto the GPU and leaves the CPU with the same job it had before." },
      { p: "Two minutes watching real utilisation on your own machine, doing your own workload, beats any calculator, and it costs nothing." },

      { h: "The short version" },
      { list: [
        "Watch GPU utilisation during the thing that feels slow. High means buy a GPU; low means look at the CPU.",
        "Rule out heat, a full drive, and memory running at default speed first. All three are free and all three mimic hardware problems.",
        "Check whether your existing socket takes a faster processor before pricing a whole new platform.",
        "Match the upgrade to what you actually run, not to what a general recommendation assumes you run.",
      ] },
      { shelf: "gpu", text: "If the diagnosis came back GPU limited, the graphics card shelf lists length, power draw and the PSU each card needs — the three things that decide whether a card is actually an option for your case." },
    ],
  },

  // ==========================================================================
  {
    slug: "how-much-power-supply",
    title: "How much power supply do you actually need?",
    dek: "Wattage calculators tell you to buy more than you need, and the internet tells you to buy more than that. Here's the arithmetic, the one place headroom genuinely matters, and why the efficiency badge is worth more than the number on the box.",
    tag: "Components",
    minutes: 5,
    updated: "2026-07-28",
    shelves: ["psu", "gpu"],
    blocks: [
      { p: "The power supply is the one component where being wrong is not just disappointing. A cheap unit failing under load can take other parts with it, and a unit that is genuinely undersized will shut the machine off mid-game with no warning. That is the reason for all the caution you read online." },
      { p: "It is also the reason a lot of people spend two hundred dollars solving a ninety-dollar problem. Here is how to size one honestly." },

      { h: "The arithmetic" },
      { p: "Almost all of your power draw is two components. The graphics card and the processor account for the overwhelming majority of what a gaming PC pulls; everything else — drives, fans, memory, the board itself — is a rounding error by comparison, realistically somewhere in the region of 50 to 80 watts all together." },
      { steps: [
        "Look up your graphics card's rated board power. Manufacturers publish it, and our graphics card shelf lists it per card.",
        "Look up your processor's maximum turbo power — not its base TDP, which is a much smaller number that describes sustained load, not peaks.",
        "Add those two together. Add roughly 75 watts for the rest of the machine.",
        "That total is your realistic peak draw. Now add headroom.",
      ] },
      { p: "For headroom, adding something in the region of 30% above that peak is the sane default. It is not superstition — there are two real reasons for it, and understanding them tells you when you can ignore the advice." },

      { h: "Why headroom exists (the real reasons)" },
      { p: "The first is transient spikes. Modern graphics cards do not draw a smooth, steady amount of power. They draw in bursts, and for very short intervals — we are talking fractions of a millisecond — a card can pull substantially above its rated board power. A power supply sized exactly to the rated figure can see one of those spikes, read it as a fault, and trip its own protection. The machine shuts off instantly. Nothing is broken, and nothing you do in software will ever diagnose it." },
      { p: "The second is efficiency. A power supply is most efficient somewhere around half its rated load, and runs hotter and louder near the top of its range. A unit permanently pinned at 95% capacity is a unit whose fan is always working and whose components are always hot, and heat is what kills them." },
      { note: "Headroom is about spikes and longevity, not about the average number being wrong. This is why you cannot just measure your wall draw with a meter and buy that." },

      { h: "The efficiency badge matters more than most people think" },
      { p: "80 Plus certification — White, Bronze, Silver, Gold, Platinum, Titanium — tells you what fraction of the power drawn from the wall actually reaches your components. The rest becomes heat inside the case." },
      { p: "The part worth understanding: the badge is a rough proxy for build quality, not just an electricity bill calculation. Manufacturers do not generally put good capacitors and proper protection circuitry into a unit and then skip certification, and they rarely achieve the higher tiers with bad components. For most people the difference between Bronze and Gold on the power bill is small. The difference in what is inside the box is not." },
      { p: "This is why the honest recommendation is usually Gold at a sensible wattage rather than Bronze at a higher one. A 650 W Gold unit from a reputable maker is a better purchase than an 850 W unit from a brand you have never heard of, at the same price, essentially every time." },
      { warn: "Wattage on the box is a claim, not a measurement. An unbranded 800 W unit and a certified 650 W unit are not comparable products, and the failure mode of the first one is not 'it runs slowly'." },

      { h: "Modular, semi-modular, and whether you care" },
      { table: {
        head: ["Type", "What it means", "Worth paying for when"],
        rows: [
          ["Non-modular", "Every cable permanently attached", "Budget is tight and the case has room to hide the spares"],
          ["Semi-modular", "Essential cables fixed, extras detachable", "Almost always the sensible middle"],
          ["Fully modular", "Every cable detachable", "Small cases, glass side panels, or you plan to build again"],
        ],
      } },
      { p: "Modularity affects tidiness and airflow, not performance or safety. In a small case it stops being cosmetic — there is genuinely nowhere to put four unused cables in a compact build, and stuffing them somewhere restricts the airflow the rest of the machine depends on." },

      { h: "The connector question, if you have a recent NVIDIA card" },
      { p: "Recent high-end graphics cards use a 12-pin connector rather than the older 8-pin PCIe plugs — the standard revised it after early problems, and current units use the 12V-2x6 form. Two things matter here." },
      { list: [
        "A supply that predates this can still run the card using an adapter, usually included in the card's box. It works. It is also another connection to seat properly.",
        "Whichever connector you use, push it in until it clicks and check it. The documented failure mode on these connectors is a partially seated plug concentrating current through fewer pins than intended, and it is a genuine hazard rather than an internet rumour. It is also completely avoidable in five seconds.",
      ] },

      { h: "So what do you buy?" },
      { p: "Do the arithmetic above, add roughly a third, and round up to the nearest common size. Common sizes exist because they cover the realistic range of builds, and the gaps between them are small enough that rounding up costs little." },
      { p: "The one time to buy meaningfully bigger than the arithmetic says is if you intend to put a much larger graphics card in this machine later. A power supply is the component most likely to outlive the build around it — it has no performance to become outdated — so buying one size up for a planned future card is one of the few genuinely sound cases for spending ahead. Buying two sizes up because a forum said so is not." },
      { p: "And the case for spending less: if you are running a modest card and a mid-range processor, you do not need a kilowatt. That configuration is comfortably inside what a good mid-sized unit delivers, and the extra capacity does nothing but sit there." },
      { shelf: "psu", text: "Our power supply shelf shows wattage, 80 Plus tier and modularity as filterable columns, so you can narrow to the handful that fit your arithmetic instead of reading thirty product pages." },
    ],
  },

  // ==========================================================================
  {
    slug: "will-this-gpu-fit",
    title: "Will that graphics card actually fit?",
    dek: "Three measurements decide it, and only one of them is the number in the product title. The check takes two minutes and it is the most common reason a part goes back.",
    tag: "Compatibility",
    minutes: 5,
    updated: "2026-07-28",
    shelves: ["gpu", "case"],
    blocks: [
      { p: "Graphics cards have grown. A card that would have looked absurd a few years ago is now unremarkable, and cases have not grown at the same rate. The result is a steady stream of people discovering, with the side panel off and the old card already removed, that the new one is about fifteen millimetres too long." },
      { p: "Three measurements decide whether a card fits. Check all three." },

      { h: "1. Length" },
      { p: "This is the obvious one and the one people do check. Your case has a published maximum GPU clearance; the card has a published length. The card must be shorter. Simple — with two complications that catch people out." },
      { list: [
        "Front-mounted radiators and fans eat into that clearance. Case manufacturers usually publish the figure with nothing mounted at the front, and sometimes publish a second, shorter figure for when a radiator is installed. If you have an AIO at the front, the second number is the one that applies to you.",
        "Cable routing needs room too. A card that clears by five millimetres technically fits, but the power cable has to come out of the end of it and bend. Some connectors need a couple of centimetres before the cable can turn. Treat a very tight fit as a no.",
      ] },

      { h: "2. Slot thickness" },
      { p: "Cards are described as dual-slot, 2.5-slot, triple-slot and so on, meaning how many expansion slot positions the cooler physically occupies. This matters in two ways that are easy to miss." },
      { p: "The first is simply whether your case has that many slot openings below the top one. Small cases often do not. The second is what else you intend to install — a capture card, a sound card, an expansion card of any kind — because a triple-slot cooler physically covers the slots underneath it whether or not you were planning to use them." },
      { note: "A '2.5-slot' card is a real thing and it is worse than it sounds: it occupies two slots and blocks most of the third, so plan as though it were a triple." },

      { h: "3. Height, which nobody checks" },
      { p: "This is the one that gets people, because it is rarely printed on the box and almost never in the product title. It is the measurement from the motherboard surface out to the top edge of the card — the direction the power connectors point." },
      { p: "In a normal mid-tower it is irrelevant. In a compact case, a slim case, or anything where the side panel sits close to the board, it decides whether the panel closes. And the connectors add to it: a card that fits with a millimetre to spare does not fit once a cable is plugged into the top of it. Cases that are tight on this dimension often publish a figure for it; if yours does, respect it, and if yours does not and the case is small, measure before ordering." },

      { h: "The other three things worth checking while you're at it" },
      { table: {
        head: ["Check", "What goes wrong", "Where to find it"],
        rows: [
          ["Power connectors", "Card needs plugs your supply doesn't have", "Card spec sheet vs. your PSU's cable list"],
          ["PSU capacity", "Machine shuts off under load", "See the power supply guide"],
          ["Case airflow", "Card fits but runs hot and loud", "Number and position of case fans"],
          ["Monitor outputs", "Card has no port your screen uses", "Card's output list vs. your monitor's inputs"],
        ],
      } },
      { p: "That last one is quietly common. Displays with older inputs and cards with only current outputs is a combination that produces a working purchase and a black screen, solvable with an adapter but irritating to discover on the day." },

      { h: "What about the PCIe generation?" },
      { p: "This worries people more than it should. A newer card in an older PCIe slot works. The interface is backwards compatible in both directions, and it negotiates down to whatever both ends support." },
      { p: "The real-world cost of running a card in an older slot is small in most cases and largest for cards with less onboard memory, because those lean on the connection to the rest of the system more often. It is a consideration, not a blocker, and it should never be the reason you replace a motherboard." },
      { warn: "The exception worth knowing: some compact cards use a physically narrower connection than a full-size card. On an older slot, a narrower connection and an older generation compound, and there the loss can be genuinely noticeable. Check the card's lane count if you are pairing a budget card with an older board." },

      { h: "Measuring your own case, if you can't find the numbers" },
      { p: "If your case is old, unbranded, or came as part of a prebuilt, the published figures may not exist. Measure it yourself." },
      { steps: [
        "Open the side panel. Find the rear bracket where the card screws in.",
        "Measure from the inside face of that rear bracket forward, to whatever you hit first — the drive cage, the front fans, or the front panel itself. That distance is your maximum card length.",
        "Subtract about 15 mm for the power cable to exit and bend. What's left is the length you should shop against.",
        "Count the slot openings at the back below the top one. That's your slot budget.",
      ] },
      { p: "Two minutes with a tape measure removes the entire category of problem, and it is the single highest-value thing you can do before ordering a card." },
      { shelf: "gpu", text: "Every card on our graphics card shelf lists its length and the power supply it needs alongside the price, so you can filter to what fits before you get attached to something that doesn't." },
    ],
  },
  // ==========================================================================
  {
    slug: "memory-prices-2026",
    title: "Why RAM and SSDs cost what they do right now",
    dek: "Memory stopped being the cheap upgrade. This is what actually happened to the market, what it means for a build you're planning this year, and the two situations where buying anyway is still the right call.",
    tag: "Buying",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["ram", "storage"],
    blocks: [
      { p: "For most of the last decade, memory was the boring part of a build. You picked a capacity, paid a price that only ever drifted downwards, and moved on to the interesting components. Anyone returning to PC building in 2026 after a few years away gets a genuine shock at the RAM and SSD shelves, and the first assumption is usually that the listing is wrong." },
      { p: "It isn't. The prices are real, and the reason is worth understanding, because it changes what the sensible move is." },

      { h: "What actually happened" },
      { p: "Memory manufacturing is a small number of very large factories making a product that is close to a commodity. That structure produces violent cycles: when everyone builds capacity at once, prices collapse; when demand jumps faster than new lines can come online, prices spike, because you cannot conjure a fabrication plant in a quarter." },
      { p: "The current spike is a demand shock. AI datacentre buildout consumes enormous quantities of memory, and the memory that goes into servers is more profitable per wafer than the memory that goes into a desktop kit. Manufacturers responded the way any business would — by shifting capacity towards the higher-margin server products. Consumer DRAM and consumer NAND are competing for what's left." },
      { p: "The scale of it has been unusual even by this market's standards. Through the second quarter of 2026, industry reporting described roughly sixty percent jumps in memory pricing, with further increases projected through the third quarter — in the region of 13 to 18 percent quarter-on-quarter for DRAM and 10 to 15 percent for NAND." },
      { note: "Those are industry contract figures, not the retail price of a specific kit. Retail moves later, moves less smoothly, and varies enormously between products. Treat them as the direction and the rough force, not as a prediction for the part you want." },

      { h: "The part that gets misread" },
      { p: "Reporting in mid-2026 described the surge as beginning to cool, and that got widely repeated as 'prices are coming down.' Read the reason and it says something different: the cooling is attributed to consumers hitting an affordability limit — people simply stopping buying — rather than to supply catching up." },
      { p: "That distinction matters a great deal if you are trying to time a purchase. Demand destruction slows the rate of increase. Genuine new supply is what brings prices back down, and new fabrication capacity is a multi-year project, not a multi-month one. A market that is rising more slowly is still rising." },
      { warn: "Nobody can tell you where memory prices go next, and anyone who says otherwise with confidence is guessing. What can be said is that the mechanism behind this spike is not the kind that unwinds in a few weeks." },

      { h: "What to do about it" },
      { p: "The honest answer splits three ways depending on why you're buying." },
      { table: {
        head: ["Your situation", "Reasonable move"],
        rows: [
          ["Machine works, you just want more", "Wait. This is discretionary and the price is bad."],
          ["Actively stuttering, out of memory", "Buy. Being short of RAM is a daily tax; the price is annoying, the stutter is worse."],
          ["Building a new machine now", "Buy what you need, skip what you don't. Don't over-provision at these prices."],
          ["Storage full, no working room", "Buy the smaller drive you need, not the aspirational one."],
        ],
      } },
      { p: "The thing to resist is the habit formed during the cheap years: buying double what you need because the step up cost almost nothing. That reasoning was correct for a decade and is not correct now. The gap between capacities is real money again, and a kit you bought for a workload you might have in three years is money spent at a market peak on a component whose price may well be lower when that workload actually arrives." },

      { h: "How much do you actually need?" },
      { p: "For a machine that games and does normal desktop work, 16 GB remains a functional amount and 32 GB is comfortable. The jump from 16 to 32 is the one that most often produces a felt difference, because it is the one that stops the swapping-to-disk stutter described in our bottleneck guide. Beyond 32 GB, the benefit is workload-specific — large video projects, virtual machines, very heavy multitasking — and if you don't already know you need it, you almost certainly don't." },
      { p: "Storage is similar. The performance difference between a good drive and a great one is far smaller in everyday use than the marketing suggests, and running out of space is a genuine performance problem, so capacity beats headline speed for most people. Our SSD guide covers why the big sequential numbers on the box don't translate the way you'd expect." },

      { h: "Two things worth checking before you spend anything" },
      { list: [
        "Is your existing memory running at its rated speed? A kit sold at a high rating runs at the board's slow default until XMP or EXPO is switched on in the BIOS. This is free, takes two minutes, and a surprising number of machines have never had it enabled.",
        "Do you have free slots? Adding a second kit alongside an existing one is cheaper than replacing, though mixing kits is less reliable than buying matched — if the machine won't post afterwards, that's usually why.",
      ] },
      { shelf: "ram", text: "The memory shelf shows capacity, speed and generation together, so you can compare price per gigabyte across kits rather than eyeballing it — which is the only comparison that really matters in a market like this one." },
    ],
  },

  // ==========================================================================
  {
    slug: "air-vs-aio",
    title: "Air cooler or liquid cooler?",
    dek: "The comparison is not really about temperature. It's about noise, height, weight, failure modes and how long you plan to keep the machine — and for most builds the unglamorous answer wins.",
    tag: "Components",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["cooler", "case", "cpu"],
    blocks: [
      { p: "Cooler threads get heated because people argue about the wrong axis. The question is rarely 'which one cools better' — a large air cooler and a mid-sized all-in-one liquid cooler land close enough that the difference doesn't change what settings you can run. The question is which set of tradeoffs you'd rather live with." },

      { h: "What each one actually is" },
      { p: "An air cooler is a block of metal fins sitting on your processor with a fan pushing air through it. Heat moves from the chip into the fins through heat pipes, and the fan carries it away. There are no moving parts other than the fan and nothing to leak." },
      { p: "An all-in-one liquid cooler — an AIO — puts a pump and a cold plate on the processor, runs coolant through tubes to a radiator bolted to one of your case's fan mounts, and blows air through that instead. It is a sealed loop that arrives pre-filled. The advantage is that it moves the heat somewhere with more room for a large radiator, and it moves the bulk off the motherboard." },

      { h: "The comparison that matters" },
      { table: {
        head: ["", "Air", "AIO"],
        rows: [
          ["Parts that can fail", "One fan", "Pump plus fans"],
          ["What failure looks like", "Gradual, noisy, obvious", "Sudden — a dead pump means temperature spikes fast"],
          ["Blocks memory slots", "Often, on tall models", "No"],
          ["Weight hanging off the board", "Significant on large models", "Radiator carried by the case"],
          ["Needs case clearance for", "Height", "Radiator length and thickness"],
          ["Noise at the same temperature", "Fan only", "Fans plus pump whine on some units"],
          ["Typical lifespan concern", "Fan bearings", "Pump, and coolant permeating out over years"],
        ],
      } },

      { h: "Pick air if" },
      { list: [
        "You want the machine to still be working in six years without thinking about it. Fewer moving parts, and the failure mode is a fan you can replace for pocket money.",
        "Your case is a normal mid-tower with no confirmed radiator space, or you don't want to check.",
        "You're on a budget. Air coolers reach 'more than good enough' at a much lower price, and the money is better spent on the parts that produce frames.",
        "Quiet matters more than peak numbers. A big air cooler at low fan speed is about as quiet as a PC gets.",
      ] },

      { h: "Pick an AIO if" },
      { list: [
        "Your processor is one of the genuinely hot ones and you intend to run it hard for hours — sustained all-core work, not gaming.",
        "A tall air cooler physically will not fit, either against the side panel or over your memory.",
        "Your case has clear top or front radiator mounting and you want the heat dumped straight out rather than circulated inside.",
        "You are moving the machine often and would rather not have a heavy block of metal levering on the motherboard.",
      ] },
      { note: "The memory clearance problem is the most common one people meet in person. Tall heat spreaders on RAM and a large air cooler frequently fight over the same space. Check your cooler's clearance figure against your memory's height before ordering, or buy low-profile memory." },

      { h: "Where the radiator goes, and why it matters" },
      { p: "An AIO's radiator can normally mount at the front of the case or at the top. Front mounting pulls cool room air across the radiator, which is best for the processor but means the air reaching your graphics card has already been warmed. Top mounting exhausts heat straight out and leaves the rest of the machine cooler, at a small cost to the processor's own temperature." },
      { p: "There is one rule that isn't about preference: the pump should never be the highest point in the loop. Air inevitably collects at the top of a sealed loop over time, and if that top is the pump, it runs dry, gets loud, and wears out early. Mounting a radiator at the front with its tubes at the bottom, or at the top, both avoid this. A radiator at the front with tubes at the top is the arrangement to avoid." },

      { h: "The part nobody mentions" },
      { p: "Stock coolers. If your processor came with one, it is genuinely adequate for the chip it shipped with under normal load — that's what it was designed for. The upgrade case for a better cooler is usually about noise rather than about the machine being unable to cope. If your PC is loud and hot, replacing the cooler is a real fix. If it's quiet and stable, a new cooler buys you a number in a monitoring app." },
      { warn: "If you are replacing a cooler on a machine that has been running for years, the thermal paste underneath is likely dried out. Clean both surfaces properly and apply fresh paste. Skipping that step can leave you worse off than before you started, and it's the most common reason a cooler upgrade disappoints." },

      { h: "Who should not buy either" },
      { p: "If your temperatures are high and the machine is a few years old and dusty, clean it and repaste it first. That costs a few dollars and fixes a real proportion of overheating complaints outright. Buying a cooler to solve a dust problem means installing an expensive part into the same choked airflow." },
      { shelf: "cooler", text: "The cooler shelf lists height for air models and radiator size for liquid ones, which are the two figures that decide whether something fits before it decides how well it works." },
    ],
  },

  // ==========================================================================
  {
    slug: "ssd-speed",
    title: "SATA, NVMe, and why the big speed number lies",
    dek: "The gap between a good SSD and a great one is enormous on the box and almost invisible in use. Here's what the numbers measure, what actually makes a drive feel fast, and where spending more is genuinely worth it.",
    tag: "Components",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["storage", "mobo"],
    blocks: [
      { p: "Drive listings lead with a sequential read figure, and those figures have grown to the point of absurdity — numbers that would have described a high-end RAID array a decade ago now sit on a stick of plastic the size of a stick of gum. The natural assumption is that a drive with double the number will feel twice as fast." },
      { p: "It won't, and understanding why saves real money." },

      { h: "The three tiers, honestly" },
      { table: {
        head: ["Type", "Connection", "What it feels like"],
        rows: [
          ["Hard drive", "SATA", "Slow. Audibly mechanical. Fine for bulk storage, painful as a system drive."],
          ["SATA SSD", "SATA", "Transformative over a hard drive. The single biggest felt upgrade in computing."],
          ["NVMe SSD", "PCIe / M.2", "Faster than SATA on paper by a huge margin; noticeably faster only in specific tasks."],
        ],
      } },
      { p: "The jump from a hard drive to any SSD is the one that changes how the machine feels to use. Boot, application launch, file browsing, everything. If you are still running a system on spinning storage, that upgrade is the best value in this entire site and nothing else comes close." },
      { p: "The jump from a SATA SSD to an NVMe drive is much smaller in everyday use than the specification gap implies, because everyday use isn't sequential." },

      { h: "Why sequential speed is the wrong number" },
      { p: "Sequential read means reading one enormous continuous file. That happens when you copy a video file or load one very large asset. It is not what your computer spends its time doing." },
      { p: "Opening an application or loading a game means fetching thousands of small scattered pieces. That workload is measured by random performance and by how many operations the drive can juggle at once, and the difference between drives on those measures is far narrower than the headline gap. This is the reason two drives with wildly different advertised speeds can load the same game within a second of each other." },
      { note: "Games are the clearest example. Loading times improved dramatically moving from hard drive to SSD, and then largely stopped improving, because the bottleneck moved to decompression and to the game engine itself rather than the storage." },

      { h: "The specification that actually predicts disappointment" },
      { p: "Cheaper drives use a fast cache to absorb writes and then fall back to a much slower mode once that cache is exhausted. For normal use you never notice. For a large sustained write — moving a huge folder, editing video, installing a very large game — the drive can drop to a fraction of its advertised speed partway through the transfer." },
      { p: "This is the real quality divide in the SSD market, and it is almost never on the front of the box. If you routinely move very large amounts of data, sustained write behaviour matters more than the peak figure. If you don't, it genuinely doesn't, and a budget drive is fine." },
      { p: "The other thing that hides in the specification is DRAM. Drives with their own cache memory generally hold up better under load than those without, though the gap has narrowed as controllers have improved." },

      { h: "Before you buy: does it fit and will it run at full speed?" },
      { steps: [
        "Check your motherboard has a free M.2 slot. Older boards may have one or none.",
        "Check what PCIe generation that slot runs at. A newer drive works in an older slot but runs at the older slot's speed — which, per everything above, you will mostly not notice.",
        "Check whether populating a second M.2 slot disables SATA ports on your board. Many boards share those lanes, and this surprises people mid-build.",
        "Check the length. M.2 drives come in different lengths and the common one is not the only one.",
      ] },
      { warn: "That third point catches people out regularly. If a drive vanishes from your system after adding an M.2 SSD, the board almost certainly reassigned lanes rather than anything being broken. The manual will say which ports are shared." },

      { h: "What to actually buy" },
      { list: [
        "Still on a hard drive? Any SSD. Stop reading and do it.",
        "Buying a system drive? A mainstream NVMe drive from a known brand. Prioritise capacity over the headline speed number.",
        "Adding bulk storage for games? Capacity per dollar wins. A SATA SSD is perfectly good here and often cheaper per gigabyte.",
        "Storing archives you rarely touch? A hard drive is still the cheapest way to hold a lot of data, and there's no shame in it.",
      ] },
      { p: "As with memory, storage prices in 2026 are not what they were, so the old advice of 'just buy the bigger one, it's barely more' needs retiring for now. Buy the capacity you'll use." },
      { shelf: "storage", text: "The storage shelf separates drive type and capacity so you can compare cost per gigabyte directly rather than being led by whichever number the manufacturer chose to print largest." },
    ],
  },

  // ==========================================================================
  {
    slug: "motherboard",
    title: "Choosing a motherboard without overpaying for it",
    dek: "Boards are the component where the price range is widest and the performance difference is smallest. Here's the short list of things that genuinely differ, and the expensive features most people never use.",
    tag: "Components",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["mobo", "cpu", "ram"],
    blocks: [
      { p: "Two motherboards for the same processor can differ by several hundred dollars and run that processor at identical speed. The board is not a performance part in the way a graphics card is — it is the thing that decides what you can plug in, how much you can push, and how much of a nuisance the build is." },
      { p: "So the sensible way to shop is not by tier. It is by working out which four or five things you actually need and buying the cheapest board that has them." },

      { h: "The non-negotiables" },
      { steps: [
        "The socket must match your processor exactly. This is not a place for near-enough — a chip either fits the socket or it doesn't.",
        "The chipset must support that specific chip. Same socket does not always mean same support, particularly with newer chips on older chipsets.",
        "Check the manufacturer's support list for your exact processor model, and note whether it says a BIOS update is required.",
        "The memory generation must match. DDR4 and DDR5 are not interchangeable and the slots are physically keyed differently.",
        "The form factor must fit your case. ATX, Micro-ATX and Mini-ITX, largest to smallest.",
      ] },
      { warn: "The BIOS update trap is worth dwelling on. A board can list support for a processor that it cannot actually boot until its firmware is updated — and updating firmware normally requires a working processor. Some boards can update without one via a dedicated port, and that feature is worth paying for if you're pairing a new chip with a board design that predates it. If yours can't, you may need an older chip just to perform the update." },

      { h: "What actually differs between a cheap board and an expensive one" },
      { table: {
        head: ["Feature", "Who needs it"],
        rows: [
          ["Stronger power delivery", "Heavy sustained loads or overclocking. Gaming rarely stresses this."],
          ["More M.2 slots", "Anyone planning multiple fast drives — genuinely useful and easy to underestimate."],
          ["Better networking", "Wired 2.5G or newer Wi-Fi. Only useful if the rest of your network is."],
          ["More rear USB ports", "Everyone eventually. This is the most underrated spec on the list."],
          ["Better onboard audio", "People using headphones directly, no external interface. A real difference."],
          ["More fan headers", "Larger cases and air-cooled builds. Splitters exist, but headers are cleaner."],
          ["Heatsinks everywhere, RGB", "Aesthetics. Nothing wrong with that — just know what you're paying for."],
        ],
      } },
      { p: "The two on that list that people most often wish they'd bought more of are USB ports and M.2 slots. Both are permanent constraints — you cannot add a slot later — and both are cheap when you're choosing the board and impossible afterwards." },

      { h: "Where the money is usually wasted" },
      { list: [
        "Overclocking-grade power delivery on a machine that will never be overclocked. Modern chips already boost themselves close to their limit; manual overclocking is a hobby now, not a value play.",
        "Flagship chipsets bought for headroom. The extra lanes and features are real, but if you can't name the thing you'd plug into them, they're decoration.",
        "Large boards in small cases. A Micro-ATX board in a mid-tower is entirely normal and often cheaper for the same features.",
        "Buying for future processors on the same socket. Sometimes this pays off handsomely and sometimes the platform ends a generation later. It is a bet, not a plan.",
      ] },

      { h: "The size question" },
      { p: "Micro-ATX boards are shorter than ATX and drop some expansion slots you probably weren't going to use. They fit in almost every case that fits an ATX board, and they're frequently cheaper for the same chipset. For a build with one graphics card and no add-in cards — which is nearly every gaming build — this is the default that people skip past for no particular reason." },
      { p: "Mini-ITX is a different proposition. It's for small cases specifically, it costs more rather than less, it has two memory slots instead of four, and building in one is harder. Choose it because you want a small computer, not to save money." },

      { h: "The two features worth paying a little extra for" },
      { p: "A rear-panel button that flashes the BIOS without a working processor installed. It sounds like an obscure enthusiast feature and it is the difference between a build that finishes on Saturday and a build that stalls waiting for a chip you only need in order to update firmware. If you're pairing a recent processor with a board design that shipped before it, this is close to insurance." },
      { p: "And a diagnostic readout — either a two-digit code display or a row of labelled lights. When a machine doesn't post, the single hardest part is working out which component is unhappy, and a board that tells you 'memory' rather than sitting there in silence saves an afternoon of pulling parts one at a time. Neither of these makes the computer faster. Both make it much less likely you spend a weekend on a problem the board already knew the answer to." },

      { h: "Who should not buy a new board" },
      { p: "If you're upgrading an existing machine, check whether your current socket takes a faster processor first. A drop-in chip upgrade avoids the board, the memory, and the entire reinstall — and it's the first thing our Upgrade Finder checks, because it is the cheapest good outcome available and most people don't know whether it applies to them." },
      { shelf: "mobo", text: "The motherboard shelf shows socket, chipset and form factor together, which are the three filters that eliminate most of the catalogue before you start comparing on anything else." },
    ],
  },

  // ==========================================================================
  {
    slug: "monitor-match",
    title: "Matching a monitor to the frame rate you can actually produce",
    dek: "A 240 Hz display fed 70 frames a second is a 70 Hz display you overpaid for. Work out what your machine produces first, then buy the panel that suits it — and know which spec on the box is the one that matters.",
    tag: "Buying",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["monitor", "gpu"],
    blocks: [
      { p: "Monitors are unusual among PC parts in that they outlive everything else. A graphics card is a three-to-five year purchase; a good display can comfortably see out two or three of them. That argues for buying a bit better than you strictly need — but only along the axes that age well, and refresh rate is not one of them if your machine can't feed it." },

      { h: "Start with what your machine produces" },
      { p: "Before comparing panels, find out what frame rate you actually get in the games you play at the resolution you want. Turn on your driver's performance overlay, play for a few minutes, and note the range. That single number constrains everything below." },
      { p: "A display cannot show frames that don't exist. If your machine produces 70 frames per second in the games you care about, the difference between a 144 Hz panel and a 240 Hz panel is, for you, nothing. The money is better spent on the graphics card that raises the number, or on panel quality you'll see every day regardless of frame rate." },
      { note: "The exception is competitive shooters at low settings, which are deliberately easy to render and where very high frame rates are achievable on modest hardware. If that's your main game, high refresh is worth prioritising — it's the one genre where the difference is both real and reachable." },

      { h: "Resolution changes your GPU's job more than anything else" },
      { table: {
        head: ["Resolution", "Load on the GPU", "Sensible for"],
        rows: [
          ["1080p", "Lightest", "High frame rates on modest hardware; competitive play"],
          ["1440p", "Substantially heavier", "The common sweet spot for mid-range and up"],
          ["4K", "Heaviest by a wide margin", "Strong GPUs, or slower-paced games where frame rate matters less"],
        ],
      } },
      { p: "Moving up in resolution costs frames, and it costs them on the graphics card specifically. This is the counterintuitive half of the bottleneck problem: a machine that's CPU limited at 1080p may be perfectly balanced at 1440p, because the extra pixels give the GPU more to do while the CPU's job stays the same." },

      { h: "Panel type, which you'll notice every single day" },
      { list: [
        "IPS — accurate colour, wide viewing angles, the safe default. Blacks are grey-ish in a dark room.",
        "VA — much better contrast and deeper blacks, but slower pixel transitions can smear in fast motion. Good for dark, atmospheric games and film.",
        "TN — fastest and cheapest, worst colour and viewing angles. Increasingly niche.",
        "OLED — the best image available, with genuine per-pixel black. Costs considerably more, and static elements like a taskbar or a HUD carry a burn-in risk over years that other panel types don't have.",
      ] },
      { p: "Panel type is the spec you will notice on a Tuesday afternoon doing nothing in particular. Refresh rate is the one you notice in motion. Both matter; only one of them is on the front of the box in enormous type." },

      { h: "Adaptive sync is not optional" },
      { p: "Variable refresh — FreeSync, G-Sync, or the VESA Adaptive-Sync standard behind them — lets the display change its refresh rate to match whatever your machine is producing moment to moment. Without it, a frame rate that doesn't divide evenly into the refresh rate produces tearing or stutter." },
      { p: "It is close to universal on modern displays and it removes an entire category of visual problem. It also makes an imperfect frame rate feel far better than the raw number suggests, which is exactly the situation most people are in. Check it's there, and check it's switched on — it frequently ships disabled in the monitor's own menu." },
      { warn: "Also check your cable and port. A display capable of a high refresh rate at a high resolution will silently fall back to something lower over an inadequate cable or an older port, and nothing on screen tells you. Confirm the actual refresh rate in your operating system's display settings after setting it up." },

      { h: "Size, distance, and the mistake that isn't reversible cheaply" },
      { p: "Screen size and resolution have to be considered together, because what you actually perceive is pixel density at your viewing distance. A large panel at a low resolution looks coarse up close on a desk while looking perfectly fine across a room, which is why television advice transfers badly to monitors." },
      { p: "On a normal desk, the practical effect is that going bigger without going higher in resolution tends to disappoint, and going higher in resolution without going bigger tends to make everything small until you scale it up in the operating system. Ultrawides complicate this further: they're excellent for work and for immersive single-player games, and less useful in competitive titles where some games letterbox the extra width or where the edges are outside your useful field of view anyway. If you can see one in person before committing, do — it's the component least well described by its specification." },

      { h: "Who should not upgrade" },
      { p: "If your current display is a decent 1440p panel with adaptive sync and your machine struggles to hit its refresh rate already, a new monitor makes your games look worse, not better — a bigger, sharper panel demands more from the same graphics card. Fix the frame rate first, then buy the display that shows it off." },
      { shelf: "monitor", text: "The monitor shelf lists size, resolution and refresh rate together so you can rule out the panels your machine can't feed before comparing anything else." },
    ],
  },

  // ==========================================================================
  {
    slug: "reuse",
    title: "What to keep when you upgrade, and what to replace",
    dek: "The most expensive habit in PC building is replacing parts that were fine. Here's what genuinely carries over to a new build, what's a false economy, and the one component people keep that they really shouldn't.",
    tag: "Upgrading",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["psu", "case", "storage", "cooler"],
    blocks: [
      { p: "Almost every 'new PC' is in practice a partial one. You have a machine, some of it is still good, and the question is where to draw the line. Drawing it in the wrong place either wastes several hundred dollars on parts that didn't need replacing, or saves a hundred on a part that then causes trouble for years." },

      { h: "Keep, almost always" },
      { list: [
        "Storage. SSDs carry over cleanly and a drive that works has no meaningful age problem for typical desktop use. Move it and keep going.",
        "The case, if you like it and it fits. Cases barely change. The things to verify are clearance for a modern graphics card, radiator or cooler space, and front panel connectors — the port standards changed and adapters exist.",
        "The monitor, keyboard, mouse, and everything else on the desk. None of these care what's inside the box.",
        "Case fans, if they're quiet and they spin. There's nothing in a fan to go out of date.",
      ] },

      { h: "It depends" },
      { table: {
        head: ["Part", "Keep it if", "Replace it if"],
        rows: [
          ["Power supply", "Good unit, adequate wattage, under ~7 years", "Old, unknown brand, or your new GPU needs more"],
          ["Memory", "Same generation as the new board", "Board takes a different generation — not optional"],
          ["CPU cooler", "It has a mounting kit for the new socket", "No bracket available, or it was always marginal"],
          ["Motherboard", "Only if you're keeping the processor", "New processor with a different socket"],
        ],
      } },
      { p: "The memory row is the one that surprises people mid-upgrade. Memory generations are physically keyed so they can't be inserted into the wrong board, and there's no adapter. If your new platform uses a different generation than your old one, that's a mandatory purchase — which, at 2026 memory prices, can meaningfully change whether the upgrade makes sense at all. Work it out before you buy the board, not after." },

      { h: "The one people keep that they shouldn't" },
      { p: "An old power supply. It is invisible, it appears to work, and replacing it feels like spending money on nothing. But it's the component with consumable parts inside that degrade with heat and time, it's the one whose failure can take other components with it, and it's the one being asked to do a harder job than it was bought for if your new graphics card draws more than the old one." },
      { p: "A good quality unit that is a few years old and comfortably rated for the new load is fine. A cheap unit of unknown provenance, or one that was already close to its limit, is a poor thing to gamble a new graphics card against. Our power supply guide covers how to work out what the new machine actually needs." },
      { warn: "Also check the connectors, not just the wattage. Newer high-power graphics cards use a connector that older supplies don't have. Adapters exist and are widely used, but seating them fully matters — a partially seated high-current connector is a known fire hazard, not a theoretical one." },

      { h: "The order that saves the most money" },
      { steps: [
        "Diagnose what's actually limiting you before buying anything. Our bottleneck guide is ten minutes and frequently ends the process there.",
        "Check whether your existing socket takes a faster processor. The cheapest good outcome is a chip swap into the board you already have.",
        "If a new platform is genuinely needed, price the whole thing — board, chip, and memory if the generation changes — before deciding. Partial pricing is how upgrades quietly double.",
        "Confirm the power supply can handle the new load and has the right connectors.",
        "Reuse everything on the keep list without guilt.",
      ] },

      { h: "Two things that carry over that people forget to check" },
      { p: "Your operating system licence usually survives a hardware change, but a major change — particularly the motherboard — can require reactivating it. Linking the licence to an account before you take the machine apart makes that a two-minute inconvenience instead of a support call." },
      { p: "The other is your cooler's mounting hardware. Manufacturers of good coolers frequently supply a bracket for a new socket, sometimes free, and that turns a cooler you thought was scrap back into a part you keep. It's worth an email before you buy a replacement, and it's the single most commonly missed reuse on this page." },

      { h: "The honest case for doing nothing" },
      { p: "If the machine does what you need, no upgrade path is better value than the one you don't buy. The point of diagnosing first is partly to find the cheap fix, and partly to find out that there isn't a problem worth solving. That's a legitimate result, and it's the one we'd rather you left with than a purchase that changes nothing." },
      { shelf: "psu", text: "If the power supply is the part you're replacing, the shelf lists wattage, efficiency rating and modularity, which are the three things that separate units that otherwise look identical." },
    ],
  },

  // ==========================================================================
  {
    slug: "listing-traps",
    title: "Reading a PC parts listing without getting burned",
    dek: "Product pages are written to sell, not to inform. These are the specific patterns that cost people money — recycled model names, renewed units sold as new, capacity that isn't what it looks like, and reviews attached to the wrong product.",
    tag: "Buying",
    minutes: 4,
    updated: "2026-07-28",
    shelves: ["gpu", "storage", "psu"],
    blocks: [
      { p: "Most of what goes wrong with an online parts purchase isn't fraud. It's a listing that is technically accurate and practically misleading, read quickly by someone who already decided what they were buying. These are the patterns worth slowing down for." },

      { h: "The model name that means several things" },
      { p: "Manufacturers reuse names across meaningfully different products. The same graphics card model can exist in variants with different memory capacities or different memory bus widths that perform noticeably differently. Storage lines frequently change their internal components mid-life while keeping the same product name and box, sometimes with real consequences for sustained performance." },
      { p: "The defence is to match the full model string, including the suffix and the capacity, against the manufacturer's own specification page rather than trusting the seller's title. If the listing title and the manufacturer's page disagree about any number, believe the manufacturer." },

      { h: "Condition, hidden in plain sight" },
      { table: {
        head: ["What it says", "What it means"],
        rows: [
          ["Renewed / Refurbished", "Used, inspected, resold. Often fine, usually a shorter warranty."],
          ["Open box", "Returned. Condition varies enormously."],
          ["OEM / Bulk / Tray", "No retail box, often no accessories, sometimes no consumer warranty."],
          ["Pull / Used", "Removed from a working system. No warranty at all."],
        ],
      } },
      { p: "None of these are inherently bad deals — a renewed unit at a real discount with a stated warranty can be a sensible buy. The problem is buying one without noticing, comparing its price against new units, and concluding you found a bargain." },
      { warn: "The one to be most careful with second-hand is the power supply, because you cannot inspect what matters and its failure can damage other parts. A used graphics card is a risk to your money; a used supply of unknown history is a risk to everything attached to it." },

      { h: "Reviews that belong to a different product" },
      { p: "Marketplaces group variants of a product under one listing, and reviews pool across all of them. A drive listing with thousands of glowing reviews may have earned nearly all of them on a different capacity, or on an earlier revision with different internals. A monitor listing can pool reviews across sizes." },
      { p: "Read the recent reviews specifically, and check which variant each reviewer bought. A high average with a cluster of recent complaints describing the exact variant you want is a much clearer signal than the headline score." },
      { note: "Since the FTC's rule on fake reviews took effect, buying reviews is explicitly illegal in the US — but that addresses fabricated reviews, not the structural problem of genuine reviews pooling across variants that share a listing. That one is on you to check." },

      { h: "Specification tricks worth knowing" },
      { list: [
        "Storage capacity is advertised in decimal gigabytes; your operating system reports binary ones. A 1 TB drive showing as roughly 931 GB is normal and not a defect.",
        "Peak versus sustained. A drive's headline speed is a burst figure; a power supply's peak wattage is not its continuous rating. Look for the continuous number.",
        "Refresh rates that require specific conditions — a particular port, a particular cable, or a lower resolution than the one advertised alongside it.",
        "Bundled software or accessories counted as value. Free trials and cable ties are not a discount.",
        "Prices shown against a 'was' figure that the product never sustainably sold at. Compare against other current listings for the same part, not against the crossed-out number.",
      ] },

      { h: "A sanity check before ordering" },
      { steps: [
        "Copy the exact model number into the manufacturer's site and confirm the key specifications match the listing.",
        "Check condition and seller. Verify who is actually shipping and warranting it, not just whose logo is at the top.",
        "Confirm physical fit — length, height, slot count, connector type — against your case and board.",
        "Read the most recent reviews, filtered to your variant if the option exists.",
        "Check the return window and what it costs you to use it. This is the real safety net.",
      ] },

      { h: "About the prices on this site" },
      { p: "Our listings are rebuilt from Amazon on a schedule rather than checked at the instant you load the page, so a price here can be a little behind. Every product links straight through to the source, and the price on Amazon at checkout is the one that counts. We'd rather tell you that plainly than print 'live prices' over something that updates monthly." },
      { p: "We also earn a commission when you buy through those links, at no extra cost to you. That's disclosed at the foot of every page for a reason: it's the thing you should factor in when reading any recommendation on any site, including this one. It's also why these guides are written to be useful to someone who buys nothing — if the only value here were the Buy buttons, you'd have every reason to distrust the words around them." },
      { shelf: "gpu", text: "Every product on our shelves links directly to its Amazon listing, so you can run the checks above on the source page before committing to anything." },
    ],
  },
];

export const GUIDES_BY_SLUG = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

export function guideSlugs() {
  return GUIDES.map((g) => g.slug);
}

export function getGuide(slug) {
  return GUIDES_BY_SLUG[slug] || null;
}

// The "keep reading" rail at the foot of an article.
//
// Rotating from the current article's own position rather than always taking
// the first three matters more than it looks. Slicing from the top would point
// seven of the ten articles at the same three, leaving the rest with no inbound
// links from anywhere on the site — which is exactly the shape a search engine
// reads as "these pages aren't important". Walking forward and wrapping gives
// every article the same number of inbound links.
export function otherGuides(slug, n = 3) {
  const i = GUIDES.findIndex((g) => g.slug === slug);
  if (i < 0) return GUIDES.slice(0, n);
  const out = [];
  for (let k = 1; k <= GUIDES.length && out.length < n; k++) {
    out.push(GUIDES[(i + k) % GUIDES.length]);
  }
  return out;
}

// Rough word count, used to keep us honest about the "minutes" figure rather
// than letting it drift into a made-up number.
export function guideWords(g) {
  let n = 0;
  for (const b of g.blocks) {
    if (b.p) n += b.p.split(/\s+/).length;
    if (b.h) n += b.h.split(/\s+/).length;
    if (b.note) n += b.note.split(/\s+/).length;
    if (b.warn) n += b.warn.split(/\s+/).length;
    if (b.text) n += b.text.split(/\s+/).length;
    if (b.list) for (const x of b.list) n += x.split(/\s+/).length;
    if (b.steps) for (const x of b.steps) n += x.split(/\s+/).length;
    if (b.table) for (const r of b.table.rows) for (const c of r) n += String(c).split(/\s+/).length;
  }
  return n;
}
