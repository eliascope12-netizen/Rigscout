// ============================================================================
// GUIDE BLOCK RENDERER
// ----------------------------------------------------------------------------
// Articles in lib/guides.js are stored as arrays of typed blocks rather than as
// markdown. This is the only thing that turns them into HTML.
//
// Why not markdown: a parser is a dependency, and a dependency that renders
// arbitrary strings into a page is the kind of thing that turns into an
// injection bug later. Every block type here maps to a fixed element with no
// dangerouslySetInnerHTML anywhere, so an article can never inject markup even
// if someone pastes something odd into it.
//
// Unknown block types render as nothing rather than crashing the page — a typo
// in an article should cost a paragraph, not the whole site.
// ============================================================================
import Link from "next/link";
import { CATS } from "../lib/catalog";

function Shelf({ cat, text }) {
  const meta = CATS[cat];
  if (!meta) return null;
  return (
    <div className="g-shelf">
      <p>{text}</p>
      <Link href={`/parts/${cat}`} className="btn sm">
        Browse {meta.plural.toLowerCase()} →
      </Link>
    </div>
  );
}

export default function GuideBlocks({ blocks }) {
  return (
    <div className="g-body">
      {blocks.map((b, i) => {
        if (b.h) return <h2 key={i}>{b.h}</h2>;
        if (b.p) return <p key={i}>{b.p}</p>;
        if (b.note)
          return (
            <aside key={i} className="g-note">
              <span className="g-mark">i</span>
              <p>{b.note}</p>
            </aside>
          );
        if (b.warn)
          return (
            <aside key={i} className="g-note g-warn">
              <span className="g-mark">!</span>
              <p>{b.warn}</p>
            </aside>
          );
        if (b.list)
          return (
            <ul key={i} className="g-list">
              {b.list.map((x, j) => (
                <li key={j}>{x}</li>
              ))}
            </ul>
          );
        if (b.steps)
          return (
            <ol key={i} className="g-steps">
              {b.steps.map((x, j) => (
                <li key={j}>{x}</li>
              ))}
            </ol>
          );
        if (b.table)
          return (
            <div key={i} className="g-tablewrap">
              <table className="g-table">
                <thead>
                  <tr>
                    {b.table.head.map((h, j) => (
                      <th key={j}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.table.rows.map((r, j) => (
                    <tr key={j}>
                      {r.map((c, k) => (
                        <td key={k}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        if (b.shelf) return <Shelf key={i} cat={b.shelf} text={b.text} />;
        return null;
      })}
    </div>
  );
}
