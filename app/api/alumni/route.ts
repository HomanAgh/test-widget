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
  teams: {
    name: string;
    leagueLevel: string | null;
  }[];
  draftPick?: string;
}

/**
 * Helper to fetch leagueLevel if missing.
 */
async function fetchLeagueLevelFallback(teamId: number): Promise<string | null> {
  try {
    // We'll fetch up to 1 item from team-stats to find a fallback leagueLevel
    const fallbackUrl = `${apiBaseUrl}/team-stats?offset=0&limit=1&sort=-season&team=${teamId}&apiKey=${apiKey}`;
    console.log(`Alumni: fetching fallback leagueLevel => ${fallbackUrl}`);

    const resp = await fetch(fallbackUrl);
    if (!resp.ok) {
      console.error(`Failed to fetch fallback leagueLevel for teamId=${teamId}: ${resp.statusText}`);
      return null;
    }

    const fallbackData: ApiResponse<TeamStatsItem> = await resp.json();
    if (fallbackData.data && fallbackData.data.length > 0) {
      return fallbackData.data[0].league?.leagueLevel ?? null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching fallback leagueLevel for teamId=${teamId}:`, error);
    return null;
  }
}

/**
 * Helper to fetch the NHL draft pick for a player (if any).
 */
async function fetchDraftPick(playerId: number): Promise<string> {
  try {
    const url = `${apiBaseUrl}/players/${playerId}/draft-selections?offset=0&limit=100&sort=-year&fields=year,round,overall,draftType.slug&apiKey=${apiKey}`;
    console.log(`Alumni: fetching draft pick => ${url}`);

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error fetching draft pick for playerId ${playerId}: ${response.statusText}`);
      return 'N/A';
    }

    const data: ApiResponse<DraftSelection> = await response.json();
    if (!data.data || data.data.length === 0) {
      return 'N/A';
    }

    // Filter to only NHL picks
    const nhlDrafts = data.data.filter((d) => d.draftType?.slug === 'nhl-entry-draft');
    if (nhlDrafts.length === 0) {
      return 'N/A';
    }

    const draft = nhlDrafts[0];
    return `${draft.year} Round ${draft.round}, Overall ${draft.overall}`;
  } catch (error) {
    console.error(`Error fetching draft pick for playerId=${playerId}:`, error);
    return 'N/A';
  }
}

/**
 * Build the "base" URL for a single team & (optional) single league,
 * EXCLUDING offset & limit, since we will handle pagination ourselves in fetchAllPages.
 */
function buildTeamBaseUrl(teamId: number, singleLeague: string | null) {
  // Let each function omit offset & limit from the final URL
  // We'll add them dynamically in fetchAllPages.
  let url = `${apiBaseUrl}/player-stats?apiKey=${apiKey}&player.hasPlayedInTeam=${teamId}`;

  if (singleLeague) {
    url += `&league=${singleLeague}`;
  } else {
    url += `&fetchAllLeagues=true`;
  }

  // fields
  url += `&fields=${encodeURIComponent(
    'player.id,player.name,player.yearOfBirth,player.gender,team.id,team.name,team.league.slug,team.league.leagueLevel'
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
    // Update totalRecords if available
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
    // fetchAllPages will handle looping through offsets
    const items = await fetchAllPages<PlayerStatsItem>(baseUrl, 1000);

    for (const item of items) {
      const playerId = item.player.id;
      if (!playerMap.has(playerId)) {
        playerMap.set(playerId, {
          id: playerId,
          name: item.player.name || '',
          yearOfBirth: item.player.yearOfBirth || null,
          gender: item.player.gender || null,
          teams: [],
        });
      }
      const existing = playerMap.get(playerId)!;

      // Determine leagueLevel, with fallback
      let leagueLevel = item.team.league?.leagueLevel || null;
      const teamId = item.team.id;

      // If leagueLevel is null, attempt fallback fetch
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
 * Main GET => /api/alumni
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Query params
  const teamIdsParam = searchParams.get('teamIds'); // e.g. "21240,33613"
  const leagueParam = searchParams.get('league');   // e.g. "nhl,shl"
  const fetchAllLeagues = searchParams.get('fetchAllLeagues') === 'true';
  const includeYouth = searchParams.get('includeYouth') === 'true';
  const teamsParam = searchParams.get('teams');     // e.g. "Some Youth Team Name"
  const genderParam = searchParams.get('gender');   // e.g. "male" or "female"

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
    leagues = []; // "no leagueParam but fetchAllLeagues=true" => interpret "all leagues"
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
        // fetch for each league in "OR" logic
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
    // 3) Convert map to array
    //
    let allPlayers = Array.from(playerMap.values());

    //
    // 4) Optional: filter by gender
    //
    if (genderParam) {
      allPlayers = allPlayers.filter((p) => p.gender?.toLowerCase() === genderParam.toLowerCase());
    }

    //
    // 5) Fetch draft picks for each player
    //
    const draftPickPromises = allPlayers.map(async (p) => {
      const dp = await fetchDraftPick(p.id);
      p.draftPick = dp;
    });
    await Promise.all(draftPickPromises);

    //
    // 6) Transform dateOfBirth => birthYear
    //
    //    (You can do this client-side if you prefer.)
    //
    const finalPlayers = allPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      birthYear: p.yearOfBirth,
      gender: p.gender,
      draftPick: p.draftPick ?? 'N/A',
      teams: p.teams,
    }));

    // Return all players at once. 
    // (No more offset/limit pagination here.)
    return NextResponse.json({
      players: finalPlayers,
      total: finalPlayers.length,
    });
  } catch (error) {
    console.error('Alumni: Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}

