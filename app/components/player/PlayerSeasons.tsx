"use client";

import React from "react";
import useSWR from "swr";
import SeasonsTable from "./PlayerSeasonsTable";
import type { SeasonStats, PlayerType } from "@/app/types/player";

interface PlayerSeasonsProps {
  playerId: string;
  backgroundColor?: string; // NEW
  textColor?: string;       // NEW
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
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const { data, error } = useSWR(`/api/playerSeasons?playerId=${encodeURIComponent(playerId)}`, fetcher);

  if (!data && !error) {
    return <div style={{ color: textColor }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error.message}</div>;
  }

  if (!data || !data.stats || data.stats.length === 0) {
    return <div style={{ color: "red" }}>NoStatsAvailable</div>;
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
    <div
      className="max-w-6xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor, color: textColor }}
    >
      <SeasonsTable playerType={playerType} seasons={seasons} backgroundColor={backgroundColor} textColor={textColor} />
    </div>
  );
};

export default PlayerSeasons;
