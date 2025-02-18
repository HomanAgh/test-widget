import { NextResponse } from 'next/server';
import { LeagueDetails, LeagueApiResponse } from '@/app/types/route';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

export async function GET() {
  try {
    // Define league levels you want to fetch
    const leagueLevels = ['college'];

    // Fetch leagues for each league level
    const leaguePromises = leagueLevels.map(async (level) => {
      const res = await fetch(
        `${apiBaseUrl}/leagues?offset=0&limit=100&sort=name&leagueLevel=${level}&apiKey=${apiKey}&fields=slug,name,logo.url`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch leagues for level ${level}: ${res.statusText}`);
      }

      const json: LeagueApiResponse = await res.json();
      return json;
    });

    // Wait for all fetches to complete
    const leagueResponses: LeagueApiResponse[] = await Promise.all(leaguePromises);

    // Combine and format the league data
    const leagues = leagueResponses.flatMap((response) =>
      (response.data || []).map((league: LeagueDetails) => ({
        slug: league.slug, // Unique identifier for the league
        name: league.name, // Human-readable name for the league
        logo: league.logo?.url ?? null,
      }))
    );

    return NextResponse.json({ leagues });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching leagues:', error.message);
    } else {
      console.error('Unknown error fetching leagues:', error);
    }
    return NextResponse.json(
      { error: 'Failed to fetch leagues.' },
      { status: 500 }
    );
  }
}
