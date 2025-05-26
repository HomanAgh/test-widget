"use client";

import { useState, useEffect } from "react";

export interface CurrentPlayer {
  id: number;
  name: string;
  birthYear: number | null;
  gender: string | null;
  position: string | null;
  status: string | null;
  youthTeam: string | null;
  draftPick: any;
  currentTeams: Array<{
    name: string;
    leagueLevel: string;
    leagueSlug: string;
    isCurrentTeam: boolean;
  }>;
}

export interface CurrentPlayersResponse {
  players: CurrentPlayer[];
  total: number;
}

type GenderParam = "male" | "female" | null;

export const useFetchCurrentPlayers = (
  teamIds: number[],
  leagueType: string,
  leagues: string,
  includeYouth: boolean,
  youthTeam: string | null,
  genderParam: GenderParam
) => {
  const [results, setResults] = useState<CurrentPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentPlayers = async () => {
      if (teamIds.length === 0) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('🔍 [useFetchCurrentPlayers] Starting fetch with params:', {
          teamIds,
          leagueType,
          leagues,
          includeYouth,
          youthTeam,
          genderParam
        });

        const params = new URLSearchParams();
        params.append("teamIds", teamIds.join(","));
        
        if (leagues) {
          params.append("league", leagues);
        }
        
        if (includeYouth) {
          params.append("includeYouth", "true");
          if (youthTeam) {
            params.append("teams", youthTeam);
          }
        }
        
        if (genderParam) {
          params.append("gender", genderParam);
        }

        const url = `/api/where-are-they-now?${params.toString()}`;
        console.log('🌐 [useFetchCurrentPlayers] Fetching from URL:', url);

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: CurrentPlayersResponse = await response.json();
        console.log('✅ [useFetchCurrentPlayers] Received data:', {
          totalPlayers: data.total,
          playersWithCurrentTeams: data.players.filter(p => p.currentTeams.length > 0).length
        });

        setResults(data.players);
      } catch (err) {
        console.error('❌ [useFetchCurrentPlayers] Error fetching current players:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlayers();
  }, [teamIds, leagueType, leagues, includeYouth, youthTeam, genderParam]);

  return { results, loading, error };
}; 