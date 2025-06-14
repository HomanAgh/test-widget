import { NextResponse } from 'next/server';
import {
  ApiResponse,
  PlayerStatsItem,
  TeamStatsItem,
  DraftSelection,
  CombinedPlayer,
} from '@/app/types/route';

// Cache configuration
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
const whereAreTheyNowCache = new Map<string, { data: any; timestamp: number }>();
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
    endpoint: 'where-are-they-now'
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

  // NOTE: We cannot filter by isActiveSeason in the URL - API doesn't support it
  // We'll filter after fetching the data
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

  // NOTE: We cannot filter by isActiveSeason in the URL - API doesn't support it
  // We'll filter after fetching the data
  url += `&fields=${encodeURIComponent(fields)}`;
  return url;
}

async function fetchAllPages<T>(baseUrl: string, pageSize = 1000): Promise<T[]> {
  const allItems: T[] = [];
  
  try {
    const initialUrl = `${baseUrl}&offset=0&limit=${pageSize}`;
    console.log('🔍 [Where Are They Now] Fetching initial page:', initialUrl);
    const initialRes = await fetch(initialUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!initialRes.ok) {
      console.error('[Where Are They Now] Initial fetch failed:', initialRes.statusText);
      return [];
    }

    const initialData: ApiResponse<T> & { _meta?: { totalRecords?: number } } = await initialRes.json();
    if (initialData.data) {
      allItems.push(...initialData.data);
    }

    const totalRecords = initialData._meta?.totalRecords ?? 0;
    console.log('📊 [Where Are They Now] Initial fetch results:', {
      itemsReceived: initialData.data?.length || 0,
      totalRecords,
      needsMorePages: totalRecords > pageSize
    });
    
    if (totalRecords > pageSize) {
      const totalPages = Math.ceil(totalRecords / pageSize);
      console.log(`[Where Are They Now] Fetching ${totalPages - 1} additional pages for a total of ${totalRecords} records`);
      
      const pagePromises = [];
      
      for (let page = 1; page < totalPages; page++) {
        const offset = page * pageSize;
        const urlWithPagination = `${baseUrl}&offset=${offset}&limit=${pageSize}`;
        
        pagePromises.push(
          fetch(urlWithPagination, { next: { revalidate: 3600 } })
            .then(res => {
              console.log(`📄 [Where Are They Now] Fetching page ${page}:`, urlWithPagination);
              if (!res.ok) throw new Error(`Page ${page} fetch failed: ${res.statusText}`);
              return res.json();
            })
            .then(data => {
              console.log(`✅ [Where Are They Now] Page ${page} completed:`, data.data?.length || 0, 'items');
              if (data.data) {
                return data.data;
              }
              return [];
            })
            .catch(err => {
              console.error(`❌ [Where Are They Now] Error fetching page ${page}:`, err);
              return [];
            })
        );
      }
      
      const pageResults = await Promise.all(pagePromises);
      pageResults.forEach(items => {
        allItems.push(...items);
      });
    }

    console.log(`🎯 [Where Are They Now] Total items fetched: ${allItems.length} out of ${totalRecords}`);
    
    if (allItems.length < totalRecords) {
      console.warn(`⚠️ [Where Are They Now] Warning: Expected ${totalRecords} items but only fetched ${allItems.length}`);
    }
    
    return allItems;
  } catch (error) {
    console.error('[Where Are They Now] Error in fetchAllPages:', error);
    return allItems;
  }
}

