'use client';

import React, { useEffect, useState } from 'react';
import ScoringLeadersTable, { getEliteProspectsStatsUrl } from './ScoringLeadersTable';
import { ScoringLeadersResponse } from '@/app/types/scoringLeaders';

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
}

const ScoringLeaders: React.FC<ScoringLeadersProps> = ({ 
  leagueSlug, 
  season,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6"
  },
  hideSeasonSelector = false
}) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1; 

  let seasonStartYear = currentYear;
  if (currentMonth < 9) {
    seasonStartYear = currentYear - 1;
  }

  const SEASONS_BACK = 19;
  const seasonsArray: string[] = [];
  for (let y = seasonStartYear; y >= seasonStartYear - SEASONS_BACK; y--) {
    seasonsArray.push(`${y}-${y + 1}`);
  }

  const [selectedSeason, setSelectedSeason] = useState<string>(season || seasonsArray[0]);
  const [scoringLeaders, setScoringLeaders] = useState<ScoringLeadersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>("");

  useEffect(() => {
    const fetchScoringLeaders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/league/${leagueSlug}/scoring-leaders?season=${encodeURIComponent(selectedSeason)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch scoring leaders data");
        }
        const data = await response.json();
        
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
          if (firstPlayer.team && firstPlayer.team.league && firstPlayer.team.league.name) {
            setLeagueName(firstPlayer.team.league.name);
          }
        }
        
        // Process the data to ensure all required fields exist
        const processedData = {
          ...data,
          data: data.data.map((item: any) => ({
            id: item.id || Math.random().toString(36).substr(2, 9),
            player: {
              id: item.player?.id || 0,
              firstName: item.player?.firstName || '',
              lastName: item.player?.lastName || '',
              name: item.player?.name || `${item.player?.firstName || ''} ${item.player?.lastName || ''}`,
              slug: item.player?.slug || item.player?.id?.toString() || '',
              position: '',
              nationality: '',
              ...item.player
            },
            team: {
              id: item.team?.id || 0,
              name: item.team?.name || '',
              // Generate a slug if it doesn't exist
              slug: item.team?.slug || item.team?.id?.toString() || '',
              league: item.team?.league || {},
              ...item.team
            },
            regularStats: {
              GP: item.regularStats?.GP || 0,
              G: item.regularStats?.G || 0,
              A: item.regularStats?.A || 0,
              PTS: item.regularStats?.PTS || 0,
              ...item.regularStats
            },
            season: item.season || { slug: selectedSeason },
            ...item
          }))
        };
        
        setScoringLeaders(processedData);
      } catch (err: any) {
        console.error("Error fetching scoring leaders:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchScoringLeaders();
  }, [leagueSlug, selectedSeason]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  const getEPUrl = () => {
    return getEliteProspectsStatsUrl(leagueSlug, selectedSeason);
  };

  if (loading) {
    return <div className="text-center text-gray-600 my-8">Loading scoring leaders...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 my-8">Error: {error}</div>;
  }
  if (!scoringLeaders || !scoringLeaders.data || scoringLeaders.data.length === 0) {
    return <div className="text-center my-8">No scoring data available</div>;
  }

  const leagueDisplay = leagueName || leagueSlug.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto my-8">
      {!hideSeasonSelector && (
        <div className="text-center mb-6">
          <div className="flex justify-center items-center mb-4">
            <label htmlFor="season-select" className="mr-2 font-semibold">
              Select Season:
            </label>
            <select
              id="season-select"
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="border px-3 py-1 rounded"
            >
              {seasonsArray.map((seasonOption) => (
                <option key={seasonOption} value={seasonOption}>
                  {seasonOption}
                </option>
              ))}
            </select>
          </div>
        </div>
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