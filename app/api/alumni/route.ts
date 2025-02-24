import { NextResponse } from 'next/server';
import { ApiResponse, PlayerStatsItem, TeamStatsItem, DraftSelection, CombinedPlayer } from '@/app/types/route';

const alumniRouteCache = new Map<string, any>();
const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;
const leagueLevelCache: Map<number, string | null> = new Map();

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

async function fetchLeagueLevelFallback(teamId: number): Promise<string | null> {
  if (leagueLevelCache.has(teamId)) {
    return leagueLevelCache.get(teamId) || null;
  }

  try {
    const fallbackUrl = `${apiBaseUrl}/team-stats?offset=0&limit=1&sort=-season&team=${teamId}&apiKey=${apiKey}&fields=league.leagueLevel`;
    console.log(`Alumni: fetching fallback leagueLevel => ${fallbackUrl}`);

    const resp = await fetch(fallbackUrl);
    if (!resp.ok) {
      console.error(`Failed fallback for teamId=${teamId}: ${resp.statusText}`);
      leagueLevelCache.set(teamId, null);
      return null;
    }

    const fallbackData: ApiResponse<TeamStatsItem> = await resp.json();
    if (fallbackData.data && fallbackData.data.length > 0) {
      const level = fallbackData.data[0].league?.leagueLevel ?? null;
      leagueLevelCache.set(teamId, level);
      return level;
    }

    leagueLevelCache.set(teamId, null);
    return null;
  } catch (error) {
    console.error(`Error in fallback for teamId=${teamId}:`, error);
    leagueLevelCache.set(teamId, null);
    return null;
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
  console.log(url);
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
  console.log(url);
  return url;
}

async function fetchAllPages<T>(baseUrl: string, pageSize = 1000): Promise<T[]> {
  const allItems: T[] = [];
  let offset = 0;
  let totalRecords = 0;

  do {
    const urlWithPagination = `${baseUrl}&offset=${offset}&limit=${pageSize}`;
    console.log('Fetching paginated => ', urlWithPagination);

    const res = await fetch(urlWithPagination);
    if (!res.ok) {
      console.error('Paginated fetch failed:', res.statusText);
      break;
    }

    const data: ApiResponse<T> & { _meta?: { totalRecords?: number } } = await res.json();
    if (data.data) {
      allItems.push(...data.data);
    }

    const metaTotal = data._meta?.totalRecords ?? 0;
    if (metaTotal > 0) {
      totalRecords = metaTotal;
    }

    offset += pageSize;
  } while (offset < totalRecords);

  return allItems;
}

async function fetchAndMergePlayerStats(
  baseUrl: string,
  playerMap: Map<number, CombinedPlayer>
) {
  try {
    const items = await fetchAllPages<PlayerStatsItem>(baseUrl, 1000);

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

      let leagueLevel = item.team.league?.leagueLevel || null;
      const teamId = item.team.id;
      if (!leagueLevel && teamId) {
        leagueLevel = await fetchLeagueLevelFallback(teamId);
      }

      const teamObj = {
        name: item.team.name || 'Unknown Team',
        leagueLevel: leagueLevel ?? 'unknown',
        leagueSlug: item.team.league?.slug ?? 'unknown',
      };
      console.log(teamObj);

      const alreadyExists = existing.teams.find(
        (t) => t.name === teamObj.name && t.leagueLevel === teamObj.leagueLevel
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

  let startIndex = 0;
  while (startIndex < playerIds.length) {
    const chunk = playerIds.slice(startIndex, startIndex + chunkSize);
    const joinedIds = chunk.join(',');
    const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}&fields=${encodeURIComponent(
      'player.id,year,round,overall,team.name,team.logo.small,draftType.slug'
    )}`;

    console.log('Fetching Draft Picks from:', url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        startIndex += chunkSize;
        continue;
      }

      interface DraftSelectionWithPlayer extends DraftSelection {
        player?: { id: number };
      }
      const data: ApiResponse<DraftSelectionWithPlayer> = await response.json();
      if (!data.data) {
        startIndex += chunkSize;
        continue;
      }

      for (const ds of data.data) {
        const pid = ds.player?.id;
        if (!pid) continue;

        resultMap.set(pid, {
          year: ds.year,
          round: ds.round,
          overall: ds.overall,
          team: ds.team
            ? {
                name: ds.team.name ?? 'Unknown Team',
                logo: ds.team.logo ?? 'Unkown Logo',
              }
            : undefined,
          draftType: ds.draftType,
        });
      }
    } catch (err) {
      console.error('Error in fetchBatchDraftPicks chunk:', err);
    }

    startIndex += chunkSize;
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

  console.log('Alumni: Query params =>', {
    teamIdsParam,
    leagueParam,
    includeYouth,
    teamsParam,
    genderParam,
  });

  const cacheKey = buildCacheKey(teamIdsParam, leagueParam, includeYouth, teamsParam, genderParam);

  if (alumniRouteCache.has(cacheKey)) {
    console.log('Returning cached /api/alumni response for key:', cacheKey);
    return NextResponse.json(alumniRouteCache.get(cacheKey), {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });
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
    for (const id of teamIds) {
      const baseUrl = buildTeamBaseUrl(id, leagues.length ? leagues : null);
      await fetchAndMergePlayerStats(baseUrl, playerMap);
    }
    if (includeYouth && teamsParam) {
      const baseUrl = buildYouthBaseUrl(teamsParam, leagues.length ? leagues : null);
      await fetchAndMergePlayerStats(baseUrl, playerMap);
    }

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

    alumniRouteCache.set(cacheKey, responseData);

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
