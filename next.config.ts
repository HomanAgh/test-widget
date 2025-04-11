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
    // Create standard CORS headers with only valid HTTP header names
    const corsHeaders = [
      { key: "Access-Control-Allow-Credentials", value: "true" },
      { key: "Access-Control-Allow-Origin", value: "*" },
      { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
      { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-widget-id, User-Agent, Authorization, Origin, Referer, Cookie, Set-Cookie" },
      { key: "Access-Control-Max-Age", value: "86400" }
    ];
    
    return [
      // Special handling for OPTIONS preflight requests
      {
        source: "/(api|embed)/:path*",
        methods: ["OPTIONS"],
        headers: corsHeaders
      },
      // Matching all API routes
      {
        source: "/api/:path*",
        headers: corsHeaders
      },
      // Special handling for tournament-alumni API routes
      {
        source: "/api/tournament-alumni/:path*",
        headers: corsHeaders
      },
      // Auth session API route
      {
        source: "/api/auth/session",
        headers: corsHeaders
      },
      // Handle widget-related resources
      {
        source: "/widget-loader-combined.js",
        headers: corsHeaders
      },
      {
        source: "/embed.js",
        headers: corsHeaders
      },
      {
        source: "/widget-bundle.js",
        headers: corsHeaders
      }
    ]
  }
};

export default nextConfig;
