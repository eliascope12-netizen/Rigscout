// A single live product tile — real image, live price, direct buy link.
export default function ProductCard({ p }) {
  const disc = p.was && p.price && p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0;
  return (
    <div className="prod">
      <a className="imgwrap" href={p.url} target="_blank" rel="nofollow sponsored noopener">
        {disc > 0 && <span className="disc">-{disc}%</span>}
        <img src={p.image} alt={p.title} loading="lazy"
          onError={(e) => { e.currentTarget.style.opacity = 0.2; }} />
      </a>
      <div className="title">{p.title}</div>
      {p.rating ? <div className="rating">★ {p.rating.toFixed(1)}</div> : null}
      <div>
        <span className="price">{p.price != null ? "$" + p.price.toFixed(2) : "See price"}</span>
        {disc > 0 && <span className="was">${p.was.toFixed(2)}</span>}
      </div>
      <a className="btn amazon sm buy" href={p.url} target="_blank" rel="nofollow sponsored noopener">View on Amazon →</a>
    </div>
  );
}
