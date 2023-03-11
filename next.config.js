/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*r2.dev",
      },
    ],
    domains: [
      "https://pub-adaebb95357d425c8801f60e07ee54e4.r2.dev",
      "avatars.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
