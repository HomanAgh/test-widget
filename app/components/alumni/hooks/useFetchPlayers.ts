/* import { useState, useEffect } from 'react';
import { AlumniPlayer, AlumniAPIResponse, DraftPickAPIResponse } from '@/app/types/player';

export const useFetchPlayers = (
  selectedTeam: string | null,
  activeFilter: string,
  leagueParam: string | null
) => {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchPlayers = async () => {
      setLoading(true);
      setError('');
      setResults([]);

      try {
        let url = `/api/alumni?query=${encodeURIComponent(selectedTeam)}`;
        if (leagueParam) url += `&league=${leagueParam}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const data = (await response.json()) as AlumniAPIResponse;
        const players: AlumniPlayer[] = data.players.map((player) => ({
          id: player.id,
          name: player.name,
          birthYear: player.birthYear || NaN,
        }));

        const draftPickAndTeamData = await fetchDraftPicksAndTeams(players.map((p) => p.id), leagueParam);

        const playersWithAdditionalData = players.map((player) => ({
          ...player,
          draftPick: draftPickAndTeamData[player.id]?.draftPick || 'N/A',
          teams: draftPickAndTeamData[player.id]?.teams || [],
        }));

        setResults(playersWithAdditionalData);
      } catch (err) {
        setError('Failed to fetch players.');
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedTeam, activeFilter, leagueParam]);

  const fetchDraftPicksAndTeams = async (
    playerIds: number[],
    league: string | null
  ): Promise<Record<number, { draftPick: string; teams: string[] }>> => {
    try {
      const idsString = playerIds.join(',');
      let url = `/api/draftpicks?playerIds=${idsString}`;
      if (league) url += `&league=${league}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch draft picks and teams.');

      const data = (await response.json()) as DraftPickAPIResponse;
      return data.players.reduce((acc, entry) => {
        acc[entry.playerId] = {
          draftPick: entry.draftPick || 'N/A',
          teams: entry.teams || [],
        };
        return acc;
      }, {} as Record<number, { draftPick: string; teams: string[] }>);
    } catch (err) {
      console.error('Error fetching draft picks and teams:', err);
      return {};
    }
  };

  return { results, loading, error };
};


 */

import { useState, useEffect } from 'react';
import { AlumniPlayer, AlumniAPIResponse, DraftPickAPIResponse } from '@/app/types/player';
import { fetchDraftPicksAndTeams } from './fetchDraftPicksAndTeams';

export const useFetchPlayers = (
  selectedTeam: string | null,
  activeFilter: string,
  leagueParam: string | null
): {
  results: AlumniPlayer[];
  loading: boolean;
  error: string;
  hasMore: boolean;
  fetchPlayers: (reset?: boolean) => Promise<void>;
} => {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true); // New state to track if more players exist
  const [offset, setOffset] = useState(0); // Tracks current offset
  const limit = 20; // Number of players to fetch per request

  const fetchPlayers = async (reset: boolean = false) => {
    setLoading(true);
    setError('');
  
    try {
      let url = `/api/alumni?query=${encodeURIComponent(selectedTeam || '')}&offset=${offset}&limit=${limit}`;
      if (leagueParam) url += `&league=${leagueParam}`;
  
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');
  
      const data = (await response.json()) as AlumniAPIResponse;
      const players: AlumniPlayer[] = data.players.map((player) => ({
        id: player.id,
        name: player.name,
        birthYear: player.birthYear || NaN,
      }));
  
      const draftPickAndTeamData = await fetchDraftPicksAndTeams(players.map((p) => p.id), leagueParam);
  
      const playersWithAdditionalData = players.map((player) => ({
        ...player,
        draftPick: draftPickAndTeamData[player.id]?.draftPick || 'N/A',
        teams: draftPickAndTeamData[player.id]?.teams || [],
      }));
  
      setResults((prev) => {
        const combinedResults = reset ? playersWithAdditionalData : [...prev, ...playersWithAdditionalData];
        const uniqueResults = Array.from(
          new Map(combinedResults.map((player) => [player.id, player])).values()
        );
        return uniqueResults;
      });
  
      setOffset((prev) => prev + players.length);
      setHasMore(players.length === limit);
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  };
  
  /* useEffect(() => {
    if (selectedTeam) fetchPlayers(true); // Reset results when team changes
  }, [selectedTeam, activeFilter, leagueParam]); */
  useEffect(() => {
    if (selectedTeam || leagueParam) {
      setResults([]); // Clear results
      setOffset(0); // Reset offset
      setHasMore(true); // Allow fetching more
      fetchPlayers(true); // Fetch new data
    }
  }, [selectedTeam, activeFilter, leagueParam]);
  

  return { results, loading, error, hasMore, fetchPlayers };
};
