# RigScout

A Next.js web app that works out which part is holding a PC back, plans a build
where every component is checked against every other one, and prices it against
real Amazon listings.

The important thing to understand about how it works: **the live site never
talks to Amazon.** Every product, price and photo comes from a file in this
repository, `data/catalog.json`, which is rebuilt on a schedule by a GitHub
Action. Serving a page costs nothing. Ten visitors and ten million visitors cost
exactly the same, and the site cannot break because an API quota ran out.

---

## What you'll set up

| Account | What it's for | Cost |
|---|---|---|
| **GitHub** | Stores the code, and rebuilds the prices twice a month | Free |
| **Vercel** | Hosts the site | Free |
| **RapidAPI** | Where the prices come from, when the catalog is rebuilt | Free tier is enough |
| **Amazon Associates** | Your affiliate tag, so buy links earn commission | Free |

Nothing here has to cost money. That is a deliberate design decision, not a
starting point you grow out of — see *The request budget* below.

---

## How the prices work

There are two halves, and keeping them separate is the whole trick.

**The website** reads `data/catalog.json` and nothing else. No API key, no
network call, no cache to warm. This is why it is free to run at any traffic
level.

**The catalog builder** (`scripts/build-catalog.mjs`) is what actually queries
Amazon. It runs on GitHub's machines twice a month, spends a fixed and small
number of API requests, writes a new `data/catalog.json`, and commits it. That
commit makes Vercel redeploy, and the new prices are live a minute later.

So prices are real, but they are not live, and the difference is printed on
every page that shows one: *"Real Amazon prices, checked October 14 (3 days
ago)"*. That sentence is the honest version of the claim, and the code will not
let you make the dishonest one — if the catalog is placeholder data, every price
badge on the site says so automatically.

### The request budget

The RapidAPI free tier gives 100 requests a month. One catalog rebuild spends
about 33 of them: nine categories, three searches each, plus up to six top-ups
when a category comes up short.

```
2 scheduled rebuilds (1st and 15th)   ~66
1 manual rebuild if you want one      ~33
                                      ----
                                      ~99 of 100
```

That is the entire month, and the site serves unlimited traffic on top of it.

### Equal depth in every category

Every category shows the *same number* of products. Not roughly the same —
exactly the same. The build script collects as many as it can per category,
ranks them, then trims every category down to whatever the thinnest one managed.

The point is that a page of 22 graphics cards next to a page of 22 coolers reads
as a complete catalog, while 500 cards next to 10 coolers reads as a site that
gave up on coolers. If the thinnest category can only manage fewer than 12, the
script refuses to level everything down to it and warns instead — gutting eight
categories to match one broken one is not an improvement.

### Which products get shown

The ones people actually buy. Amazon's API returns a review count and a
best-seller flag with every listing, so the ranking costs no extra requests:

1. Amazon best-sellers rated 4.0 and up
2. Rated 4.3+ with 100 or more reviews
3. Rated 4.3+
4. Rated 3.9+
5. Everything else

Within each band, most-reviewed first. Review count is a proxy for sales rather
than a measure of it, but it is the only popularity signal available for free
and it is a good one — nothing accumulates six thousand reviews without having
sold a great many units.

---

## Setup

### 1) Put the code on GitHub

Create a repository and upload this folder. **Do not upload `node_modules` or
`.env.local`.** The `.gitignore` keeps both out if you use Git; if you are
dragging files into the browser, just don't drag those two.

`data/catalog.json` **does** belong in the repo. It is the site's entire
inventory — without it there is nothing to show.

### 2) Deploy on Vercel

1. Sign up at vercel.com with your GitHub account.
2. **Add New → Project**, pick the repo, **Import**.
3. Framework Preset must say **Next.js**, Root Directory must be **`./`**. If
   the preset says "Other", the build produces nothing and the site 404s.
4. Add one environment variable: `AMAZON_ASSOCIATE_TAG` = your Amazon tag
   (e.g. `rigscout-20`). Leave it out until your Associates account is approved
   — links still work, they just don't earn.
5. **Deploy.**

Note what is *not* in that list: the RapidAPI key. The site doesn't need one,
because the site never calls the API.

### 3) Turn on price rebuilds

1. Sign up at rapidapi.com (free, no card) and subscribe to **Real-Time Amazon
   Data** on the free plan. Copy your `X-RapidAPI-Key`.
2. In GitHub: **Settings → Secrets and variables → Actions → New repository
   secret.** Name it `RAPIDAPI_KEY`, paste the key.
3. **Actions** tab → **Rebuild price catalog** → **Run workflow.**

