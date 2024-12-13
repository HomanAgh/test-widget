"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import SeasonsTable from "./PlayerSeasonsTable"; // New table component for seasons
import type { SeasonStats, PlayerType } from "@/app/types/player";

interface PlayerSeasonsProps {
  playerId: string;
  backgroundColor: string;
}

// Define a fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch player seasons.");
    }
    return res.json();
  });

const PlayerSeasons: React.FC<PlayerSeasonsProps> = ({ playerId, backgroundColor }) => {
  const { t } = useTranslation();

  // Use SWR to fetch player seasonal stats
  const { data, error } = useSWR(`/api/playerSeasons?playerId=${encodeURIComponent(playerId)}`, fetcher);

  // Handle loading state
  if (!data && !error) {
    return <div className="text-center text-gray-600">{t("Loading")}</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center text-red-600">{t("ErrorOccurred")}: {error.message}</div>;
  }

  // At this point, data is loaded and no error
  if (!data || !data.stats || data.stats.length === 0) {
    return <div className="text-center text-red-600">{t("ErrorOccurred")}: NoStatsAvailable</div>;
  }

  console.log("Fetched Player Seasons:", data); // Debug log

  // Determine if the player is a GOALTENDER or SKATER
  const playerType: PlayerType = data.stats[0]?.role === "GOALTENDER" ? "GOALTENDER" : "SKATER";

  // Map the seasonal stats
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
        }),
  }));

  console.log("Mapped Seasons:", seasons); // Debug log

  return (
    <div
      className="max-w-6xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      <SeasonsTable
        playerType={playerType}
        seasons={seasons}
      />
    </div>
  );
};

export default PlayerSeasons;
