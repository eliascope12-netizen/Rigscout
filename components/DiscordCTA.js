import { DISCORD_INVITE } from "../lib/partners";

export function DiscordIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.349-1.22.645-1.873.891a.077.077 0 0 0-.041.107c.36.699.772 1.364 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.056c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.028zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.946 2.419-2.157 2.419z" />
    </svg>
  );
}

/* variant="section" — the big card used on the home page and /extras
   variant="box"     — the narrow one that sits in the builder sidebar        */
export default function DiscordCTA({ variant = "section" }) {
  if (variant === "box") {
    return (
      <a className="discbox" href={DISCORD_INVITE} target="_blank" rel="noopener">
        <span className="db-ico"><DiscordIcon size={20} /></span>
        <span className="db-mid">
          <strong>Second opinion on this build?</strong>
          <em>Post it in the Discord — someone will look it over.</em>
        </span>
        <span className="db-go">→</span>
      </a>
    );
  }

  return (
    <section className="disc-cta">
      <div className="dc-l">
        <span className="dc-badge"><DiscordIcon size={15} /> Discord</span>
        <h2>There&apos;s a room full of people doing exactly this</h2>
        <p>
          The RigScout Discord is where builds get a second pair of eyes before the money goes out.
          Post your parts list in <strong>#build-help</strong>, ask whether two specific components
          play nicely in <strong>#compatibility-questions</strong>, show off the finished machine in{" "}
          <strong>#build-showcase</strong>, or drop a genuinely good price in{" "}
          <strong>#deal-alerts</strong>. No affiliate spam in there — just prices worth sharing.
        </p>
        <div className="btns">
          <a className="btn discord" href={DISCORD_INVITE} target="_blank" rel="noopener">
            <DiscordIcon /> Join the Discord
          </a>
        </div>
      </div>
      <ul className="dc-r">
        <li><span>#</span>build-help</li>
        <li><span>#</span>compatibility-questions</li>
        <li><span>#</span>build-showcase</li>
        <li><span>#</span>deal-alerts</li>
        <li><span>#</span>introductions</li>
      </ul>
    </section>
  );
}
