'use client';

import { useEffect, useState } from 'react';
import { LeaguePlayoffResponse } from '@/app/types/leaguePlayoff';
import LeaguePlayoffBracket from './LeaguePlayoffBracket';
import SeasonSelector from '@/app/components/common/SeasonSelector';
import LeaguePlayoffTree from './LeaguePlayoffTree';

interface LeaguePlayoffProps {
  leagueId: string;
  season?: string;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  hideSeasonSelector?: boolean;
}

export default function LeaguePlayoff({ 
  leagueId, 
  season,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  hideSeasonSelector = false
}: LeaguePlayoffProps) {
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
  const [data, setData] = useState<LeaguePlayoffResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with the season prop if provided
  useEffect(() => {
    if (season) {
      setCurrentSeason(season);
    }
  }, [season]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/leaguePlayoff/${leagueId}?season=${currentSeason}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        
        const playoffData = await response.json();
        setData(playoffData);
      } catch (err) {
        console.error('Error fetching playoff data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leagueId, currentSeason]);

  // Handler for the SeasonSelector component
  const handleSeasonChange = (newSeason: string) => {
    setCurrentSeason(newSeason);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <h3 className="font-bold">Error loading playoff data</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || !data.bracket) {
    return (
      <div className="p-4 bg-gray-50 text-gray-700 rounded-md">
        <p>No playoff data available for this league and season.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {!hideSeasonSelector && (
        <div className="mb-4 flex justify-end">
          <SeasonSelector
            leagueSlug={leagueId}
            initialSeason={currentSeason}
            onSeasonChange={handleSeasonChange}
          />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-center">Playoff Bracket</h2>
      <LeaguePlayoffBracket bracket={data.bracket} />
    </div>
  );
}
