/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // AMAZON_ASSOCIATE_TAG is server-only on purpose — it must never end up in the
  // browser bundle. But the disclosure copy has to know whether the Amazon side
  // is live yet, on pages that render in the browser too. So we inline a bare
  // yes/no at build time and nothing else: the tag itself still never leaves the
  // server. Set the tag in the host's environment and every "we earn commission"
  // sentence on the site turns itself back on at the next build.
  env: {
    AMAZON_AFFILIATE_ACTIVE: process.env.AMAZON_ASSOCIATE_TAG ? "1" : "",
  },
  // Amazon product images are served from these hosts — allow Next.js <Image> and
  // plain <img> tags to load them. (We use plain <img> to keep things simple.)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "images-na.ssl-images-amazon.com" },
    ],
  },
};
module.exports = nextConfig;
