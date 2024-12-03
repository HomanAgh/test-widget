import React, { useState, useEffect } from "react";
import BackgroundSelector from "./BackgroundSelector";
import Player from "../player/Player";

interface WidgetSetupProps {
  playerId: string;
}

const WidgetSetup: React.FC<WidgetSetupProps> = ({ playerId }) => {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [teamColor, setTeamColor] = useState<string | null>(null);
  const [gameLimit, setGameLimit] = useState(5);

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

  // Handle game limit selection
  const handleGameLimitChange = (limit: number) => {
    setGameLimit(limit);
  };

  // Generate Embed URL
  const embedUrl = `http://localhost:3000/embed/player?playerId=${playerId}&backgroundColor=${encodeURIComponent(
    backgroundColor
  )}&gameLimit=${gameLimit}`;  

  // iFrame Embed Code
  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      {/* Background Selector */}
      <BackgroundSelector
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        teamColor={teamColor || undefined}
        playerId={playerId} // Pass playerId to reset on change
      />

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

      {/* Player Widget Preview */}
      <div className="mt-6">
        <Player playerId={playerId} backgroundColor={backgroundColor} gameLimit={gameLimit} />
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
