/*   import { NextResponse } from 'next/server'; //ny route för optimering men vet ej om det är bra, KOM IHÅG DET HÄR

  const API_BASE_URL = 'https://api.eliteprospects.com/v1';
  const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key
  
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const playerIds = searchParams.get('playerIds'); // Comma-separated list of player IDs
  
    if (!playerIds) {
      return NextResponse.json({ error: 'Player IDs are required.' }, { status: 400 });
    }
  
    try {
      const idsArray = playerIds.split(',').map((id) => id.trim());
  
      // Fetch only valid player IDs (remove duplicates and empty IDs)
      const uniqueIds = [...new Set(idsArray)].filter((id) => id);
  
      // Specify only the fields you need
      const fields = 'year,round,overall';
  
      // Fetch draft pick data for each player
      const draftPromises = uniqueIds.map(async (playerId) => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/players/${playerId}/draft-selections?offset=0&limit=1&sort=-year&fields=${fields}&apiKey=${API_KEY}`
          );
  
          if (!response.ok) {
            console.error(`Error fetching draft pick for playerId ${playerId}: ${response.status}`);
            return { playerId, draftPick: 'N/A' };
          }
  
          const data = await response.json();
  
          if (!data.data?.length) {
            return { playerId, draftPick: 'N/A' }; // No draft data available
          }
  
          const draft = data.data[0];
          const draftPick = `${draft.year} Round ${draft.round}, Overall ${draft.overall}`;
          return { playerId, draftPick };
        } catch (error) {
          console.error(`Error fetching draft pick for playerId ${playerId}:`, error);
          return { playerId, draftPick: 'N/A' };
        }
      });
  
      // Wait for all fetches to complete
      const draftResults = await Promise.all(draftPromises);
  
      return NextResponse.json({ draftPicks: draftResults });
    } catch (error) {
      console.error('Error fetching draft picks:', error);
      return NextResponse.json(
        { error: 'Failed to fetch draft picks.' },
        { status: 500 }
      );
    }
  }
 */

  import { NextResponse } from 'next/server';

  const API_BASE_URL = 'https://api.eliteprospects.com/v1';
  const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key
  
  export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const playerIds = searchParams.get('playerIds'); // Comma-separated list of player IDs
  
    if (!playerIds) {
      return NextResponse.json({ error: 'Player IDs are required.' }, { status: 400 });
    }
  
    try {
      const idsArray = playerIds.split(',').map((id) => id.trim());
  
      // Fetch only valid player IDs (remove duplicates and empty IDs)
      const uniqueIds = [...new Set(idsArray)].filter((id) => id);
  
      // Specify only the fields you need for draft picks
      const draftFields = 'year,round,overall';
  
      // Fetch draft pick and team data for each player
      const playerPromises = uniqueIds.map(async (playerId) => {
        try {
          // Fetch draft pick data
          const draftResponse = await fetch(
            `${API_BASE_URL}/players/${playerId}/draft-selections?offset=0&limit=1&sort=-year&fields=${draftFields}&apiKey=${API_KEY}`
          );
  
          const draftData = await draftResponse.json();
          const draftPick = draftData.data?.[0]
            ? `${draftData.data[0].year} Round ${draftData.data[0].round}, Overall ${draftData.data[0].overall}`
            : 'N/A';
  
          // Fetch team data
          const teamsResponse = await fetch(
            `${API_BASE_URL}/player-stats/teams?offset=0&limit=100&sort=team&player=${playerId}&apiKey=${API_KEY}`
          );
  
          const teamsData = await teamsResponse.json();
          const teams = teamsData.data?.length
            ? teamsData.data.map((team: any) => team.team.name).join(', ')
            : 'N/A';
  
          return {
            playerId,
            draftPick,
            teams, // Add the team data here
          };
        } catch (error) {
          console.error(`Error fetching data for playerId ${playerId}:`, error);
          return { playerId, draftPick: 'N/A', teams: 'N/A' };
        }
      });
  
      // Wait for all fetches to complete
      const playerResults = await Promise.all(playerPromises);
  
      // Return a unified "players" response instead of "draftPicks"
      return NextResponse.json({ players: playerResults });
    } catch (error) {
      console.error('Error fetching player data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch player data.' },
        { status: 500 }
      );
    }
  }
  
