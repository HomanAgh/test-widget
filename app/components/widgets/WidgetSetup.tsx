import React, { useState, useEffect } from "react";
import BackgroundSelector from "./BackgroundSelector";
import Player from "../player/Player";
import PlayerStat from "../player/PlayerStat";

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
  const [showCurrentSeasonStats, setShowCurrentSeasonStats] = useState(false); // Track which widget to show

  // Fetch the team color when the playerId changes
  useEffect(() => {
    const fetchTeamColor = async () => {
      try {
        const playerResponse = await fetch(`/api/player?playerId=${playerId}`);
        const playerData = await playerResponse.json();
        const teamId = playerData.playerInfo.team?.id;

        if (teamId) {
          const teamResponse = await fetch(`/api/team?teamId=${teamId}`);
          const teamData = await teamResponse.json();
          const fetchedTeamColor = teamData.colors[0]; // Use the first team color
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

  const toggleDisplay = () => {
    setShowCurrentSeasonStats((prev) => !prev);
  };

  const embedUrl = `http://localhost:3000/embed/player?playerId=${playerId}&backgroundColor=${encodeURIComponent(
    backgroundStyle.backgroundColor || ""
  )}&gameLimit=${gameLimit}`;

  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      {/* Background Selector */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2 text-center">Background Options:</h3>
        <BackgroundSelector
          backgroundColor={backgroundStyle.backgroundColor || "#FFFFFF"}
          setBackgroundColor={(color) =>
            setBackgroundStyle({ backgroundColor: color })
          }
          teamColor={teamColor || undefined}
        />
      </div>

      {/* Game Limit Selector */}
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium mb-2">Select Number of Games:</h3>
        <div className="flex justify-center space-x-4">
          {[5, 10, 15, 20].map((limit) => (
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

      {/* Toggle Button for Current Season Stats */}
      <div className="text-center mb-6">
        <button
          onClick={toggleDisplay}
          className={`px-6 py-2 rounded-md ${
            showCurrentSeasonStats ? "bg-blue-600 text-white" : "bg-blue-400 text-white"
          } hover:bg-blue-500`}
        >
          {showCurrentSeasonStats ? "Show Recent Games" : "Show Current Season Stats"}
        </button>
      </div>

      {/* Player Widget or PlayerStat Preview */}
      <div className="mt-6">
        {showCurrentSeasonStats ? (
          <PlayerStat
            playerId={playerId}
            backgroundColor={backgroundStyle.backgroundColor || "#FFFFFF"}
          />
        ) : (
          <Player
            playerId={playerId}
            backgroundColor={backgroundStyle.backgroundColor || "#FFFFFF"}
            gameLimit={gameLimit}
          />
        )}
      </div>

      {/* Embed Code Section */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Embed Code</h3>
        <textarea
          readOnly
          value={iframeCode}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md"
        ></textarea>

        {/* Preview the iframe */}
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
