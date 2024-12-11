"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import PlayerStatsTable from "./PlayerStatsTable";
import type { PlayerType, Goalie, Skater } from "@/app/types/player";

interface PlayerStatProps {
  playerId: string;
  backgroundColor: string;
}

const PlayerStat: React.FC<PlayerStatProps> = ({ playerId, backgroundColor }) => {
  const { t } = useTranslation(); // Hook for translations
  const [playerType, setPlayerType] = useState<PlayerType | null>(null);
  const [stats, setStats] = useState<Goalie | Skater | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerStats = async () => {
        try {
          // Fetch player info to determine playerType
          const response = await fetch(`/api/playerStats?playerId=${playerId}`);
          const data = await response.json();
      
          console.log("Fetched Player Data:", data); // Debug: Log the full API response.
      
          if (!data.stats) {
            console.error("Stats missing in response:", data); // Log when stats are missing.
            setError("NoStatsAvailable");
            return;
          }
      
          const type: PlayerType = data.playerInfo.playerType;
          setPlayerType(type);
      
          const fetchedStats = type === "GOALTENDER"
            ? {
                gamesPlayed: data.stats?.gamesPlayed || 0,
                shotsAgainst: data.stats?.shotsAgainst ?? "N/A",
                saves: data.stats?.saves ?? "N/A",
                goalsAgainst: data.stats?.goalsAgainst ?? "N/A",
                savePercentage: parseFloat(data.stats?.savePercentage) || 0,
              }
            : {
                gamesPlayed: data.stats?.gamesPlayed || 0,
                goals: data.stats?.goals ?? "N/A",
                assists: data.stats?.assists ?? "N/A",
                points: data.stats?.points ?? "N/A",
                plusMinusRating: data.stats?.plusMinusRating ?? "N/A",
              };
      
          console.log("Mapped Stats:", fetchedStats); // Debug: Log mapped stats.
      
          setStats(fetchedStats);
        } catch (err) {
          console.error("Error fetching player stats:", err); // Log errors explicitly.
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("UnknownErrorOccurred");
          }
        } finally {
          setLoading(false);
        }
      };
      
  
    fetchPlayerStats();
  }, [playerId]);  

  if (loading) return <div className="text-center text-gray-600">{t("Loading")}</div>;
  if (error) return <div className="text-center text-red-600">{t("ErrorOccurred")}: {error}</div>;

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      {playerType && stats && (
        <PlayerStatsTable
          playerType={playerType}
          stats={stats}
        />
      )}
    </div>
  );
};

export default PlayerStat;
