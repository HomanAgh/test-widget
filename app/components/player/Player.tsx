import React, { useEffect, useState } from "react";
import PlayerInfo from "./PlayerInfo";
import GamesTable from "./GamesTable";

interface GameLog {
  date: string;
  goals?: number;
  assists?: number;
  points?: number;
  plusMinusRating?: number;
  shotsAgainst?: number;
  saves?: number;
  goalsAgainst?: number;
  savePercentage?: number;
}

interface PlayerStats {
  id: string;
  name: string;
  imageUrl: string;
  playerType: "SKATER" | "GOALTENDER";
  lastFiveGames: GameLog[];
  team?: { id: number; name: string };
  league?: { slug: string; name: string };
  nationality: string;
  jerseyNumber: string;
}

interface PlayerProps {
  playerId: string;
  backgroundColor: string; // Add this to support the background color
}

const Player: React.FC<PlayerProps> = ({ playerId, backgroundColor }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(
          `/api/player?playerId=${encodeURIComponent(playerId)}`
        );
        const data = await response.json();

        setPlayerStats({
          id: data.playerInfo.id,
          name: data.playerInfo.name || "Unknown Player",
          imageUrl: data.playerInfo.imageUrl || "/default-image.jpg",
          playerType: data.playerInfo.playerType,
          lastFiveGames: data.lastFiveGames || [],
          team: data.playerInfo.team,
          league: data.playerInfo.league,
          nationality: data.playerInfo.nationality || "Unknown Nationality",
          jerseyNumber: data.playerInfo.jerseyNumber || "N/A",
        });
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [playerId]);

  if (loading) return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div
      className={`max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg`}
      style={{ backgroundColor }} // Apply the background color
    >
      {playerStats && <PlayerInfo playerStats={playerStats} />}
      {playerStats && (
        <GamesTable
          lastFiveGames={playerStats.lastFiveGames}
          playerType={playerStats.playerType}
        />
      )}
    </div>
  );
};

export default Player;
