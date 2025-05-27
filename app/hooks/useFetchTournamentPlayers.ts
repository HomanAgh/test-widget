import { useState, useEffect, useRef, useCallback } from "react";
import isEqual from "lodash.isequal";
import { AlumniPlayer } from "@/app/types/alumni";

// Create a module-level cache object (if you still want local caching)
const playersCache = new Map<string, AlumniPlayer[]>();

export function useFetchTournamentPlayers(
  selectedTournaments: string[],
  leagueParam: string | string[] | null, // Now accepts array or string
  genderParam: string | null = null // optional if you want gender filtering
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLeague, setCurrentLeague] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Convert leagueParam to consistent format
  const leagues = Array.isArray(leagueParam) ? leagueParam : (leagueParam ? [leagueParam] : []);
  
  // Build a cache key representing the current query parameters
  const cacheKey = JSON.stringify({
    tournaments: [...selectedTournaments].sort(),
    leagues: [...leagues].sort(),
    genderParam,
  });

  // Refs to track previous parameter values
  const prevTournamentsRef = useRef<string[]>([]);
  const prevLeaguesRef = useRef<string[]>([]);
  const prevGenderRef = useRef<string | null>(null);

  // Fetch players for a single league
  const fetchSingleLeague = useCallback(async (league: string): Promise<AlumniPlayer[]> => {
    const tournamentsParam = encodeURIComponent(selectedTournaments.join(","));
    let url = `/api/tournament-alumni?tournaments=${tournamentsParam}&league=${encodeURIComponent(league)}`;

    if (genderParam && genderParam.trim() !== "") {
      url += `&gender=${encodeURIComponent(genderParam)}`;
    }

    console.log(`Fetching league: ${league}`, url);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error for league ${league}:`, errorText);
      throw new Error(`Failed to fetch players for ${league}. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Got ${data.players?.length || 0} players for league: ${league}`);
    return data.players || [];
  }, [selectedTournaments, genderParam]);

  // Sequential fetch for multiple leagues
  const fetchPlayers = useCallback(async () => {
    // Basic guard: if no tournaments are selected, nothing to fetch
    if (selectedTournaments.length === 0) {
      setError("Please select at least one tournament.");
      setResults([]);
      return;
    }

    if (leagues.length === 0) {
      setError("Please select at least one league.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setProgress({ current: 0, total: leagues.length });

    const allPlayers: AlumniPlayer[] = [];
    const playerIds = new Set<number>(); // Track unique player IDs to prevent duplicates

    try {
      for (let i = 0; i < leagues.length; i++) {
        const league = leagues[i];
        setCurrentLeague(league);
        setProgress({ current: i, total: leagues.length });

        try {
          const leaguePlayers = await fetchSingleLeague(league);
          
          // Filter out duplicate players based on their ID
          const uniqueLeaguePlayers = leaguePlayers.filter(player => {
            if (playerIds.has(player.id)) {
              console.log(`Skipping duplicate player: ${player.name} (ID: ${player.id}) from league: ${league}`);
              return false;
            }
            playerIds.add(player.id);
            return true;
          });
          
          console.log(`Added ${uniqueLeaguePlayers.length} unique players from ${league} (${leaguePlayers.length - uniqueLeaguePlayers.length} duplicates filtered)`);
          
          allPlayers.push(...uniqueLeaguePlayers);
          
          // Update results after each league
          setResults([...allPlayers]);
          setProgress({ current: i + 1, total: leagues.length });
          
        } catch (err) {
          console.error(`Failed to fetch league ${league}:`, err);
          // Continue with other leagues even if one fails
        }
      }

      setCurrentLeague(null);
      
      if (allPlayers.length === 0) {
        setError("No players found for the selected tournaments and leagues.");
      } else {
        console.log(`Total unique players loaded: ${allPlayers.length}`);
      }

    } catch (err) {
      console.error("useFetchTournamentPlayers error:", err);
      setError("Failed to fetch players.");
      setResults([]);
    } finally {
      setLoading(false);
      setCurrentLeague(null);
    }
  }, [selectedTournaments, leagues, genderParam, fetchSingleLeague]);

  // Effect to trigger a refetch if relevant inputs changed
  useEffect(() => {
    const tournamentsChanged = !isEqual(prevTournamentsRef.current, selectedTournaments);
    const leaguesChanged = !isEqual(prevLeaguesRef.current, leagues);
    const genderChanged = prevGenderRef.current !== genderParam;

    console.log(
      "Tournaments changed:", tournamentsChanged,
      "Leagues changed:", leaguesChanged,
      "Gender changed:", genderChanged
    );

    if (tournamentsChanged || leaguesChanged || genderChanged) {
      // Check local cache
      if (playersCache.has(cacheKey)) {
        console.log("Using cached data for tournaments:", selectedTournaments);
        setResults(playersCache.get(cacheKey)!);
        setProgress({ current: leagues.length, total: leagues.length });
      } else {
        console.log("Fetching new data for tournaments:", selectedTournaments);
        fetchPlayers();
      }

      // Update previous parameter refs
      prevTournamentsRef.current = [...selectedTournaments];
      prevLeaguesRef.current = [...leagues];
      prevGenderRef.current = genderParam;
    }
  }, [selectedTournaments, leagues, genderParam, cacheKey, fetchPlayers]);

  // If you still want to store the new results in the cache:
  useEffect(() => {
    if (results.length > 0 && !loading) {
      playersCache.set(cacheKey, results);
    }
  }, [results, cacheKey, loading]);

  return {
    results,
    loading,
    error,
    currentLeague,
    progress,
  };
}
