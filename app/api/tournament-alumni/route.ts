import { NextResponse } from "next/server";
import {
  ApiResponse,
  PlayerStatsItem,
  TeamStatsItem,
  DraftSelection,
  CombinedPlayer,
} from "@/app/types/route"; // Adjust import path if needed
import { 
  getLeagueLevel as getLeagueLevelFromConfig, 
  getTournamentLeagueSlug,
  getLeagueCategory as getLeagueCategoryFromConfig 
} from "@/app/config/leagues";

// 1 hour cache
const CACHE_TTL = 60 * 60 * 1000;
const tournamentAlumniCache = new Map<string, { data: any; timestamp: number }>();

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

/**
 * Get tournament mapping info with fallbacks
 */
function getTournamentMapping(slug: string): { category: string; leagueSlug: string } {
  const leagueSlug = getTournamentLeagueSlug(slug);
  
  // Get category based on the mapped league slug
  const category = getLeagueCategoryFromConfig(leagueSlug) || 'professional';
  
  return { category, leagueSlug };
}

/** 
 * Determine the appropriate leagueLevel for a league slug
 */
function getLeagueLevel(slug?: string): string {
  return getLeagueLevelFromConfig(slug);
}

/** Fallback for missing league data. */
type LeagueFallback = { level: string | null; slug: string | null };
const leagueFallbackCache = new Map<number, LeagueFallback>();

async function fetchLeagueFallback(teamId: number): Promise<LeagueFallback> {
  if (leagueFallbackCache.has(teamId)) {
    return leagueFallbackCache.get(teamId)!;
  }

  const fallbackUrl = `${apiBaseUrl}/team-stats?team=${teamId}&offset=0&limit=1&sort=-season&apiKey=${apiKey}&fields=league.leagueLevel,league.slug`;
  try {
    const resp = await fetch(fallbackUrl);
    if (!resp.ok) {
      console.error(`Team fallback fetch failed for ID=${teamId}`);
      leagueFallbackCache.set(teamId, { level: null, slug: null });
      return { level: null, slug: null };
    }
    const data: ApiResponse<TeamStatsItem> = await resp.json();
    if (data.data && data.data.length > 0) {
      const level = data.data[0].league?.leagueLevel ?? null;
      const slug = data.data[0].league?.slug ?? null;
      leagueFallbackCache.set(teamId, { level, slug });
      return { level, slug };
    }
    leagueFallbackCache.set(teamId, { level: null, slug: null });
    return { level: null, slug: null };
  } catch (err) {
    console.error(`fetchLeagueFallback error:`, err);
    leagueFallbackCache.set(teamId, { level: null, slug: null });
    return { level: null, slug: null };
  }
}

/** Fetch all pages from the external /player-stats endpoint, if totalRecords > pageSize. */
async function fetchAllPages<T>(baseUrl: string, pageSize = 1000): Promise<T[]> {
  const allItems: T[] = [];
  try {
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const url = `${baseUrl}&offset=${offset}&limit=${pageSize}`;
      const resp = await fetch(url);
      if (!resp.ok) {
        console.error(`Failed to fetch at offset=${offset}`, resp.statusText);
        break;
      }
      const data: ApiResponse<T> & { _meta?: { totalRecords?: number } } = await resp.json();
      if (!data.data || data.data.length === 0) {
        hasMore = false;
      } else {
        allItems.push(...data.data);
        offset += pageSize;
        if (data._meta?.totalRecords && offset >= data._meta.totalRecords) {
          hasMore = false;
        }
      }
    }
    return allItems;
  } catch (err) {
    console.error(`fetchAllPages error:`, err);
    return allItems;
  }
}

