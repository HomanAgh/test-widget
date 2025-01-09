"use client";

import React from "react";
import useSWR from "swr";
import CareerTable from "./PlayerCareerTable"; // Table component for displaying stats
import type { CareerStats } from "@/app/types/player";

interface PlayerCareerProps {
  playerId: string;
  backgroundColor?: string;
  textColor?: string; // NEW
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
  backgroundColor = "#FFFFFF", // default if not provided
  textColor = "#000000",       // default if not provided
}) => {
  // Use SWR to fetch the player's career data
  const { data, error } = useSWR(`/api/playerCareer?playerId=${playerId}`, fetcher);

  // Handle loading state
  if (!data && !error) {
    return <div className="text-center text-gray-600">{"Loading..."}</div>;
  }

  // Handle error state
  if (error) {
    return <div className="text-center text-red-600">{"Error Occurred"}: {error.message}</div>;
  }

  // Now we have data and no error
  if (!data || !data.stats) {
    return <div className="text-center text-red-600">{"Error Occurred"}: NoStatsAvailable</div>;
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

  console.log("Mapped Careers:", careers); // Debug log

  return (
    <div
      className="max-w-6xl mx-auto my-8 p-6 rounded-lg shadow-lg"
      style={{
        backgroundColor,
        color: textColor, // ensure text inherits our chosen color
      }}
    >
      <h2 className="text-2xl font-bold mb-4">Career Statistics</h2>
      {careers && (
        <CareerTable
          careers={careers}
          backgroundColor={backgroundColor} // pass to the table
          textColor={textColor}            // pass to the table
        />
      )}
    </div>
  );
};

export default PlayerCareers;
