/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["*.scdn.co"],
  },
};

module.exports = nextConfig;
