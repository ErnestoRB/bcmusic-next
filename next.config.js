// const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
    ],
  },
  /* webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
     if (isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: "vm", to: "pages/" }],
        })
      );
    } 
    return config;
  },*/
};

module.exports = nextConfig;
