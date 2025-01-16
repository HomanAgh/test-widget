/* import { NextResponse } from 'next/server';

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
    console.log('AlumniSearchTeam Route: Received query:', query);
    const url = `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&offset=0&limit=30&sort=name&apiKey=${apiKey}`;
    console.log('AlumniSearchTeam Route: Fetching URL:', url);

    const response = await fetch(url);
    console.log('AlumniSearchTeam Route: Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    const data: TeamsResponse = await response.json();
    console.log('AlumniSearchTeam Route: Number of teams returned:', data.data?.length ?? 0);

    // Process the team data to include league name
    const teams = data.data?.map((team: EliteProspectTeam) => ({
      id: team.id,
      name: team.name,
      league: team.league?.name || 'N/A',
    })) || [];

    teams.forEach((t) => {
      console.log(`Team ID = ${t.id}, Team Name = ${t.name}`);
    });

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
  teamClass?: string; // Ensure teamClass is included
}

interface TeamsResponse {
  data?: EliteProspectTeam[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query'); // Input from the user
  const teamClass = searchParams.get('teamClass'); // Optional: Filter by team class (e.g., "women")

  if (!query) {
    return NextResponse.json({ error: 'Please provide a team name query.' }, { status: 400 });
  }

  try {
    console.log('AlumniSearchTeam Route: Received query:', query);
    const url = `${apiBaseUrl}/teams?q=${encodeURIComponent(query)}&offset=0&limit=30&sort=name&apiKey=${apiKey}`;
    console.log('AlumniSearchTeam Route: Fetching URL:', url);

    const response = await fetch(url);
    console.log('AlumniSearchTeam Route: Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    const data: TeamsResponse = await response.json();
    console.log('AlumniSearchTeam Route: Number of teams returned:', data.data?.length ?? 0);

    const filteredTeams = data.data?.filter((team) => {
      if (teamClass === "women") {
        return team.teamClass === "women"; // Show only women's teams
      } else if (teamClass === "") {
        return team.teamClass !== "women"; // Show only non-women's teams
      }
      return true; // Default case (if no teamClass is provided)
    });

    // Process the filtered team data to include league name
    const teams = filteredTeams?.map((team: EliteProspectTeam) => ({
      id: team.id,
      name: team.name,
      league: team.league?.name || 'N/A',
    })) || [];

    teams.forEach((t) => {
      console.log(`Team ID = ${t.id}, Team Name = ${t.name}`);
    });

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
