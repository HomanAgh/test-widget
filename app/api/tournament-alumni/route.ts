import { NextResponse } from "next/server";
import {
  ApiResponse,
  PlayerStatsItem,
  TeamStatsItem,
  DraftSelection,
  CombinedPlayer,
} from "@/app/types/route"; // Adjust import path if needed
import { leagueRankings } from "@/app/components/alumni/LeagueSelection";

// 1 hour cache
const CACHE_TTL = 60 * 60 * 1000;
const tournamentAlumniCache = new Map<string, { data: any; timestamp: number }>();

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

/**
 * Map tournament slugs to the appropriate category and leagueSlug.
 * The leagueSlug must exist in leagueRankings for sorting to work.
 */
const tournamentMapping: Record<string, { category: string; leagueSlug: string }> = {
  // International Pro Tournaments
  "world-championship": { category: "professional", leagueSlug: "wc" },
  "wc": { category: "professional", leagueSlug: "wc" },
  "olympics": { category: "professional", leagueSlug: "olympics" },
  "olympic-games": { category: "professional", leagueSlug: "olympics" },
  "spengler-cup": { category: "professional", leagueSlug: "shl" }, // using SHL ranking
  "champions-hockey-league": { category: "professional", leagueSlug: "shl" },
  
  // Junior Tournaments
  "world-junior": { category: "junior", leagueSlug: "wjc" },
  "wjc": { category: "junior", leagueSlug: "wjc" },
  "world-juniors": { category: "junior", leagueSlug: "wjc" },
  "u18-world-championship": { category: "junior", leagueSlug: "wjc" },
  "u18-worlds": { category: "junior", leagueSlug: "wjc" },
  "memorial-cup": { category: "junior", leagueSlug: "ohl" }, // using OHL ranking
  "hlinka-gretzky": { category: "junior", leagueSlug: "wjc" },
  
  // College Tournaments
  "ncaa-tournament": { category: "college", leagueSlug: "ncaa" },
  "frozen-four": { category: "college", leagueSlug: "ncaa" },
  "beanpot": { category: "college", leagueSlug: "ncaa" },
  
  // Women's Tournaments
  "womens-worlds": { category: "professional", leagueSlug: "pwhl-w" },
  "womens-olympics": { category: "professional", leagueSlug: "pwhl-w" },
  "u18-womens-worlds": { category: "junior", leagueSlug: "jwhl-w" }
};

/**
 * Get tournament mapping info with fallbacks
 */
function getTournamentMapping(slug: string): { category: string; leagueSlug: string } {
  const slugLc = slug.toLowerCase();
  
  // Direct mapping
  if (tournamentMapping[slugLc]) {
    return tournamentMapping[slugLc];
  }
  
  // Fallback based on name patterns
  if (slugLc.includes('junior') || slugLc.includes('u18') || slugLc.includes('u20')) {
    return { category: 'junior', leagueSlug: 'wjc' };
  }
  
  if (slugLc.includes('college') || slugLc.includes('ncaa') || slugLc.includes('university')) {
    return { category: 'college', leagueSlug: 'ncaa' };
  }
  
  if (slugLc.includes('women') || slugLc.includes('girl')) {
    return { category: 'professional', leagueSlug: 'pwhl-w' };
  }
  
  // Default to pro tournament
  return { category: 'professional', leagueSlug: 'nhl' };
}

/** 
 * Determine the appropriate leagueLevel for a league slug
 */
function getLeagueLevel(slug?: string): string {
  if (!slug) return "unknown";
  const slugLc = slug.toLowerCase();

  // Professional
  if (["nhl","ahl","shl","del","liiga","echl","icehl","khl","pwhl-w","phf-w","nwhl-ca-w", "slovakia", "nl", "czechia","sdhl-w","hockeyallsvenskan"].includes(slugLc)) {
    return "professional";
  }
  // Junior
  if (["ohl","whl","qmjhl","ushl","j20-nationell", "cchl", "mhl", "jwhl-w", "wjc"].includes(slugLc)) {
    return "junior";
  }
  // College
  if (["ncaa","usports","acac","acha","ncaa-w","acha-w","ncaa-iii-w","acha-d2-w"].includes(slugLc)) {
    return "college";
  }
  // Otherwise treat it as "tournament"
  return "professional"; // Default to professional if unknown
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
  ].join(","));

  const urlWithFields = `${baseUrl}&fields=${fields}`;
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
        name: item.team.name || "Unknown Team",
        leagueSlug: leagueSlug || "unknown",
        leagueLevel: leagueLevel || "unknown",
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

    // Attach draft picks
    for (const cp of allPlayers) {
      cp.draftPick = draftPickMap.get(cp.player.id) ?? null;
    }

    // 4) Shape the final output as AlumniPlayer objects
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
        name: t.name,
        leagueLevel: t.leagueLevel,
        leagueSlug: t.leagueSlug
      }));

      return {
        id: cp.player.id,
        name: cp.player.name,
        birthYear: cp.player.yearOfBirth ? parseInt(String(cp.player.yearOfBirth), 10) : null,
        gender: cp.player.gender,
        status: cp.player.status,
        position: cp.player.position,
        draftPick,
        teams: mappedTeams
      };
    });

    const responseData = {
      tournaments: tournamentSlugs,
      totalPlayers: finalPlayers.length,
      players: finalPlayers
    };

    // Cache & return
    tournamentAlumniCache.set(cacheKey, { data: responseData, timestamp: now });
    return NextResponse.json(responseData, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/tournament-alumni route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