/** Merge player-stats results into a Map of CombinedPlayers. */
async function mergePlayerStats(baseUrl: string, playerMap: Map<number, CombinedPlayer>, tournamentSlug?: string) {
  // We'll add fields param here to avoid duplication
  const fields = encodeURIComponent([
    "player.id",
    "player.name",
    "player.yearOfBirth",
    "player.gender",
    "player.status",
    "player.position",
    "player.youthTeam",
    "team.id",
    "team.name",
    "team.league.slug",
    "team.league.leagueLevel",
    "isActiveSeason"
  ].join(","));

  const urlWithFields = `${baseUrl}&fields=${fields}`;
  console.log("EP API URL:", urlWithFields);
  const items = await fetchAllPages<PlayerStatsItem>(urlWithFields, 1000);

  // Identify teams needing fallback
  const teamIdsNeedingFallback: number[] = [];
  for (const item of items) {
    const leagueSlug = item.team.league?.slug;
    const leagueLevel = item.team.league?.leagueLevel;
    if (item.team.id && (!leagueSlug || !leagueLevel)) {
      if (!teamIdsNeedingFallback.includes(item.team.id)) {
        teamIdsNeedingFallback.push(item.team.id);
      }
    }
  }

  // Fetch fallback data
  const fallbackPromises = teamIdsNeedingFallback.map(tid => fetchLeagueFallback(tid));
  const fallbackResults = await Promise.all(fallbackPromises);
  const fallbackMap = new Map<number, LeagueFallback>();
  teamIdsNeedingFallback.forEach((tid, idx) => {
    fallbackMap.set(tid, fallbackResults[idx]);
  });

  // Get tournament mapping info if this is a tournament
  let tournamentInfo;
  if (tournamentSlug) {
    tournamentInfo = getTournamentMapping(tournamentSlug);
  }
  
  // Merge into the playerMap
  for (const item of items) {
    const pid = item.player.id;
    if (!playerMap.has(pid)) {
      playerMap.set(pid, {
        player: {
          id: pid,
          name: item.player.name || "",
          yearOfBirth: item.player.yearOfBirth || null,
          gender: item.player.gender || null,
          status: item.player.status || null,
          position: item.player.position || "",
          youthTeam: item.player.youthTeam || null,
        },
        teams: [],
        draftPick: null,
      });
    }

    const existing = playerMap.get(pid)!;

    let leagueSlug = item.team.league?.slug || null;
    let leagueLevel = item.team.league?.leagueLevel || null;
    
    if (item.team.id && fallbackMap.has(item.team.id)) {
      const fb = fallbackMap.get(item.team.id)!;
      if (!leagueSlug) leagueSlug = fb.slug;
      if (!leagueLevel) leagueLevel = fb.level;
    }

    // If this is a tournament, use the tournament-specific mapping info
    if (tournamentInfo && tournamentSlug) {
      // Handle the actual tournament team special case
      if (item.team.name?.toLowerCase().includes(tournamentSlug.toLowerCase()) ||
          (leagueSlug && (leagueSlug.toLowerCase() === tournamentSlug.toLowerCase()))) {
        // This is the tournament team itself
        leagueSlug = tournamentInfo.leagueSlug;
        leagueLevel = tournamentInfo.category;
      } else {
        // This is a normal team in their history, keep its original values
        if (leagueSlug) {
          leagueLevel = getLeagueLevel(leagueSlug);
        }
      }
    } else if (leagueSlug) {
      // Determine league level based on slug
      leagueLevel = getLeagueLevel(leagueSlug);
    }

    // Insert into teams array
    const alreadyExists = existing.teams.find(
      (t) => t.name === item.team.name && t.leagueSlug === leagueSlug
    );
    
    if (!alreadyExists) {
      existing.teams.push({
        id: item.team.id || undefined,
        name: item.team.name || "Unknown Team",
        leagueSlug: leagueSlug || "unknown",
        leagueLevel: leagueLevel || "unknown",
        isCurrentTeam: item.isActiveSeason === true
      });
    }
  }
}

