"use client";

import React, { useState, useCallback } from "react";

interface EmbedCodeBlockProps {
  iframeCode: string;
}

const EmbedCodeBlock: React.FC<EmbedCodeBlockProps> = ({ iframeCode }) => {
  // Moved from parent into this component
  const [showCode, setShowCode] = useState(false);

  // Copy to clipboard logic (local)
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Embed Code</h3>
      <div
    className="relative"
    // Put the onClick on the parent container
    onClick={() => {
        // Only flip to true if it’s still false
        if (!showCode) setShowCode(true);
    }}
    >
    <textarea
        readOnly
        value={iframeCode}
        rows={3}
        className={`w-full p-2 border border-gray-300 rounded-md transition-[filter] duration-300 ${
        showCode ? "" : "blur-sm"
        }`}
    />
    
    {/* Absolute overlay - no separate click handler */}
    {!showCode && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
        <span className="bg-white px-4 py-2 rounded-md text-gray-700">
            Click to Reveal Code
        </span>
        </div>
    )}
    </div>


      {/* Buttons for "Preview" and "Copy" */}
        <div className="flex space-x-2 mt-2">
        <button
          onClick={() => copyToClipboard(iframeCode)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
        >
          Copy
        </button>
      </div>
    </div>
  );
};

export default EmbedCodeBlock;
