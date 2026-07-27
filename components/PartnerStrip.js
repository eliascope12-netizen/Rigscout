import Link from "next/link";
import { PARTNERS } from "../lib/partners";

/* The compact version — three one-liners, no pitch. It appears under a
   finished build, where the job is to mention these exist and then get out of
   the way. The full write-ups, including who should skip each one, live on
   /extras and that's where the link goes. */
export default function PartnerStrip({ title = "Worth thinking about after it's built" }) {
  return (
    <div className="pstrip">
      <div className="ps-h">{title}</div>
      <p className="ps-sub">
        Not parts, and not urgent. Every one of these has a page explaining who should skip it.
      </p>
      {PARTNERS.map((p) => (
        <a
          key={p.key}
          className="ps-row"
          href={p.href}
          target="_blank"
          rel="nofollow sponsored noopener"
        >
          <span className={"ps-ico " + p.accent}>{p.icon}</span>
          <span className="ps-mid">
            <strong>{p.name}</strong>
            <em>{p.oneline}</em>
          </span>
          <span className="ps-go">↗</span>
        </a>
      ))}
      <Link href="/extras" className="ps-more">
        Read the full rundown, caveats included →
      </Link>
      <div className="ps-disc">
        These are affiliate links. They cost you nothing extra and they don&apos;t change what we
        recommend — <Link href="/disclosure" className="ilink">how that works</Link>.
      </div>
    </div>
  );
}
