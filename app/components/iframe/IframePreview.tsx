"use client";

import React, { useState, useCallback } from "react";

interface EmbedCodeBlockProps {
  iframeCode: string;
}

const EmbedCodeBlock: React.FC<EmbedCodeBlockProps> = ({ iframeCode }) => {
  const [showModalCode, setShowModalCode] = useState(false);
  const [embedType, setEmbedType] = useState<'direct-script' | 'iframe'>('direct-script');
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, []);

  // Convert iframe code to direct script implementation
  const generateDirectScriptCode = useCallback(() => {
    try {
      const srcMatch = iframeCode.match(/src="([^"]+)"/);
      if (!srcMatch || !srcMatch[1]) return '';
      const srcUrl = srcMatch[1];
      const url = new URL(srcUrl, window.location.origin);
      const params = url.searchParams;
      const pathParts = url.pathname.split('/');
      const widgetType = pathParts[pathParts.length - 1];
      
      // Build the direct script implementation
      let widgetDiv = `<div class="ep-widget" \n  data-widget-type="${widgetType}"`;
      
      // Add parameters based on widget type
      switch (widgetType) {
        case 'player':
          if (params.has('playerId')) widgetDiv += `\n  data-player-id="${params.get('playerId')}"`;
          if (params.has('gameLimit')) widgetDiv += `\n  data-game-limit="${params.get('gameLimit')}"`;
          if (params.has('viewMode')) widgetDiv += `\n  data-view-mode="${params.get('viewMode')}"`;
          if (params.has('showSummary')) widgetDiv += `\n  data-show-summary="${params.get('showSummary')}"`;
          break;
        case 'team':
          if (params.has('teamId')) widgetDiv += `\n  data-team-id="${params.get('teamId')}"`;
          break;
        case 'league':
          if (params.has('leagueSlug')) widgetDiv += `\n  data-league-slug="${params.get('leagueSlug')}"`;
          break;
        case 'scoring-leaders':
          if (params.has('leagueSlug')) widgetDiv += `\n  data-league-slug="${params.get('leagueSlug')}"`;
          if (params.has('season')) widgetDiv += `\n  data-season="${params.get('season')}"`;
          break;
        case 'goalie-leaders':
          if (params.has('leagueSlug')) widgetDiv += `\n  data-league-slug="${params.get('leagueSlug')}"`;
          if (params.has('season')) widgetDiv += `\n  data-season="${params.get('season')}"`;
          break;
        case 'alumni':
          if (params.has('teamIds')) {
            // Convert team IDs to object array format
            const teamIds = params.get('teamIds')?.split(',') || [];
            const teams = params.get('teams')?.split(',') || [];
            const teamObjects = teamIds.map((id, index) => ({
              id,
              name: teams[index] || `Team ${id}`
            }));
            widgetDiv += `\n  data-selected-teams='${JSON.stringify(teamObjects)}'`;
          }
          if (params.has('leagues')) {
            const leagues = params.get('leagues')?.split(',') || [];
            widgetDiv += `\n  data-selected-leagues='${JSON.stringify(leagues)}'`;
          }
          widgetDiv += `\n  data-include-youth="false"`;
          widgetDiv += `\n  data-selected-league-categories='{"junior":true,"college":true,"professional":true}'`;
          break;
        case 'tournament':
          if (params.has('tournaments')) {
            const tournaments = params.get('tournaments')?.split(',') || [];
            widgetDiv += `\n  data-selected-tournaments='${JSON.stringify(tournaments)}'`;
          }
          if (params.has('leagues')) {
            const leagues = params.get('leagues')?.split(',') || [];
            widgetDiv += `\n  data-selected-leagues='${JSON.stringify(leagues)}'`;
          }
          widgetDiv += `\n  data-selected-league-categories='{"junior":true,"college":true,"professional":true}'`;
          break;
      }
      
      if (params.has('backgroundColor')) widgetDiv += `\n  data-background-color="${params.get('backgroundColor')}"`;
      if (params.has('textColor')) widgetDiv += `\n  data-text-color="${params.get('textColor')}"`;
      if (params.has('tableBackgroundColor')) widgetDiv += `\n  data-table-background-color="${params.get('tableBackgroundColor')}"`;
      if (params.has('headerTextColor')) widgetDiv += `\n  data-header-text-color="${params.get('headerTextColor')}"`;
      if (params.has('nameTextColor')) widgetDiv += `\n  data-name-text-color="${params.get('nameTextColor')}"`;
      
      widgetDiv += `\n></div>\n\n<script async src="${window.location.origin}/widget-loader-combined.js"></script>`;
      
      return widgetDiv;
    } catch (error) {
      console.error('Error generating direct script code:', error);
      return '';
    }
  }, [iframeCode]);

  // Get the appropriate code based on the selected embed type
  const directScriptCode = generateDirectScriptCode();
  const currentCode = embedType === 'iframe' ? iframeCode : directScriptCode;

  const navigateToEmbedDocs = () => {
    window.open('/embed/docs', '_blank');
  };

  const navigateToEmbedDemo = () => {
    window.open('/embed/demo', '_blank');
  };
  
  const navigateToContact = () => {
    window.open('/contact', '_blank');
  };

  const handleOpenModal = () => {
    setShowModalCode(false);
    setShowModal(true);
  };

  const EmbedModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Embed Widget on Your Website</h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="mb-4">
            <p className="mb-2">Choose how you want to embed this widget:</p>
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setEmbedType('direct-script')}
                className={`px-4 py-2 rounded-md ${
                  embedType === 'direct-script' 
                    ? 'bg-[#0B9D52] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Direct Script (Recommended)
              </button>
              <button
                onClick={() => setEmbedType('iframe')}
                className={`px-4 py-2 rounded-md ${
                  embedType === 'iframe' 
                    ? 'bg-[#0B9D52] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                iframe (Legacy)
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                {embedType === 'direct-script' ? 'Direct Script Embed Code (Recommended)' : 'iframe Embed Code (Legacy)'}
              </h3>
              <div className="relative">
                <textarea
                  readOnly
                  value={currentCode}
                  rows={embedType === 'direct-script' ? 10 : 3}
                  className={`w-full p-2 border border-gray-300 rounded-md transition-[filter] duration-300 ${
                    showModalCode ? "" : "blur-sm"
                  }`}
                  onClick={() => {
                    if (!showModalCode) setShowModalCode(true);
                  }}
                />
                
                {!showModalCode && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={() => setShowModalCode(true)}
                  >
                    <span className="bg-white px-4 py-2 rounded-md text-gray-700">
                      Click to Reveal Code
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => copyToClipboard(currentCode)}
                  className="bg-[#0B9D52] text-white rounded-md hover:bg-green-700 transition-all px-4 py-2"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => {
                    window.open('/widget-script-test.html', '_blank');
                  }}
                  className="bg-[#052D41] text-white hover:bg-blue-700 transition-all px-4 py-2 rounded-md "
                >
                  Test Widget
                </button>
              </div>

              {embedType === 'direct-script' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Direct Script Implementation:</strong> This method embeds the widget directly into your page without an iframe. 
                    It provides better integration with your site and improved performance.
                  </p>
                </div>
              )}

              {embedType === 'iframe' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    <strong>Legacy Method:</strong> iframe embedding is still supported but not recommended. 
                    Consider using the direct script implementation for better integration and performance.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Documentation & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={navigateToEmbedDocs}
                  className="block p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-[#052D41] underline">Embedding Guide</h4>
                  <p className="text-sm text-gray-600">Learn how to embed widgets on your website</p>
                </div>
                <div 
                  onClick={navigateToEmbedDemo}
                  className="block p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-[#052D41] underline">Live Demos</h4>
                  <p className="text-sm text-gray-600">See examples of embedded widgets</p>
                </div>
                <div 
                  onClick={navigateToContact}
                  className="block p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-[#052D41] underline">Need Help?</h4>
                  <p className="text-sm text-gray-600">Contact our support team for assistance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 flex justify-center pb-[24px]">
      <button
        onClick={handleOpenModal}
        className="bg-[#0B9D52] text-white font-bold hover:bg-green-700 transition-all px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2 font-bold font-montserrat"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <span>ADD TO YOUR WEBSITE</span>
      </button>
      
      {/* Render the modal */}
      <EmbedModal />
    </div>
  );
};

export default EmbedCodeBlock;
