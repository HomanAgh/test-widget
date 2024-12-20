import { useState, useEffect } from 'react';
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/player';
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
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20; // Number of players per request

  // Fetch players from API
  const fetchPlayers = async (reset: boolean = false) => {
    if (!selectedTeam && !leagueParam) {
      setError('Either a team or league must be selected.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = `/api/alumni?offset=${reset ? 0 : offset}&limit=${limit}`;
      if (selectedTeam) url += `&query=${encodeURIComponent(selectedTeam)}`;
      if (leagueParam) {
        url += `&league=${leagueParam}`;
      } else {
        url += `&fetchAllLeagues=true`; // Indicate fetching for all leagues
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');

      const data = (await response.json()) as AlumniAPIResponse;

      // Map players to the AlumniPlayer type
      const players: AlumniPlayer[] = data.players.map((player) => ({
        id: player.id,
        name: player.name,
        birthYear: player.birthYear || null,
      }));

      // Fetch additional draft pick and team data
      const draftPickAndTeamData = await fetchDraftPicksAndTeams(
        players.map((p) => p.id),
        leagueParam
      );

      const playersWithAdditionalData = players.map((player) => ({
        ...player,
        draftPick: draftPickAndTeamData[player.id]?.draftPick || 'N/A',
        teams: draftPickAndTeamData[player.id]?.teams || [],
      }));

      setResults((prev) => {
        const combinedResults = reset
          ? playersWithAdditionalData
          : [...prev, ...playersWithAdditionalData];
        // Ensure unique results by player ID
        return Array.from(new Map(combinedResults.map((player) => [player.id, player])).values());
      });

      setOffset((prev) => prev + players.length);
      setHasMore(players.length === limit); // Check if there are more players to fetch
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  };

  // Watch for changes to selected team, active filter, or leagueParam
  useEffect(() => {
    if (selectedTeam || leagueParam) {
      setResults([]);
      setOffset(0);
      setHasMore(true);
      fetchPlayers(true); // Fetch new data and reset results
    }
  }, [selectedTeam, activeFilter, leagueParam]);

  return { results, loading, error, hasMore, fetchPlayers };
};
