/* import { NextResponse } from "next/server";

interface PlayerStatsItem {
  player: {
    id: number;
    name: string;
    position?: string;
    yearOfBirth?: number;
    gender?: string;
    status?: string;
    youthTeam?: string;
  };
  team: {
    id: number;
    name: string;
    league?: {
      slug?: string;
      leagueLevel?: string;
    };
  };
}

interface CombinedTeam {
  name: string;
  leagueSlug: string;
  leagueLevel: string;
}

interface CombinedPlayer {
  id: number;
  name: string;
  birthYear?: number;
  gender?: string;
  position?: string;
  status?: string;
  youthTeam?: string;
  teams: CombinedTeam[];
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const tournamentAlumniCache = new Map<string, { data: any; timestamp: number }>();

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

function forceLeagueLevel(slug?: string): string {
  if (!slug) return "unknown";
  const slugLc = slug.toLowerCase();

  // Professional
  if ([
    "nhl","ahl","khl","shl","del","liiga","echl","icehl","hockeyallsvenskan","nl","slovakia", "hockeyallsvenskan", "pwhl-w","sdhl-w", "phf-w", "nwhl-ca-w"
  ].includes(slugLc)) {
    return "professional";
  }

  // Junior
  if ([
    "ohl","whl","qmjhl","ushl","mhl","cchl","j20-nationell", "jwhl-w"
  ].includes(slugLc)) {
    return "junior";
  }

  // College
  if ([
    "ncaa","usports","acac","acha","ncaa-w","acha-w", "ncaa-iii-w", "acha-d2-w"
  ].includes(slugLc)) {
    return "college";
  }

  // Otherwise, treat as "tournament" or fallback
  return "tournament";
}

async function fetchTournamentPlayers(tournamentSlug: string): Promise<number[]> {
  // We'll keep it simple, but if >1000 rows exist, you'd do pagination.
  const fields = encodeURIComponent("player.id,team.league.slug,team.league.leagueLevel");
  const url = `${apiBaseUrl}/player-stats?player.hasPlayedInLeague=${tournamentSlug}&fields=${fields}&apiKey=${apiKey}&limit=1000`;

  const resp = await fetch(url);
  if (!resp.ok) {
    console.error(`Failed to fetch players for tournament=${tournamentSlug}:`, resp.statusText);
    return [];
  }
  const data = await resp.json();
  if (!data.data) return [];

  const playerIds = new Set<number>();
  for (const item of data.data as PlayerStatsItem[]) {
    playerIds.add(item.player.id);
  }

  return Array.from(playerIds);
}

async function fetchFullCareer(playerId: number): Promise<PlayerStatsItem[]> {
  const fields = encodeURIComponent(
    "player.id,player.name,player.position,player.yearOfBirth,player.gender,player.status,player.youthTeam,team.id,team.name,team.league.slug,team.league.leagueLevel"
  );
  const url = `${apiBaseUrl}/player-stats?player=${playerId}&apiKey=${apiKey}&fields=${fields}&limit=1000`;
  
  const resp = await fetch(url);
  if (!resp.ok) {
    console.error(`Failed to fetch career for player=${playerId}:`, resp.statusText);
    return [];
  }
  const data = await resp.json();
  if (!data.data) return [];

  return data.data as PlayerStatsItem[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tournamentsParam = searchParams.get("tournaments") || "";
  const tournamentSlugs = tournamentsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (tournamentSlugs.length === 0) {
    return NextResponse.json(
      { error: "Please provide one or more 'tournaments' in the query." },
      { status: 400 }
    );
  }

  // Check cache
  const cacheKey = JSON.stringify({ tournamentSlugs });
  const now = Date.now();
  if (tournamentAlumniCache.has(cacheKey)) {
    const cached = tournamentAlumniCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data, { status: 200 });
    }
  }

  try {
    // 1) Collect unique player IDs for all given tournaments
    const allPlayerIds = new Set<number>();
    for (const slug of tournamentSlugs) {
      const ids = await fetchTournamentPlayers(slug);
      ids.forEach((id) => allPlayerIds.add(id));
    }
    const uniquePlayerIds = Array.from(allPlayerIds);

    // 2) For each player, fetch entire career
    const playerMap = new Map<number, { 
      id: number;
      name: string;
      position?: string;
      yearOfBirth?: number;
      gender?: string;
      status?: string;
      youthTeam?: string;
      teams: CombinedTeam[];
    }>();

    for (const pid of uniquePlayerIds) {
      const careerRows = await fetchFullCareer(pid);
      if (careerRows.length === 0) continue;

      // Initialize the map if not present
      if (!playerMap.has(pid)) {
        const first = careerRows[0];
        playerMap.set(pid, {
          id: first.player.id,
          name: first.player.name,
          position: first.player.position,
          yearOfBirth: first.player.yearOfBirth,
          gender: first.player.gender,
          status: first.player.status,
          youthTeam: first.player.youthTeam,
          teams: [],
        });
      }

      const existing = playerMap.get(pid)!;

      // Merge teams
      for (const row of careerRows) {
        // Force leagueLevel
        const forcedLevel = forceLeagueLevel(row.team.league?.slug);
        const teamObj: CombinedTeam = {
          name: row.team.name,
          leagueSlug: row.team.league?.slug || "unknown",
          leagueLevel: forcedLevel,
        };
        // Avoid duplicates
        if (!existing.teams.find(
          (t) => t.name === teamObj.name && t.leagueSlug === teamObj.leagueSlug
        )) {
          existing.teams.push(teamObj);
        }
      }
    }

    // 3) Build final array of CombinedPlayer
    const finalPlayers: CombinedPlayer[] = [];
    for (const data of playerMap.values()) {
      finalPlayers.push({
        id: data.id,
        name: data.name,
        position: data.position,
        birthYear: data.yearOfBirth,
        gender: data.gender,
        status: data.status,
        youthTeam: data.youthTeam,
        teams: data.teams,
      });
    }

    const responseData = {
      tournaments: tournamentSlugs,
      totalPlayers: finalPlayers.length,
      players: finalPlayers,
    };

    // Cache
    tournamentAlumniCache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return NextResponse.json(responseData, { status: 200 });
  } catch (err: any) {
    console.error("Error in tournamentAlumni route:", err.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
 */

