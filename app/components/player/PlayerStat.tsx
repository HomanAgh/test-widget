"use client";

import React from "react";
import useSWR from "swr";
import PlayerStatsTable from "./PlayerStatsTable";
import type { PlayerType, Goalie, Skater } from "@/app/types/player";

interface PlayerStatProps {
  playerId: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch player stats.");
    }
    return res.json();
  });

const PlayerStat: React.FC<PlayerStatProps> = ({ playerId, customColors }) => {
  const { data, error } = useSWR(
    `/api/playerStats?playerId=${encodeURIComponent(playerId)}`,
    fetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.stats || !data.playerInfo) {
    return <div>NoStatsAvailable</div>;
  }

  const type: PlayerType = data.playerInfo.playerType;

  const stats =
    type === "GOALTENDER"
      ? ({
          gamesPlayed: data.stats?.gamesPlayed || 0,
          shotsAgainst: data.stats?.shotsAgainst ?? "N/A",
          saves: data.stats?.saves ?? "N/A",
          goalsAgainst: data.stats?.goalsAgainst ?? "N/A",
          savePercentage: parseFloat(data.stats?.savePercentage) || 0,
        } as Goalie)
      : ({
          gamesPlayed: data.stats?.gamesPlayed || 0,
          goals: data.stats?.goals ?? "N/A",
          assists: data.stats?.assists ?? "N/A",
          points: data.stats?.points ?? "N/A",
          plusMinusRating: data.stats?.plusMinusRating ?? "N/A",
        } as Skater);

  return (
    <>
      <PlayerStatsTable
        playerType={type}
        stats={stats}
        customColors={customColors}
      />
    </>
  );
};

export default PlayerStat;
