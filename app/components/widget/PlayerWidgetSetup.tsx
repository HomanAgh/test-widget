import React, { useState, useEffect, useMemo } from "react";
import BackgroundSelector from "./BackgroundSelector";
import Player from "../player/Player";

interface WidgetSetupProps {
  playerId: string;
}

const WidgetSetup: React.FC<WidgetSetupProps> = ({ playerId }) => {
  const [backgroundStyle, setBackgroundStyle] = useState<{
    backgroundColor?: string;
    backgroundImage?: string;
  }>({
    backgroundColor: "#FFFFFF",
  });
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [gameLimit, setGameLimit] = useState(5);

  // Updated state to include "career" view
  const [viewMode, setViewMode] = useState<"stats" | "seasons" | "career" | "games">("stats");

  useEffect(() => {
    const fetchTeamColor = async () => {
      try {
        const playerResponse = await fetch(`/api/player/${encodeURIComponent(playerId)}`);
        const playerData = await playerResponse.json();
        const teamId = playerData.playerInfo.team?.id;

        if (teamId) {
          const teamResponse = await fetch(`/api/team?teamId=${teamId}`);
          const teamData = await teamResponse.json();
          const fetchedTeamColor = teamData.colors[0];
          setTeamColor(fetchedTeamColor);
        } else {
          setTeamColor(null);
        }
      } catch (error) {
        console.error("Failed to fetch team color:", error);
        setTeamColor(null);
      }
    };

    fetchTeamColor();
  }, [playerId]);

  const handleColorChange = (color: string) => {
    if (color.startsWith("linear-gradient")) {
      setBackgroundStyle({ backgroundImage: color });
    } else {
      setBackgroundStyle({ backgroundColor: color });
    }
  };

  const handleGameLimitChange = (limit: number) => {
    setGameLimit(limit);
  };

  const embedUrl = useMemo(() => {
    return `http://localhost:3000/embed/player?playerId=${playerId}&backgroundColor=${encodeURIComponent(
      backgroundStyle.backgroundColor || ""
    )}&gameLimit=${gameLimit}&viewMode=${viewMode}`;
  }, [playerId, backgroundStyle, gameLimit, viewMode]);

  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-center">Background Options:</h3>
        <BackgroundSelector
          backgroundColor={backgroundStyle.backgroundColor || "#FFFFFF"}
          setBackgroundColor={(color) => setBackgroundStyle({ backgroundColor: color })}
          teamColor={teamColor || undefined}
        />
      </div>

      <div className="text-center my-4">
        <h3 className="text-lg font-medium mb-2">View Mode:</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setViewMode("stats")}
            className={`px-6 py-2 rounded-md ${
              viewMode === "stats" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Current Season Stats
          </button>
          <button
            onClick={() => setViewMode("seasons")}
            className={`px-6 py-2 rounded-md ${
              viewMode === "seasons" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Player Seasons
          </button>
          <button
            onClick={() => setViewMode("career")}
            className={`px-6 py-2 rounded-md ${
              viewMode === "career" ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
            } hover:bg-blue-500`}
          >
            Show Player Career
          </button>
          <button
            onClick={() => setViewMode("games")}
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
                onClick={() => handleGameLimitChange(limit)}
                className={`px-4 py-2 rounded-md ${
                  gameLimit === limit ? "bg-green-600 text-white" : "bg-green-400 text-white"
                } hover:bg-green-500`}
              >
                {limit} Games
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Player
          playerId={playerId}
          backgroundColor={backgroundStyle.backgroundColor || "#FFFFFF"}
          gameLimit={gameLimit}
          viewMode={viewMode}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Embed Code</h3>
        <textarea
          readOnly
          value={iframeCode}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>

        <h3 className="text-lg font-medium mt-4 mb-2">Preview</h3>
        <iframe
          src={embedUrl}
          style={{ width: "100%", height: "500px", border: "none" }}
        ></iframe>
      </div>
    </div>
  );
};

export default WidgetSetup;
