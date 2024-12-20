/* import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface ApiResponse<T> {
  data?: T[];
}

interface Team {
  id: number;
  name?: string;
}

interface Player {
  id: number;
  name?: string;
  dateOfBirth?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // e.g., "San Jose Jr. Sharks"
  const league = searchParams.get('league'); // e.g., "nhl" (optional)

  if (!query) {
    return NextResponse.json({ error: 'Please provide a query.' }, { status: 400 });
  }

  try {
    // Step 1: Fetch teams matching the query
    const teamsUrl = `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
    const teamsResponse = await fetch(teamsUrl);
    if (!teamsResponse.ok) {
      throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
    }

    const teamsData: ApiResponse<Team> = await teamsResponse.json();
    console.log('Teams Data:', teamsData);

    let playersByTeam: Player[] = [];
    if (teamsData?.data && teamsData.data.length > 0) {
      // Extract team IDs
      const teamIds = teamsData.data.map((team: Team) => team.id);
      console.log('Team IDs:', teamIds);

      // Step 2: Fetch players for each team ID, requesting only the needed fields
      const fieldsParam = 'id,name,dateOfBirth'; 
      const playersByTeamPromises = teamIds.map((id: number) =>
        fetch(
          `${apiBaseUrl}/players?hasPlayedInTeam=${id}${
            league ? `&hasPlayedInLeague=${league}` : ''
          }&apiKey=${apiKey}&fields=${encodeURIComponent(fieldsParam)}`
        )
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to fetch players for team ${id}: ${res.statusText}`);
            }
            return res.json();
          })
          .then((response: ApiResponse<Player>) => response.data || [])
      );

      const playersByTeamResponses = await Promise.all(playersByTeamPromises);
      console.log('Players by Team Responses:', playersByTeamResponses);

      // Flatten the array of player arrays
      playersByTeam = playersByTeamResponses.flat();
      console.log('Players by Team:', playersByTeam);
    }

    // Step 3: Fetch players matching the youthTeam directly, again with limited fields
    const youthTeamUrl = `${apiBaseUrl}/players?offset=0&limit=100&sort=name&youthTeam=${encodeURIComponent(query)}${
      league ? `&hasPlayedInLeague=${league}` : ''
    }&apiKey=${apiKey}&fields=id,name,dateOfBirth`;

    const youthTeamResponse = await fetch(youthTeamUrl);
    if (!youthTeamResponse.ok) {
      throw new Error(`Failed to fetch youth team players: ${youthTeamResponse.statusText}`);
    }

    const youthTeamData: ApiResponse<Player> = await youthTeamResponse.json();
    console.log('Youth Team Players Response:', youthTeamData);

    const playersByYouthTeam = youthTeamData.data || [];
    console.log('Players by Youth Team:', playersByYouthTeam);

    // Step 4: Combine all players and remove duplicates by id
    const allPlayers = [...playersByTeam, ...playersByYouthTeam].reduce(
      (uniquePlayers: Player[], player: Player) => {
        if (!uniquePlayers.some((p) => p.id === player.id)) {
          uniquePlayers.push(player);
        }
        return uniquePlayers;
      },
      []
    );

    console.log('Combined Players:', allPlayers);

    // Step 5: Convert dateOfBirth to birthYear and return minimal fields
    const minimalPlayers = allPlayers.map((player) => ({
      id: player.id,
      name: player.name || '',
      birthYear: player.dateOfBirth ? new Date(player.dateOfBirth).getFullYear() : null,
    }));

    return NextResponse.json({ players: minimalPlayers });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching players:', error.message);
    } else {
      console.error('Unknown error fetching players:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
 */

import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface ApiResponse<T> {
  data?: T[];
}

interface Team {
  id: number;
  name?: string;
}

interface Player {
  id: number;
  name?: string;
  dateOfBirth?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // e.g., "San Jose Jr. Sharks"
  const league = searchParams.get('league'); // e.g., "nhl" (optional)
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!query) {
    return NextResponse.json({ error: 'Please provide a query.' }, { status: 400 });
  }

  try {
    // Fetch teams matching the query
    const teamsUrl = `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
    const teamsResponse = await fetch(teamsUrl);
    if (!teamsResponse.ok) {
      throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
    }

    const teamsData: ApiResponse<Team> = await teamsResponse.json();

    let playersByTeam: Player[] = [];
    if (teamsData?.data && teamsData.data.length > 0) {
      const teamIds = teamsData.data.map((team) => team.id);

      const fieldsParam = 'id,name,dateOfBirth';
      const playersByTeamPromises = teamIds.map((id) =>
        fetch(
          `${apiBaseUrl}/players?hasPlayedInTeam=${id}${league ? `&hasPlayedInLeague=${league}` : ''}&apiKey=${apiKey}&fields=${encodeURIComponent(
            fieldsParam
          )}`
        )
          .then((res) => res.ok ? res.json() : Promise.reject(`Error for team ${id}: ${res.statusText}`))
          .then((response: ApiResponse<Player>) => response.data || [])
      );

      const playersByTeamResponses = await Promise.all(playersByTeamPromises);
      playersByTeam = playersByTeamResponses.flat();
    }

    // Fetch youth team players
    const youthTeamUrl = `${apiBaseUrl}/players?youthTeam=${encodeURIComponent(query)}${league ? `&hasPlayedInLeague=${league}` : ''}&apiKey=${apiKey}&fields=id,name,dateOfBirth`;
    const youthTeamResponse = await fetch(youthTeamUrl);
    if (!youthTeamResponse.ok) {
      throw new Error(`Failed to fetch youth team players: ${youthTeamResponse.statusText}`);
    }
    const youthTeamData: ApiResponse<Player> = await youthTeamResponse.json();
    const playersByYouthTeam = youthTeamData.data || [];

    // Combine and deduplicate
    const allPlayers = [...playersByTeam, ...playersByYouthTeam].reduce(
      (uniquePlayers, player) => {
        if (!uniquePlayers.some((p) => p.id === player.id)) {
          uniquePlayers.push(player);
        }
        return uniquePlayers;
      },
      [] as Player[]
    );

    // Paginate the results
    const paginatedPlayers = allPlayers.slice(offset, offset + limit);

    // Convert dateOfBirth to birthYear and return minimal fields
    const minimalPlayers = paginatedPlayers.map((player) => ({
      id: player.id,
      name: player.name || '',
      birthYear: player.dateOfBirth ? new Date(player.dateOfBirth).getFullYear() : null,
    }));

    return NextResponse.json({
      players: minimalPlayers,
      total: allPlayers.length,
      nextOffset: offset + limit < allPlayers.length ? offset + limit : null,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching players:', error.message);
    } else {
      console.error('Unknown error fetching players:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
