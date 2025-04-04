"use client";

import React from "react";
import Link from "next/link";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import Header from "@/app/components/Header";
import PoweredBy from "@/app/components/common/style/PoweredBy";

const EmbedDocs = () => {
  return (
    <PageWrapper>
      <Header currentPath="/embed/docs" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Widget Embedding Documentation</h1>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">New: Direct Script Implementation</h2>
          <p className="text-blue-700 mb-3">
            Our new direct script implementation provides better integration with your website, improved performance, 
            and a more seamless user experience.
          </p>
          <Link 
            href="/embed/docs/direct-script" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Direct Script Documentation
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Available Implementation Methods</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center mr-2 text-xs">✓</span>
              Direct Script (Recommended)
            </h3>
            <p className="text-gray-700 mb-4">Embed widgets directly on your page without iframes for better integration.</p>
            <Link 
              href="/embed/docs/direct-script" 
              className="text-blue-600 hover:underline font-medium"
            >
              View Documentation →
            </Link>
          </div>
          
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-xl font-semibold mb-2 flex items-center">
              <span className="inline-block w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center mr-2 text-xs">i</span>
              iframe Embedding (Legacy)
            </h3>
            <p className="text-gray-700 mb-4">The traditional way to embed widgets using iframes.</p>
            <Link 
              href="/embed/docs/iframe" 
              className="text-blue-600 hover:underline font-medium"
            >
              View Documentation →
            </Link>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Example Implementation</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-8">
          <pre className="text-sm">
{`<!-- Player Widget -->
<div 
  class="ep-widget" 
  data-widget-type="player" 
  data-player-id="38703"
  data-game-limit="5"
  data-view-mode="stats"
  data-background-color="#052D41"
  data-text-color="#000000"
></div>

<!-- Widget Loader Script (place at the end of the body) -->
<script src="https://eliteprospects.com/widget-loader-combined.js"></script>`}
          </pre>
        </div>
        
        <div className="flex justify-center">
          <Link 
            href="/widget-test.html" 
            target="_blank"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold"
          >
            Test Widget Implementation
          </Link>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default EmbedDocs; 