/* import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal'; // npm install lodash.isequal
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/player';
import { fetchDraftPicksAndTeams } from './fetchDraftPicksAndTeams';

export function useFetchPlayers(
  selectedTeamIds: number[],
  activeFilter: string,    // or 'customLeague' | 'customJunLeague'
  leagueParam: string | null
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // We'll store "previous" values in refs, so we can compare.
  const prevTeamIdsRef = useRef<number[]>([]);
  const prevLeagueRef = useRef<string | null>(null);
  const prevFilterRef = useRef<string>('');

  const limit = 20;

  async function fetchPlayers(reset = false) {
    if (selectedTeamIds.length === 0 && !leagueParam) {
      setError('Either a team or a league must be selected.');
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
        url += `&league=${leagueParam}`;
      } else {
        url += `&fetchAllLeagues=true`;
      }

      console.log('useFetchPlayers: fetching =>', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');
      const data = (await response.json()) as AlumniAPIResponse;

      const players: AlumniPlayer[] = data.players.map((player) => ({
        id: player.id,
        name: player.name,
        birthYear: player.birthYear || null,
      }));

      // fetch draft picks + teams for each player
      const draftPickAndTeamData = await fetchDraftPicksAndTeams(
        players.map((p) => p.id),
        leagueParam
      );

      const playersWithExtra = players.map((p) => ({
        ...p,
        draftPick: draftPickAndTeamData[p.id]?.draftPick || 'N/A',
        teams: draftPickAndTeamData[p.id]?.teams || [],
      }));

      setResults((prev) => {
        const combined = reset ? playersWithExtra : [...prev, ...playersWithExtra];
        const deduped = Array.from(new Map(combined.map((x) => [x.id, x])).values());
        return deduped;
      });

      if (reset) {
        setOffset(players.length);
      } else {
        setOffset((prev) => prev + players.length);
      }

      setHasMore(players.length === limit);
    } catch (err: any) {
      console.error('useFetchPlayers error:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  }

  // This effect only calls fetchPlayers if the relevant inputs have truly changed
  useEffect(() => {
    const teamIdsChanged = !isEqual(prevTeamIdsRef.current, selectedTeamIds);
    const leagueChanged = prevLeagueRef.current !== leagueParam;
    const filterChanged = prevFilterRef.current !== activeFilter;

    if (teamIdsChanged || leagueChanged || filterChanged) {
      // Something actually changed => re-fetch
      setResults([]);
      setOffset(0);
      setHasMore(true);
      fetchPlayers(true);

      // Update the "previous" refs
      prevTeamIdsRef.current = [...selectedTeamIds]; // copy array
      prevLeagueRef.current = leagueParam;
      prevFilterRef.current = activeFilter;
    }
  }, [selectedTeamIds, leagueParam, activeFilter]);

  return { results, loading, error, hasMore, fetchPlayers };
}
 */

import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal'; // npm install lodash.isequal
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/player';
import { fetchDraftPicksAndTeams } from './fetchDraftPicksAndTeams';

export function useFetchPlayers(
  selectedTeamIds: number[],
  activeFilter: string, // or 'customLeague' | 'customJunLeague'
  leagueParam: string | null,
  includeYouth: boolean, // Added for the new feature
  youthTeam: string | null // Added to handle youth team searches
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // We'll store "previous" values in refs, so we can compare.
  const prevTeamIdsRef = useRef<number[]>([]);
  const prevLeagueRef = useRef<string | null>(null);
  const prevFilterRef = useRef<string>('');
  const prevYouthRef = useRef<boolean>(false);
  const prevYouthTeamRef = useRef<string | null>(null);

  const limit = 20;

  async function fetchPlayers(reset = false) {
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
        url += `&league=${leagueParam}`;
      } else {
        url += `&fetchAllLeagues=true`;
      }
      if (includeYouth && youthTeam) {
        url += `&includeYouth=true&teams=${encodeURIComponent(youthTeam)}`;
      }

      console.log('useFetchPlayers: fetching =>', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');
      const data = (await response.json()) as AlumniAPIResponse;

      const players: AlumniPlayer[] = data.players.map((player) => ({
        id: player.id,
        name: player.name,
        birthYear: player.birthYear || null,
      }));

      // Fetch draft picks + teams for each player
      const draftPickAndTeamData = await fetchDraftPicksAndTeams(
        players.map((p) => p.id),
        leagueParam
      );

      const playersWithExtra = players.map((p) => ({
        ...p,
        draftPick: draftPickAndTeamData[p.id]?.draftPick || 'N/A',
        teams: draftPickAndTeamData[p.id]?.teams || [],
      }));

      setResults((prev) => {
        const combined = reset ? playersWithExtra : [...prev, ...playersWithExtra];
        const deduped = Array.from(new Map(combined.map((x) => [x.id, x])).values());
        return deduped;
      });

      if (reset) {
        setOffset(players.length);
      } else {
        setOffset((prev) => prev + players.length);
      }

      setHasMore(players.length === limit);
    } catch (err: any) {
      console.error('useFetchPlayers error:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  }

  // This effect only calls fetchPlayers if the relevant inputs have truly changed
  useEffect(() => {
    const teamIdsChanged = !isEqual(prevTeamIdsRef.current, selectedTeamIds);
    const leagueChanged = prevLeagueRef.current !== leagueParam;
    const filterChanged = prevFilterRef.current !== activeFilter;
    const youthChanged = prevYouthRef.current !== includeYouth;
    const youthTeamChanged = prevYouthTeamRef.current !== youthTeam;

    if (teamIdsChanged || leagueChanged || filterChanged || youthChanged || youthTeamChanged) {
      // Something actually changed => re-fetch
      setResults([]);
      setOffset(0);
      setHasMore(true);
      fetchPlayers(true);

      // Update the "previous" refs
      prevTeamIdsRef.current = [...selectedTeamIds]; // copy array
      prevLeagueRef.current = leagueParam;
      prevFilterRef.current = activeFilter;
      prevYouthRef.current = includeYouth;
      prevYouthTeamRef.current = youthTeam;
    }
  }, [selectedTeamIds, leagueParam, activeFilter, includeYouth, youthTeam]);

  return { results, loading, error, hasMore, fetchPlayers };
}
