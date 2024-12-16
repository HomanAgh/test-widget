import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // Input from the user

  if (!query) {
    return NextResponse.json({ error: 'Please provide a team name query.' }, { status: 400 });
  }

  try {
    console.log('Fetching teams with query:', query);

    // API call to fetch teams matching the query
    const response = await fetch(
      `${API_BASE_URL}/teams?q=${encodeURIComponent(query)}&offset=0&limit=20&sort=name&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    const data = await response.json();

    // Extract and format the team data
    const teams = data.data?.map((team: any) => ({
      id: team.id,
      name: team.name,
      league: team.currentLeague?.name || 'N/A',
    })) || [];

    console.log('Teams fetched:', teams);

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams.' }, { status: 500 });
  }
}
