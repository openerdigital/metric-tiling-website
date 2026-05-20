/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const securityHeaders = require("./securityHeaders");
const redirects = require("./redirects.next");

require("dotenv").config();
// eslint-disable-next-line import/order
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Remote image/poster/thumbnail hosts. This does not add iframe/embed support
// for YouTube/Vimeo URLs by itself.
const domains = [
  "picsum.photos",
  "www.pexels.com",
  "img.youtube.com",
  "i.ytimg.com",
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "vimeo.com",
  "player.vimeo.com",
  "i.vimeocdn.com",
];

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
    minimumCacheTTL: 63072000,
    deviceSizes: [640, 1024, 1200, 1920, 3840],
    imageSizes: [], // Empty array to prevent default image sizes
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
          },
        },
      ],
    });
    return config;
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return redirects;
  },
};

module.exports = async (phase) =>
  withPlugins([withBundleAnalyzer], nextConfig)(phase, {
    undefined,
  });
