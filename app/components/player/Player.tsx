"use client";

import React, { useEffect, useState } from "react";
import BackgroundSelector from "./BackgroundSelector";
import PlayerInfo from "./PlayerInfo";
import GamesTable from "./GamesTable";

interface GameLog {
  date: string;
  teamName: string;
  opponentName: string;
  teamScore: number;
  opponentScore: number;
  outcome: string;
  goals: number;
  assists: number;
  points: number;
  plusMinusRating: number;
}

interface PlayerStats {
  id: string;
  name: string;
  imageUrl: string;
  lastFiveGames: GameLog[];
  team?: { id: number; name: string };
  league?: { slug: string; name: string };
  nationality: string;
  jerseyNumber: string;
}

interface PlayerProps {
  playerId: string;
}

const Player: React.FC<PlayerProps> = ({ playerId }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("bg-blue-100");

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const response = await fetch(
          `/api/player?playerId=${encodeURIComponent(playerId)}`
        );
        const data = await response.json();

        setPlayerStats({
          id: playerId,
          name: data.playerInfo.name || "Unknown Player",
          imageUrl: data.playerInfo.imageUrl || "/default-image.jpg",
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
      className={`max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg ${backgroundColor}`}
    >
      <BackgroundSelector
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      {playerStats && <PlayerInfo playerStats={playerStats} />}
      {playerStats && <GamesTable lastFiveGames={playerStats.lastFiveGames} />}
    </div>
  );
};

export default Player;
