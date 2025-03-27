"use client";

import React, { useEffect, useState } from "react";
import LeagueTable from "./LeagueTable";
import type { LeagueTableProps } from "@/app/types/league";
import SeasonSelector from "@/app/components/common/SeasonSelector";

interface LeagueProps {
  leagueSlug: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  hideSeasonSelector?: boolean;
  season?: string;
}

const League: React.FC<LeagueProps> = ({
  leagueSlug,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  hideSeasonSelector = false,
  season,
}) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  let seasonStartYear = currentYear;
  if (currentMonth < 9) {
    seasonStartYear = currentYear - 1;
  }

  // Generate a default season string for initial load
  const defaultSeason = season || `${seasonStartYear}-${seasonStartYear + 1}`;
  const [currentSeason, setCurrentSeason] = useState<string>(defaultSeason);
  const [standings, setStandings] = useState<
    LeagueTableProps["standings"] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with the season prop if provided
  useEffect(() => {
    if (season) {
      setCurrentSeason(season);
    }
  }, [season]);

  useEffect(() => {
    const fetchLeagueStandings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/league/${leagueSlug}?season=${encodeURIComponent(
            currentSeason
          )}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch league data");
        }
        const data = await response.json();
        setStandings(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueStandings();
  }, [leagueSlug, currentSeason]);

  // Handler for the SeasonSelector component
  const handleSeasonChange = (newSeason: string) => {
    setCurrentSeason(newSeason);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }
  if (!standings) {
    return <div className="text-center">No standings available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 rounded-lg">
      {!hideSeasonSelector && (
        <SeasonSelector
          leagueSlug={leagueSlug}
          initialSeason={currentSeason}
          onSeasonChange={handleSeasonChange}
        />
      )}
      <LeagueTable
        key={`league-table-${leagueSlug}-${currentSeason}`}
        standings={standings}
        logoS=""
        backgroundColor={customColors.backgroundColor}
        textColor={customColors.textColor}
        tableBackgroundColor={customColors.tableBackgroundColor}
        headerTextColor={customColors.headerTextColor}
        nameTextColor={customColors.nameTextColor}
      />
    </div>
  );
};

export default League;
