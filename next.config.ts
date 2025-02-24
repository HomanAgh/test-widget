import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  productionBrowserSourceMaps: false,

  serverRuntimeConfig: {
    hostname: 'localhost.st', 
  },

    images: {
      domains: ['files.eliteprospects.com'], 
  },
};

export default nextConfig;
