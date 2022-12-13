/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // trueに設定する
    externalDir: true,
  },
}

module.exports = nextConfig
