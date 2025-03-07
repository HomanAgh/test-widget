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

  const limit = 6800;

  const fetchPlayers = useCallback(async (reset = false) => {
    // Basic guard: if no tournaments are selected, nothing to fetch
    if (selectedTournaments.length === 0) {
      setError('Please select at least one tournament.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Fetch basic player data from tournaments
      let url = `/api/tournament/players?offset=${reset ? 0 : offset}&limit=${limit}`;
      url += `&tournaments=${encodeURIComponent(selectedTournaments.join(','))}`;
      
      console.log('Step 1: Fetching basic player data =>', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to fetch players. Status: ${response.status}`);
      }

      const data = await response.json() as AlumniAPIResponse;
      
      if (!data.players || data.players.length === 0) {
        setError('No players found for the selected tournaments.');
        setLoading(false);
        return;
      }

      let playersToProcess = data.players;
      console.log(`Received ${playersToProcess.length} basic players from API`);

      // Step 2: If league filter is provided, filter players by leagues
      if (leagueParam && leagueParam.trim() !== '') {
        const leagues = leagueParam.split(',').filter(Boolean);
        
        if (leagues.length > 0) {
          console.log('Step 2: Filtering players by leagues:', leagues);
          
          const playerIds = playersToProcess.map(p => p.id);
          const filterResponse = await fetch('/api/tournament/filter-by-leagues', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              playerIds,
              leagues,
            }),
          });
          
          if (!filterResponse.ok) {
            console.error('Error filtering players by leagues:', await filterResponse.text());
          } else {
            const filterData = await filterResponse.json();
            const filteredIds = new Set(filterData.playerIds);
            
            playersToProcess = playersToProcess.filter(p => filteredIds.has(p.id));
            console.log(`Filtered to ${playersToProcess.length} players matching league criteria`);
          }
        }
      }

      // Step 3: Fetch detailed player information (draft picks, team history)
      if (playersToProcess.length > 0) {
        console.log('Step 3: Fetching detailed player information');
        
        const playerIds = playersToProcess.map(p => p.id);
        const detailsResponse = await fetch('/api/tournament/player-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            playerIds,
          }),
        });
        
        if (!detailsResponse.ok) {
          console.error('Error fetching player details:', await detailsResponse.text());
        } else {
          const detailsData = await detailsResponse.json();
          console.log('Received player details data:', Object.keys(detailsData).length, 'players');
          
          // Merge the details with the basic player data
          playersToProcess = playersToProcess.map(player => {
            const details = detailsData[player.id];
            
            if (details) {
              console.log(`Player ${player.id} (${player.name}) - Birth year from details: ${details.birthYear}`);
              return {
                ...player,
                draftPick: details.draftPick,
                teams: details.teams,
                birthYear: details.birthYear
              };
            }
            
            return player;
          });
          
          // Log a sample of players to verify birth year data
          if (playersToProcess.length > 0) {
            console.log('Sample player with details:', JSON.stringify(playersToProcess[0], null, 2));
          }
          
          console.log('Successfully merged player details');
        }
      }

      const newPlayers = playersToProcess;
      
      setResults(prev => {
        const combined = reset ? newPlayers : [...prev, ...newPlayers];
        return Array.from(new Map(combined.map(p => [p.id, p])).values());
      });

      if (reset) {
        setOffset(newPlayers.length);
      } else {
        setOffset(prev => prev + newPlayers.length);
      }
      
      setHasMore(newPlayers.length === limit);

    } catch (err) {
      console.error('useFetchTournamentPlayers error:', err);
      setError('Failed to fetch players.');
    } finally {
      setLoading(false);
    }
  }, [selectedTournaments, leagueParam, offset, limit]);

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

  return { 
    results, 
    loading, 
    error, 
    hasMore, 
    fetchMore: () => !loading && hasMore ? fetchPlayers(false) : null
  };
} 