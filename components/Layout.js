import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DiscordIcon } from "./DiscordCTA";
import { DISCORD_INVITE, AMAZON_AFFILIATE_LIVE } from "../lib/partners";

const LINKS = [
  ["/", "Home"],
  ["/upgrade", "Upgrade Finder"],
  ["/builder", "PC Builder"],
  ["/parts", "Browse Parts"],
  ["/products", "Deals & Search"],
  ["/guides", "Guides"],
  ["/extras", "Beyond the Build"],
];

export default function Layout({ children }) {
  const { pathname } = useRouter();

  // ---------------------------------------------------------------------
  // The nav used to be a single row that turned into a horizontal scroller
  // on small screens. In practice that means six of the seven destinations
  // are off the right edge with no visible hint they exist — on a phone the
  // site looked like it had two pages. Below 860px the links now live in a
  // real menu instead.
  // ---------------------------------------------------------------------
  const [open, setOpen] = useState(false);

  // Close on navigation, otherwise the panel stays open over the new page.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Escape closes it, same as every other overlay on the site.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav className={"nav" + (open ? " open" : "")}>
        <div className="wrap">
          <Link href="/" className="brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="8" fill="#4f8cff" />
              <circle cx="14" cy="14" r="6.2" stroke="#fff" strokeWidth="2.4" />
              <line x1="18.6" y1="18.6" x2="24" y2="24" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <span>RigScout</span>
          </Link>

          <button
            className="navtoggle"
            type="button"
            aria-expanded={open}
            aria-controls="navmenu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={"burger" + (open ? " x" : "")}><i /><i /><i /></span>
            <span className="navtoggle-t">Menu</span>
          </button>

          <div className={"navlinks" + (open ? " open" : "")} id="navmenu">
            {LINKS.slice(1).map(([href, label]) => {
              const on = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
              return <Link key={href} href={href} className={"link" + (on ? " active" : "")}>{label}</Link>;
            })}
            <span className="spacer" />
            <a className="navdisc" href={DISCORD_INVITE} target="_blank" rel="noopener" title="Join the RigScout Discord">
              <DiscordIcon size={16} />
              <span>Discord</span>
            </a>
            <Link href="/upgrade" className="btn sm">Analyze my build</Link>
          </div>
        </div>
      </nav>

      {/* Tapping anywhere off the menu closes it. Rendered only when open so it
          never sits in front of the page on a desktop. */}
      {open && <button className="navscrim" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <main>{children}</main>
      <footer className="foot">
        <div className="wrap footrow">
          <span>© 2026 RigScout</span>
          {/*
            About / Privacy / Contact are here rather than tucked away because
            Associates reviewers look for them in the footer, and because a site
            that takes commission and hides who runs it has earned the suspicion
            it gets.
          */}
          <span className="footlinks">
            <a href={DISCORD_INVITE} target="_blank" rel="noopener">Discord</a>
            <Link href="/about">About</Link>
            <Link href="/guides">Guides</Link>
            <Link href="/extras">Beyond the Build</Link>
            <Link href="/disclosure">How we make money</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
          </span>
          {/*
            The Associates line is required once you're in the program — and
            forbidden before you are, because it claims a relationship with
            Amazon that doesn't exist yet. It appears the moment the tag is set.
          */}
          <span>
            {AMAZON_AFFILIATE_LIVE
              ? "As an Amazon Associate, we earn from qualifying purchases."
              : "No ads, no sponsored placements, no affiliate income yet."}
          </span>
        </div>
      </footer>
    </>
  );
}
