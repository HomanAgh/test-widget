"use client";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CareerTable from "./PlayerCareerTable"; // Table component for displaying stats
import type { CareerStats } from "@/app/types/player";

interface PlayerCareerProps {
  playerId: string;
  backgroundColor: string;
}

const PlayerCareers: React.FC<PlayerCareerProps> = ({ playerId, backgroundColor }) => {
  const { t } = useTranslation(); // Translation hook
  const [careers, setCareers] = useState<CareerStats[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerCareers = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch player career stats from the custom API route
        const response = await fetch(`/api/playerCareer?playerId=${playerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch player career data.");
        }

        const data = await response.json();

        console.log("Fetched Player Career Stats:", data); // Debug log

        if (!data || !data.stats) {
          console.error("No stats available in the response:", data); // Debug log
          setError("NoStatsAvailable");
          return;
        }

        // Map stats to the required format
        const mappedCareers = data.stats.map((career: any) => ({
          league: career.league,
          numberOfSeasons: career.numberOfSeasons || 0,
          gamesPlayed: career.stats.gamesPlayed,
          ...(career.stats.goalsAgainstAverage !== undefined
            ? {
                goalsAgainstAverage: career.stats.goalsAgainstAverage,
                savePercentage: career.stats.savePercentage,
                shutouts: career.stats.shutouts,
              }
            : {
                goals: career.stats.goals,
                assists: career.stats.assists,
                points: career.stats.points,
              }),
        }));

        setCareers(mappedCareers);
        console.log("Mapped Careers:", mappedCareers); // Debug log
      } catch (err) {
        console.error("Error fetching player career data:", err); // Error log
        setError(t("ErrorOccurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCareers();
  }, [playerId]);

  if (loading) {
    return <div className="text-center text-gray-600">{t("Loading")}</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{t("ErrorOccurred")}: {error}</div>;
  }

  return (
    <div
      className="max-w-6xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor }}
    >
      {careers && (
        <CareerTable
          careers={careers}
        />
      )}
    </div>
  );
};

export default PlayerCareers;
