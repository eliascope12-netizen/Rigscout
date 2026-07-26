import Link from "next/link";
import { useRouter } from "next/router";

const LINKS = [
  ["/", "Home"],
  ["/upgrade", "Upgrade Finder"],
  ["/builder", "PC Builder"],
  ["/parts", "Browse Parts"],
  ["/products", "Deals & Search"],
  ["/guides", "Guides"],
];

export default function Layout({ children }) {
  const { pathname } = useRouter();
  return (
    <>
      <nav className="nav">
        <div className="wrap">
          <Link href="/" className="brand">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="28" height="28" rx="8" fill="#4f8cff" />
              <circle cx="14" cy="14" r="6.2" stroke="#fff" strokeWidth="2.4" />
              <line x1="18.6" y1="18.6" x2="24" y2="24" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
            <span>RigScout</span>
          </Link>
          {LINKS.slice(1).map(([href, label]) => {
            const on = pathname === href || (href !== "/" && pathname.startsWith(href + "/"));
            return <Link key={href} href={href} className={"link" + (on ? " active" : "")}>{label}</Link>;
          })}
          <span className="spacer" />
          <Link href="/upgrade" className="btn sm">Analyze my build</Link>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="foot">
        <div className="wrap" style={{ display: "flex", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: 10 }}>
          <span>© 2026 RigScout</span>
          <span>As an Amazon Associate, we earn from qualifying purchases.</span>
        </div>
      </footer>
    </>
  );
}
