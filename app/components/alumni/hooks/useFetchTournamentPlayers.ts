import { useState, useEffect, useRef, useCallback } from 'react';
import isEqual from 'lodash.isequal';
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/alumni';

// Create a module-level cache object
const playersCache = new Map<string, AlumniPlayer[]>();

export function useFetchTournamentPlayers(
  selectedTournaments: string[],
  leagueParam: string | null,
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Build a cache key representing the current query parameters.
  const cacheKey = JSON.stringify({
    tournaments: [...selectedTournaments].sort(),
    leagueParam,
  });

  // Refs to track previous parameter values
  const prevTournamentsRef = useRef<string[]>([]);
  const prevLeagueRef = useRef<string | null>(null);

  const limit = 500;

  const fetchPlayers = useCallback(async (reset = false) => {
    // Basic guard: if no tournaments are selected, nothing to fetch
    if (selectedTournaments.length === 0) {
      setError('Please select at least one tournament.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = `/api/alumni/tournament?offset=${reset ? 0 : offset}&limit=${limit}`;

      // Add tournaments parameter
      url += `&tournaments=${encodeURIComponent(selectedTournaments.join(','))}`;

      // Add leagues parameter if provided
      if (leagueParam) {
        const leagueString = Array.isArray(leagueParam)
          ? leagueParam.join(',')
          : leagueParam;
        url += `&leagues=${encodeURIComponent(leagueString)}`;
      }

      console.log('useFetchTournamentPlayers: GET =>', url);

      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch players. Status: ${response.status}`);
      }

      const data = (await response.json()) as AlumniAPIResponse;
      console.log('API response data:', data);
      
      if (!data.players) {
        setError('No players returned from API.');
        setLoading(false);
        return;
      }

      const newPlayers = data.players;
      console.log(`Received ${newPlayers.length} players from API`);
      
      const combined = reset ? newPlayers : [...results, ...newPlayers];

      // De-duplicate players by id
      const deduped = Array.from(new Map(combined.map((p) => [p.id, p])).values());

      setResults(deduped);
      playersCache.set(cacheKey, deduped);

      if (reset) {
        setOffset(newPlayers.length);
      } else {
        setOffset((prev) => prev + newPlayers.length);
      }
      setHasMore(newPlayers.length === limit);
    } catch (err) {
      console.error('useFetchTournamentPlayers error:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  }, [selectedTournaments, leagueParam, offset, results, cacheKey]);

  // Effect to trigger a refetch if relevant inputs changed
  useEffect(() => {
    const tournamentsChanged = !isEqual(prevTournamentsRef.current, selectedTournaments);
    const leagueChanged = prevLeagueRef.current !== leagueParam;
    
    console.log('Tournaments changed:', tournamentsChanged, 'League changed:', leagueChanged);

    if (tournamentsChanged || leagueChanged) {
      if (playersCache.has(cacheKey)) {
        console.log('Using cached data for tournaments:', selectedTournaments);
        setResults(playersCache.get(cacheKey)!);
      } else {
        console.log('Fetching new data for tournaments:', selectedTournaments);
        setResults([]);
        setOffset(0);
        setHasMore(true);
        fetchPlayers(true);
      }

      // Update previous parameter refs
      prevTournamentsRef.current = [...selectedTournaments];
      prevLeagueRef.current = leagueParam;
    }
  }, [selectedTournaments, leagueParam, cacheKey, fetchPlayers]);

  return { results, loading, error, hasMore, fetchPlayers };
} 