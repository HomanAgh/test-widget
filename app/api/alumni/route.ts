import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

interface ApiResponse<T> {
  data?: T[];
  // Add other fields as needed, like meta, pagination, etc.
}

interface Team {
  id: number;
  name?: string;
  // Add other known fields for teams if needed
}

interface Player {
  id: number;
  name?: string;
  // Add other known fields for players if needed
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
    const teamsResponse = await fetch(
      `${API_BASE_URL}/teams?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`
    );
    if (!teamsResponse.ok) {
      throw new Error(`Failed to fetch teams: ${teamsResponse.statusText}`);
    }

    const teamsData: ApiResponse<Team> = await teamsResponse.json();
    console.log('Teams Data:', teamsData); // Log full response for teams

    let playersByTeam: Player[] = [];
    if (teamsData?.data && teamsData.data.length > 0) {
      // Extract team IDs
      const teamIds = teamsData.data.map((team: Team) => team.id);
      console.log('Team IDs:', teamIds); // Log team IDs

      // Step 2: Fetch players for each team ID
      const playersByTeamPromises = teamIds.map((id: number) =>
        fetch(
          `${API_BASE_URL}/players?hasPlayedInTeam=${id}${
            league ? `&hasPlayedInLeague=${league}` : ''
          }&apiKey=${API_KEY}`
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
      console.log('Players by Team:', playersByTeam); // Log combined players by team
    }

    // Step 3: Fetch players matching the youthTeam directly
    const youthTeamResponse = await fetch(
      `${API_BASE_URL}/players?offset=0&limit=100&sort=name&youthTeam=${encodeURIComponent(query)}${
        league ? `&hasPlayedInLeague=${league}` : ''
      }&apiKey=${API_KEY}`
    );
    if (!youthTeamResponse.ok) {
      throw new Error(`Failed to fetch youth team players: ${youthTeamResponse.statusText}`);
    }

    const youthTeamData: ApiResponse<Player> = await youthTeamResponse.json();
    console.log('Youth Team Players Response:', youthTeamData); // Log youth team response

    const playersByYouthTeam = youthTeamData.data || [];
    console.log('Players by Youth Team:', playersByYouthTeam); // Log parsed youth team players

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
    console.log('Combined Players:', allPlayers); // Log combined list of players

    // Step 5: Return the combined players
    return NextResponse.json({ players: allPlayers });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching players:', error.message);
    } else {
      console.error('Unknown error fetching players:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
