"use client";

import React, { useState, useEffect } from "react";

interface SeasonSelectorProps {
  leagueSlug: string;
  initialSeason: string;
  onSeasonChange: (season: string) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  leagueSlug,
  initialSeason,
  onSeasonChange,
}) => {
  const [seasonsArray, setSeasonsArray] = useState<string[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);
  const [loading, setLoading] = useState(true);

  // Initial setup - only run once on mount using initialSeason
  useEffect(() => {
    console.log("SeasonSelector - initialSeason updated:", initialSeason);
    setSelectedSeason(initialSeason);
  }, [initialSeason]);

  // Fetch available seasons for the league
  useEffect(() => {
    console.log("SeasonSelector - Fetching seasons for league:", leagueSlug);
    let isMounted = true;
    const fetchSeasons = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/seasons?leagueSlug=${leagueSlug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch seasons: ${response.statusText}`);
        }
        const data = await response.json();

        if (!isMounted) return;

        if (data && data.seasons && Array.isArray(data.seasons)) {
          // Sort seasons in descending order (newest first)
          const sortedSeasons = [...data.seasons].sort((a, b) => {
            const yearA = parseInt(a.split("-")[0]);
            const yearB = parseInt(b.split("-")[0]);
            return yearB - yearA;
          });

          console.log("SeasonSelector - Seasons fetched:", sortedSeasons);
          setSeasonsArray(sortedSeasons);

          // If the provided season is not in the list, use the most recent one
          if (
            sortedSeasons.length > 0 &&
            !sortedSeasons.includes(selectedSeason)
          ) {
            const defaultSeason = sortedSeasons[0];
            console.log(
              "SeasonSelector - Selected season not in list, defaulting to:",
              defaultSeason
            );
            setSelectedSeason(defaultSeason);
            onSeasonChange(defaultSeason);
          }
        }
      } catch (error) {
        console.error("SeasonSelector - Error fetching seasons:", error);
        // Set a default array of recent seasons if API fails
        if (!isMounted) return;

        const currentYear = new Date().getFullYear();
        const defaultSeasons = [];
        for (let i = 0; i < 5; i++) {
          defaultSeasons.push(`${currentYear - i}-${currentYear - i + 1}`);
        }
        console.log("SeasonSelector - Using fallback seasons:", defaultSeasons);
        setSeasonsArray(defaultSeasons);

        // Set the initial season if available, otherwise use the current year
        if (
          !defaultSeasons.includes(selectedSeason) &&
          defaultSeasons.length > 0
        ) {
          const fallbackSeason = defaultSeasons[0];
          console.log(
            "SeasonSelector - Using fallback season:",
            fallbackSeason
          );
          setSelectedSeason(fallbackSeason);
          onSeasonChange(fallbackSeason);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSeasons();

    return () => {
      isMounted = false;
    };
  }, [leagueSlug]); // Only re-fetch when leagueSlug changes, not when selectedSeason changes

  const handleSeasonChange = (season: string) => {
    console.log("SeasonSelector - Season change triggered:", season);
    setSelectedSeason(season);
    onSeasonChange(season);
  };

  // If no seasons available yet, show a loading state
  if (loading && seasonsArray.length === 0) {
    return (
      <div className="w-full text-center mt-6 mb-4">
        <span className="text-gray-500">Loading seasons...</span>
      </div>
    );
  }

  // If no seasons even after loading, show a message
  if (!loading && seasonsArray.length === 0) {
    return (
      <div className="w-full text-center mt-6 mb-4">
        <span className="text-gray-500">No seasons available</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center">
      <label htmlFor="season-select" className="mr-2 font-semibold">
        Select Season:
      </label>
      <select
        id="season-select"
        value={selectedSeason}
        onChange={(e) => handleSeasonChange(e.target.value)}
        className="border px-3 py-1 rounded font-sans"
      >
        {seasonsArray.map((seasonOption) => (
          <option key={seasonOption} value={seasonOption}>
            {seasonOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SeasonSelector;
