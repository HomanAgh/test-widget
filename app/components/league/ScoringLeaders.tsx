'use client';

import React, { useEffect, useState } from 'react';
import ScoringLeadersTable, { getEliteProspectsStatsUrl } from './ScoringLeadersTable';
import { ScoringLeadersResponse } from '@/app/types/scoringLeaders';
import { Link } from '@/app/components/common/style';

interface ScoringLeadersProps {
  leagueSlug: string;
  season: string;
}

const ScoringLeaders: React.FC<ScoringLeadersProps> = ({ leagueSlug, season }) => {
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

  // Fetch league info to get the league name
  useEffect(() => {
    const fetchLeagueInfo = async () => {
      try {
        const response = await fetch(`/api/league/${leagueSlug}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.data && data.data.length > 0) {
            // Try to find the league name from the response
            const league = data.data[0];
            if (league.team && league.team.league && league.team.league.name) {
              setLeagueName(league.team.league.name);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching league info:", err);
      }
    };

    fetchLeagueInfo();
  }, [leagueSlug]);

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
        
        // Try to extract league name if not already set
        if (!leagueName && data.data.length > 0) {
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
  }, [leagueSlug, selectedSeason, leagueName]);

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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Scoring Leaders in the{' '}
          <Link 
            href={getEPUrl()}
            className="text-[#0D73A6] cursor-pointer hover:underline"
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
      <ScoringLeadersTable 
        scoringLeaders={scoringLeaders} 
        leagueDisplay={leagueDisplay}
        selectedSeason={selectedSeason}
      />
    </div>
  );
};

export default ScoringLeaders; 