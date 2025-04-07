"use client";

import React from "react";
import useSWR from "swr";
import SeasonsTable from "./PlayerSeasonsTable";
import type { SeasonStats, PlayerType } from "@/app/types/player";

interface PlayerSeasonsProps {
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
      throw new Error(errorData.error || "Failed to fetch player seasons.");
    }
    return res.json();
  });

const PlayerSeasons: React.FC<PlayerSeasonsProps> = ({
  playerId,
  customColors,
}) => {
  const { data, error } = useSWR(
    `/api/playerSeasons?playerId=${encodeURIComponent(playerId)}`,
    fetcher
  );

  if (!data && !error) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data || !data.stats || data.stats.length === 0) {
    return <div>NoStatsAvailable</div>;
  }

  const playerType: PlayerType =
    data.stats[0]?.role === "GOALTENDER" ? "GOALTENDER" : "SKATER";

  const seasons: SeasonStats[] = data.stats.map((season: any) => ({
    season: season.season,
    teamName: season.teamName,
    teamId: season.teamId,
    league: season.league,
    role: season.role,
    gamesPlayed: season.stats.gamesPlayed,
    ...(playerType === "GOALTENDER"
      ? {
          goalsAgainstAverage: season.stats.goalsAgainstAverage,
          savePercentage: season.stats.savePercentage,
          shutouts: season.stats.shutouts,
        }
      : {
          goals: season.stats.goals,
          assists: season.stats.assists,
          points: season.stats.points,
          plusMinus: season.stats.plusMinus,
        }),
  }));

  return (
    <>
      <SeasonsTable
        playerType={playerType}
        seasons={seasons}
        customColors={customColors}
      />
    </>
  );
};

export default PlayerSeasons;
