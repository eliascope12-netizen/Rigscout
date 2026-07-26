# RigScout — the real, live-priced version

This is a full web application (a Next.js app), not a single HTML file. It has a
small **backend** so it can pull **live Amazon prices, real product photos, and
the full catalog** — the things a downloadable file can't do.

It runs right now with built-in **sample data**, so you can try it before signing
up for anything. Add one API key and it switches to **live** Amazon data.

---

## What you'll set up (all free to start)

| Account | What it's for | Cost |
|---|---|---|
| **RapidAPI** | The live Amazon data (prices, photos, search) | Free tier: 100 requests/mo. ~$25/mo when live. |
| **GitHub** | Stores the code | Free |
| **Vercel** | Hosts the site + backend | Free |
| **Amazon Associates** | Your affiliate tag (earn commission) | Free |

Only the data API ever costs money, and only once you outgrow the free tier.
Read **"How many results you actually get"** below before you decide which plan
to be on — it's the one thing that decides whether the catalog looks full or thin.

---

## Option A — try it on your computer first (optional, 5 min)

You need [Node.js](https://nodejs.org) installed (the "LTS" version).

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Everything works using sample data. When you're
ready for live prices, create `.env.local` (copy `.env.local.example`) and paste
your RapidAPI key in.

---

## Option B — put it online (the real goal)

### 1) Get your live-data API key (RapidAPI)
1. Go to **rapidapi.com** and sign up (free, no card).
2. Search for **"Real-Time Amazon Data"** and open it.
3. Click **Subscribe** → choose a plan (see the section below on which one).
4. On the API's page, copy your **`X-RapidAPI-Key`** value. Keep it handy.

### 2) Put the code on GitHub
1. Sign up at **github.com** (free).
2. Create a new repository (e.g. `rigscout`).
3. Upload this whole folder to it (GitHub's website has an "upload files" button,
   or use GitHub Desktop). **Do not upload `node_modules` or `.env.local`.**
   The `.gitignore` file in here already keeps both out if you use Git; if you're
   dragging files into the browser, just don't drag those two.

### 3) Deploy on Vercel
1. Sign up at **vercel.com** with your GitHub account (free).
2. Click **Add New → Project**, pick your `rigscout` repo, click **Import**.
3. **Framework Preset must say "Next.js"** and **Root Directory must be `./`**.
   If the preset says "Other", the build produces nothing and the site 404s.
4. Before deploying, open **Environment Variables** and add:
   - `RAPIDAPI_KEY` = the key from step 1
   - `AMAZON_ASSOCIATE_TAG` = your Amazon tag (e.g. `rigscout-20`) — or leave blank for now
5. Click **Deploy**. In ~1 minute you'll get a live URL like
   `rigscout.vercel.app`. That's your site — with live prices.

To use your own domain later: Vercel → Project → **Settings → Domains**.

### Updating the site later
Replace the files in the GitHub repo with the new ones and commit. Vercel watches
the repo and redeploys on its own — there's nothing to click. Give it about a
minute, then hard-refresh the site (Ctrl+Shift+R) so your browser stops showing
you the old copy.

---

## The three settings that matter

Set these as Environment Variables in Vercel (and in `.env.local` locally):

- **`RAPIDAPI_KEY`** — turns on live Amazon data. Without it, the app uses sample
  data. This is read **server-side only**; it is never sent to the browser, so
  nobody visiting the site can see or steal it.
- **`AMAZON_ASSOCIATE_TAG`** — added to every buy link so you earn commission.
- **`CATALOG_PAGES`** — how many pages of Amazon results to pull per search.
  Defaults to `2`. Raising it deepens the catalog and spends more API calls —
  the maths is in the next section.

After changing environment variables in Vercel, click **Redeploy** for them to
take effect.

---

## How many results you actually get

RigScout doesn't run one Amazon search per category — it runs a whole list of
them and merges the results, throwing away duplicates by ASIN. Graphics cards
alone fan out across **41 different searches** ("RTX 5090", "RX 9070 XT", "Intel
Arc B580", "RTX 4060 Ti 16GB", and so on down the range), and there are **175
searches across the nine categories**. Each search returns about 16 listings per
page, and `CATALOG_PAGES` decides how many pages deep each one goes.

At the default `CATALOG_PAGES=2` that's up to roughly **1,300 graphics card
listings** and around **5,600 parts overall** before de-duplication — as against
the sixteen cards a single search gives you.

**But every one of those searches is an API request**, and this is where the plan
you picked on RapidAPI decides what the site looks like:

- **Free tier — 100 requests/month.** That is the whole month, for everybody who
  visits. One person opening the graphics-card page with the default settings can
  spend 80+ of them. In practice the free tier is for *checking that live data
  works at all*, not for running the site. Once it's used up, RapidAPI returns
  errors and RigScout quietly falls back to its built-in sample catalog — the
  site keeps working and nothing looks broken, but the prices stop being live.
- **Paid tier (~$25/month)** is what actually delivers the "every card on Amazon"
  depth. That's the plan to be on the day you start sending real traffic.

Two things keep the bill down on the paid plan. Results are **cached for 24
hours** in two places — in memory on the server, and at Vercel's edge
(`s-maxage=86400, stale-while-revalidate=604800`) — so a hundred visitors looking
at graphics cards on the same day cost the same as one. And the searches are
**loaded in tranches of seven**: opening a category fetches only the first
tranche, and deeper ones are pulled in as somebody scrolls or filters. Most
visitors never trigger the deep ones at all.

If you want to spend less, lower `CATALOG_PAGES` to `1`. If you want maximum
depth and you're on the paid plan, `3` is a sensible ceiling — beyond that Amazon
starts returning loosely-related listings anyway.

---

## Why prices stay accurate on their own

The backend (`/lib/amazon.js`) caches results for 24 hours, then refreshes them
automatically from Amazon. You never edit prices by hand — that's the whole point
of having a live data source. Every buy button links straight to that exact
product (`amazon.com/dp/ASIN`) with your tag attached, not to a search page, so
the price the customer sees on Amazon is the price they saw here.

## Making prices fully "Amazon-compliant" later

Amazon prefers that displayed prices come from **their** Product Advertising API
(PA-API), which you can access once your Associates account has qualifying sales.
When you're there, you only need to swap the fetch logic inside
`/lib/amazon.js` — the rest of the app stays the same.

---

## Where things live

```
lib/specs.js        → what each part actually is: sockets, memory type, card
                      length, cooler height and mounting, case clearances.
                      Matched against real Amazon listing titles.
lib/compat.js       → the compatibility engine. Decides what fits, writes the
                      plain-English verdict, and filters the parts browser so
                      incompatible parts are never offered in the first place.
lib/benchmarks.js   → the bottleneck engine (CPU/GPU performance + FPS estimate)
lib/catalog.js      → the search lists behind each category, the spec columns,
                      and the filters
lib/amazon.js       → live Amazon data (server-side only; your key is safe here)
pages/api/          → the backend endpoints the site calls
pages/parts/        → the open, PCPartPicker-style parts browser
pages/              → the pages (home, upgrade, builder, products, guides)
components/         → shared UI (nav, product card, part browser)
styles/globals.css  → the design
```

---

## A note on the compatibility engine

The rule the whole thing is built on: **never hand the research back to the
customer.** RigScout doesn't say "confirm the socket before buying" — if it can't
confirm something itself, it stays quiet about it rather than turning it into
homework. Sockets, memory generation, card length against case clearance, cooler
height against the side panel, cooler mounting against the chip, power-supply
headroom and board-to-case fit are all checked automatically, and anything that
doesn't fit what's already in the build is filtered out of the browser before
anyone can pick it.
