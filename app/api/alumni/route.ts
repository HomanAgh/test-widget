import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // e.g., "San Jose Jr. Sharks"

  if (!query) {
    return NextResponse.json({ error: 'Please provide a query.' }, { status: 400 });
  }

  try {
    // Step 1: Fetch teams matching the query
    const teamsResponse = await fetch(
      `${API_BASE_URL}/teams?q=${encodeURIComponent(query)}&apiKey=${API_KEY}`
    );
    const teamsData = await teamsResponse.json();

    let playersByTeam: any[] = [];
    if (teamsData && teamsData.data && teamsData.data.length > 0) {
      // Extract team IDs
      const teamIds = teamsData.data.map((team: any) => team.id);

      // Step 2: Fetch players for each team ID
      const playersByTeamPromises = teamIds.map((id: number) =>
        fetch(
          `${API_BASE_URL}/players?hasPlayedInTeam=${id}&hasPlayedInLeague=nhl&apiKey=${API_KEY}`
        ).then((res) => res.json())
      );

      const playersByTeamResponses = await Promise.all(playersByTeamPromises);

      playersByTeam = playersByTeamResponses.flatMap((response) => response.data || []);
    }

    // Step 3: Fetch players matching the youthTeam directly
    const youthTeamResponse = await fetch(
      `${API_BASE_URL}/players?offset=0&limit=100&sort=name&youthTeam=${encodeURIComponent(
        query
      )}&hasPlayedInLeague=nhl&apiKey=${API_KEY}`
    );

    const youthTeamData = await youthTeamResponse.json();

    const playersByYouthTeam = youthTeamData.data || [];

    // Step 4: Combine all players and remove duplicates
    const allPlayers = [...playersByTeam, ...playersByYouthTeam].reduce(
      (uniquePlayers: any[], player: any) => {
        if (!uniquePlayers.some((p) => p.id === player.id)) {
          uniquePlayers.push(player);
        }
        return uniquePlayers;
      },
      []
    );

    // Step 5: Return the combined players
    return NextResponse.json({ players: allPlayers });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}