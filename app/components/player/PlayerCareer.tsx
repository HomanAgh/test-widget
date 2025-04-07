"use client";

import React from "react";
import useSWR from "swr";
import CareerTable from "./PlayerCareerTable"; // Table component for displaying stats
import type { CareerStats } from "@/app/types/player";

interface PlayerCareerProps {
  playerId: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

// Define a fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to fetch player career data.");
    }
    return res.json();
  });

const PlayerCareers: React.FC<PlayerCareerProps> = ({
  playerId,
  customColors,
}) => {
  // Use SWR to fetch the player's career data
  const { data, error } = useSWR(
    `/api/playerCareer?playerId=${playerId}`,
    fetcher
  );

  // Handle loading state
  if (!data && !error) {
    return <div className="text-center text-gray-600">{"Loading..."}</div>;
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center text-red-600">
        {"Error Occurred"}: {error.message}
      </div>
    );
  }

  // Now we have data and no error
  if (!data || !data.stats) {
    return (
      <div className="text-center text-red-600">
        {"Error Occurred"}: NoStatsAvailable
      </div>
    );
  }

  console.log("Fetched Player Career Stats:", data); // Debug log

  // Map stats to the required format
  const careers: CareerStats[] = data.stats.map((career: any) => ({
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
          plusMinus: career.stats.plusMinus,
        }),
  }));

  console.log("Mapped Careers:", careers);

  return (
    <>
      {careers && <CareerTable careers={careers} customColors={customColors} />}
    </>
  );
};

export default PlayerCareers;
