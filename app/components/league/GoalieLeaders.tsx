"use client";

import React, { useEffect, useState } from "react";
import GoalieLeadersTable from "./GoalieLeadersTable";
import { GoalieLeadersResponse } from "@/app/types/goalieLeaders";
import SeasonSelector from "@/app/components/common/SeasonSelector";
import StatsTypeSelector from "@/app/components/common/StatsTypeSelector";

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
  hideStatsTypeSelector?: boolean;
  nationalityFilter?: string;
  defaultStatsType?: "regular" | "postseason";
  onStatsTypeChange?: (statsType: "regular" | "postseason") => void;
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
  hideStatsTypeSelector = false,
  nationalityFilter = "all",
  defaultStatsType = "regular",
  onStatsTypeChange,
}) => {
  const [goalieLeaders, setGoalieLeaders] =
    useState<GoalieLeadersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>(season);
  const [currentNationalityFilter, setCurrentNationalityFilter] =
    useState<string>(nationalityFilter);
  const [statsType, setStatsType] = useState<"regular" | "postseason">(
    defaultStatsType
  );
  const [hasPlayoffStats, setHasPlayoffStats] = useState<boolean>(false);

  // Fetch goalie leaders data
  useEffect(() => {
    const fetchGoalieLeaders = async () => {
      setLoading(true);
      setError(null);

      try {
        // Include statsType to fetch the appropriate dataset
        const response = await fetch(
          `/api/league/${leagueSlug}/goalie-leaders?season=${selectedSeason}&nationality=${currentNationalityFilter}&statsType=${statsType}`
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

        // Check if data has playoff stats
        const hasPlayoffs = data.data?.some(
          (player: any) =>
            player.postseasonStats &&
            (player.postseasonStats.GP > 0 || player.postseasonStats.SVP > 0)
        );
        setHasPlayoffStats(hasPlayoffs);
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
  }, [leagueSlug, selectedSeason, currentNationalityFilter, statsType]);

  // Update currentNationalityFilter when prop changes
  useEffect(() => {
    setCurrentNationalityFilter(nationalityFilter);
  }, [nationalityFilter]);

  // Handler for the SeasonSelector component
  const handleSeasonChange = (newSeason: string) => {
    setSelectedSeason(newSeason);
  };

  // Handler for the StatsTypeSelector component
  const handleStatsTypeChange = (newStatsType: "regular" | "postseason") => {
    setStatsType(newStatsType);
    if (onStatsTypeChange) {
      onStatsTypeChange(newStatsType);
    }
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
      <div className="w-full text-center mt-6 mb-4 flex justify-center items-center">
        {!hideSeasonSelector && (
          <SeasonSelector
            leagueSlug={leagueSlug}
            initialSeason={selectedSeason}
            onSeasonChange={handleSeasonChange}
          />
        )}

        {!hideStatsTypeSelector && (
          <StatsTypeSelector
            statsType={statsType}
            onChange={handleStatsTypeChange}
            hasPlayoffStats={hasPlayoffStats}
          />
        )}
      </div>
      <GoalieLeadersTable
        goalieLeaders={goalieLeaders}
        leagueDisplay={leagueDisplay}
        selectedSeason={selectedSeason}
        statsType={statsType}
        customColors={customColors}
      />
    </div>
  );
};

export default GoalieLeaders;
