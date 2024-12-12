/* import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET() {
  try {
    // Fetch all junior leagues
    const response = await fetch(
      `${API_BASE_URL}/leagues?offset=0&limit=100&sort=name&leagueLevel=major-junior&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch junior leagues: ${response.statusText}`);
    }

    const leaguesData = await response.json();

    // Extract and return the relevant league information
    const leagues = (leaguesData.data || []).map((league: any) => ({
      slug: league.slug, // Unique identifier for the league
      name: league.name, // Human-readable name for the league
    }));

    return NextResponse.json({ leagues });
  } catch (error) {
    console.error('Error fetching junior leagues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch junior leagues.' },
      { status: 500 }
    );
  }
}
 */

import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

export async function GET() {
  try {
    // Define league levels you want to fetch
    const leagueLevels = ['major-junior', 'junior', 'junior-a'];

    // Fetch leagues for each league level
    const leaguePromises = leagueLevels.map((level) =>
      fetch(
        `${API_BASE_URL}/leagues?offset=0&limit=100&sort=name&leagueLevel=${level}&apiKey=${API_KEY}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch leagues for level ${level}: ${res.statusText}`);
        }
        return res.json();
      })
    );

    // Wait for all fetches to complete
    const leagueResponses = await Promise.all(leaguePromises);

    // Combine and format the league data
    const leagues = leagueResponses.flatMap((response) =>
      (response.data || []).map((league: any) => ({
        slug: league.slug, // Unique identifier for the league
        name: league.name, // Human-readable name for the league
      }))
    );

    return NextResponse.json({ leagues });
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leagues.' },
      { status: 500 }
    );
  }
}