async function fetchAndMergeCurrentPlayerStats(
  baseUrl: string,
  playerMap: Map<number, CombinedPlayer>
) {
  try {
    console.log('🚀 [Where Are They Now] Starting fetchAndMergeCurrentPlayerStats for:', baseUrl);
    const items = await fetchAllPages<PlayerStatsItem>(baseUrl, 1000);
    console.log('📈 [Where Are They Now] Received items from fetchAllPages:', items.length);
    
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
    
    if (teamIdsNeedingFallback.length > 0) {
      console.log('🔄 [Where Are They Now] Fetching league fallbacks for teams:', teamIdsNeedingFallback);
    }
    
    const fallbackPromises = teamIdsNeedingFallback.map(teamId => 
      fetchLeagueLevelAndSlug(teamId)
    );
    const fallbackResults = await Promise.all(fallbackPromises);
    
    const fallbackMap = new Map<number, LeagueFallback>();
    teamIdsNeedingFallback.forEach((teamId, index) => {
      fallbackMap.set(teamId, fallbackResults[index]);
    });

    // Process all items - focus on current teams only
    let activeSeasonCount = 0;
    const totalItemsCount = items.length;
    
    for (const item of items) {
      // IMPORTANT: Filter for active seasons only - API doesn't support URL filtering
      if (!item.isActiveSeason) {
        continue;
      }
      
      activeSeasonCount++;

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
        isCurrentTeam: true // All teams are current since we filter by isActiveSeason
      };

      // For "Where are they now", we only want current teams, so no need to check for duplicates
      // since each player should only have one current team per league
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
    
    console.log('✨ [Where Are They Now] Completed fetchAndMergeCurrentPlayerStats:', {
      totalItemsFetched: totalItemsCount,
      activeSeasonItems: activeSeasonCount,
      uniquePlayersInMap: playerMap.size,
      activeSeasonPercentage: totalItemsCount > 0 ? ((activeSeasonCount / totalItemsCount) * 100).toFixed(1) + '%' : '0%'
    });
  } catch (err) {
    console.error('❌ [Where Are They Now] Error in fetchAndMergeCurrentPlayerStats:', err);
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
        console.error('[Where Are They Now] Error in fetchBatchDraftPicks chunk:', err);
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

  // Check cache with TTL
  const now = Date.now();
  if (whereAreTheyNowCache.has(cacheKey)) {
    const cachedData = whereAreTheyNowCache.get(cacheKey)!;
    if (now - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
        },
      });
    }
  }

  const teamIds = teamIdsParam
    ? teamIdsParam.split(',').map((idStr) => parseInt(idStr.trim(), 10))
    : [];

  let leagues: string[] = [];
  if (leagueParam) {
    leagues = leagueParam.split(',').map((l) => l.trim());
  }

  const playerMap: Map<number, CombinedPlayer> = new Map();

  try {
    console.log('🎬 [Where Are They Now] Starting current teams data fetch with params:', {
      teamIds,
      leagues,
      includeYouth,
      teamsParam,
      genderParam
    });
    
    const fetchPromises = [];
    
    for (const id of teamIds) {
      const baseUrl = buildTeamBaseUrl(id, leagues.length ? leagues : null);
      console.log(`🏒 [Where Are They Now] Adding team fetch for ID ${id}:`, baseUrl);
      fetchPromises.push(fetchAndMergeCurrentPlayerStats(baseUrl, playerMap));
    }
    
    if (includeYouth && teamsParam) {
      const baseUrl = buildYouthBaseUrl(teamsParam, leagues.length ? leagues : null);
      console.log('👶 [Where Are They Now] Adding youth team fetch:', baseUrl);
      fetchPromises.push(fetchAndMergeCurrentPlayerStats(baseUrl, playerMap));
    }
    
    console.log(`⏳ [Where Are They Now] Waiting for ${fetchPromises.length} fetch operations to complete...`);
    await Promise.all(fetchPromises);
    console.log('🏁 [Where Are They Now] All fetch operations completed!');

    let allPlayers = Array.from(playerMap.values());
    console.log('👥 [Where Are They Now] Total players before gender filter:', allPlayers.length);

    if (genderParam) {
      const beforeFilter = allPlayers.length;
      allPlayers = allPlayers.filter(
        (p) => p.player.gender?.toLowerCase() === genderParam.toLowerCase()
      );
      console.log(`🚻 [Where Are They Now] Gender filter applied (${genderParam}): ${beforeFilter} → ${allPlayers.length} players`);
    }

    const allPlayerIds = allPlayers.map((p) => p.player.id);
    console.log('🎯 [Where Are They Now] Fetching draft picks for', allPlayerIds.length, 'players');
    const draftPickMap = await fetchBatchDraftPicks(allPlayerIds);
    console.log('📋 [Where Are They Now] Draft picks fetched:', draftPickMap.size, 'players have draft data');

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
      currentTeams: p.teams.map(team => ({
        name: team.name,
        leagueLevel: team.leagueLevel,
        leagueSlug: team.leagueSlug,
        isCurrentTeam: team.isCurrentTeam
      })),
    }));

    const responseData = {
      players: finalPlayers,
      total: finalPlayers.length,
    };

    whereAreTheyNowCache.set(cacheKey, { 
      data: responseData, 
      timestamp: now 
    });

    console.log('🎉 [Where Are They Now] Response ready with', finalPlayers.length, 'players');

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('❌ [Where Are They Now] Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch current teams data.' }, { status: 500 });
  }
} 