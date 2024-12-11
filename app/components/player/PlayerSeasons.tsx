"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SeasonsTable from "./PlayerSeasonsTable"; // New table component for seasons
import type { SeasonStats, PlayerType } from "@/app/types/player";

interface PlayerSeasonsProps {
  playerId: string;
  backgroundColor: string;
}

const PlayerSeasons: React.FC<PlayerSeasonsProps> = ({ playerId, backgroundColor }) => {
  const { t } = useTranslation(); // Translation hook
  const [playerType, setPlayerType] = useState<PlayerType | null>(null);
  const [seasons, setSeasons] = useState<SeasonStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerSeasons = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch player seasonal stats from the API
        const response = await fetch(`/api/playerSeasons?playerId=${playerId}`);
        const data = await response.json();

        console.log("Fetched Player Seasons:", data); // Debug log

        if (!data || !data.stats) {
          console.error("Missing stats in API response:", data); // Debug log
          setError("NoStatsAvailable");
          return;
        }

        // Determine if the player is a GOALTENDER or SKATER
        const type: PlayerType = data.stats[0]?.role === "GOALTENDER" ? "GOALTENDER" : "SKATER";
        setPlayerType(type);

        // Map the seasonal stats
        const mappedSeasons = data.stats.map((season: any) => ({
          season: season.season,
          teamName: season.teamName,
          teamId: season.teamId,
          league: season.league,
          role: season.role,
          gamesPlayed: season.stats.gamesPlayed,
          ...(type === "GOALTENDER"
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

        setSeasons(mappedSeasons);
        console.log("Mapped Seasons:", mappedSeasons); // Debug log
      } catch (err) {
        console.error("Error fetching player seasons:", err); // Error log
        setError("ErrorOccurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerSeasons();
  }, [playerId]); 

  if (loading) return <div className="text-center text-gray-600">{t("Loading")}</div>;
  if (error) return <div className="text-center text-red-600">{t("ErrorOccurred")}: {error}</div>;

  return (
    <div
      className="max-w-6xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      {playerType && seasons && (
        <SeasonsTable
          playerType={playerType}
          seasons={seasons}
        />
      )}
    </div>
  );
};

export default PlayerSeasons;
