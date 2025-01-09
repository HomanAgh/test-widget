"use client";

import React, { useState, useMemo } from "react";
import Player from "../player/Player";
import TeamBackgroundColorSelector from "../common/TeamBackgroundColorSelector";

interface WidgetSetupProps {
  playerId: string;
}

const WidgetSetup: React.FC<WidgetSetupProps> = ({ playerId }) => {
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");

  const [gameLimit, setGameLimit] = useState(5);
  const [viewMode, setViewMode] = useState<"stats" | "seasons" | "career" | "games">("stats");
  const [showPreview, setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // 1) If user enables team colors and we have at least 1 color, use that as background
  //    Otherwise, use the customColor from the user’s color picker.
  const finalBackgroundColor = useMemo(() => {
    if (useTeamColor && teamColors.length > 0) {
      return teamColors[0];
    }
    return customColor;
  }, [useTeamColor, teamColors, customColor]);

  // 2) For text color, use teamColors[1] if it exists
  //    If we don’t have an index [1], default to e.g. black or compute a color
  const finalTextColor = useMemo(() => {
    if (useTeamColor && teamColors.length > 1) {
      return teamColors[1]; // pick the second color from the array
    }
    // Fallback if we only have one color or none
    return "#000000"; 
  }, [useTeamColor, teamColors]);

  const handleGameLimitChange = (limit: number) => {
    setGameLimit(limit);
  };

  const embedUrl = useMemo(() => {
    return (
      `http://localhost:3000/embed/player?playerId=${playerId}` +
      `&backgroundColor=${encodeURIComponent(finalBackgroundColor)}` +
      `&textColor=${encodeURIComponent(finalTextColor)}` +
      `&gameLimit=${gameLimit}&viewMode=${viewMode}` +
      `&showSummary=${showSummary}`
    );
  }, [playerId, finalBackgroundColor, finalTextColor, gameLimit, viewMode, showSummary]);

  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      <TeamBackgroundColorSelector
        playerId={playerId}
        defaultEnabled={false}
        onTeamColorsChange={setTeamColors}
        onUseTeamColorChange={setUseTeamColor}
        onCustomColorChange={setCustomColor}
        enableText="Enable Team Colors"
        disableText="Disable Team Colors"
      />

      <div className="text-center my-4">
        <h3 className="text-lg font-medium mb-2">View Mode:</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setViewMode("stats");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
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
          // pass both backgroundColor and textColor
          backgroundColor={finalBackgroundColor}
          textColor={finalTextColor}
          gameLimit={gameLimit}
          viewMode={viewMode}
          showSummary={showSummary}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Embed Code</h3>
        <div className="flex items-center space-x-4">
          <textarea
            readOnly
            value={iframeCode}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          >
            Preview
          </button>
        </div>

        <h3 className="text-lg font-medium mt-4 mb-2">Preview</h3>
        {showPreview && (
          <iframe
            src={embedUrl}
            style={{ width: "100%", height: "500px", border: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default WidgetSetup;
