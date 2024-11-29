import React, { useState, useEffect } from "react";
import BackgroundSelector from "./BackgroundSelector";
import Player from "../player/Player";

interface WidgetSetupProps {
  playerId: string;
}

const WidgetSetup: React.FC<WidgetSetupProps> = ({ playerId }) => {
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); // Default white
  const [teamColor, setTeamColor] = useState<string | null>(null); // Team color

  // Fetch team color for the selected player
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
          setBackgroundColor("#FFFFFF"); // Default to team color
        } else {
          setTeamColor(null);
          setBackgroundColor("#FFFFFF"); // Default to white if no team color
        }
      } catch (error) {
        console.error("Failed to fetch team color:", error);
        setTeamColor(null);
        setBackgroundColor("#FFFFFF");
      }
    };

    fetchTeamColor();
  }, [playerId]); // Re-fetch when playerId changes

  return (
    <div>
      {/* Background Selector */}
      <BackgroundSelector
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        teamColor={teamColor || undefined}
      />

      {/* Player Widget Preview */}
      <div className="mt-6">
        <Player playerId={playerId} backgroundColor={backgroundColor} />
      </div>
    </div>
  );
};

export default WidgetSetup;
