"use client";

import React from "react";
import Link from "next/link";

export default function IframeEmbedDocs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">iframe Widget Embedding (Legacy)</h1>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-8 border border-yellow-200">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">Legacy Implementation</h2>
        <p className="text-yellow-700 mb-3">
          This is the traditional method for embedding EliteProspects widgets using iframes. 
          While still supported, we recommend using our new 
          <Link href="/embed/docs/direct-script" className="text-blue-600 underline ml-1">
            direct script implementation
          </Link> for better integration.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Basic iframe Implementation</h2>
        <p className="mb-4">
          To embed a widget using an iframe, insert the following code into your HTML:
        </p>
        
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <pre className="text-sm">
{`<!-- Player Widget iframe -->
<iframe 
  src="https://eliteprospects.com/embed/player?playerId=38703&gameLimit=5&viewMode=stats"
  width="100%" 
  height="600" 
  frameborder="0"
  scrolling="no">
</iframe>`}
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Widget Types and Parameters</h2>
        <p className="mb-4">Different widget types require different URL parameters:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Widget Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Base URL</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Required Parameters</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Optional Parameters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Player</td>
                <td className="border border-gray-300 px-4 py-2"><code>.../embed/player</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>playerId</code></td>
                <td className="border border-gray-300 px-4 py-2">
                  <code>gameLimit</code>, <code>viewMode</code>, <code>showSummary</code>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Team</td>
                <td className="border border-gray-300 px-4 py-2"><code>.../embed/team</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>teamId</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">League</td>
                <td className="border border-gray-300 px-4 py-2"><code>.../embed/league</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>leagueSlug</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Scoring Leaders</td>
                <td className="border border-gray-300 px-4 py-2"><code>.../embed/scoring-leaders</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>leagueSlug</code>, <code>season</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Goalie Leaders</td>
                <td className="border border-gray-300 px-4 py-2"><code>.../embed/goalie-leaders</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>leagueSlug</code>, <code>season</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Styling Parameters</h2>
        <p className="mb-4">All widgets support these styling parameters as URL query parameters:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>backgroundColor</code></td>
                <td className="border border-gray-300 px-4 py-2">Widget background color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#052D41</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>textColor</code></td>
                <td className="border border-gray-300 px-4 py-2">Text color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#000000</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>tableBackgroundColor</code></td>
                <td className="border border-gray-300 px-4 py-2">Table background color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#FFFFFF</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>headerTextColor</code></td>
                <td className="border border-gray-300 px-4 py-2">Header text color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#FFFFFF</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>nameTextColor</code></td>
                <td className="border border-gray-300 px-4 py-2">Name text color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#0D73A6</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">iframe Sizing Considerations</h2>
        <p className="mb-4">
          When embedding using iframes, keep the following considerations in mind:
        </p>
        <ul className="list-disc pl-8 mb-6">
          <li className="mb-2">Set <code>width="100%"</code> for responsive behavior (recommended)</li>
          <li className="mb-2">The <code>height</code> attribute needs to be set properly for your content</li>
          <li className="mb-2">Set <code>frameborder="0"</code> to avoid iframe borders</li>
          <li className="mb-2">Set <code>scrolling="no"</code> to avoid scrollbars within the iframe</li>
        </ul>
        <p className="mb-4">
          Different widgets may require different heights. You may need to adjust the height based on your specific use case.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Advanced Implementation Examples</h2>
        
        <h3 className="text-xl font-semibold mb-3">Player Widget with Custom Styling</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <pre className="text-sm">
{`<iframe 
  src="https://eliteprospects.com/embed/player?playerId=38703&gameLimit=5&viewMode=stats&backgroundColor=%23052D41&textColor=%23FFFFFF&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFD700&nameTextColor=%2389CFF0"
  width="100%" 
  height="600" 
  frameborder="0"
  scrolling="no">
</iframe>`}
          </pre>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">Scoring Leaders Widget</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <pre className="text-sm">
{`<iframe 
  src="https://eliteprospects.com/embed/scoring-leaders?leagueSlug=nhl&season=2023-2024&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="800" 
  frameborder="0"
  scrolling="no">
</iframe>`}
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">URL Encoding</h2>
        <p className="mb-4">
          When using colors in hexadecimal format, remember to properly URL encode the # symbol as %23.
          For example, <code>#052D41</code> becomes <code>%23052D41</code> in the URL.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recommendation</h2>
        <p className="mb-4">
          While iframe embedding is still supported, we recommend using our new 
          <Link href="/embed/docs/direct-script" className="text-blue-600 underline mx-1">
            direct script implementation
          </Link> 
          for better integration, improved performance, and a more seamless user experience.
        </p>
      </section>
    </div>
  );
} 