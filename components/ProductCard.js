// A single product tile — photo, price, direct buy link.
//
// The photo and the link both go through components/Product.js rather than
// being written out here, because both can fail in public: a dead Amazon image
// draws a broken-image icon, and a row that isn't a real listing yet would
// otherwise link to Amazon's "we couldn't find that page". See that file.
import { BuyButton, ProductImage, ProductLink } from "./Product";

export default function ProductCard({ p }) {
  const disc = p.was && p.price && p.was > p.price ? Math.round((1 - p.price / p.was) * 100) : 0;
  return (
    <div className="prod">
      <ProductLink p={p} className="imgwrap">
        {disc > 0 && <span className="disc">-{disc}%</span>}
        <ProductImage p={p} alt={p.title} />
      </ProductLink>
      <div className="title">{p.title}</div>
      {p.rating ? <div className="rating">★ {p.rating.toFixed(1)}</div> : null}
      <div>
        <span className="price">{p.price != null ? "$" + p.price.toFixed(2) : "See price"}</span>
        {disc > 0 && <span className="was">${p.was.toFixed(2)}</span>}
      </div>
      <BuyButton p={p} className="btn amazon sm buy" label="View on Amazon →" />
    </div>
  );
}
