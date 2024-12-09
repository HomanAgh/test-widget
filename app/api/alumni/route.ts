/* import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamName = searchParams.get('teamName'); // e.g., "San Jose Jr. Sharks"

  if (!teamName) {
    return NextResponse.json({ error: 'Please provide a team name.' }, { status: 400 });
  }

  try {
    // Step 1: Fetch teams matching the name
    const teamsResponse = await fetch(
      `${API_BASE_URL}/teams?q=${encodeURIComponent(teamName)}&apiKey=${API_KEY}`
    );
    const teamsData = await teamsResponse.json();

    if (!teamsData || !teamsData.data || teamsData.data.length === 0) {
      return NextResponse.json({ error: 'No teams found.' }, { status: 404 });
    }

    // Extract team IDs
    const teamIds = teamsData.data.map((team: any) => team.id);

    // Step 2: Fetch players for each team ID
    const playersPromises = teamIds.map((id: number) =>
      fetch(
        `${API_BASE_URL}/players?hasPlayedInTeam=${id}&hasPlayedInLeague=nhl&apiKey=${API_KEY}`
      ).then((res) => res.json())
    );

    const playersResponses = await Promise.all(playersPromises);

    // Step 3: Combine all players and remove duplicates
    const allPlayers = playersResponses
      .flatMap((response) => response.data || []) // Combine all players
      .reduce((uniquePlayers: any[], player: any) => {
        if (!uniquePlayers.some((p) => p.id === player.id)) {
          uniquePlayers.push(player);
        }
        return uniquePlayers;
      }, []);

    // Step 4: Return the players
    return NextResponse.json({ players: allPlayers });
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json({ error: 'Failed to fetch data.' }, { status: 500 });
  }
}
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teamName = searchParams.get('teamName'); // e.g., "San Jose Jr. Sharks"

  if (!teamName) {
    return NextResponse.json({ error: 'Please provide a team name.' }, { status: 400 });
  }

  try {
    // Step 1: Fetch teams matching the name
    const teamsResponse = await fetch(
      `${API_BASE_URL}/teams?q=${encodeURIComponent(teamName)}&apiKey=${API_KEY}`
    );
    const teamsData = await teamsResponse.json();

    if (!teamsData || !teamsData.data || teamsData.data.length === 0) {
      return NextResponse.json({ error: 'No teams found.' }, { status: 404 });
    }

    // Extract team IDs
    const teamIds = teamsData.data.map((team: any) => team.id);

    // Step 2: Fetch players for each team ID
    const playersByTeamPromises = teamIds.map((id: number) =>
      fetch(
        `${API_BASE_URL}/players?hasPlayedInTeam=${id}&hasPlayedInLeague=nhl&apiKey=${API_KEY}`
      ).then((res) => res.json())
    );

    const playersByTeamResponses = await Promise.all(playersByTeamPromises);

    const playersByTeam = playersByTeamResponses.flatMap((response) => response.data || []);

    // Step 3: Fetch players matching the youthTeam directly
    const youthTeamResponse = await fetch(
      `${API_BASE_URL}/players?q=${encodeURIComponent(teamName)}&apiKey=${API_KEY}`
    );

    if (!youthTeamResponse.ok) {
      throw new Error(`Failed to fetch players by youth team: ${await youthTeamResponse.text()}`);
    }

    const youthTeamData = await youthTeamResponse.json();

    const playersByYouthTeam = (youthTeamData.data || []).filter(
      (player: any) =>
        player.youthTeam?.toLowerCase() === teamName.toLowerCase() // Exact match for youth team
    );

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
