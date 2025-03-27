"use client";

import React, { useEffect, useState } from "react";
import GoalieLeadersTable from "./GoalieLeadersTable";
import { GoalieLeadersResponse } from "@/app/types/goalieLeaders";
import SeasonSelector from "@/app/components/common/SeasonSelector";

interface GoalieLeadersProps {
  leagueSlug: string;
  season: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  hideSeasonSelector?: boolean;
}

const GoalieLeaders: React.FC<GoalieLeadersProps> = ({
  leagueSlug,
  season = "2024-2025",
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  hideSeasonSelector = false,
}) => {
  const [goalieLeaders, setGoalieLeaders] =
    useState<GoalieLeadersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>(season);

  // Fetch goalie leaders data
  useEffect(() => {
    const fetchGoalieLeaders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/league/${leagueSlug}/goalie-leaders?season=${selectedSeason}`
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch goalie leaders: ${response.statusText}`
          );
        }

        const data = await response.json();
        setGoalieLeaders(data);

        // Try to get league name from the first player's team
        if (
          data &&
          data.data &&
          data.data.length > 0 &&
          data.data[0].team?.league?.name
        ) {
          setLeagueName(data.data[0].team.league.name);
        }
      } catch (error: any) {
        console.error("Error fetching goalie leaders:", error);
        setError(error.message || "Failed to load goalie leaders");
      } finally {
        setLoading(false);
      }
    };

    if (leagueSlug && selectedSeason) {
      fetchGoalieLeaders();
    }
  }, [leagueSlug, selectedSeason]);

  // Handler for the SeasonSelector component
  const handleSeasonChange = (newSeason: string) => {
    setSelectedSeason(newSeason);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 my-8">
        Loading goalie leaders...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600 my-8">Error: {error}</div>;
  }
  if (
    !goalieLeaders ||
    !goalieLeaders.data ||
    goalieLeaders.data.length === 0
  ) {
    return <div className="text-center my-8">No goalie data available</div>;
  }

  const leagueDisplay = leagueName || leagueSlug.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto my-8">
      {!hideSeasonSelector && (
        <SeasonSelector
          leagueSlug={leagueSlug}
          initialSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
        />
      )}
      <GoalieLeadersTable
        goalieLeaders={goalieLeaders}
        leagueDisplay={leagueDisplay}
        selectedSeason={selectedSeason}
        customColors={customColors}
      />
    </div>
  );
};

export default GoalieLeaders;
