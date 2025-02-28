import React from "react";
import Link from "next/link";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import Header from "@/app/components/Header";
import PoweredBy from "@/app/components/common/style/PoweredBy";

const EmbedHome = () => {
  return (
    <PageWrapper>
      <Header currentPath="/embed" />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Widget Embed System</h1>
          <p className="text-xl text-gray-600 mb-8">
            Easily embed our widgets on any website with a script tag or iframe
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
            <p className="text-gray-600 mb-6">
              Learn how to embed our widgets on your website with detailed instructions and examples.
            </p>
            <Link 
              href="/embed/docs" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              View Documentation
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Live Demo</h2>
            <p className="text-gray-600 mb-6">
              See our widgets in action and get code snippets you can copy and paste into your website.
            </p>
            <Link 
              href="/embed/demo" 
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
            >
              View Demo
            </Link>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Available Widgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Player Widget</h3>
              <p className="text-gray-600">Display player statistics and information.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Team Widget</h3>
              <p className="text-gray-600">Show team roster and performance data.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">League Widget</h3>
              <p className="text-gray-600">Display league standings and statistics.</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Alumni Widget</h3>
              <p className="text-gray-600">Showcase alumni from your organization.</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Script Tag Embed</h2>
            <p className="mb-4">Add this script to your website for automatic responsive height adjustment:</p>
            <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
              <pre className="text-sm">
                {`<script 
                  src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/widget-embed.js" 
                  data-widget-type="player"
                  data-player-id="8478402"
                  data-width="100%"
                  data-height="600px"
                ></script>`}
              </pre>
            </div>
            <div className="text-center">
              <Link 
                href="/embed/docs" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Direct iframe Embed</h2>
            <p className="mb-4">Or use a direct iframe for more control over the embedding process:</p>
            <div className="bg-gray-800 text-white p-4 rounded-md mb-6 overflow-x-auto">
              <pre className="text-sm">
                {`<iframe
                  src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'}/embed/player?playerId=8478402" 
                  width="100%"
                  height="600px"
                  frameborder="0"
                ></iframe>`}
              </pre>
            </div>
            <div className="text-center">
              <Link 
                href="/embed/demo" 
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
              >
                See Examples
              </Link>
            </div>
          </div>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default EmbedHome; 