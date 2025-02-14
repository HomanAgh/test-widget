import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/alumni';

/**
 * Custom hook to fetch alumni players from our single /api/alumni route.
 */
export function useFetchPlayers(
  selectedTeamIds: number[],
  // You had an `activeFilter` in your code; it can still be used if desired.
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

  // Refs to track if inputs truly changed
  const prevTeamIdsRef = useRef<number[]>([]);
  const prevLeagueRef = useRef<string | null>(null);
  const prevFilterRef = useRef<string | null>(null);
  const prevYouthRef = useRef<boolean>(false);
  const prevYouthTeamRef = useRef<string | null>(null);
  const prevGenderRef = useRef<'male' | 'female' | null>(null);

  const limit = 20;

  async function fetchPlayers(reset = false) {
    // Basic guard: if no team, no league, and no youth => there's nothing to fetch
    if (selectedTeamIds.length === 0 && !leagueParam && !includeYouth) {
      setError('Either a team, a league, or youth team must be selected.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let url = `/api/alumni?offset=${reset ? 0 : offset}&limit=${limit}`;

      // Team IDs
      if (selectedTeamIds.length > 0) {
        url += `&teamIds=${encodeURIComponent(selectedTeamIds.join(','))}`;
      }

      // League
      if (leagueParam) {
        url += `&league=${leagueParam}`;
      } 

      // Youth
      if (includeYouth && youthTeam) {
        url += `&includeYouth=true&teams=${encodeURIComponent(youthTeam)}`;
      }

      // Gender
      if (genderParam) {
        url += `&gender=${encodeURIComponent(genderParam)}`;
      }

      console.log('useFetchPlayers: GET =>', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');

      const data = (await response.json()) as AlumniAPIResponse;

      // data.players => has [id, name, birthYear, gender, draftPick, teams...]
      if (!data.players) {
        setError('No players returned from API.');
        setLoading(false);
        return;
      }

      // If we are resetting, start fresh
      const newPlayers = data.players;
      const combined = reset ? newPlayers : [...results, ...newPlayers];

      // De-duplicate by ID if you want:
      const deduped = Array.from(new Map(combined.map((p) => [p.id, p])).values());

      setResults(deduped);

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

    if (teamIdsChanged || leagueChanged || filterChanged || youthChanged || youthTeamChanged || genderChanged) {
      setResults([]);
      setOffset(0);
      setHasMore(true);
      fetchPlayers(true);

      // Update "previous" references
      prevTeamIdsRef.current = [...selectedTeamIds];
      prevLeagueRef.current = leagueParam;
      prevFilterRef.current = activeFilter;
      prevYouthRef.current = includeYouth;
      prevYouthTeamRef.current = youthTeam;
      prevGenderRef.current = genderParam;
    }

  }, [selectedTeamIds, leagueParam, activeFilter, includeYouth, youthTeam, genderParam]);

  return { results, loading, error, hasMore, fetchPlayers };
}