/* import { NextResponse } from 'next/server';
import {
  ApiResponse,
  PlayerStatsItem,
  TeamStatsItem,
  DraftSelection,
  CombinedPlayer,
} from '@/app/types/route';

// Increase cache TTL for better performance
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const alumniRouteCache = new Map<string, { data: any; timestamp: number }>();
const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

type LeagueFallback = {
  level: string | null;
  slug: string | null;
};

const leagueFallbackCache: Map<number, LeagueFallback> = new Map();


function buildCacheKey(
  teamIdsParam: string | null,
  leagueParam: string | null,
  includeYouth: boolean,
  teamsParam: string | null,
  genderParam: string | null
) {
  return JSON.stringify({
    teamIdsParam,
    leagueParam,
    includeYouth,
    teamsParam,
    genderParam,
  });
}


async function fetchLeagueLevelAndSlug(teamId: number): Promise<LeagueFallback> {
  if (leagueFallbackCache.has(teamId)) {
    return leagueFallbackCache.get(teamId)!;
  }

  const fallbackUrl = `${apiBaseUrl}/team-stats?offset=0&limit=1&sort=-season&team=${teamId}&apiKey=${apiKey}&fields=league.leagueLevel,league.slug`;

  try {
    const resp = await fetch(fallbackUrl, { 
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    
    if (!resp.ok) {
      console.error(`Failed fallback for teamId=${teamId}: ${resp.statusText}`);
      leagueFallbackCache.set(teamId, { level: null, slug: null });
      return { level: null, slug: null };
    }

    const fallbackData: ApiResponse<TeamStatsItem> = await resp.json();
    if (fallbackData.data && fallbackData.data.length > 0) {
      const level = fallbackData.data[0].league?.leagueLevel ?? null;
      const slug = fallbackData.data[0].league?.slug ?? null;
      leagueFallbackCache.set(teamId, { level, slug });
      return { level, slug };
    }

    // no records found
    leagueFallbackCache.set(teamId, { level: null, slug: null });
    return { level: null, slug: null };
  } catch (error) {
    console.error(`Error in fallback for teamId=${teamId}:`, error);
    leagueFallbackCache.set(teamId, { level: null, slug: null });
    return { level: null, slug: null };
  }
}

const fields = [
  'player.id',
  'player.name',
  'isActiveSeason',
  'player.position',
  'player.yearOfBirth',
  'player.gender',
  'player.status',
  'player.youthTeam',
  'team.id',
  'team.name',
  'team.league.slug',
  'team.league.leagueLevel',
].join(',');


function buildTeamBaseUrl(teamId: number, leagues: string[] | null) {
  const leagueParam = leagues?.join(',');
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&fields=${encodeURIComponent(fields)}`;

  if (leagueParam) {
    url += `&league=${encodeURIComponent(leagueParam)}`;
  }
  // The key part: only players who have played in that team
  url += `&player.hasPlayedInTeam=${teamId}`;
  return url;
}


function buildYouthBaseUrl(teamsParam: string, leagues: string[] | null) {
  const leagueParam = leagues?.join(',');
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&fields=${encodeURIComponent(fields)}`;

  if (leagueParam) {
    url += `&league=${encodeURIComponent(leagueParam)}`;
  }
  // For youth
  url += `&player.youthTeam=${encodeURIComponent(teamsParam)}`;
  return url;
}


function buildLeagueOnlyBaseUrl(leagues: string[]) {
  const leagueParam = leagues.join(',');
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&fields=${encodeURIComponent(fields)}`;
  if (leagueParam) {
    url += `&league=${encodeURIComponent(leagueParam)}`;
  }
  console.log (url)
  return url;
}


async function fetchAllPages<T>(baseUrl: string, pageSize = 1000): Promise<T[]> {
  const allItems: T[] = [];
  
  try {
    // First request to get total count
    const initialUrl = `${baseUrl}&offset=0&limit=${pageSize}`;
    const initialRes = await fetch(initialUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!initialRes.ok) {
      console.error('Initial fetch failed:', initialRes.statusText);
      return [];
    }

    const initialData: ApiResponse<T> & { _meta?: { totalRecords?: number } } = await initialRes.json();
    if (initialData.data) {
      allItems.push(...initialData.data);
    }

    // Get the total number of records to fetch
    const totalRecords = initialData._meta?.totalRecords ?? 0;
    
    // If we need more pages, fetch them in parallel
    if (totalRecords > pageSize) {
      const totalPages = Math.ceil(totalRecords / pageSize);
      console.log(`Fetching ${totalPages - 1} additional pages for a total of ${totalRecords} records`);
      
      const pagePromises = [];
      
      for (let page = 1; page < totalPages; page++) {
        const offset = page * pageSize;
        const urlWithPagination = `${baseUrl}&offset=${offset}&limit=${pageSize}`;
        
        pagePromises.push(
          fetch(urlWithPagination, { next: { revalidate: 3600 } })
            .then(res => {
              if (!res.ok) throw new Error(`Page ${page} fetch failed: ${res.statusText}`);
              return res.json();
            })
            .then(data => {
              if (data.data) {
                return data.data;
              }
              return [];
            })
            .catch(err => {
              console.error(`Error fetching page ${page}:`, err);
              return [];
            })
        );
      }
      
      const pageResults = await Promise.all(pagePromises);
      pageResults.forEach(items => {
        allItems.push(...items);
      });
    }

    console.log(`Total items fetched: ${allItems.length} out of ${totalRecords}`);
    
    if (allItems.length < totalRecords) {
      console.warn(`Warning: Expected ${totalRecords} items but only fetched ${allItems.length}`);
    }
    
    return allItems;
  } catch (error) {
    console.error('Error in fetchAllPages:', error);
    return allItems; // Return whatever we managed to fetch
  }
}


async function fetchAndMergePlayerStats(
  baseUrl: string,
  playerMap: Map<number, CombinedPlayer>
) {
  try {
    const items = await fetchAllPages<PlayerStatsItem>(baseUrl, 1000);
    
    // Batch process league fallbacks
    const teamIdsNeedingFallback: number[] = [];
    const teamIdToPlayersMap: Map<number, PlayerStatsItem[]> = new Map();
    
    for (const item of items) {
      const teamId = item.team.id;
      if (teamId && (!item.team.league?.leagueLevel || !item.team.league?.slug)) {
        if (!teamIdsNeedingFallback.includes(teamId)) {
          teamIdsNeedingFallback.push(teamId);
        }
        
        if (!teamIdToPlayersMap.has(teamId)) {
          teamIdToPlayersMap.set(teamId, []);
        }
        teamIdToPlayersMap.get(teamId)!.push(item);
      }
    }
    
    // Fetch all fallbacks in parallel
    const fallbackPromises = teamIdsNeedingFallback.map(teamId => 
      fetchLeagueLevelAndSlug(teamId)
    );
    const fallbackResults = await Promise.all(fallbackPromises);
    
    const fallbackMap = new Map<number, LeagueFallback>();
    teamIdsNeedingFallback.forEach((teamId, index) => {
      fallbackMap.set(teamId, fallbackResults[index]);
    });

    // Merge items into the main playerMap
    for (const item of items) {
      const pid = item.player.id;
      if (!playerMap.has(pid)) {
        playerMap.set(pid, {
          player: {
            id: pid,
            name: item.player.name || '',
            yearOfBirth: item.player.yearOfBirth || null,
            gender: item.player.gender || null,
            status: item.player.status || null,
            position: item.player.position,
            youthTeam: item.player.youthTeam || null,
          },
          teams: [],
        });
      }

      const existing = playerMap.get(pid)!;

      let leagueLevel = item.team.league?.leagueLevel ?? null;
      let leagueSlug = item.team.league?.slug ?? null;

      const teamId = item.team.id;
      if (teamId && fallbackMap.has(teamId)) {
        const fallback = fallbackMap.get(teamId)!;
        if (!leagueLevel) {
          leagueLevel = fallback.level;
        }
        if (!leagueSlug) {
          leagueSlug = fallback.slug;
        }
      }

      const teamObj = {
        name: item.team.name || 'Unknown Team',
        leagueLevel: leagueLevel ?? 'unknown',
        leagueSlug: leagueSlug ?? 'unknown',
      };

      const alreadyExists = existing.teams.find(
        (t) =>
          t.name === teamObj.name &&
          t.leagueLevel === teamObj.leagueLevel &&
          t.leagueSlug === teamObj.leagueSlug
      );

      if (!alreadyExists) {
        existing.teams.push(teamObj);
      }
    }
  } catch (err) {
    console.error('Error in fetchAndMergePlayerStats:', err);
  }
}


async function fetchBatchDraftPicks(
  playerIds: number[],
  chunkSize = 500
): Promise<Map<number, DraftSelection>> {
  const resultMap = new Map<number, DraftSelection>();
  if (!playerIds.length) return resultMap;

  const chunks: number[][] = [];
  for (let i = 0; i < playerIds.length; i += chunkSize) {
    chunks.push(playerIds.slice(i, i + chunkSize));
  }
  
  const MAX_CONCURRENT = 3;
  
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
      const joinedIds = chunk.join(',');
      const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}&fields=${encodeURIComponent(
        'player.id,year,round,overall,team.name,team.logo.small,draftType.slug'
      )}`;

      try {
        const response = await fetch(url, {
          next: { revalidate: 86400 }
        });
        
        if (!response.ok) {
          return new Map<number, DraftSelection>();
        }

        interface DraftSelectionWithPlayer extends DraftSelection {
          player?: { id: number };
        }
        const data: ApiResponse<DraftSelectionWithPlayer> = await response.json();
        if (!data.data) {
          return new Map<number, DraftSelection>();
        }

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
                  name: ds.team.name ?? 'Unknown Team',
                  logo: ds.team.logo ?? 'Unknown Logo',
                }
              : undefined,
            draftType: ds.draftType,
          });
        }
        return chunkMap;
      } catch (err) {
        console.error('Error in fetchBatchDraftPicks chunk:', err);
        return new Map<number, DraftSelection>();
      }
    });

    const chunkResults = await Promise.all(chunkPromises);
    for (const chunkMap of chunkResults) {
      for (const [pid, draftSelection] of chunkMap.entries()) {
        resultMap.set(pid, draftSelection);
      }
    }
  }

  return resultMap;
}

export const revalidate = 3000;


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const teamIdsParam = searchParams.get('teamIds');
  const leagueParam = searchParams.get('league');
  const includeYouth = searchParams.get('includeYouth') === 'true';
  const teamsParam = searchParams.get('teams');
  const genderParam = searchParams.get('gender');

  const cacheKey = buildCacheKey(teamIdsParam, leagueParam, includeYouth, teamsParam, genderParam);

  // Check in-memory cache
  const now = Date.now();
  if (alumniRouteCache.has(cacheKey)) {
    const cachedData = alumniRouteCache.get(cacheKey)!;
    if (now - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
      });
    }
  }

  // Parse the query params
  const teamIds = teamIdsParam
    ? teamIdsParam.split(',').map((idStr) => parseInt(idStr.trim(), 10))
    : [];

  let leagues: string[] = [];
  if (leagueParam) {
    leagues = leagueParam.split(',').map((l) => l.trim()).filter(Boolean);
  }

  const playerMap: Map<number, CombinedPlayer> = new Map();

  try {
    // Build a list of fetch promises
    const fetchPromises: Promise<void>[] = [];

    // 1) Team-based logic (existing)
    for (const id of teamIds) {
      if (id > 0) {
        const baseUrl = buildTeamBaseUrl(id, leagues.length ? leagues : null);
        fetchPromises.push(fetchAndMergePlayerStats(baseUrl, playerMap));
      }
    }
    
    // 2) Youth-based logic (existing)
    if (includeYouth && teamsParam) {
      const baseUrl = buildYouthBaseUrl(teamsParam, leagues.length ? leagues : null);
      fetchPromises.push(fetchAndMergePlayerStats(baseUrl, playerMap));
    }

    // 3) NEW CODE: If no team IDs but we have leagues, fetch league-only
    if (teamIds.length === 0 && !teamsParam && leagues.length > 0) {
      const baseUrl = buildLeagueOnlyBaseUrl(leagues);
      fetchPromises.push(fetchAndMergePlayerStats(baseUrl, playerMap));
    }

    // Wait for all fetches
    await Promise.all(fetchPromises);

    // Gender filter (existing)
    let allPlayers = Array.from(playerMap.values());
    if (genderParam) {
      allPlayers = allPlayers.filter(
        (p) => p.player.gender?.toLowerCase() === genderParam.toLowerCase()
      );
    }

    // Draft picks
    const allPlayerIds = allPlayers.map((p) => p.player.id);
    const draftPickMap = await fetchBatchDraftPicks(allPlayerIds);

    for (const p of allPlayers) {
      p.draftPick = draftPickMap.get(p.player.id) ?? null;
    }

    // Build final array
    const finalPlayers = allPlayers.map((p) => ({
      id: p.player.id,
      name: p.player.name,
      birthYear: p.player.yearOfBirth,
      gender: p.player.gender,
      position: p.player.position,
      status: p.player.status,
      youthTeam: p.player.youthTeam,
      draftPick: p.draftPick
        ? {
            year: p.draftPick.year,
            round: p.draftPick.round,
            overall: p.draftPick.overall,
            team: p.draftPick.team
              ? {
                  name: p.draftPick.team?.name ?? 'N/A',
                  logo: p.draftPick.team?.logo?.small ?? null,
                }
              : undefined,
            draftType: p.draftPick.draftType,
          }
        : '-',
      teams: p.teams,
    }));

    const responseData = {
      players: finalPlayers,
      total: finalPlayers.length,
    };

    // Store in cache
    alumniRouteCache.set(cacheKey, { 
      data: responseData, 
      timestamp: now 
    });

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Alumni: Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
 */

