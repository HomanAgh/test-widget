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
          shotsAgainst: data.stats?.shotsAgainst || 0,
          saves: data.stats?.saves || 0,
          goalsAgainst: data.stats?.goalsAgainst || 0,
          savePercentage: parseFloat(data.stats?.savePercentage) || 0,
        } as Goalie)
      : ({
          gamesPlayed: data.stats?.gamesPlayed || 0,
          goals: data.stats?.goals || 0,
          assists: data.stats?.assists || 0,
          points: data.stats?.points || 0,
          plusMinusRating: data.stats?.plusMinusRating || 0,
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
