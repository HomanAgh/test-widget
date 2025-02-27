"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface EmbedCodeBlockProps {
  iframeCode: string;
}

const EmbedCodeBlock: React.FC<EmbedCodeBlockProps> = ({ iframeCode }) => {
  const router = useRouter();
  const [showModalCode, setShowModalCode] = useState(false);
  const [embedType, setEmbedType] = useState<'iframe' | 'script'>('iframe');
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, []);

  // Generate script tag code from iframe code
  const generateScriptCode = useCallback(() => {
    try {
      // Extract the src URL from the iframe code
      const srcMatch = iframeCode.match(/src="([^"]+)"/);
      if (!srcMatch || !srcMatch[1]) return '';
      
      const srcUrl = srcMatch[1];
      const url = new URL(srcUrl, window.location.origin);
      
      // Extract parameters from the URL
      const params = url.searchParams;
      
      // Determine widget type from the URL path
      const pathParts = url.pathname.split('/');
      const widgetType = pathParts[pathParts.length - 1];
      
      // Build the script tag with appropriate data attributes
      let scriptCode = `<script\n  src="${window.location.origin}/widget-embed.js"\n  data-widget-type="${widgetType}"`;
      
      // Add parameters as data attributes
      switch (widgetType) {
        case 'player':
          if (params.has('playerId')) scriptCode += `\n  data-player-id="${params.get('playerId')}"`;
          if (params.has('gameLimit')) scriptCode += `\n  data-game-limit="${params.get('gameLimit')}"`;
          if (params.has('viewMode')) scriptCode += `\n  data-view-mode="${params.get('viewMode')}"`;
          if (params.has('showSummary')) scriptCode += `\n  data-show-summary="${params.get('showSummary')}"`;
          break;
        case 'team':
          if (params.has('teamId')) scriptCode += `\n  data-team-id="${params.get('teamId')}"`;
          break;
        case 'league':
          if (params.has('leagueSlug')) scriptCode += `\n  data-league-slug="${params.get('leagueSlug')}"`;
          break;
        case 'alumni':
          if (params.has('teamIds')) scriptCode += `\n  data-team-ids="${params.get('teamIds')}"`;
          if (params.has('leagues')) scriptCode += `\n  data-leagues="${params.get('leagues')}"`;
          if (params.has('teams')) scriptCode += `\n  data-teams="${params.get('teams')}"`;
          if (params.has('backgroundColor')) scriptCode += `\n  data-background-color="${params.get('backgroundColor')}"`;
          if (params.has('textColor')) scriptCode += `\n  data-text-color="${params.get('textColor')}"`;
          if (params.has('tableBackgroundColor')) scriptCode += `\n  data-table-background-color="${params.get('tableBackgroundColor')}"`;
          if (params.has('nameTextColor')) scriptCode += `\n  data-name-text-color="${params.get('nameTextColor')}"`;
          break;
      }
      
      // Add common attributes
      scriptCode += `\n  data-width="100%"\n  data-height="600px"\n></script>`;
      
      return scriptCode;
    } catch (error) {
      console.error('Error generating script code:', error);
      return '';
    }
  }, [iframeCode]);

  const scriptCode = generateScriptCode();
  const currentCode = embedType === 'iframe' ? iframeCode : scriptCode;

  // Navigation handlers
  const navigateToEmbedDocs = () => {
    window.open('/embed/docs', '_blank');
  };

  const navigateToEmbedDemo = () => {
    window.open('/embed/demo', '_blank');
  };
  
  const navigateToContact = () => {
    window.open('/contact', '_blank');
  };

  // Reset modal state when opening
  const handleOpenModal = () => {
    setShowModalCode(false);
    setShowModal(true);
  };

  // Modal component
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
                onClick={() => setEmbedType('iframe')}
                className={`px-4 py-2 rounded-md ${
                  embedType === 'iframe' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                iframe
              </button>
              <button
                onClick={() => setEmbedType('script')}
                className={`px-4 py-2 rounded-md ${
                  embedType === 'script' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Script Tag
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                {embedType === 'iframe' ? 'iframe Embed Code' : 'Script Tag Embed Code'}
              </h3>
              <div className="relative">
                <textarea
                  readOnly
                  value={currentCode}
                  rows={embedType === 'script' ? 8 : 3}
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
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
                >
                  Copy Code
                </button>
                <button
                  onClick={() => {
                    window.open('/test/super-simple-test.html', '_blank');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                >
                  Test Widget
                </button>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-semibold mb-2">Documentation & Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={navigateToEmbedDocs}
                  className="block p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-blue-600">Embedding Guide</h4>
                  <p className="text-sm text-gray-600">Learn how to embed widgets on your website</p>
                </div>
                <div 
                  onClick={navigateToEmbedDemo}
                  className="block p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-blue-600">Live Demos</h4>
                  <p className="text-sm text-gray-600">See examples of embedded widgets</p>
                </div>
                <div 
                  onClick={navigateToContact}
                  className="block p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-blue-600">Need Help?</h4>
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
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center space-x-2 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <span>Put on your website</span>
      </button>
      
      {/* Render the modal */}
      <EmbedModal />
    </div>
  );
};

export default EmbedCodeBlock;
