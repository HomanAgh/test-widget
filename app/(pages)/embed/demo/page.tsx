"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import PageWrapper from "@/app/components/common/style/PageWrapper";
import Header from "@/app/components/Header";
import PoweredBy from "@/app/components/common/style/PoweredBy";

const EmbedDemo = () => {
  // Load the widget script once the component is mounted
  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/widget-loader-combined.js?dev=true'
      : 'https://widget.eliteprospects.com/widget-loader-combined.js';
    document.body.appendChild(script);
    
    return () => {
      // Clean up script tag when component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);
  
  return (
    <PageWrapper>
      <Header currentPath="/embed/demo" />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-6">Widget Demo</h1>
        
        <p className="mb-6">
          This page demonstrates the different widget types available for embedding.
          For detailed documentation, visit the{" "}
          <Link href="/embed/docs" className="text-blue-600 hover:underline">
            documentation page
          </Link>.
        </p>
        
        <div className="grid grid-cols-1 gap-8 mb-10">
          {/* Player Widget */}
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Player Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">Script Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
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
></div>

<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg" style={{ minHeight: "450px" }}>
                  {/* Widget will be loaded by the script at the bottom of the page */}
                  <div 
                    className="ep-widget" 
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
                  ></div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">iframe Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<iframe 
  src="/embed/player?playerId=38703&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="500px"
  frameBorder="0"
></iframe>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <iframe 
                    src="/embed/player?playerId=38703&gameLimit=5&viewMode=stats&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
                    width="100%" 
                    height="450px"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Team Widget */}
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Team Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">Script Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
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
></div>

<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg" style={{ minHeight: "450px" }}>
                  <div 
                    className="ep-widget" 
                    data-widget-type="team" 
                    data-team-id="18741"
                    data-background-color="#052D41"
                    data-text-color="#000000"
                    data-table-background-color="#FFFFFF"
                    data-header-text-color="#FFFFFF"
                    data-name-text-color="#0D73A6"
                  ></div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">iframe Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<iframe 
  src="/embed/team?teamId=18741&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="500px"
  frameBorder="0"
></iframe>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <iframe 
                    src="/embed/team?teamId=18741&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
                    width="100%" 
                    height="450px"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Scoring Leaders Widget */}
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Scoring Leaders Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">Script Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
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
></div>

<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg" style={{ minHeight: "450px" }}>
                  <div 
                    className="ep-widget" 
                    data-widget-type="scoring-leaders" 
                    data-league-slug="nhl"
                    data-season="2023-2024"
                    data-background-color="#052D41"
                    data-text-color="#000000"
                    data-table-background-color="#FFFFFF"
                    data-header-text-color="#FFFFFF"
                    data-name-text-color="#0D73A6"
                  ></div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">iframe Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<iframe 
  src="/embed/scoring-leaders?leagueSlug=nhl&season=2023-2024&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="500px"
  frameBorder="0"
></iframe>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <iframe 
                    src="/embed/scoring-leaders?leagueSlug=nhl&season=2023-2024&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
                    width="100%" 
                    height="450px"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Goalie Leaders Widget */}
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Goalie Leaders Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">Script Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
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
></div>

<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg" style={{ minHeight: "450px" }}>
                  <div 
                    className="ep-widget" 
                    data-widget-type="goalie-leaders" 
                    data-league-slug="nhl"
                    data-season="2023-2024"
                    data-background-color="#052D41"
                    data-text-color="#000000"
                    data-table-background-color="#FFFFFF"
                    data-header-text-color="#FFFFFF"
                    data-name-text-color="#0D73A6"
                  ></div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">iframe Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<iframe 
  src="/embed/goalie-leaders?leagueSlug=nhl&season=2023-2024&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="500px"
  frameBorder="0"
></iframe>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <iframe 
                    src="/embed/goalie-leaders?leagueSlug=nhl&season=2023-2024&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
                    width="100%" 
                    height="450px"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Alumni Widget */}
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Alumni Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">Script Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="alumni" 
  data-selected-teams='[{"id":"18741","name":"San Jose Barracuda"}]'
  data-selected-leagues='["nhl","shl","ahl","khl"]'
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>

<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg" style={{ minHeight: "450px" }}>
                  <div 
                    className="ep-widget" 
                    data-widget-type="alumni" 
                    data-selected-teams='[{"id":"18741","name":"San Jose Barracuda"}]'
                    data-selected-leagues='["nhl","shl","ahl","khl"]'
                    data-background-color="#052D41"
                    data-text-color="#000000"
                    data-table-background-color="#FFFFFF"
                    data-header-text-color="#FFFFFF"
                    data-name-text-color="#0D73A6"
                  ></div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">iframe Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<iframe 
  src="/embed/alumni?teamIds=18741&leagues=nhl,shl,ahl,khl&teams=San%20Jose%20Barracuda&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="500px"
  frameBorder="0"
></iframe>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <iframe 
                    src="/embed/alumni?teamIds=18741&leagues=nhl,shl,ahl,khl&teams=San%20Jose%20Barracuda&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
                    width="100%" 
                    height="450px"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tournament Widget */}
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Tournament Widget</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">Script Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<div 
  class="ep-widget" 
  data-widget-type="alumni-tournament" 
  data-selected-tournaments='["brick-invitational"]'
  data-selected-leagues='["nhl","ahl"]'
  data-background-color="#052D41"
  data-text-color="#000000"
  data-table-background-color="#FFFFFF"
  data-header-text-color="#FFFFFF"
  data-name-text-color="#0D73A6"
></div>

<script src="https://widget.eliteprospects.com/widget-loader-combined.js"></script>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg" style={{ minHeight: "450px" }}>
                  <div 
                    className="ep-widget" 
                    data-widget-type="alumni-tournament" 
                    data-selected-tournaments='["brick-invitational"]'
                    data-selected-leagues='["nhl","ahl"]'
                    data-background-color="#052D41"
                    data-text-color="#000000"
                    data-table-background-color="#FFFFFF"
                    data-header-text-color="#FFFFFF"
                    data-name-text-color="#0D73A6"
                  ></div>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-3">iframe Implementation</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  <pre className="text-sm">
{`<iframe 
  src="/embed/alumni-tournament?tournaments=brick-invitational&leagues=nhl,ahl&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
  width="100%" 
  height="500px"
  frameBorder="0"
></iframe>`}
                  </pre>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <iframe 
                    src="/embed/alumni-tournament?tournaments=brick-invitational&leagues=nhl,ahl&backgroundColor=%23052D41&textColor=%23000000&tableBackgroundColor=%23FFFFFF&headerTextColor=%23FFFFFF&nameTextColor=%230D73A6"
                    width="100%" 
                    height="450px"
                    frameBorder="0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg mb-8 border border-green-200">
          <h2 className="text-xl font-semibold text-green-800 mb-2">Want to Try It Yourself?</h2>
          <p className="text-green-700 mb-4">
            You can test the widgets on our dedicated test page with adjustable parameters.
          </p>
          <div className="flex justify-center">
            <Link 
              href="/widget-test.html" 
              target="_blank"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-semibold"
            >
              Open Widget Test Page
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <Link href="/embed/docs" className="text-blue-600 hover:underline font-medium">
            View Full Documentation →
          </Link>
        </div>
      </div>
      <PoweredBy />
    </PageWrapper>
  );
};

export default EmbedDemo; 