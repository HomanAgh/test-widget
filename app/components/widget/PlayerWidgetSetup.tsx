"use client";

import React, { useState, useMemo } from "react";
import Player from "../player/Player";
import EmbedCodeBlock from "../iframe/IframePreview";

interface WidgetSetupProps {
  playerId: string;
}

const WidgetSetup: React.FC<WidgetSetupProps> = ({ playerId }) => {
  const [gameLimit, setGameLimit] = useState(5);
  const [viewMode, setViewMode] = useState<"stats" | "seasons" | "career" | "games">("stats");
  const [,setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);


  const handleGameLimitChange = (limit: number) => {
    setGameLimit(limit);
  };

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      `${baseUrl}/embed/player?playerId=${playerId}` +
      `&gameLimit=${gameLimit}&viewMode=${viewMode}` +
      `&showSummary=${showSummary}`
    );
  }, [playerId, gameLimit, viewMode, showSummary]);

  const iframeCode = `<iframe src="${embedUrl}" class="alumni-iframe"></iframe>`;

  return (
    <div>
      <div className="text-center my-4">
        <h3 className="text-lg font-medium mb-2">View Mode:</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setViewMode("stats");
              setShowPreview(false);
            }}
            className={`px-2 py-2 rounded-md ${
              viewMode === "stats" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Current Season Stats
          </button>
          <button
            onClick={() => {
              setViewMode("seasons");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
              viewMode === "seasons" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Player Seasons
          </button>
          <button
            onClick={() => {
              setViewMode("career");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
              viewMode === "career" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Player Career
          </button>
          <button
            onClick={() => {
              setViewMode("games");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
              viewMode === "games" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Recent Games
          </button>
        </div>
      </div>

      {viewMode === "games" && (
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium mb-2">Select Number of Games:</h3>
          <div className="flex justify-center space-x-4">
            {[5, 10, 15, 20, 25].map((limit) => (
              <button
                key={limit}
                onClick={() => {
                  handleGameLimitChange(limit);
                  setShowPreview(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  gameLimit === limit ? "bg-green-600 text-white" : "bg-green-400 text-white"
                } hover:bg-green-500`}
              >
                {limit} Games
              </button>
            ))}
            <button
              onClick={() => setShowSummary((prev) => !prev)}
              className={`px-4 py-2 rounded-md ${
                showSummary ? "bg-purple-600 text-white" : "bg-purple-400 text-white"
              } hover:bg-purple-500`}
            >
              {showSummary ? "View Details" : "View Summary"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Player
          playerId={playerId}
          gameLimit={gameLimit}
          viewMode={viewMode}
          showSummary={showSummary}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default WidgetSetup;
