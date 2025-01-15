import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

// Minimal interfaces
interface ApiResponse<T> {
  data?: T[];
}
interface Player {
  id: number;
  name?: string;
  dateOfBirth?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse team IDs
  const teamIdsParam = searchParams.get('teamIds'); // e.g. "21240,33613"
  // e.g. "nhl,shl,ohl" => should be an OR
  const leagueParam = searchParams.get('league');
  const includeYouth = searchParams.get('includeYouth') === 'true';
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const teamsParam = searchParams.get('teams'); // for youth team name

  console.log('Alumni Route: Received query params =>');
  console.log('  teamIdsParam =', teamIdsParam);
  console.log('  leagueParam =', leagueParam);
  console.log('  includeYouth =', includeYouth);
  console.log('  teamsParam =', teamsParam);
  console.log('  offset =', offset, 'limit =', limit);

  // Convert teamIds => number[]
  const teamIds = teamIdsParam
    ? teamIdsParam.split(',').map((idStr) => parseInt(idStr.trim(), 10))
    : [];
  // Convert league => string[]
  const leagues = leagueParam
    ? leagueParam.split(',').map((l) => l.trim().toLowerCase())
    : [];

  let allPlayers: Player[] = [];

  try {
    //
    // 1) Fetch players for each numeric team ID, BUT do multiple fetches
    //    for each league => OR logic.
    //
    for (const id of teamIds) {
      if (leagues.length === 0) {
        // If no league specified, or user wants "all leagues", do a single fetch
        const url = buildTeamUrl(id, null);
        console.log(`Alumni Route: fetching all leagues for teamId=${id} => ${url}`);
        await fetchAndCombinePlayers(url, allPlayers, id);
      } else {
        // leagues array => do 1 fetch per league => OR
        for (const singleLeague of leagues) {
          const url = buildTeamUrl(id, singleLeague);
          console.log(
            `Alumni Route: fetching teamId=${id}, singleLeague=${singleLeague} => ${url}`
          );
          await fetchAndCombinePlayers(url, allPlayers, id);
        }
      }
    }

    //
    // 2) If includeYouth=true && teamsParam present => fetch youthTeam with OR logic for leagues
    //
    if (includeYouth && teamsParam) {
      if (leagues.length === 0) {
        // No specific league => fetchAllLeagues for youthTeam
        const url = buildYouthUrl(teamsParam, null);
        console.log(`Alumni Route: fetching youthTeam (all leagues) => ${url}`);
        await fetchAndCombinePlayers(url, allPlayers, /*teamId=*/-1);
      } else {
        // OR logic for each league
        for (const singleLeague of leagues) {
          const url = buildYouthUrl(teamsParam, singleLeague);
          console.log(
            `Alumni Route: fetching youthTeam (league=${singleLeague}) => ${url}`
          );
          await fetchAndCombinePlayers(url, allPlayers, /*teamId=*/-1);
        }
      }
    }

    //
    // 3) Deduplicate
    //
    const uniquePlayers = deduplicatePlayersById(allPlayers);
    console.log(
      'Alumni Route: total unique players before pagination =',
      uniquePlayers.length
    );

    //
    // 4) Paginate
    //
    const paginatedPlayers = uniquePlayers.slice(offset, offset + limit);
    console.log(
      `Alumni Route: returning players from index ${offset} to ${
        offset + limit
      }, final count = ${paginatedPlayers.length}`
    );

    //
    // 5) Convert dateOfBirth => birthYear
    //
    const minimalPlayers = paginatedPlayers.map((player) => ({
      id: player.id,
      name: player.name || '',
      birthYear: player.dateOfBirth
        ? new Date(player.dateOfBirth).getFullYear()
        : null,
    }));

    //
    // 6) Return
    //
    return NextResponse.json({
      players: minimalPlayers,
      total: uniquePlayers.length,
      nextOffset: offset + limit < uniquePlayers.length ? offset + limit : null,
    });
  } catch (error) {
    console.error('Alumni Route: Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}

/**
 * Helper function: Build a URL for players from a single team and league (or no league).
 */
function buildTeamUrl(teamId: number, singleLeague: string | null) {
  let url = `${apiBaseUrl}/players?hasPlayedInTeam=${teamId}`;
  if (singleLeague) {
    url += `&hasPlayedInLeague=${singleLeague}`;
  } else {
    url += `&fetchAllLeagues=true`;
  }
  url += `&apiKey=${apiKey}&fields=${encodeURIComponent('id,name,dateOfBirth')}`;
  return url;
}

/**
 * Helper function: Build a URL for youthTeam with a single league (or none).
 */
function buildYouthUrl(teamsParam: string, singleLeague: string | null) {
  let url = `${apiBaseUrl}/players?youthTeam=${encodeURIComponent(teamsParam)}`;
  if (singleLeague) {
    url += `&hasPlayedInLeague=${singleLeague}`;
  } else {
    url += `&fetchAllLeagues=true`;
  }
  url += `&apiKey=${apiKey}&fields=${encodeURIComponent('id,name,dateOfBirth')}`;
  return url;
}

/**
 * Helper: fetch, parse, and push results into the allPlayers array.
 */
async function fetchAndCombinePlayers(
  url: string,
  allPlayers: Player[],
  teamId: number
) {
  const res = await fetch(url);
  console.log(`Alumni Route: response status for teamId=${teamId} =>`, res.status);

  if (!res.ok) {
    console.error(`Alumni Route: failed to fetch players for teamId=${teamId}: ${res.statusText}`);
    return;
  }

  const json: ApiResponse<Player> = await res.json();
  const players = json.data || [];
  console.log(`Alumni Route: Team ID ${teamId} => fetched ${players.length} players.`);
  allPlayers.push(...players);
}

/**
 * Helper: deduplicate players by their ID.
 */
function deduplicatePlayersById(players: Player[]): Player[] {
  const uniqueMap = new Map<number, Player>();
  for (const p of players) {
    uniqueMap.set(p.id, p);
  }
  return Array.from(uniqueMap.values());
}
