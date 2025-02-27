"use client";

import React from "react";
import Link from "next/link";

const EmbedDemo = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Widget Embed Demo</h1>
      
      <p className="mb-6">
        This page demonstrates how to embed widgets from our application into your website.
        For detailed documentation, please visit the{" "}
        <Link href="/embed/docs" className="text-blue-600 hover:underline">
          documentation page
        </Link>.
      </p>
      
      <div className="bg-blue-50 p-6 rounded-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Embedding Options</h2>
        <p className="mb-4">
          You can embed our widgets using either a script tag or a direct iframe. Each example below shows both options.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Script Tag</h3>
            <p>Automatically handles responsive height adjustment and creates an iframe for you.</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Direct iframe</h3>
            <p>Gives you more control over the embedding process.</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        <div className="border border-gray-300 rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Player Widget</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Code Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Script Tag</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<script 
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/widget-embed.js" 
  data-widget-type="player"
  data-player-id="38703"
  data-game-limit="5"
  data-view-mode="stats"
  data-show-summary="true"
  data-width="100%"
  data-height="600px"
></script>`}
                </pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">iframe</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<iframe
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/embed/player?playerId=38703&gameLimit=5&viewMode=stats&showSummary=true" 
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <iframe
                src="/embed/player?playerId=38703&gameLimit=5&viewMode=stats&showSummary=true"
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Team Widget</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Code Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Script Tag</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<script 
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/widget-embed.js" 
  data-widget-type="team"
  data-team-id="18741"
  data-width="100%"
  data-height="600px"
></script>`}
                </pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">iframe</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<iframe
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/embed/team?teamId=18741" 
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <iframe
                src="/embed/team?teamId=18741"
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">League Widget</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Code Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Script Tag</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<script 
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/widget-embed.js" 
  data-widget-type="league"
  data-league-slug="nhl"
  data-width="100%"
  data-height="600px"
></script>`}
                </pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">iframe</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<iframe
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/embed/league?leagueSlug=nhl" 
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <iframe
                src="/embed/league?leagueSlug=nhl"
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
        
        <div className="border border-gray-300 rounded-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Alumni Widget</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Code Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">Script Tag</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<script 
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/widget-embed.js" 
  data-widget-type="alumni"
  data-team-ids="18741"
  data-leagues="nhl,shl,ahl,khl"
  data-teams="San Jose Barracuda"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-name-text-color="#0D73A6"
  data-width="100%"
  data-height="600px"
></script>`}
                </pre>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">iframe</h4>
                <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto">
                  {`<iframe
  src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/embed/alumni?teamIds=18741&leagues=nhl,shl,ahl,khl&teams=San%20Jose%20Barracuda&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&nameTextColor=%230D73A6" 
  width="100%"
  height="600px"
  frameborder="0"
></iframe>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Live Preview</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <iframe
                src="/embed/alumni?teamIds=18741&leagues=nhl,shl,ahl,khl&teams=San%20Jose%20Barracuda&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&nameTextColor=%230D73A6"
                width="100%"
                height="600px"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-md mb-8">
        <h2 className="text-xl font-semibold mb-2">How to Use</h2>
        <ol className="list-decimal pl-6">
          <li className="mb-2">Choose either the script tag or iframe approach based on your needs.</li>
          <li className="mb-2">Copy the code for the widget you want to embed.</li>
          <li className="mb-2">Paste it into your HTML where you want the widget to appear.</li>
          <li className="mb-2">Adjust the parameters as needed for your specific use case.</li>
          <li className="mb-2">The script tag approach will automatically resize to fit content.</li>
        </ol>
      </div>
      
      <p className="text-center">
        <Link href="/embed/docs" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          View Full Documentation
        </Link>
      </p>
    </div>
  );
};

export default EmbedDemo; 