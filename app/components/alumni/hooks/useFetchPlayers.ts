import { useState, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal'; // Ensure lodash.isequal is installed
import { AlumniPlayer, AlumniAPIResponse } from '@/app/types/player';
import { fetchDraftPicksAndTeams } from './fetchDraftPicksAndTeams';

export function useFetchPlayers(
  selectedTeamIds: number[],
  activeFilter: string, // e.g., 'customLeague' | 'customJunLeague'
  leagueParam: string | null,
  includeYouth: boolean,
  youthTeam: string | null,
  genderParam: "male" | "female" | null 
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  // Refs to track previous values
  const prevTeamIdsRef = useRef<number[]>([]);
  const prevLeagueRef = useRef<string | null>(null);
  const prevFilterRef = useRef<string>('');
  const prevYouthRef = useRef<boolean>(false);
  const prevYouthTeamRef = useRef<string | null>(null);
  const prevGenderRef = useRef<"male" | "female" | null>(null);

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
      if (genderParam) {
        url += `&gender=${encodeURIComponent(genderParam)}`;
      }

      console.log('useFetchPlayers: fetching =>', url);

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch players.');
      const data = (await response.json()) as AlumniAPIResponse;

      const players: AlumniPlayer[] = data.players.map((player) => ({
        id: player.id,
        name: player.name,
        birthYear: player.birthYear ?? null,
        gender: player.gender?.toLowerCase(), // Keep original gender handling
        teams: [],
      }));

      console.log('Mapped Players:', players);

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

      console.log('Players with Extra Data:', playersWithExtra);

      setResults((prev) => {
        const combined = reset ? playersWithExtra : [...prev, ...playersWithExtra];
        const deduped = Array.from(new Map(combined.map((x) => [x.id, x])).values());
        return deduped;
      });

      if (reset) {
        setOffset(playersWithExtra.length);
      } else {
        setOffset((prev) => prev + playersWithExtra.length);
      }

      setHasMore(playersWithExtra.length === limit);
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
    const genderChanged = prevGenderRef.current !== genderParam; 

    if (teamIdsChanged || leagueChanged || filterChanged || youthChanged || youthTeamChanged || genderChanged) {
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
      prevGenderRef.current = genderParam;
    }
  }, [selectedTeamIds, leagueParam, activeFilter, includeYouth, youthTeam, genderParam]);

  return { results, loading, error, hasMore, fetchPlayers };
}




