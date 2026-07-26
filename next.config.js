/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
