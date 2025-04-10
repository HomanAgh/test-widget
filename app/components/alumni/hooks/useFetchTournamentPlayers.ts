import { useState, useEffect, useRef, useCallback } from "react";
import isEqual from "lodash.isequal";
import { AlumniPlayer } from "@/app/types/alumni";

// Create a module-level cache object (if you still want local caching)
const playersCache = new Map<string, AlumniPlayer[]>();

export function useFetchTournamentPlayers(
  selectedTournaments: string[],
  leagueParam: string | null,
  genderParam: string | null = null // optional if you want gender filtering
) {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If you no longer do pagination in the new route, remove hasMore/offset logic:
  // (Or keep them if your new route supports offset/limit. This example removes them.)
  
  // Build a cache key representing the current query parameters
  const cacheKey = JSON.stringify({
    tournaments: [...selectedTournaments].sort(),
    leagueParam,
    genderParam,
  });

  // Refs to track previous parameter values
  const prevTournamentsRef = useRef<string[]>([]);
  const prevLeagueRef = useRef<string | null>(null);
  const prevGenderRef = useRef<string | null>(null);

  // The single fetch call to the new route
  const fetchPlayers = useCallback(async () => {
    // Basic guard: if no tournaments are selected, nothing to fetch
    if (selectedTournaments.length === 0) {
      setError("Please select at least one tournament.");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Build the URL for the new route
      // e.g. /api/tournament-alumni?tournaments=brick-invitational,spengler-cup&league=nhl&gender=male
      const tournamentsParam = encodeURIComponent(selectedTournaments.join(","));
      let url = `/api/tournament-alumni?tournaments=${tournamentsParam}`;

      if (leagueParam && leagueParam.trim() !== "") {
        url += `&league=${encodeURIComponent(leagueParam)}`;
      }
      if (genderParam && genderParam.trim() !== "") {
        url += `&gender=${encodeURIComponent(genderParam)}`;
      }

      console.log("Fetching tournament-alumni players:", url);
      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`Failed to fetch players. Status: ${response.status}`);
      }

      const data = await response.json();
      // The new route should return data.players
      if (!data.players || data.players.length === 0) {
        setError("No players found for the selected tournaments.");
        setResults([]);
      } else {
        setResults(data.players);
      }
    } catch (err) {
      console.error("useFetchTournamentPlayers error:", err);
      setError("Failed to fetch players.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTournaments, leagueParam, genderParam]);

  // Effect to trigger a refetch if relevant inputs changed
  useEffect(() => {
    const tournamentsChanged = !isEqual(prevTournamentsRef.current, selectedTournaments);
    const leagueChanged = prevLeagueRef.current !== leagueParam;
    const genderChanged = prevGenderRef.current !== genderParam;

    console.log(
      "Tournaments changed:", tournamentsChanged,
      "League changed:", leagueChanged,
      "Gender changed:", genderChanged
    );

    if (tournamentsChanged || leagueChanged || genderChanged) {
      // Check local cache
      if (playersCache.has(cacheKey)) {
        console.log("Using cached data for tournaments:", selectedTournaments);
        setResults(playersCache.get(cacheKey)!);
      } else {
        console.log("Fetching new data for tournaments:", selectedTournaments);
        setResults([]);
        fetchPlayers();
      }

      // Update previous parameter refs
      prevTournamentsRef.current = [...selectedTournaments];
      prevLeagueRef.current = leagueParam;
      prevGenderRef.current = genderParam;
    }
  }, [selectedTournaments, leagueParam, genderParam, cacheKey, fetchPlayers]);

  // If you still want to store the new results in the cache:
  useEffect(() => {
    if (results.length > 0) {
      playersCache.set(cacheKey, results);
    }
  }, [results, cacheKey]);

  return {
    results,
    loading,
    error,
    // If you had pagination, you could return fetchMore or hasMore, but removed here for simplicity
  };
}
