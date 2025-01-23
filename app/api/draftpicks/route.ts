import { NextResponse } from 'next/server';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface ApiResponse<T> {
  data?: T[];
}
interface DraftSelection {
  year: number;
  round: number;
  overall: number;
  draftType?: {
    league?: {
      slug?: string;
    };
  };
}

async function fetchDraftPick(playerId: string): Promise<string> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/players/${playerId}/draft-selections?offset=0&limit=100&sort=-year&fields=year,round,overall,draftType.league.slug&apiKey=${apiKey}`
    );

    if (!response.ok) {
      console.error(`Error fetching draft pick for playerId ${playerId}: ${response.statusText}`);
      return 'N/A';
    }

    const data: ApiResponse<DraftSelection> = await response.json();
    if (!data.data || data.data.length === 0) {
      return 'N/A';
    }

    const nhlDrafts = data.data.filter(
      (draft) => draft?.draftType?.league?.slug === 'nhl'
    );

    if (nhlDrafts.length === 0) {
      return 'N/A';
    }

    const draft = nhlDrafts[0];
    return `${draft.year} Round ${draft.round}, Overall ${draft.overall}`;
  } catch (error) {
    console.error(`Error fetching draft pick for player ${playerId}:`, error);
    return 'N/A';
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerIds = searchParams.get('playerIds'); // e.g. ?playerIds=123,456
  const leagueParam = searchParams.get('league');  // unused now (or you could remove this param if not needed)
  const fetchAllLeagues = searchParams.get('fetchAllLeagues') === 'true'; // likewise

  if (!playerIds) {
    return NextResponse.json(
      { error: 'playerIds is required.' },
      { status: 400 }
    );
  }

  try {
    const idsArray = playerIds.split(',').map((id) => id.trim());
    const uniqueIds = [...new Set(idsArray)].filter((id) => id);

    const playerDataPromises = uniqueIds.map(async (playerId) => {
      const draftPick = await fetchDraftPick(playerId);
      return {
        playerId: parseInt(playerId, 10),
        draftPick: draftPick || 'N/A',
      };
    });

    const playerData = await Promise.all(playerDataPromises);

    return NextResponse.json({ players: playerData });
  } catch (error) {
    console.error('Error fetching draft pick data:', error);
    return NextResponse.json({ error: 'Failed to fetch draft picks.' }, { status: 500 });
  }
}
