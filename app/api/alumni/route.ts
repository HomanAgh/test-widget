import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface ApiResponse<T> {
  data?: T[];
  _meta?: {
    totalRecords?: number;
    [key: string]: any;
  };
}

interface PlayerStatsItem {
  player: {
    position: string;
    id: number;
    name?: string;
    yearOfBirth?: string;
    gender?: string;
  };
  team: {
    id?: number;
    name?: string;
    league?: {
      slug?: string;
      leagueLevel?: string;
    };
  };
}

interface TeamStatsItem {
  league?: {
    leagueLevel?: string;
  };
}

interface DraftSelection {
  year: number;
  round: number;
  overall: number;
  draftType?: {
    slug?: string;
  };
}

interface CombinedPlayer {
  id: number;
  name: string;
  yearOfBirth: string | null;
  gender: string | null;
  position: string;
  teams: {
    name: string;
    leagueLevel: string | null;
  }[];
  draftPick?: string;
}

/**
 * Add a simple in-memory cache to store fallback league levels
 * (teamId -> leagueLevel).
 */
const leagueLevelCache: Map<number, string | null> = new Map();

async function fetchLeagueLevelFallback(teamId: number): Promise<string | null> {
  // If we already have a cached value, return it immediately.
  if (leagueLevelCache.has(teamId)) {
    return leagueLevelCache.get(teamId) || null;
  }

  try {
    const fallbackUrl = `${apiBaseUrl}/team-stats?offset=0&limit=1&sort=-season&team=${teamId}&apiKey=${apiKey}`;
    console.log(`Alumni: fetching fallback leagueLevel => ${fallbackUrl}`);

    const resp = await fetch(fallbackUrl);
    if (!resp.ok) {
      console.error(`Failed to fetch fallback leagueLevel for teamId=${teamId}: ${resp.statusText}`);
      // Cache the failure as null so we don't retry repeatedly
      leagueLevelCache.set(teamId, null);
      return null;
    }

    const fallbackData: ApiResponse<TeamStatsItem> = await resp.json();
    if (fallbackData.data && fallbackData.data.length > 0) {
      const level = fallbackData.data[0].league?.leagueLevel ?? null;
      // Cache the result for future lookups
      leagueLevelCache.set(teamId, level);
      return level;
    }

    leagueLevelCache.set(teamId, null);
    return null;
  } catch (error) {
    console.error(`Error fetching fallback leagueLevel for teamId=${teamId}:`, error);
    leagueLevelCache.set(teamId, null);
    return null;
  }
}


/**
 * Build the "base" URL for a single team & (optional) single league,
 * EXCLUDING offset & limit, since we will handle pagination ourselves in fetchAllPages.
 */
function buildTeamBaseUrl(teamId: number, singleLeague: string | null) {
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&player.hasPlayedInTeam=${teamId}`;

  if (singleLeague) {
    url += `&league=${singleLeague}`;
  } else {
    url += `&fetchAllLeagues=true`;
  }

  // Specify the fields we want
  url += `&fields=${encodeURIComponent(
    'player.id,player.name,player.position,player.yearOfBirth,player.gender,team.id,team.name,team.league.slug,team.league.leagueLevel'
  )}`;

  return url;
}

/**
 * Build a "base" URL for fetching players by youthTeam name (if supported by your API).
 */
function buildYouthBaseUrl(teamsParam: string, singleLeague: string | null) {
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&player.youthTeam=${encodeURIComponent(teamsParam)}`;

  if (singleLeague) {
    url += `&league=${singleLeague}`;
  } else {
    url += `&fetchAllLeagues=true`;
  }

  url += `&fields=${encodeURIComponent(
    'player.id,player.name,player.yearOfBirth,player.gender,team.id,team.name,team.league.slug,team.league.leagueLevel'
  )}`;

  return url;
}

/**
 * fetchAllPages: given a baseUrl (that does NOT contain offset/limit),
 * fetch data in increments of pageSize, repeating until we've collected all data.
 */
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

/**
 * Helper to fetch from a single "baseUrl" (player-stats) across multiple pages
 * and merge into our global playerMap so we accumulate teams for each player.
 */
