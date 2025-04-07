"use client";

import React, { useEffect, useState } from "react";
import ScoringLeadersTable from "./ScoringLeadersTable";
import { ScoringLeadersResponse } from "@/app/types/scoringLeaders";
import SeasonSelector from "@/app/components/common/SeasonSelector";

interface ScoringLeadersProps {
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
  positionFilter?: string;
  nationalityFilter?: string;
}

const ScoringLeaders: React.FC<ScoringLeadersProps> = ({
  leagueSlug,
  season,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  hideSeasonSelector = false,
  positionFilter = "all",
  nationalityFilter = "all",
}) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  let seasonStartYear = currentYear;
  if (currentMonth < 9) {
    seasonStartYear = currentYear - 1;
  }

  // Generate a default season
  const defaultSeason = season || `${seasonStartYear}-${seasonStartYear + 1}`;
  const [selectedSeason, setSelectedSeason] = useState<string>(defaultSeason);
  const [scoringLeaders, setScoringLeaders] =
    useState<ScoringLeadersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>("");

  useEffect(() => {
    const fetchScoringLeaders = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const params = new URLSearchParams();
        params.append("season", selectedSeason);
        if (positionFilter !== "all") {
          params.append("position", positionFilter);
        }
        if (nationalityFilter !== "all") {
          params.append("nationality", nationalityFilter);
        }

        console.log("Fetching scoring leaders with params:", params.toString());
        const response = await fetch(
          `/api/league/${leagueSlug}/scoring-leaders?${params.toString()}`
        );

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(
            errorData.error || "Failed to fetch scoring leaders data"
          );
        }

        const data = await response.json();
        console.log("Received data:", data);

        // Validate the data structure
        if (!data) {
          console.error("Empty data received from API");
          throw new Error("No data received from API");
        }

        // If data.error exists, it's an error response
        if (data.error) {
          console.error("API returned an error:", data.error);
          throw new Error(data.error);
        }

        // Ensure data.data exists and is an array
        if (!data.data || !Array.isArray(data.data)) {
          console.error("Invalid data structure:", data);
          throw new Error("Invalid data structure received from API");
        }

        // Try to extract league name from the first player's data
        if (data.data.length > 0) {
          const firstPlayer = data.data[0];
          if (
            firstPlayer.team &&
            firstPlayer.team.league &&
            firstPlayer.team.league.name
          ) {
            setLeagueName(firstPlayer.team.league.name);
          }
        }

        setScoringLeaders(data);
      } catch (err: any) {
        console.error("Error fetching scoring leaders:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchScoringLeaders();
  }, [leagueSlug, selectedSeason, positionFilter, nationalityFilter]);

  // Handler for the SeasonSelector component
  const handleSeasonChange = (newSeason: string) => {
    setSelectedSeason(newSeason);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600 my-8">
        Loading scoring leaders...
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-600 my-8">Error: {error}</div>;
  }
  if (
    !scoringLeaders ||
    !scoringLeaders.data ||
    scoringLeaders.data.length === 0
  ) {
    return <div className="text-center my-8">No scoring data available</div>;
  }

  const leagueDisplay = leagueName || leagueSlug.toUpperCase();

  // Extract unique nationalities from the data
  const nationalities = new Set<string>();
  scoringLeaders.data.forEach((player) => {
    if (
      player.player?.nationality &&
      typeof player.player.nationality === "object"
    ) {
      nationalities.add(player.player.nationality.slug);
    }
  });

  return (
    <div className="max-w-6xl mx-auto my-8">
      {!hideSeasonSelector && (
        <SeasonSelector
          leagueSlug={leagueSlug}
          initialSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
        />
      )}
      <ScoringLeadersTable
        scoringLeaders={scoringLeaders}
        leagueDisplay={leagueDisplay}
        selectedSeason={selectedSeason}
        customColors={customColors}
      />
    </div>
  );
};

export default ScoringLeaders;
