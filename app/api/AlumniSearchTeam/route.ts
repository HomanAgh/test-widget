/* import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface EliteProspectLeague {
  name: string;
}

interface EliteProspectTeam {
  id: number;
  name: string;
  currentLeague?: EliteProspectLeague;
}

interface TeamsResponse {
  data?: EliteProspectTeam[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // Input from the user

  if (!query) {
    return NextResponse.json({ error: 'Please provide a team name query.' }, { status: 400 });
  }

  try {
    console.log('Fetching teams with query:', query);

    const response = await fetch(
      `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&offset=0&limit=20&sort=name&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    const data: TeamsResponse = await response.json();

    // Extract and format the team data
    const teams = data.data?.map((team: EliteProspectTeam) => ({
      id: team.id,
      name: team.name,
      league: team.currentLeague?.name || 'N/A',
    })) || [];

    console.log('Teams fetched:', teams);

    return NextResponse.json({ teams });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching teams:', error.message);
    } else {
      console.error('Unknown error fetching teams:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch teams.' }, { status: 500 });
  }
}


 */

import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface EliteProspectLeague {
  name: string;
}

interface EliteProspectTeam {
  id: number;
  name: string;
  league?: EliteProspectLeague | null;
}

interface TeamsResponse {
  data?: EliteProspectTeam[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // Input from the user

  if (!query) {
    return NextResponse.json({ error: 'Please provide a team name query.' }, { status: 400 });
  }

  try {
    console.log('Fetching teams with query:', query);

    // Fetch the list of teams from the API
    const response = await fetch(
      `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&offset=0&limit=20&sort=name&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    const data: TeamsResponse = await response.json();

    // Process the team data to include league name
    const teams = data.data?.map((team: EliteProspectTeam) => ({
      id: team.id,
      name: team.name,
      league: team.league?.name || 'N/A', // Extract league name or default to 'N/A'
    })) || [];

    console.log('Processed teams:', teams);

    return NextResponse.json({ teams });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching teams:', error.message);
    } else {
      console.error('Unknown error fetching teams:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch teams.' }, { status: 500 });
  }
}