async function fetchAndMergePlayerStats(
  baseUrl: string,
  playerMap: Map<number, CombinedPlayer>
) {
  try {
    const items = await fetchAllPages<PlayerStatsItem>(baseUrl, 1000);

    for (const item of items) {
      const playerId = item.player.id;
      if (!playerMap.has(playerId)) {
        playerMap.set(playerId, {
          id: playerId,
          name: item.player.name || '',
          yearOfBirth: item.player.yearOfBirth || null,
          gender: item.player.gender || null,
          position: item.player.position, 
          teams: [],
        });
      }

      const existing = playerMap.get(playerId)!;

      // Determine leagueLevel, with fallback
      let leagueLevel = item.team.league?.leagueLevel || null;
      const teamId = item.team.id;
      if (!leagueLevel && teamId) {
        leagueLevel = await fetchLeagueLevelFallback(teamId);
      }

      // Insert the new team if not already present
      const teamObj = {
        name: item.team.name || 'Unknown Team',
        leagueLevel: leagueLevel ?? 'unknown',
      };
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

/**
 * NEW: Batch-fetch NHL draft picks for multiple players at once.
 *
 * Example URL:
 *   /draft-selections?draftType=nhl-entry-draft&player=597559,38703,6146&apiKey=...
 */
async function fetchBatchDraftPicks(playerIds: number[]): Promise<Map<number, string>> {
  const resultMap = new Map<number, string>();
  if (!playerIds.length) return resultMap;

  // Build comma-separated IDs
  const joinedIds = playerIds.join(',');
  // Build final URL
  const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}`;
  console.log('Batch fetching draft picks =>', url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Error fetching batch draft picks:', response.statusText);
      return resultMap; // return empty if fail
    }

    interface DraftSelectionWithPlayer extends DraftSelection {
      player?: { id: number; name?: string };
    }
    const data: ApiResponse<DraftSelectionWithPlayer> = await response.json();
    if (!data.data) {
      return resultMap;
    }

    // For each returned selection, store something like: "2020 Round 2, Overall 35"
    for (const ds of data.data) {
      const pid = ds.player?.id;
      if (!pid) continue; // skip if missing

      // If you only want the first or the latest, you can decide your logic.
      // For simplicity, let's just store the first time we see it (likely sorted).
      if (!resultMap.has(pid)) {
        const pickStr = `${ds.year} Round ${ds.round}, Overall ${ds.overall}`;
        resultMap.set(pid, pickStr);
      }
    }
  } catch (err) {
    console.error('Error in fetchBatchDraftPicks:', err);
  }

  return resultMap;
}

/**
 * Main GET => /api/alumni
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Query params
  const teamIdsParam = searchParams.get('teamIds'); 
  const leagueParam = searchParams.get('league');   
  const fetchAllLeagues = searchParams.get('fetchAllLeagues') === 'true';
  const includeYouth = searchParams.get('includeYouth') === 'true';
  const teamsParam = searchParams.get('teams');     
  const genderParam = searchParams.get('gender');   

  console.log('Alumni: Query params =>');
  console.log('  teamIdsParam =', teamIdsParam);
  console.log('  leagueParam =', leagueParam, 'fetchAllLeagues =', fetchAllLeagues);
  console.log('  includeYouth =', includeYouth);
  console.log('  teamsParam =', teamsParam);
  console.log('  gender =', genderParam);

  // Convert teamIds => number[]
  const teamIds = teamIdsParam
    ? teamIdsParam.split(',').map((idStr) => parseInt(idStr.trim(), 10))
    : [];

  // Convert league => string[]
  let leagues: string[] = [];
  if (leagueParam) {
    leagues = leagueParam.split(',').map((l) => l.trim());
  } else if (fetchAllLeagues) {
    leagues = []; // interpret "all leagues"
  }

  // A container to accumulate data for each player (by ID)
  const playerMap: Map<number, CombinedPlayer> = new Map();

  try {
    //
    // 1) For each team, fetch player-stats across all pages (and each league).
    //
    for (const id of teamIds) {
      if (leagues.length === 0) {
        // no specific leagues => fetch all
        const baseUrl = buildTeamBaseUrl(id, null);
        await fetchAndMergePlayerStats(baseUrl, playerMap);
      } else {
        // fetch for each league
        for (const singleLeague of leagues) {
          const baseUrl = buildTeamBaseUrl(id, singleLeague);
          await fetchAndMergePlayerStats(baseUrl, playerMap);
        }
      }
    }

    //
    // 2) If includeYouth => do the same for youthTeam
    //
    if (includeYouth && teamsParam) {
      if (leagues.length === 0) {
        const baseUrl = buildYouthBaseUrl(teamsParam, null);
        await fetchAndMergePlayerStats(baseUrl, playerMap);
      } else {
        for (const singleLeague of leagues) {
          const baseUrl = buildYouthBaseUrl(teamsParam, singleLeague);
          await fetchAndMergePlayerStats(baseUrl, playerMap);
        }
      }
    }

    //
    // 3) Convert playerMap to an array
    //
    let allPlayers = Array.from(playerMap.values());

    //
    // 4) Optional: filter by gender
    //
    if (genderParam) {
      allPlayers = allPlayers.filter(
        (p) => p.gender?.toLowerCase() === genderParam.toLowerCase()
      );
    }

    //
    // 5) Batch-fetch draft picks for all players
    //
    const allPlayerIds = allPlayers.map((p) => p.id);
    const draftPickMap = await fetchBatchDraftPicks(allPlayerIds);

    // Merge the draftPick into each player
    for (const p of allPlayers) {
      p.draftPick = draftPickMap.get(p.id) ?? '-';
    }

    //
    // 6) Final transformation: rename yearOfBirth => birthYear, etc.
    //
    const finalPlayers = allPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      birthYear: p.yearOfBirth,
      gender: p.gender,
      position: p.position,
      draftPick: p.draftPick ?? 'N/A',
      teams: p.teams,
    }));

    return NextResponse.json({
      players: finalPlayers,
      total: finalPlayers.length,
    });
  } catch (error) {
    console.error('Alumni: Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