// File: app/api/alumni-tournaments/route.ts

import { NextResponse } from "next/server";
import {
  ApiResponse,
  PlayerStatsItem,
  TeamStatsItem,
  DraftSelection,
  CombinedPlayer,
} from "@/app/types/route"; // Adjust import path if needed

// 1 hour cache
const CACHE_TTL = 60 * 60 * 1000;
const tournamentAlumniCache = new Map<string, { data: any; timestamp: number }>();

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

/** 
 * If you want to force "leagueLevel" to one of: "professional", "junior", "college", or "tournament".
 * Adjust the arrays below to your preference.
 */
function forceLeagueLevel(slug?: string): string {
  if (!slug) return "unknown";
  const slugLc = slug.toLowerCase();

  // Professional
  if (["nhl","ahl","shl","del","liiga","echl","icehl","khl","pwhl-w","phf-w","nwhl-ca-w"].includes(slugLc)) {
    return "professional";
  }
  // Junior
  if (["ohl","whl","qmjhl","ushl","j20-nationell"].includes(slugLc)) {
    return "junior";
  }
  // College
  if (["ncaa","usports","acac","acha","ncaa-w","acha-w","ncaa-iii-w","acha-d2-w"].includes(slugLc)) {
    return "college";
  }
  // Otherwise treat it as "tournament"
  return "tournament";
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
async function mergePlayerStats(baseUrl: string, playerMap: Map<number, CombinedPlayer>) {
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

    // Force a simpler leagueLevel if desired
    const forcedLevel = forceLeagueLevel(leagueSlug ?? undefined);

    // Insert into teams array
    const alreadyExists = existing.teams.find(
      (t) => t.name === item.team.name && t.leagueSlug === leagueSlug
    );
    if (!alreadyExists) {
      existing.teams.push({
        name: item.team.name || "Unknown Team",
        leagueSlug: leagueSlug,
        leagueLevel: forcedLevel,
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
 * The main GET handler for /api/alumni-tournaments.
 * e.g. /api/alumni-tournaments?tournaments=brick-invitational,spengler-cup&league=nhl&gender=male
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
      // Merge results into our playerMap
      await mergePlayerStats(baseUrl, playerMap);
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
        : {
            year: 0,
            round: 0,
            overall: 0,
            team: { name: "", logo: "" },
          };

      // Map the teams to your { name, leagueLevel } shape
      const mappedTeams = cp.teams.map((t) => ({
        name: t.name,
        leagueLevel: t.leagueLevel, // or null if you prefer
      }));

      return {
        id: cp.player.id,
        name: cp.player.name,
        birthYear: cp.player.yearOfBirth ? parseInt(cp.player.yearOfBirth, 10) : null,
        gender: cp.player.gender,
        status: cp.player.status,
        position: cp.player.position,
        draftPick,
        teams: mappedTeams,
        teamName: "", // or pick one from mappedTeams if you want
      };
    });

    const responseData = {
      tournaments: tournamentSlugs,
      totalPlayers: finalPlayers.length,
      players: finalPlayers,
      nextOffset: null, // or handle pagination if needed
    };

    // Cache & return
    tournamentAlumniCache.set(cacheKey, { data: responseData, timestamp: now });
    return NextResponse.json(responseData, { status: 200 });
  } catch (err: any) {
    console.error("Error in /api/alumni-tournaments route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Optionally, if you want Next.js to revalidate after 3000 seconds (SWR behavior):
// export const revalidate = 3000;
