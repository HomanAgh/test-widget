import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET() {
  try {
    // Fetch all professional leagues
    const response = await fetch(
      `${API_BASE_URL}/leagues?offset=0&limit=100&sort=name&leagueLevel=professional&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch leagues: ${response.statusText}`);
    }

    const leaguesData = await response.json();

    // Extract and return the relevant league information
    const leagues = (leaguesData.data || []).map((league: any) => ({
      slug: league.slug, // Unique identifier for the league
      name: league.name, // Human-readable name for the league
    }));

    return NextResponse.json({ leagues });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leagues.' },
      { status: 500 }
    );
  }
}
