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
        
        <div className="mb-8">
          <p className="mb-4">
            Our widgets can be embedded on any website using either an iframe or a script tag. 
            This documentation explains how to use both methods and customize the widgets to fit your needs.
          </p>
          <Link href="/embed/demo" className="text-blue-600 hover:underline">
            View live demos →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">iframe Embedding</h2>
            <p className="mb-4">
              The simplest way to embed our widgets is using an iframe. This method works on any website and gives you full control over the dimensions.
            </p>
            <h3 className="text-lg font-medium mb-2">Basic Example:</h3>
            <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto mb-4">
              {`<iframe
src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/embed/player?playerId=8478402" 
width="100%"
eight="600px"
frameborder="0"
></iframe>`}
            </pre>
            <p className="text-sm text-gray-600">
              The iframe method is compatible with all browsers and doesn't require any JavaScript on your page.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Script Tag Embedding</h2>
            <p className="mb-4">
              For more flexibility, you can use our script tag method. This approach automatically handles responsive sizing.
            </p>
            <h3 className="text-lg font-medium mb-2">Basic Example:</h3>
            <pre className="bg-gray-800 text-white p-3 rounded-md text-sm overflow-x-auto mb-4">
              {`<script 
src="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/widget-embed.js" 
data-widget-type="player"
data-player-id="8478402"
data-width="100%"
data-height="600px"
></script>`}
            </pre>
            <p className="text-sm text-gray-600">
              The script tag automatically creates an iframe and handles the responsive behavior.
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Widget Types & Parameters</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Player Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">playerId</td>
                  <td className="border border-gray-300 px-4 py-2">The unique ID of the player</td>
                  <td className="border border-gray-300 px-4 py-2">8478402</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">gameLimit</td>
                  <td className="border border-gray-300 px-4 py-2">Number of games to display (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">viewMode</td>
                  <td className="border border-gray-300 px-4 py-2">Display mode (stats or games)</td>
                  <td className="border border-gray-300 px-4 py-2">stats</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">showSummary</td>
                  <td className="border border-gray-300 px-4 py-2">Whether to show the summary section</td>
                  <td className="border border-gray-300 px-4 py-2">true</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">headerTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Team Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">teamId</td>
                  <td className="border border-gray-300 px-4 py-2">The unique ID of the team</td>
                  <td className="border border-gray-300 px-4 py-2">18741</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">headerTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">League Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">leagueSlug</td>
                  <td className="border border-gray-300 px-4 py-2">The slug identifier for the league</td>
                  <td className="border border-gray-300 px-4 py-2">nhl</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">headerTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Scoring Leaders Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">leagueSlug</td>
                  <td className="border border-gray-300 px-4 py-2">The slug identifier for the league</td>
                  <td className="border border-gray-300 px-4 py-2">nhl</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">season</td>
                  <td className="border border-gray-300 px-4 py-2">The season to display</td>
                  <td className="border border-gray-300 px-4 py-2">2024-2025</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">headerTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Goalie Leaders Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">leagueSlug</td>
                  <td className="border border-gray-300 px-4 py-2">The slug identifier for the league</td>
                  <td className="border border-gray-300 px-4 py-2">nhl</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">season</td>
                  <td className="border border-gray-300 px-4 py-2">The season to display</td>
                  <td className="border border-gray-300 px-4 py-2">2024-2025</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">headerTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Alumni Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">teamIds</td>
                  <td className="border border-gray-300 px-4 py-2">Comma-separated team IDs</td>
                  <td className="border border-gray-300 px-4 py-2">18741</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">leagues</td>
                  <td className="border border-gray-300 px-4 py-2">Comma-separated league slugs to filter by</td>
                  <td className="border border-gray-300 px-4 py-2">nhl,shl,ahl,khl</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">teams</td>
                  <td className="border border-gray-300 px-4 py-2">Youth team names (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">San Jose Barracuda</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Tournament Alumni Widget</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tournaments</td>
                  <td className="border border-gray-300 px-4 py-2">Comma-separated tournament slugs</td>
                  <td className="border border-gray-300 px-4 py-2">brick-invitational</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">leagues</td>
                  <td className="border border-gray-300 px-4 py-2">Comma-separated league slugs to filter by</td>
                  <td className="border border-gray-300 px-4 py-2">nhl,ahl</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">backgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#052D41</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">textColor</td>
                  <td className="border border-gray-300 px-4 py-2">Text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#000000</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">tableBackgroundColor</td>
                  <td className="border border-gray-300 px-4 py-2">Table background color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">headerTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Header text color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#FFFFFF</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">nameTextColor</td>
                  <td className="border border-gray-300 px-4 py-2">Player name link color (optional)</td>
                  <td className="border border-gray-300 px-4 py-2">#0D73A6</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
          <h2 className="text-xl font-semibold mb-4">Advanced Usage</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Responsive Design</h3>
            <p className="mb-4">
              Both embedding methods support responsive design. For best results:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Set width to 100% to make the widget fill its container</li>
              <li className="mb-2">For script embedding, you can omit the height to allow automatic height adjustment</li>
              <li className="mb-2">For iframe embedding, a fixed height is recommended (e.g., 600px)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Troubleshooting</h3>
            <p className="mb-4">
              If you encounter issues with the widgets:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Ensure the parameters are correctly formatted</li>
              <li className="mb-2">Check that the IDs used are valid</li>
              <li className="mb-2">For script embedding, verify that JavaScript is enabled</li>
              <li className="mb-2">If using Content Security Policy (CSP), ensure our domain is allowed</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="mb-4">
            If you need assistance with embedding our widgets or have any questions, please contact our support team.
          </p>
          <Link href="/contact" className="inline-flex items-center px-4 py-2 bg-[#0B9D52] text-white rounded-md hover:bg-green-700 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Contact Support
          </Link>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default EmbedDocs; 