/** Bulk fetch draft picks for the players in chunked calls. */
async function fetchBatchDraftPicks(playerIds: number[], chunkSize = 500): Promise<Map<number, DraftSelection>> {
  const resultMap = new Map<number, DraftSelection>();
  if (!playerIds.length) return resultMap;

  // chunking
  const chunks: number[][] = [];
  for (let i = 0; i < playerIds.length; i += chunkSize) {
    chunks.push(playerIds.slice(i, i + chunkSize));
  }

  const MAX_CONCURRENT = 3;
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
      const joinedIds = chunk.join(",");
      const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}&fields=${encodeURIComponent(
        "player.id,year,round,overall,team.name,team.logo.small,draftType.slug"
      )}`;
      try {
        const resp = await fetch(url);
        if (!resp.ok) return new Map<number, DraftSelection>();
        const data = await resp.json();
        if (!data.data) return new Map<number, DraftSelection>();

        const chunkMap = new Map<number, DraftSelection>();
        for (const ds of data.data) {
          const pid = ds.player?.id;
          if (!pid) continue;
          chunkMap.set(pid, {
            year: ds.year,
            round: ds.round,
            overall: ds.overall,
            team: ds.team
              ? {
                  name: ds.team.name ?? "",
                  logo: ds.team.logo?.small ?? "",
                }
              : undefined,
            draftType: ds.draftType,
          });
        }
        return chunkMap;
      } catch {
        return new Map<number, DraftSelection>();
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    for (const cMap of chunkResults) {
      for (const [pid, dp] of cMap.entries()) {
        resultMap.set(pid, dp);
      }
    }
  }

  return resultMap;
}

/** Build a cache key from tournaments, league, gender, etc. */
function buildCacheKey(tournamentsParam: string, leagueParam: string, genderParam: string) {
  return JSON.stringify({ tournamentsParam, leagueParam, genderParam });
}

/** Fetch tournament-specific details for the players (team name, season) */
async function fetchTournamentDetails(playerIds: number[], tournamentSlug: string, chunkSize = 500): Promise<Map<number, { teamName: string; teamId?: number; season: { startYear: number; endYear: number } | null }>> {
  const resultMap = new Map<number, { teamName: string; teamId?: number; season: { startYear: number; endYear: number } | null }>();
  if (!playerIds.length) return resultMap;

  try {
    // Chunking playerIds to avoid URL length limits
    const chunks: number[][] = [];
    for (let i = 0; i < playerIds.length; i += chunkSize) {
      chunks.push(playerIds.slice(i, i + chunkSize));
    }

    const MAX_CONCURRENT = 3;
    for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
      const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
        const joinedIds = chunk.join(",");
        const url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&player=${joinedIds}&league=${encodeURIComponent(tournamentSlug)}&limit=1000&fields=${encodeURIComponent(
          "player.id,player.name,teamName,team.id,season.startYear,season.endYear"
        )}`;
        
        console.log(`Fetching tournament details (chunk ${i}, ${chunk.length} players):`, url);
        const resp = await fetch(url);
        if (!resp.ok) {
          console.error("Failed to fetch tournament details chunk", resp.statusText);
          return new Map<number, { teamName: string; teamId?: number; season: { startYear: number; endYear: number } | null }>();
        }
        
        const data = await resp.json();
        if (!data.data || !Array.isArray(data.data)) {
          return new Map<number, { teamName: string; teamId?: number; season: { startYear: number; endYear: number } | null }>();
        }
        
        const chunkMap = new Map<number, { teamName: string; teamId?: number; season: { startYear: number; endYear: number } | null }>();
        for (const item of data.data) {
          const playerId = item.player?.id;
          if (!playerId) continue;
          
          chunkMap.set(playerId, {
            teamName: item.teamName || "Unknown Team",
            teamId: item.team?.id,
            season: item.season ? {
              startYear: item.season.startYear || 0,
              endYear: item.season.endYear || 0
            } : null
          });
        }
        return chunkMap;
      });

      const chunkResults = await Promise.all(chunkPromises);
      for (const cMap of chunkResults) {
        for (const [pid, details] of cMap.entries()) {
          resultMap.set(pid, details);
        }
      }
    }
    
    return resultMap;
  } catch (err) {
    console.error("Error fetching tournament details:", err);
    return resultMap;
  }
}

