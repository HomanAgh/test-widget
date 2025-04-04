"use client";

import React from "react";

export default function DirectScriptDocs() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Direct Script Widget Implementation</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-200">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Recommended Implementation</h2>
        <p className="text-blue-700">
          The direct script implementation provides better integration with your website, improved performance, 
          and a more seamless user experience compared to iframe embedding.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Basic Implementation</h2>
        <p className="mb-4">
          To implement a widget directly on your page, add the widget container element and the loader script:
        </p>
        
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
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
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>

<!-- Widget Loader Script (place at the end of the body) -->
<script src="https://eliteprospects.com/widget-loader-combined.js"></script>`}
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Widget Types</h2>
        <p className="mb-4">Different widget types require different parameters:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Widget Type</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Required Parameters</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Optional Parameters</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>player</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-player-id</code></td>
                <td className="border border-gray-300 px-4 py-2">
                  <code>data-game-limit</code>, <code>data-view-mode</code>, <code>data-show-summary</code>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>team</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-team-id</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>league</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-league-slug</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>scoring-leaders</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-league-slug</code>, <code>data-season</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>goalie-leaders</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-league-slug</code>, <code>data-season</code></td>
                <td className="border border-gray-300 px-4 py-2">Styling parameters</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>alumni</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-selected-teams</code>, <code>data-selected-leagues</code></td>
                <td className="border border-gray-300 px-4 py-2">
                  <code>data-include-youth</code>, <code>data-selected-league-categories</code>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>tournament</code></td>
                <td className="border border-gray-300 px-4 py-2"><code>data-selected-tournaments</code>, <code>data-selected-leagues</code></td>
                <td className="border border-gray-300 px-4 py-2">
                  <code>data-selected-league-categories</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Common Styling Parameters</h2>
        <p className="mb-4">All widgets support these styling parameters:</p>
        
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
                <td className="border border-gray-300 px-4 py-2"><code>data-background-color</code></td>
                <td className="border border-gray-300 px-4 py-2">Widget background color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#052D41</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>data-text-color</code></td>
                <td className="border border-gray-300 px-4 py-2">Text color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#000000</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>data-table-background-color</code></td>
                <td className="border border-gray-300 px-4 py-2">Table background color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#FFFFFF</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>data-header-text-color</code></td>
                <td className="border border-gray-300 px-4 py-2">Header text color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#FFFFFF</code></td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2"><code>data-name-text-color</code></td>
                <td className="border border-gray-300 px-4 py-2">Name text color</td>
                <td className="border border-gray-300 px-4 py-2"><code>#0D73A6</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Advanced Implementation Examples</h2>
        
        <h3 className="text-xl font-semibold mb-3">Alumni Widget</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="alumni" 
  data-selected-teams='[{"id":"77","name":"Detroit Red Wings"}]'
  data-selected-leagues='["nhl"]'
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
  data-include-youth="false"
  data-selected-league-categories='{"junior":true,"college":true,"professional":true}'
></div>`}
          </pre>
        </div>
        
        <h3 className="text-xl font-semibold mb-3">Tournament Widget</h3>
        <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
          <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="tournament" 
  data-selected-tournaments='["world-championship-u20"]'
  data-selected-leagues='["wjc-20"]'
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
  data-selected-league-categories='{"junior":true,"college":true,"professional":true}'
></div>`}
          </pre>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Notes on JSON Parameters</h2>
        <p className="mb-4">
          Some widget types (like alumni and tournament) require JSON string parameters. Be sure to:
        </p>
        <ul className="list-disc pl-8 mb-6">
          <li className="mb-2">Use single quotes around the attribute value and double quotes inside the JSON</li>
          <li className="mb-2">Ensure your JSON is valid (proper quotes, commas, etc.)</li>
          <li className="mb-2">Arrays must be surrounded by square brackets <code>[]</code></li>
          <li className="mb-2">Objects must be surrounded by curly braces <code>{}</code></li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Testing Your Implementation</h2>
        <p className="mb-4">
          You can test your widget implementation by visiting our <a href="/widget-test.html" target="_blank" className="text-blue-600 underline">Widget Test Page</a>.
        </p>
      </section>
    </div>
  );
} 