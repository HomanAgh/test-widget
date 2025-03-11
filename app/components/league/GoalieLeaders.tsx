'use client';

import React, { useEffect, useState } from 'react';
import GoalieLeadersTable, { getEliteProspectsStatsUrl } from './GoalieLeadersTable';
import { GoalieLeadersResponse } from '@/app/types/goalieLeaders';
import { Link } from '@/app/components/common/style';

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
}

const GoalieLeaders: React.FC<GoalieLeadersProps> = ({ 
  leagueSlug,
  season = "2024-2025",
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6"
  }
}) => {
  const [goalieLeaders, setGoalieLeaders] = useState<GoalieLeadersResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState<string>(season);
  const [seasonsArray, setSeasonsArray] = useState<string[]>([]);

  const getEPUrl = () => {
    return getEliteProspectsStatsUrl(leagueSlug, selectedSeason);
  };

  // Fetch available seasons for the league
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await fetch(`/api/seasons?leagueSlug=${leagueSlug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch seasons: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data && data.seasons && Array.isArray(data.seasons)) {
          // Sort seasons in descending order (newest first)
          const sortedSeasons = [...data.seasons].sort((a, b) => {
            const yearA = parseInt(a.split('-')[0]);
            const yearB = parseInt(b.split('-')[0]);
            return yearB - yearA;
          });
          
          setSeasonsArray(sortedSeasons);
          
          // If the provided season is not in the list, use the most recent one
          if (!sortedSeasons.includes(selectedSeason) && sortedSeasons.length > 0) {
            setSelectedSeason(sortedSeasons[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching seasons:", error);
        // Set a default array of recent seasons if API fails
        const currentYear = new Date().getFullYear();
        const defaultSeasons = [];
        for (let i = 0; i < 5; i++) {
          defaultSeasons.push(`${currentYear - i}-${currentYear - i + 1}`);
        }
        setSeasonsArray(defaultSeasons);
      }
    };

    fetchSeasons();
  }, [leagueSlug, selectedSeason]);

  // Fetch goalie leaders data
  useEffect(() => {
    const fetchGoalieLeaders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/league/${leagueSlug}/goalie-leaders?season=${selectedSeason}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch goalie leaders: ${response.statusText}`);
        }
        
        const data = await response.json();
        setGoalieLeaders(data);
        
        // Try to get league name from the first player's team
        if (data && data.data && data.data.length > 0 && data.data[0].team?.league?.name) {
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

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(e.target.value);
  };

  if (loading) {
    return <div className="text-center text-gray-600 my-8">Loading goalie leaders...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 my-8">Error: {error}</div>;
  }
  if (!goalieLeaders || !goalieLeaders.data || goalieLeaders.data.length === 0) {
    return <div className="text-center my-8">No goalie data available</div>;
  }

  const leagueDisplay = leagueName || leagueSlug.toUpperCase();

  return (
    <div className="max-w-6xl mx-auto my-8" style={{ color: customColors.textColor }}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Goalie Leaders in the{' '}
          <Link 
            href={getEPUrl()}
            style={{ color: customColors.nameTextColor }}
            className="cursor-pointer hover:underline"
          >
            {leagueDisplay} {selectedSeason}
          </Link>
        </h2>
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