/** 
 * The main GET handler for /api/tournament-alumni.
 * e.g. /api/tournament-alumni?tournaments=brick-invitational,spengler-cup&league=nhl&gender=male
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const tournamentsParam = searchParams.get("tournaments") || "";
  const leagueParam = searchParams.get("league") || "";
  const genderParam = searchParams.get("gender") || "";

  // Check in-memory cache
  const cacheKey = buildCacheKey(tournamentsParam, leagueParam, genderParam);
  const now = Date.now();
  if (tournamentAlumniCache.has(cacheKey)) {
    const cached = tournamentAlumniCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, { status: 200 });
    }
  }

  // Parse the tournaments
  const tournamentSlugs = tournamentsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!tournamentSlugs.length) {
    return NextResponse.json({ error: "No tournaments specified." }, { status: 400 });
  }

  try {
    // 1) Merge all players from each tournament slug
    const playerMap = new Map<number, CombinedPlayer>();

    for (const slug of tournamentSlugs) {
      // e.g. player.hasPlayedInLeague=brick-invitational
      let baseUrl = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&player.hasPlayedInLeague=${encodeURIComponent(slug)}`;
      // If we also have leagues, add &league=nhl,liiga, etc.
      if (leagueParam.trim()) {
        baseUrl += `&league=${encodeURIComponent(leagueParam)}`;
      }
      // Merge results into our playerMap, pass the tournament slug for special handling
      await mergePlayerStats(baseUrl, playerMap, slug);
    }

    // 2) Filter by gender if provided
    let allPlayers = Array.from(playerMap.values());
    if (genderParam) {
      allPlayers = allPlayers.filter(
        (cp) => (cp.player.gender || "").toLowerCase() === genderParam.toLowerCase()
      );
    }

    // 3) Fetch draft picks in bulk
    const allPlayerIds = allPlayers.map((cp) => cp.player.id);
    const draftPickMap = await fetchBatchDraftPicks(allPlayerIds);

    // 4) Fetch tournament-specific details for each player for each tournament
    const tournamentDetailsMap = new Map<number, { tournamentSlug: string; teamName: string; teamId?: number; season: { startYear: number; endYear: number } | null }>();
    
    for (const slug of tournamentSlugs) {
      console.log(`Fetching tournament details for '${slug}' for ${allPlayerIds.length} players`);
      const tournamentDetailsForSlug = await fetchTournamentDetails(allPlayerIds, slug);
      console.log(`Found ${tournamentDetailsForSlug.size} players with data for tournament '${slug}'`);
      
      // Merge the tournament details from this slug into our overall map
      for (const [playerId, details] of tournamentDetailsForSlug.entries()) {
        tournamentDetailsMap.set(playerId, {
          tournamentSlug: slug,
          teamName: details.teamName,
          teamId: details.teamId,
          season: details.season
        });
      }
    }

    // Attach draft picks
    for (const cp of allPlayers) {
      cp.draftPick = draftPickMap.get(cp.player.id) ?? null;
    }

    // 5) Shape the final output as AlumniPlayer objects
    //    (matching your `AlumniPlayer` interface).
    const finalPlayers = allPlayers.map((cp) => {
      // Convert CombinedPlayer -> AlumniPlayer
      const draftPick = cp.draftPick
        ? {
            year: cp.draftPick.year ?? 0,
            round: cp.draftPick.round ?? 0,
            overall: cp.draftPick.overall ?? 0,
            team: cp.draftPick.team
              ? {
                  name: cp.draftPick.team.name ?? "",
                  logo: cp.draftPick.team.logo ?? "",
                }
              : undefined,
          }
        : null;

      // Map the teams to the format expected by the Alumni component
      const mappedTeams = cp.teams.map((t) => ({
        id: t.id,
        name: t.name,
        leagueLevel: t.leagueLevel,
        leagueSlug: t.leagueSlug,
        isCurrentTeam: t.isCurrentTeam
      }));

      // Get tournament details for this player
      const tournamentDetails = tournamentDetailsMap.get(cp.player.id);
      
      return {
        id: cp.player.id,
        name: cp.player.name,
        birthYear: cp.player.yearOfBirth ? parseInt(String(cp.player.yearOfBirth), 10) : null,
        gender: cp.player.gender,
        status: cp.player.status,
        position: cp.player.position,
        draftPick,
        teams: mappedTeams,
        // Include the tournament-specific details
        tournamentTeamName: tournamentDetails?.teamName || "Unknown Team",
        tournamentSeason: tournamentDetails?.season
          ? `${tournamentDetails.season.startYear}-${tournamentDetails.season.endYear}`
          : null,
        tournamentSlug: tournamentDetails?.tournamentSlug || null,
        tournamentTeam: tournamentDetails?.teamId 
          ? {
              id: tournamentDetails.teamId,
              name: tournamentDetails.teamName || "Unknown Team"
            }
          : undefined
      };
    });

    const responseData = {
      tournaments: tournamentSlugs,
      totalPlayers: finalPlayers.length,
      players: finalPlayers
    };

    // Cache & return
    tournamentAlumniCache.set(cacheKey, { data: responseData, timestamp: now });
    console.log("Tournament Alumni Response:", {
      tournaments: tournamentSlugs,
      totalPlayers: finalPlayers.length,
      totalPlayersWithTournamentData: finalPlayers.filter(p => p.tournamentTeamName && p.tournamentTeamName !== "Unknown Team").length,
      samplePlayers: finalPlayers.slice(0, 3).map(p => ({ 
        id: p.id, 
        name: p.name,
        tournamentTeamName: p.tournamentTeamName,
        tournamentSeason: p.tournamentSeason
      }))
    });
    return NextResponse.json(responseData, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/tournament-alumni route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

