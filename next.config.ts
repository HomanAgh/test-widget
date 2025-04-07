import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  productionBrowserSourceMaps: false,

  serverRuntimeConfig: {
    hostname: 'localhost.st', 
  },

    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'files.eliteprospects.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'www.eliteprospects.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'eliteprospects.com',
          pathname: '/**',
        }
      ]
  },

  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-widget-id, User-Agent" },
        ]
      }
    ]
  }
};

export default nextConfig;
