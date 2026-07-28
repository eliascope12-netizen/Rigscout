/* ==========================================================================
   RigScout — partner recommendations
   --------------------------------------------------------------------------
   Everything on this page is an affiliate link, and every entry below has to
   earn its place by being genuinely useful to somebody who just built a PC.
   The house rules for anything added here:

     1. Say what it actually does. No marketing verbs.
     2. Say who should NOT buy it, in the same size type as the pitch.
     3. Never repeat a vendor claim we can't back up. (The big one: a VPN
        does not lower your ping. It adds a hop. See the VPN entry.)
     4. If there's a free way to do the same job, name it.

   The URLs are read from environment variables so affiliate IDs can be added
   later without a code change. Until then every link falls back to the plain
   public URL, which still works — it just doesn't pay us anything. Next.js
   inlines NEXT_PUBLIC_* at build time, so these must be written out literally
   rather than looked up dynamically.
   ========================================================================== */

const BACKBLAZE =
  process.env.NEXT_PUBLIC_BACKBLAZE_URL || "https://www.backblaze.com/cloud-backup.html";
const BISECT =
  process.env.NEXT_PUBLIC_BISECT_URL || "https://www.bisecthosting.com/";
const VPN =
  process.env.NEXT_PUBLIC_VPN_URL || "https://nordvpn.com/";

export const DISCORD_INVITE =
  process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/jt9dDCat4Q";

/* Is any of this actually an affiliate link yet? Drives whether we show the
   disclosure badge — claiming commission we don't earn is its own small lie. */
export const HAS_AFFILIATE_LINKS = Boolean(
  process.env.NEXT_PUBLIC_BACKBLAZE_URL ||
    process.env.NEXT_PUBLIC_BISECT_URL ||
    process.env.NEXT_PUBLIC_VPN_URL
);

/* Same question for the Amazon side. AMAZON_ASSOCIATE_TAG stays server-only, so
   next.config.js inlines a bare yes/no under this name — the tag never reaches
   the browser. Every "we earn a commission" sentence on the site is gated on
   this, because a disclosure that describes a relationship you don't have is a
   false statement about money, which is the one kind nobody forgives. */
export const AMAZON_AFFILIATE_LIVE = Boolean(process.env.AMAZON_AFFILIATE_ACTIVE);

/* Does the site earn anything from anything, today? */
export const ANY_AFFILIATE_LIVE = AMAZON_AFFILIATE_LIVE || HAS_AFFILIATE_LINKS;

export const PARTNERS = [
  {
    key: "backup",
    name: "Backblaze",
    tag: "Backup",
    icon: "☁",
    accent: "mint",
    href: BACKBLAZE,
    oneline: "Unlimited background backup for one computer.",
    what:
      "It installs once and then quietly uploads everything on your machine — documents, photos, saves, project files — to their servers. You don't pick folders, you don't schedule anything. If the drive dies you download it back, or pay them to post you a hard drive.",
    why:
      "A new build almost always means a brand-new drive, and a brand-new drive is the one you have no copy of. SSDs don't give you the warning noises a dying hard drive does — they tend to work perfectly right up until they don't.",
    price: "Around $99/year per computer — check their site, it has gone up before.",
    skipIf:
      "Skip it if the only thing on the machine is games. Steam, Epic and Battle.net re-download everything for free, and cloud saves already cover your progress. This is for the stuff that only exists on your PC.",
    freeAlternative:
      "An external drive and Windows File History costs you once and works offline — it just won't survive the flood, fire or theft that takes the PC and the drive sitting next to it.",
  },
  {
    key: "hosting",
    name: "BisectHosting",
    tag: "Game servers",
    icon: "⛁",
    accent: "accent",
    href: BISECT,
    oneline: "A Minecraft or game server that stays up when your PC is off.",
    what:
      "Rented server hardware with a control panel — pick a game, pick how much RAM, and you get an address your friends can connect to. Modpacks install from a dropdown rather than by hand.",
    why:
      "Hosting off your own machine works fine until you want to sleep. A rented box means the world keeps running, everyone's ping is roughly equal instead of everyone-but-you being penalised, and your upload bandwidth stops being the bottleneck.",
    price: "Budget plans start in the low single-digit dollars per month; modded packs want more RAM and cost more.",
    skipIf:
      "Skip it if it's you and two friends who only play when you're all online anyway. Hosting from the PC you already built costs nothing.",
    freeAlternative:
      "Run the server locally and use a tunnel like playit.gg if you'd rather not touch port forwarding. It's free, it just dies when your PC does.",
  },
  {
    key: "vpn",
    name: "NordVPN",
    tag: "VPN",
    icon: "⛨",
    accent: "warn",
    href: VPN,
    oneline: "Hides your home IP address. Does not make games faster.",
    what:
      "Your connection gets routed through one of their servers first, so the sites and games you connect to see that server's address instead of your home one, and your ISP can't see which sites you're reaching.",
    why:
      "Three situations where it earns its money: you play peer-to-peer games where other players can pull your IP out of the lobby and knock you offline; you use a laptop on hotel, campus or café Wi-Fi; or you want to reach a store, catalogue or service that's region-locked away from you.",
    price: "Roughly $3–5/month on a multi-year plan, more month-to-month.",
    skipIf:
      "Skip it if you're buying it for gaming performance. This is the one we get asked about most and the honest answer is no.",
    freeAlternative:
      "For the DDoS worry specifically, most modern shooters run on dedicated servers where nobody can see your address anyway — check before you spend.",
    /* This is the claim we refuse to repeat. It goes on the card, in bold, in
       the same size as everything else. */
    warning:
      "A VPN will not lower your ping. It sends your traffic further, through an extra machine, before it reaches the game — that adds latency, it doesn't remove it. The only exception is the narrow case where your ISP is routing you badly or throttling a specific service, and that's worth testing before you assume it. Anyone advertising a VPN as a way to get better frame rates or lower ping is selling you something.",
  },
];

export const PARTNERS_BY_KEY = PARTNERS.reduce((m, p) => ((m[p.key] = p), m), {});
