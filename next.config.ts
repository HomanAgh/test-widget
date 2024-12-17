import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  productionBrowserSourceMaps: false,

  // Configuration for server-side runtime
  serverRuntimeConfig: {
    hostname: 'localhost.st', // Custom hostname
  },

    images: {
      //domains: ['files.eliteprospects.com'], // Add the external domain here
  },
};

export default nextConfig;
