import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/alumni';

// Create a module-level cache object
const playersCache = new Map<string, AlumniPlayer[]>();

export function useFetchPlayers(
  selectedTeamIds: number[],
  activeFilter: string | null,
  leagueParam: string | null,
  includeYouth: boolean,
  youthTeam: string | null,
  genderParam: 'male' | 'female' | null
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Build a cache key representing the current query parameters.
  // (Sorting team IDs if order doesn't matter can help avoid cache misses.)
  const cacheKey = JSON.stringify({
    teamIds: [...selectedTeamIds].sort((a, b) => a - b),
    leagueParam,
    activeFilter,
    includeYouth,
    youthTeam,
    genderParam,
  });

  // Refs to track previous parameter values
  const prevTeamIdsRef = useRef<number[]>([]);
  const prevLeagueRef = useRef<string | null>(null);
  const prevFilterRef = useRef<string | null>(null);
  const prevYouthRef = useRef<boolean>(false);
  const prevYouthTeamRef = useRef<string | null>(null);
  const prevGenderRef = useRef<'male' | 'female' | null>(null);

  const limit = 20;

  async function fetchPlayers(reset = false) {
    // Basic guard: if no team, league, or youth is selected, nothing to fetch
    if (selectedTeamIds.length === 0 && !leagueParam && !includeYouth) {
      setError('Either a team, a league, or youth team must be selected.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = `/api/alumni?offset=${reset ? 0 : offset}&limit=${limit}`;

      if (selectedTeamIds.length > 0) {
        url += `&teamIds=${encodeURIComponent(selectedTeamIds.join(','))}`;
      }
      if (leagueParam) {
        const leagueString = Array.isArray(leagueParam)
          ? leagueParam.join(',')
          : leagueParam;
        url += `&league=${encodeURIComponent(leagueString)}`;
      }      
      if (includeYouth && youthTeam) {
        url += `&includeYouth=true&teams=${encodeURIComponent(youthTeam)}`;
      }
      if (genderParam) {
        url += `&gender=${encodeURIComponent(genderParam)}`;
      }

      console.log('useFetchPlayers: GET =>', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');

      const data = (await response.json()) as AlumniAPIResponse;
      if (!data.players) {
        setError('No players returned from API.');
        setLoading(false);
        return;
      }

      const newPlayers = data.players;
      const combined = reset ? newPlayers : [...results, ...newPlayers];

      // De-duplicate players by id
      const deduped = Array.from(new Map(combined.map((p) => [p.id, p])).values());

      setResults(deduped);

      // Cache the results if this is a fresh query (reset)
      playersCache.set(cacheKey, deduped);

      if (reset) {
        setOffset(newPlayers.length);
      } else {
        setOffset((prev) => prev + newPlayers.length);
      }
      setHasMore(newPlayers.length === limit);
    } catch (err) {
      console.error('useFetchPlayers error:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  }

  // Effect to trigger a refetch if relevant inputs changed
  useEffect(() => {
    const teamIdsChanged = !isEqual(prevTeamIdsRef.current, selectedTeamIds);
    const leagueChanged = prevLeagueRef.current !== leagueParam;
    const filterChanged = prevFilterRef.current !== activeFilter;
    const youthChanged = prevYouthRef.current !== includeYouth;
    const youthTeamChanged = prevYouthTeamRef.current !== youthTeam;
    const genderChanged = prevGenderRef.current !== genderParam;

    if (
      teamIdsChanged ||
      leagueChanged ||
      filterChanged ||
      youthChanged ||
      youthTeamChanged ||
      genderChanged
    ) {
      // Check the cache first. If we have data, use it and avoid refetching.
      if (playersCache.has(cacheKey)) {
        setResults(playersCache.get(cacheKey)!);
        // Optionally, you could set hasMore to false or cache it as well.
      } else {
        // No cache found—reset state and fetch data
        setResults([]);
        setOffset(0);
        setHasMore(true);
        fetchPlayers(true);
      }

      // Update previous parameter refs
      prevTeamIdsRef.current = [...selectedTeamIds];
      prevLeagueRef.current = leagueParam;
      prevFilterRef.current = activeFilter;
      prevYouthRef.current = includeYouth;
      prevYouthTeamRef.current = youthTeam;
      prevGenderRef.current = genderParam;
    }
  }, [
    selectedTeamIds,
    leagueParam,
    activeFilter,
    includeYouth,
    youthTeam,
    genderParam,
    cacheKey,
  ]);

  return { results, loading, error, hasMore, fetchPlayers };
}
