/* import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerIds = searchParams.get('playerIds'); // Comma-separated list of player IDs

  if (!playerIds) {
    return NextResponse.json({ error: 'Player IDs are required.' }, { status: 400 });
  }

  try {
    // Split the player IDs into an array
    const idsArray = playerIds.split(',').map((id) => id.trim());

    // Fetch draft pick data for each player
    const draftPromises = idsArray.map(async (playerId) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/players/${playerId}/draft-selections?offset=0&limit=100&sort=-year&apiKey=${API_KEY}`
        );

        const data = await response.json();

        if (!response.ok || !data.data?.length) {
          return { playerId, draftPick: 'N/A' };
        }

        // Construct the draft pick string from the first draft entry
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

/* import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerIds = searchParams.get('playerIds'); // Comma-separated list of player IDs

  if (!playerIds) {
    console.log('No player IDs provided');
    return NextResponse.json({ error: 'Player IDs are required.' }, { status: 400 });
  }

  try {
    // Split the player IDs into an array
    const idsArray = playerIds.split(',').map((id) => id.trim());
    console.log('Player IDs:', idsArray);

    // Specify only the fields you need
    const fields = 'year,round,overall';

    // Fetch draft pick data for each player
    const draftPromises = idsArray.map(async (playerId) => {
      try {
        const url = `${API_BASE_URL}/players/${playerId}/draft-selections?offset=0&limit=1&sort=-year&fields=${fields}&apiKey=${API_KEY}`;
        console.log(`Fetching draft pick data for playerId ${playerId} with URL: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok || !data.data?.length) {
          console.log(`No draft pick data found for playerId ${playerId}`);
          return { playerId, draftPick: 'N/A' };
        }

        // Construct the draft pick string from the first draft entry
        const draft = data.data[0];
        const draftPick = `${draft.year} Round ${draft.round}, Overall ${draft.overall}`;
        console.log(`Draft pick for playerId ${playerId}: ${draftPick}`);
        return { playerId, draftPick };
      } catch (error) {
        console.error(`Error fetching draft pick for playerId ${playerId}:`, error);
        return { playerId, draftPick: 'N/A' };
      }
    });

    // Wait for all fetches to complete
    const draftResults = await Promise.all(draftPromises);
    console.log('Draft Picks Fetched:', draftResults);

    return NextResponse.json({ draftPicks: draftResults });
  } catch (error) {
    console.error('Error fetching draft picks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft picks.' },
      { status: 500 }
    );
  }
} */

  import { NextResponse } from 'next/server'; //ny route för optimering men vet ej om det är bra, KOM IHÅG DET HÄR

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
  


