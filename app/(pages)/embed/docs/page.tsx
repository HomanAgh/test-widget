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
        <h1 className="text-3xl font-bold mb-6">Widget Documentation</h1>
        
        <section className="mb-6 bg-blue-50 p-5 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold mb-3">How It Works</h2>
          <p className="mb-3">
            EliteProspects widgets are embedded directly into your website using a combination of:
          </p>
          <ol className="list-decimal pl-8 mb-4">
            <li className="mb-2"><strong>Widget Container:</strong> An HTML div with data attributes that define the widget type and parameters</li>
            <li className="mb-2"><strong>Widget Loader Script:</strong> A JavaScript file that processes all widget containers on your page</li>
          </ol>
          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="font-semibold text-blue-800">
              The widget loader script only needs to be included once, regardless of how many widgets you have on the page.
            </p>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Basic Implementation</h2>
          <p className="mb-4">
            Add the widget container element with data attributes and the loader script:
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
            <pre className="text-sm">
{`<!-- Widget Container -->
<div 
  class="ep-widget" 
  data-widget-type="player" 
  data-player-id="38703"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>

<!-- Widget Loader Script -->
<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Widget Types & Parameters</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Player Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-player-id</code> - EliteProspects player ID</li>
              </ul>
              
              <h4 className="font-semibold mb-2">Optional Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-game-limit</code> - Number of games to display (default: 5)</li>
                <li><code>data-view-mode</code> - Display mode: &quot;stats&quot;, &quot;seasons&quot;, &quot;career&quot;, or &quot;games&quot; (default: &quot;stats&quot;)</li>
                <li><code>data-show-summary</code> - Show game summaries: &quot;true&quot; or &quot;false&quot; (default: &quot;false&quot;)</li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="player" 
  data-player-id="38703"
  data-game-limit="5"
  data-view-mode="stats"
  data-show-summary="false"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Team Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-team-id</code> - EliteProspects team ID</li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="team" 
  data-team-id="18741"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">League Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-league-slug</code> - League identifier (e.g., &quot;nhl&quot;, &quot;shl&quot;)</li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="league" 
  data-league-slug="nhl"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Scoring Leaders Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-league-slug</code> - League identifier (e.g., &quot;nhl&quot;, &quot;shl&quot;)</li>
                <li><code>data-season</code> - Season identifier (e.g., &quot;2023-2024&quot;)</li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="scoring-leaders" 
  data-league-slug="nhl"
  data-season="2023-2024"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Goalie Leaders Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-league-slug</code> - League identifier (e.g., &quot;nhl&quot;, &quot;shl&quot;)</li>
                <li><code>data-season</code> - Season identifier (e.g., &quot;2023-2024&quot;)</li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="goalie-leaders" 
  data-league-slug="nhl"
  data-season="2023-2024"
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Alumni Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-selected-teams</code> - JSON array of team objects: <code>[{`{"id":"18741","name":"Team Name"}`}]</code></li>
                <li><code>data-selected-leagues</code> - JSON array of league slugs: <code>[&quot;nhl&quot;,&quot;shl&quot;,&quot;ahl&quot;]</code></li>
              </ul>
              
              <h4 className="font-semibold mb-2">Optional Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-include-youth</code> - Include youth players: &quot;true&quot; or &quot;false&quot; (default: &quot;false&quot;)</li>
                <li><code>data-selected-league-categories</code> - JSON object of category filters: <code>{`{"junior":true,"college":true,"professional":true}`}</code></li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="alumni" 
  data-selected-teams='[{"id":"18741","name":"San Jose Barracuda"}]'
  data-selected-leagues='["nhl","shl","ahl","khl"]'
  data-include-youth="false"
  data-selected-league-categories='{"junior":true,"college":true,"professional":true}'
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3">Tournament Widget</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Required Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-selected-tournaments</code> - JSON array of tournament slugs: <code>[&quot;world-championship-u20&quot;]</code></li>
                <li><code>data-selected-leagues</code> - JSON array of league slugs: <code>[&quot;wjc-20&quot;]</code></li>
              </ul>
              
              <h4 className="font-semibold mb-2">Optional Parameters:</h4>
              <ul className="list-disc pl-6 mb-4">
                <li><code>data-selected-league-categories</code> - JSON object of category filters: <code>{`{"junior":true,"college":true,"professional":true}`}</code></li>
              </ul>
              
              <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="tournament" 
  data-selected-tournaments='["world-championship-u20"]'
  data-selected-leagues='["wjc-20"]'
  data-selected-league-categories='{"junior":true,"college":true,"professional":true}'
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Styling Parameters</h2>
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

          <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
            <p className="text-yellow-800">
              <strong>Important:</strong> Always include all styling parameters to ensure proper display.
              The <code>data-header-text-color=&quot;#FFFFFF&quot;</code> parameter is especially important for dark backgrounds.
            </p>
          </div>
        </section>

        <section className="mb-6 bg-yellow-50 p-5 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-bold mb-3">Notes on JSON Parameters</h2>
          <p className="mb-3">
            Some widgets (Alumni and Tournament) require JSON-formatted parameters. When adding these parameters:
          </p>
          <ul className="list-disc pl-8 mb-4">
            <li className="mb-2">Use <strong>single quotes</strong> for the HTML attribute and <strong>double quotes</strong> for the JSON values</li>
            <li className="mb-2">Make sure the JSON is valid with no trailing commas</li>
            <li className="mb-2">For HTML attributes, escape apostrophes if needed (e.g., <code>data-name=&quot;San Jose\&apos;s Team&quot;</code> should be <code>data-name=&quot;San Jose\&apos;s Team&quot;</code>)</li>
          </ul>
          <div className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
            <pre className="text-sm">
{`<!-- Correct JSON formatting -->
data-selected-teams='[{"id":"18741","name":"San Jose Barracuda"}]'
data-selected-leagues='["nhl","shl","ahl"]'
data-selected-league-categories='{"junior":true,"college":true,"professional":true}'`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">JavaScript Implementation</h2>
          <p className="mb-4">
            For dynamic widget creation, you can add widgets programmatically:
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
            <pre className="text-sm">
{`// Create widget container
const widget = document.createElement("div");
widget.className = "ep-widget";
widget.dataset.widgetType = "player";
widget.dataset.playerId = "38703";
widget.dataset.backgroundColor = "#052D41";
widget.dataset.textColor = "#000000";
widget.dataset.tableBackgroundColor = "#FFFFFF";
widget.dataset.headerTextColor = "#FFFFFF";
widget.dataset.nameTextColor = "#0D73A6";

// Add to page
document.getElementById("widget-container").appendChild(widget);

// Load widget script (if not already loaded)
if (!document.querySelector('script[src*="widget-loader-combined.js"]')) {
  const script = document.createElement("script");
  script.src = "https://widget.eliteprospects.com/widget-loader-combined.js";
  document.body.appendChild(script);
}`}
            </pre>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Development vs Production</h2>
          <p className="mb-4">
            During development, you may want to use the development version of the widget loader:
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
            <pre className="text-sm">
{`<!-- Development environment -->
<script src="https://dev-widget.eliteprospects.com/widget-loader-combined.js"></script>

<!-- Production environment -->
<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
            </pre>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
            <ul className="list-disc pl-6 text-yellow-800">
              <li className="mb-1">Always test thoroughly before deploying to production.</li>
              <li className="mb-1">For JSON parameters, use single quotes (&apos;) for the HTML attribute and double quotes (&quot;) inside the JSON.</li>
            </ul>
          </div>
        </section>

        <div className="flex justify-center mb-8">
          <Link 
            href="/embed/demo" 
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold"
          >
            View Widget Demo
          </Link>
        </div>
        
        <div className="flex justify-center mb-8">
          <Link 
            href="/widget-test.html" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-semibold"
          >
            Test Widgets Yourself
          </Link>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default EmbedDocs; 