Two minutes later the repo has a fresh catalog, Vercel has redeployed, and the
site is showing real Amazon prices with today's date on them. After that it
happens by itself on the 1st and the 15th.

The key lives in that secret and nowhere else — not in the code, not in the
committed catalog, and never sent to a browser.

> GitHub switches off scheduled workflows in repositories with no activity for
> 60 days. If prices stop updating, check that first; one manual run turns it
> back on.

---

## Environment variables

| Variable | Where | What it does |
|---|---|---|
| `AMAZON_ASSOCIATE_TAG` | Vercel | Appended to every buy link. Applied when the page renders, so setting it later works without rebuilding the catalog. |
| `RAPIDAPI_KEY` | GitHub Actions secret | Read only by the catalog builder. Not needed by the website. |
| `NEXT_PUBLIC_DISCORD_INVITE` | Vercel | Overrides the built-in invite link. |
| `NEXT_PUBLIC_BACKBLAZE_URL` `NEXT_PUBLIC_BISECT_URL` `NEXT_PUBLIC_VPN_URL` | Vercel | Affiliate links on `/extras`. Blank means the plain public page is linked instead. |
| `LIVE_SEARCH` | Vercel, optional | See below. Off unless set to `1`. |

After changing variables in Vercel, click **Redeploy** for them to take effect.

### `LIVE_SEARCH` — the one optional upgrade

Search is the single place where the stored catalog genuinely falls short:
someone hunting an unusual part won't find it on a shelf of a couple of hundred.
Setting `LIVE_SEARCH=1` **and** `RAPIDAPI_KEY` in Vercel makes the search box
query Amazon directly again. Browse pages stay free either way.

It needs both variables on purpose. On a hundred-request plan, one curious
visitor with a search box can spend a month's quota in a minute, and finding
that out from a billing page is worse than never having switched it on. Leave it
off unless you are on a paid plan.

---

## Running it locally (optional)

You need [Node.js](https://nodejs.org) (the LTS version).

```bash
npm install
npm run dev          # http://localhost:3000
```

To rebuild the catalog from your own machine instead of via GitHub Actions, put
your key in `.env.local` (copy `.env.local.example`) and run:

```bash
npm run catalog
```

Then commit the changed `data/catalog.json`. This spends the same ~33 requests
as the Action, so don't do both in the same month without checking your usage.

---

## Where things live

```
data/catalog.json     → every product the site shows. Built by the script below,
                        committed to the repo, shipped with the site.
scripts/build-catalog.mjs
                      → the only thing that ever calls Amazon. Fetches, ranks by
                        popularity, equalises the categories, writes the catalog.
.github/workflows/catalog.yml
                      → runs that script on the 1st and 15th and commits the result
lib/staticCatalog.js  → the site's only reader of the catalog file
components/PriceStamp.js
                      → the "checked on <date>" line, and the rules about what
                        the site is allowed to claim about its own prices
lib/specs.js          → what each part actually is: sockets, memory type, card
                        length, cooler height and mounting, case clearances
lib/compat.js         → the compatibility engine. Decides what fits, writes the
                        plain-English verdict, and filters incompatible parts out
                        of the browser before anyone can pick them
lib/benchmarks.js     → the bottleneck engine (CPU/GPU performance + FPS estimate)
lib/catalog.js        → category definitions, search queries, spec columns, filters
lib/amazon.js         → the live API client. Only used by the optional LIVE_SEARCH
                        path; the rest of the site never touches it.
pages/                → home, upgrade, builder, products, parts, guides
components/           → shared UI
styles/globals.css    → the design
```

---

## Two rules the code enforces

**Never claim prices are live when they aren't.** The build script checks
whether the ASINs in the catalog look like real Amazon identifiers. If they
don't, it flags the file, and every price badge on the site switches to "example
data" on its own. The GitHub Action refuses to commit a flagged catalog at all.
This matters beyond principle: the New York Attorney General fined Fareportal
$2.6M over invented urgency, and the FTC's Fake Reviews Rule has been in force
since October 2024. There are no countdown timers here, no "only 2 left", and no
review counts we didn't get from Amazon.

**Never hand the research back to the customer.** RigScout doesn't say "confirm
the socket before buying" — if it can't confirm something itself, it stays quiet
rather than turning it into homework. Sockets, memory generation, card length
against case clearance, cooler height against the side panel, cooler mounting
against the chip, power-supply headroom and board-to-case fit are all checked
automatically.

---

## Later: Amazon's own price API

Amazon prefers that displayed prices come from their Product Advertising API,
which opens up once your Associates account has qualifying sales. Getting there
only requires swapping the fetch inside `scripts/build-catalog.mjs` — the ranking,
the equalising, the site itself and everything downstream stay exactly as they
are.
