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
    id: number;
    name?: string;
    yearOfBirth?: string;
    gender?: string;
    status?:string;
    youthTeam: null;
    position: string;
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
  year?: number;
  round?: number;
  overall?: number;
  team?:{
    name?: string;
    logo?: string
  }
  draftType?: {
    slug?: string;
  };
}

interface CombinedPlayer {
  player: {
    id: number;
    name: string;
    yearOfBirth: string | null;
    gender: string | null;
    status: string | null;
    position: string;
    youthTeam?: string | null;
  }
  teams: {
    name: string;
    leagueLevel: string | null;
  }[];
  draftPick?: DraftSelection | null; 
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
    const fallbackUrl = `${apiBaseUrl}/team-stats?offset=0&limit=1&sort=-season&team=${teamId}&apiKey=${apiKey}&fields=${encodeURIComponent("league.leagueLevel")}`;
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

const fields = [
  "player.id",
  "player.name",
  "isActiveSeason",
  "player.position",
  "player.yearOfBirth",
  "player.gender",
  "player.status",
  "player.youthTeam",
  "team.id",
  "team.name",
  "team.league.slug",
  "team.league.leagueLevel",
].join(",");

function buildTeamBaseUrl(teamId: number, singleLeague: string | null) {
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&league=${singleLeague}&player.hasPlayedInTeam=${teamId}`;

  url += `&fields=${encodeURIComponent(fields)}`;

  console.log(url);
  return url;
}


function buildYouthBaseUrl(teamsParam: string, singleLeague: string | null) {
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&league=${singleLeague}&player.youthTeam=${encodeURIComponent(teamsParam)}`;

  url += `&fields=${encodeURIComponent(fields)}`;
  

  console.log(url)
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
      const playerId = item.player.id;
      if (!playerMap.has(playerId)) {
        playerMap.set(playerId, {
          player: {
            id: playerId,
            name: item.player.name || "",
            yearOfBirth: item.player.yearOfBirth || null,
            gender: item.player.gender || null,
            status: item.player.status || null,
            position: item.player.position,
            youthTeam: item.player.youthTeam || null,
          },
          teams: [],
        } as CombinedPlayer);
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

async function fetchBatchDraftPicks(
  playerIds: number[],
  chunkSize = 500
): Promise<Map<number, DraftSelection>> {
  const resultMap = new Map<number, DraftSelection>();

  if (!playerIds.length) return resultMap;

  let startIndex = 0;

  while (startIndex < playerIds.length) {
    const chunk = playerIds.slice(startIndex, startIndex + chunkSize);
    const joinedIds = chunk.join(",");
    const url = `${apiBaseUrl}/draft-selections?offset=0&limit=1000&draftType=nhl-entry-draft&player=${joinedIds}&apiKey=${apiKey}&fields=${encodeURIComponent(
      "player.id,year,round,overall,team.name,team.logo.small,draftType.slug"
    )}`;    

    console.log("Fetching Draft Picks from:", url);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        startIndex += chunkSize;
        continue;
      }

      interface DraftSelectionWithPlayer extends DraftSelection {
        player?: { id: number; name?: string };
      }
      const data: ApiResponse<DraftSelectionWithPlayer> = await response.json();

      if (!data.data) {
        startIndex += chunkSize;
        continue;
      }

      // ✅ Merge draft picks correctly into `resultMap`
      for (const ds of data.data) {
        const pid = ds.player?.id;
        if (!pid) continue;


        resultMap.set(pid, {
          year: ds.year,
          round: ds.round,
          overall: ds.overall,
          team: ds.team
            ? {
                name: ds.team.name ?? "Unknown Team",
                logo: ds.team.logo ?? "Unkown Logo",
              }
            : undefined,
          draftType: ds.draftType,
        });
      }
    } catch (err) {
      console.error("Error in fetchBatchDraftPicks chunk:", err);
    }

    startIndex += chunkSize;
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
  const includeYouth = searchParams.get('includeYouth') === 'true';
  const teamsParam = searchParams.get('teams');     
  const genderParam = searchParams.get('gender');   

  console.log('Alumni: Query params =>');
  console.log('  teamIdsParam =', teamIdsParam);
  console.log('  leagueParam =', leagueParam);
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
        (p) => p.player.gender?.toLowerCase() === genderParam.toLowerCase()
      );
    }

    //
    // 5) Batch-fetch draft picks for all players
    //
    const allPlayerIds = allPlayers.map((p) => p.player.id);
    const draftPickMap = await fetchBatchDraftPicks(allPlayerIds);

    // Merge the draftPick into each player
   // Merge the draftPick into each player
    for (const p of allPlayers) {
      p.draftPick = draftPickMap.get(p.player.id) ?? null;
    }


    //
    // 6) Final transformation: rename yearOfBirth => birthYear, etc.
    //
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
              name: p.draftPick.team?.name ?? "N/A",
              logo: p.draftPick.team?.logo?.small ?? null, // Ensure team logo is included
            },
            draftType: p.draftPick.draftType,
          }
        : "N/A",
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
