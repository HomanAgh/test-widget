"use client";

import React from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import useSWR from "swr";
import PlayerStatsTable from "./PlayerStatsTable";
import type { PlayerType, Goalie, Skater } from "@/app/types/player";

interface PlayerStatProps {
  playerId: string;
  backgroundColor: string;
}

// Define a fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch player stats.");
    }
    return res.json();
  });

const PlayerStat: React.FC<PlayerStatProps> = ({ playerId, backgroundColor }) => {
  const { t } = useTranslation();

  // Use SWR to fetch player stats
  const { data, error } = useSWR(`/api/playerStats?playerId=${encodeURIComponent(playerId)}`, fetcher);

  // Handle loading state
  if (!data && !error) {
    return <div className="text-center text-gray-600">{t("Loading")}</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center text-red-600">{t("ErrorOccurred")}: {error.message}</div>;
  }

  // Now we have data and no error. Validate and map data.
  if (!data || !data.stats || !data.playerInfo) {
    return <div className="text-center text-red-600">{t("ErrorOccurred")}: NoStatsAvailable</div>;
  }

  const type: PlayerType = data.playerInfo.playerType;
  
  const stats = type === "GOALTENDER"
    ? {
        gamesPlayed: data.stats?.gamesPlayed || 0,
        shotsAgainst: data.stats?.shotsAgainst ?? "N/A",
        saves: data.stats?.saves ?? "N/A",
        goalsAgainst: data.stats?.goalsAgainst ?? "N/A",
        savePercentage: parseFloat(data.stats?.savePercentage) || 0,
      } as Goalie
    : {
        gamesPlayed: data.stats?.gamesPlayed || 0,
        goals: data.stats?.goals ?? "N/A",
        assists: data.stats?.assists ?? "N/A",
        points: data.stats?.points ?? "N/A",
        plusMinusRating: data.stats?.plusMinusRating ?? "N/A",
      } as Skater;

  console.log("Mapped Stats:", stats); // Debug: Log mapped stats.

  return (
    <div
      className="max-w-4xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      <PlayerStatsTable
        playerType={type}
        stats={stats}
      />
    </div>
  );
};

export default PlayerStat;
