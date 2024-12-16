import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://api.eliteprospects.com/v1';
const API_KEY = 'zp87Qi0RfESG95zhH1x9FlimIZPmMhbq'; // Replace with your actual API key

interface ApiResponse<T> {
  data?: T[];
}

interface DraftSelection {
  year: number;
  round: number;
  overall: number;
}

interface TeamResponseItem {
  team: {
    name: string;
  };
}

const fetchDraftPick = async (playerId: string): Promise<string> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/players/${playerId}/draft-selections?offset=0&limit=1&sort=-year&fields=year,round,overall&apiKey=${API_KEY}`
    );

    if (!response.ok) {
      console.error(`Error fetching draft pick for playerId ${playerId}: ${response.status}`);
      return 'N/A';
    }

    const data: ApiResponse<DraftSelection> = await response.json();
    if (!data.data || data.data.length === 0) {
      return 'N/A'; // No draft data available
    }

    const draft = data.data[0];
    return `${draft.year} Round ${draft.round}, Overall ${draft.overall}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching draft pick for playerId ${playerId}:`, error.message);
    } else {
      console.error(`Unknown error fetching draft pick for playerId ${playerId}:`, error);
    }
    return 'N/A';
  }
};

const fetchTeamsByLeague = async (playerId: string, league: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/player-stats/teams?offset=0&limit=100&sort=team&player=${playerId}&league=${league}&apiKey=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch teams for player ${playerId}`);
    }

    const data: ApiResponse<TeamResponseItem> = await response.json();
    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((item) => item.team.name);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching teams for player ${playerId}:`, error.message);
    } else {
      console.error(`Unknown error fetching teams for player ${playerId}:`, error);
    }
    return [];
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerIds = searchParams.get('playerIds'); // Comma-separated list of player IDs
  const league = searchParams.get('league'); // Selected league

  if (!playerIds || !league) {
    return NextResponse.json({ error: 'Player IDs and league are required.' }, { status: 400 });
  }

  try {
    const idsArray = playerIds.split(',').map((id) => id.trim());
    const uniqueIds = [...new Set(idsArray)].filter((id) => id);

    const playerDataPromises = uniqueIds.map(async (playerId) => {
      const [draftPick, teams] = await Promise.all([
        fetchDraftPick(playerId),
        fetchTeamsByLeague(playerId, league),
      ]);

      return {
        playerId,
        draftPick: draftPick || 'N/A',
        teams: teams.length > 0 ? teams.join(', ') : 'N/A',
      };
    });

    const playerData = await Promise.all(playerDataPromises);
    return NextResponse.json({ players: playerData });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching player data:', error.message);
    } else {
      console.error('Unknown error fetching player data:', error);
    }
    return NextResponse.json({ error: 'Failed to fetch player data.' }, { status: 500 });
  }
}
