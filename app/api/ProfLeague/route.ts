import { NextResponse } from 'next/server';
import { LeagueDetails, LeagueApiResponse } from '@/app/types/route'; 

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

export async function GET() {
  try {
    const leagueLevels = ['professional','semi-professional'];
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

    const leagueResponses: LeagueApiResponse[] = await Promise.all(leaguePromises);
    const leagues = leagueResponses.flatMap((response) =>
      (response.data || []).map((league: LeagueDetails) => ({
        slug: league.slug, 
        name: league.name, 
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


