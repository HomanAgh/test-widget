import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,

  // Configuration for server-side runtime
  serverRuntimeConfig: {
    hostname: 'localhost.st', // Custom hostname
  },

};

export default nextConfig;
