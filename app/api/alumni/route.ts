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

function buildTeamBaseUrl(teamId: number, leagues: string[] | string | null) {
  let leagueParam: string | null = null;
  if (leagues) {
    leagueParam = Array.isArray(leagues) ? leagues.join(',') : leagues;
  }
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&league=${encodeURIComponent(
    leagueParam ?? ''
  )}&player.hasPlayedInTeam=${teamId}`;

  url += `&fields=${encodeURIComponent(fields)}`;
  return url;
}

function buildYouthBaseUrl(teamsParam: string, leagues: string[] | string | null) {
  let leagueParam: string | null = null;
  if (leagues) {
    leagueParam = Array.isArray(leagues) ? leagues.join(',') : leagues;
  }
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&league=${encodeURIComponent(
    leagueParam ?? ''
  )}&player.youthTeam=${encodeURIComponent(teamsParam)}`;

  url += `&fields=${encodeURIComponent(fields)}`;
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
      // Calculate how many pages we need to fetch
      const totalPages = Math.ceil(totalRecords / pageSize);
      console.log(`Fetching ${totalPages - 1} additional pages for a total of ${totalRecords} records`);
      
      const pagePromises = [];
      
      // Start from page 1 (we already have page 0)
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
      
      // Wait for all pages to load in parallel
      const pageResults = await Promise.all(pagePromises);
      
      // Add all items from all pages
      pageResults.forEach(items => {
        allItems.push(...items);
      });
    }

    console.log(`Total items fetched: ${allItems.length} out of ${totalRecords}`);
    
    // Verify we have all the data
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
    
    // First pass - identify teams needing fallback
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
    
    // Create a map of teamId to fallback data
    const fallbackMap = new Map<number, LeagueFallback>();
    teamIdsNeedingFallback.forEach((teamId, index) => {
      fallbackMap.set(teamId, fallbackResults[index]);
    });

    // Process all items
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

  // Process chunks in parallel with a reasonable concurrency limit
  const chunks: number[][] = [];
  for (let i = 0; i < playerIds.length; i += chunkSize) {
    chunks.push(playerIds.slice(i, i + chunkSize));
  }
  
  const MAX_CONCURRENT = 3; // Limit concurrent requests
  
  // Process chunks with limited concurrency
  for (let i = 0; i < chunks.length; i += MAX_CONCURRENT) {
    const chunkPromises = chunks.slice(i, i + MAX_CONCURRENT).map(async (chunk) => {
      const joinedIds = chunk.join(',');
      const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}&fields=${encodeURIComponent(
        'player.id,year,round,overall,team.name,team.logo.small,draftType.slug'
      )}`;

      try {
        const response = await fetch(url, {
          next: { revalidate: 86400 } // Cache for 24 hours
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
    
    // Merge chunk results into the main result map
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

  // Check cache with TTL
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
    leagues = leagueParam.split(',').map((l) => l.trim());
  }

  const playerMap: Map<number, CombinedPlayer> = new Map();

  try {
    // Fetch team data in parallel
    const fetchPromises = [];
    
    for (const id of teamIds) {
      const baseUrl = buildTeamBaseUrl(id, leagues.length ? leagues : null);
      fetchPromises.push(fetchAndMergePlayerStats(baseUrl, playerMap));
    }
    
    if (includeYouth && teamsParam) {
      const baseUrl = buildYouthBaseUrl(teamsParam, leagues.length ? leagues : null);
      fetchPromises.push(fetchAndMergePlayerStats(baseUrl, playerMap));
    }
    
    // Wait for all fetches to complete
    await Promise.all(fetchPromises);

    let allPlayers = Array.from(playerMap.values());

    if (genderParam) {
      allPlayers = allPlayers.filter(
        (p) => p.player.gender?.toLowerCase() === genderParam.toLowerCase()
      );
    }

    const allPlayerIds = allPlayers.map((p) => p.player.id);
    const draftPickMap = await fetchBatchDraftPicks(allPlayerIds);

    for (const p of allPlayers) {
      p.draftPick = draftPickMap.get(p.player.id) ?? null;
    }

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
            team: {
              name: p.draftPick.team?.name ?? 'N/A',
              logo: p.draftPick.team?.logo?.small ?? null,
            },
            draftType: p.draftPick.draftType,
          }
        : '-',
      teams: p.teams,
    }));

    const responseData = {
      players: finalPlayers,
      total: finalPlayers.length,
    };

    // Store in cache with timestamp
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

import { NextResponse } from 'next/server';
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

/** Utility function to build a unique cache key from the query params */
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

/** 
 * If a league's data is missing from the item, we do a fallback fetch to fill leagueLevel or slug.
 * This is your existing logic for partial data.
 */
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

/** 
 * Build a URL that fetches players who have played in a specific team ID 
 * plus optional league param
 */
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

/** 
 * Build a URL that fetches players by youthTeam name, plus optional league param 
 */
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

/**
 * NEW: Build a URL that fetches ALL players in given leagues (no team constraint)
 */
function buildLeagueOnlyBaseUrl(leagues: string[]) {
  const leagueParam = leagues.join(',');
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&fields=${encodeURIComponent(fields)}`;
  if (leagueParam) {
    url += `&league=${encodeURIComponent(leagueParam)}`;
  }
  return url;
}

/**
 * Helper to fetch all pages from an endpoint that might have multiple pages of data.
 */
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

/**
 * fetchAndMergePlayerStats:
 *  - fetches all pages of data from baseUrl
 *  - merges them into playerMap by player ID
 *  - does fallback for missing league data
 */
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

/**
 * fetchBatchDraftPicks: fetches draft info in chunks
 */
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

/** 
 * MAIN GET Handler 
 */
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
