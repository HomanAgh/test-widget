/* import { NextResponse } from 'next/server';

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

  // numeric team IDs, e.g. ?teamIds=21240,33613
  const teamIdsParam = searchParams.get('teamIds');
  // optional league param, e.g. ?league=nhl
  const league = searchParams.get('league');
  // toggle for including youth team fetch, e.g. ?includeYouth=true
  const includeYouth = searchParams.get('includeYouth') === 'true';
  // offset & limit for pagination
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  // parse IDs into an array of numbers
  const teamIds = teamIdsParam
    ? teamIdsParam.split(',').map((idStr) => parseInt(idStr.trim(), 10))
    : [];

  // string-based param for youthTeam (if you want the user’s typed name):
  // e.g. ?teams=San Jose Jr. Sharks
  const teamsParam = searchParams.get('teams'); 

  console.log('Alumni Route: Received query params =>');
  console.log('  teamIdsParam =', teamIdsParam);
  console.log('  league =', league);
  console.log('  includeYouth =', includeYouth);
  console.log('  teamsParam =', teamsParam);
  console.log('  offset =', offset, 'limit =', limit);

  let allPlayers: Player[] = [];

  try {
    // 1) For each numeric team ID, fetch "hasPlayedInTeam=<ID>"
    for (const id of teamIds) {
      // Build external URL
      let playersUrl = `${apiBaseUrl}/players?hasPlayedInTeam=${id}`;
      if (league) {
        playersUrl += `&hasPlayedInLeague=${league}`;
      } else {
        // optionally handle "fetchAllLeagues"
        playersUrl += `&fetchAllLeagues=true`;
      }
      playersUrl += `&apiKey=${apiKey}&fields=${encodeURIComponent('id,name,dateOfBirth')}`;

      console.log(`Alumni Route: fetching players for teamId=${id}:`, playersUrl);
      const res = await fetch(playersUrl);
      console.log(
        `Alumni Route: response status for teamId=${id} =>`,
        res.status
      );
      if (!res.ok) {
        console.error(
          `Alumni Route: failed to fetch players for team ID ${id}: ${res.statusText}`
        );
        continue; // or throw an error if you want
      }

      const json: ApiResponse<Player> = await res.json();
      const playersForTeam = json.data || [];
      console.log(`Alumni Route: Team ID ${id} returned ${playersForTeam.length} players.`);
      allPlayers.push(...playersForTeam);
    }

    // 2) If includeYouth=true AND teamsParam is present, do a youthTeam fetch:
    if (includeYouth && teamsParam) {
      // e.g. "San Jose Jr. Sharks"
      let youthUrl = `${apiBaseUrl}/players?youthTeam=${encodeURIComponent(
        teamsParam
      )}`;
      if (league) {
        youthUrl += `&hasPlayedInLeague=${league}`;
      } else {
        youthUrl += `&fetchAllLeagues=true`;
      }
      youthUrl += `&apiKey=${apiKey}&fields=${encodeURIComponent('id,name,dateOfBirth')}`;

      console.log('Alumni Route: fetching youthTeamUrl:', youthUrl);
      const youthRes = await fetch(youthUrl);
      console.log('Alumni Route: youthTeamUrl response status =>', youthRes.status);

      if (youthRes.ok) {
        const youthJson: ApiResponse<Player> = await youthRes.json();
        const youthPlayers = youthJson.data || [];
        console.log(`Alumni Route: youthTeam=${teamsParam} returned ${youthPlayers.length} players.`);
        allPlayers.push(...youthPlayers);
      } else {
        console.warn(
          `Alumni Route: youthTeam fetch failed with ${youthRes.statusText}`
        );
      }
    }

    // 3) Deduplicate by ID
    const uniquePlayers = allPlayers.reduce((acc, player) => {
      if (!acc.some((p) => p.id === player.id)) {
        acc.push(player);
      }
      return acc;
    }, [] as Player[]);

    console.log(
      'Alumni Route: total unique players before pagination =',
      uniquePlayers.length
    );

    // 4) Paginate
    const paginatedPlayers = uniquePlayers.slice(offset, offset + limit);
    console.log(
      `Alumni Route: returning players from index ${offset} to ${
        offset + limit
      }, final count = ${paginatedPlayers.length}`
    );

    // 5) Convert dateOfBirth => birthYear
    const minimalPlayers = paginatedPlayers.map((player) => ({
      id: player.id,
      name: player.name || '',
      birthYear: player.dateOfBirth
        ? new Date(player.dateOfBirth).getFullYear()
        : null,
    }));

    // 6) Return JSON
    return NextResponse.json({
      players: minimalPlayers,
      total: uniquePlayers.length,
      nextOffset: offset + limit < uniquePlayers.length ? offset + limit : null,
    });
  } catch (error: unknown) {
    console.error('Alumni Route: Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
 */

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

  // Get query parameters
  const teamIdsParam = searchParams.get('teamIds'); // e.g., ?teamIds=21240,33613
  const league = searchParams.get('league'); // e.g., ?league=nhl
  const includeYouth = searchParams.get('includeYouth') === 'true'; // ?includeYouth=true
  const offset = parseInt(searchParams.get('offset') || '0', 10); // Pagination offset
  const limit = parseInt(searchParams.get('limit') || '20', 10); // Pagination limit
  const teamsParam = searchParams.get('teams'); // For youth team name

  console.log('Alumni Route: Received query params =>');
  console.log('  teamIdsParam =', teamIdsParam);
  console.log('  league =', league);
  console.log('  includeYouth =', includeYouth);
  console.log('  teamsParam =', teamsParam);
  console.log('  offset =', offset, 'limit =', limit);

  let allPlayers: Player[] = [];

  try {
    // Step 1: Fetch players for each numeric team ID
    if (teamIdsParam) {
      const teamIds = teamIdsParam.split(',').map((idStr) => parseInt(idStr.trim(), 10));
      for (const id of teamIds) {
        let playersUrl = `${apiBaseUrl}/players?hasPlayedInTeam=${id}`;
        if (league) {
          playersUrl += `&hasPlayedInLeague=${league}`;
        } else {
          playersUrl += `&fetchAllLeagues=true`;
        }
        playersUrl += `&apiKey=${apiKey}&fields=${encodeURIComponent('id,name,dateOfBirth')}`;

        console.log(`Alumni Route: fetching players for teamId=${id}:`, playersUrl);
        const res = await fetch(playersUrl);
        console.log(`Alumni Route: response status for teamId=${id} =>`, res.status);

        if (res.ok) {
          const json: ApiResponse<Player> = await res.json();
          const playersForTeam = json.data || [];
          console.log(`Alumni Route: Team ID ${id} returned ${playersForTeam.length} players.`);
          allPlayers.push(...playersForTeam);
        } else {
          console.error(`Alumni Route: failed to fetch players for team ID ${id}: ${res.statusText}`);
        }
      }
    }

    // Step 2: Fetch players by youth team if includeYouth=true
    if (includeYouth && teamsParam) {
      let youthUrl = `${apiBaseUrl}/players?youthTeam=${encodeURIComponent(teamsParam)}`;
      if (league) {
        youthUrl += `&hasPlayedInLeague=${league}`;
      } else {
        youthUrl += `&fetchAllLeagues=true`;
      }
      youthUrl += `&apiKey=${apiKey}&fields=${encodeURIComponent('id,name,dateOfBirth')}`;

      console.log('Alumni Route: fetching youthTeamUrl:', youthUrl);
      const youthRes = await fetch(youthUrl);
      console.log('Alumni Route: youthTeamUrl response status =>', youthRes.status);

      if (youthRes.ok) {
        const youthJson: ApiResponse<Player> = await youthRes.json();
        const youthPlayers = youthJson.data || [];
        console.log(`Alumni Route: youthTeam=${teamsParam} returned ${youthPlayers.length} players.`);
        allPlayers.push(...youthPlayers);
      } else {
        console.warn(`Alumni Route: youthTeam fetch failed with ${youthRes.statusText}`);
      }
    }

    // Step 3: Deduplicate players by ID
    const uniquePlayers = allPlayers.reduce((acc, player) => {
      if (!acc.some((p) => p.id === player.id)) {
        acc.push(player);
      }
      return acc;
    }, [] as Player[]);

    console.log('Alumni Route: total unique players before pagination =', uniquePlayers.length);

    // Step 4: Paginate
    const paginatedPlayers = uniquePlayers.slice(offset, offset + limit);
    console.log(
      `Alumni Route: returning players from index ${offset} to ${
        offset + limit
      }, final count = ${paginatedPlayers.length}`
    );

    // Step 5: Convert dateOfBirth to birthYear
    const minimalPlayers = paginatedPlayers.map((player) => ({
      id: player.id,
      name: player.name || '',
      birthYear: player.dateOfBirth
        ? new Date(player.dateOfBirth).getFullYear()
        : null,
    }));

    // Step 6: Return response
    return NextResponse.json({
      players: minimalPlayers,
      total: uniquePlayers.length,
      nextOffset: offset + limit < uniquePlayers.length ? offset + limit : null,
    });
  } catch (error: unknown) {
    console.error('Alumni Route: Error in fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
