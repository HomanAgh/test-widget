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
}

interface TeamResponseItem {
  team: {
    id?: number;
    league: { leagueLevel?: string };
    name: string;
  };
}

//
// 1. Fetch draft pick details for a player
//
const fetchDraftPick = async (playerId: string): Promise<string> => {
  try {
    console.log(`Fetching draft pick for player ${playerId}`);
    const response = await fetch(
      `${apiBaseUrl}/players/${playerId}/draft-selections?offset=0&limit=1&sort=-year&fields=year,round,overall&apiKey=${apiKey}`
    );

    if (!response.ok) {
      console.error(`Error fetching draft pick for playerId ${playerId}: ${response.statusText}`);
      return 'N/A';
    }

    const data: ApiResponse<DraftSelection> = await response.json();
    if (!data.data || data.data.length === 0) {
      console.log(`No draft pick data found for player ${playerId}`);
      return 'N/A';
    }

    const draft = data.data[0];
    return `${draft.year} Round ${draft.round}, Overall ${draft.overall}`;
  } catch (error) {
    console.error(`Error fetching draft pick for player ${playerId}:`, error);
    return 'N/A';
  }
};

//
// 2. Fetch teams from multiple leagues for a single player
//    => "OR" logic by calling the API once per league and combining results.
//
export const fetchTeamsByLeagues = async (
  playerId: string,
  leagues: string[] | null
): Promise<{ name: string; leagueLevel: string | null }[]> => {
  try {
    // If no leagues specified, either return empty or handle "fetchAllLeagues" in your own logic
    if (!leagues || leagues.length === 0) {
      console.log(
        `No leagues specified for player ${playerId}; returning empty array (or fetch all if needed).`
      );
      return [];
    }

    let allTeams: { name: string; leagueLevel: string | null }[] = [];

    // Make one request per league => OR logic
    for (const league of leagues) {
      const url = `${apiBaseUrl}/player-stats/teams?offset=0&limit=100&sort=team&player=${playerId}&league=${league}&apiKey=${apiKey}`;
      console.log(`Fetching teams for player ${playerId}, league=${league}\nURL => ${url}`);

      const response = await fetch(url);
      if (!response.ok) {
        console.error(
          `Failed to fetch teams for player ${playerId} in league ${league}: ${response.statusText}`
        );
        // Continue to next league to allow partial results
        continue;
      }

      const data: ApiResponse<TeamResponseItem> = await response.json();
      if (!data.data || data.data.length === 0) {
        console.log(`No team data found for league=${league} and player=${playerId}`);
        continue;
      }

      // We use `Promise.all` so we can run the "leagueLevel fallback fetch" in parallel for each item.
      const teamsForThisLeague = await Promise.all(
        data.data.map(async (item) => {
          const { team } = item;
          const { id: teamId, league } = team;
          let leagueLevel = league?.leagueLevel || null;

          // If leagueLevel is null, fetch from /team-stats to get the fallback
          if (!leagueLevel && teamId) {
            try {
              // Example: /v1/team-stats?offset=0&limit=100&sort=-season&team=95&apiKey=XYZ
              const fallbackUrl = `${apiBaseUrl}/team-stats?offset=0&limit=1&sort=-season&team=${teamId}&apiKey=${apiKey}`;
              console.log(`Fetching leagueLevel from fallback for teamId=${teamId}\nURL => ${fallbackUrl}`);

              const fallbackResp = await fetch(fallbackUrl);
              if (fallbackResp.ok) {
                const teamStatsData: ApiResponse<any> = await fallbackResp.json();
                // If there's at least one record, grab that leagueLevel
                if (teamStatsData.data && teamStatsData.data.length > 0) {
                  leagueLevel = teamStatsData.data[0]?.league?.leagueLevel ?? null;
                }
              } else {
                console.error(`Failed to fetch fallback team-stats for teamId=${teamId}: ${fallbackResp.statusText}`);
              }
            } catch (error) {
              console.error(`Error fetching fallback team-stats for teamId=${teamId}:`, error);
            }
          }

          return {
            name: team.name,
            leagueLevel: leagueLevel ?? 'unknown',
          };
        })
      );

      // Merge with previously fetched teams
      allTeams = allTeams.concat(teamsForThisLeague);
    }

    return allTeams;
  } catch (error) {
    console.error(`Error fetching teams for player ${playerId}:`, error);
    return [];
  }
};

//
// 3. Main handler for the route => /api/draftpicks
//
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playerIds = searchParams.get('playerIds'); // e.g. ?playerIds=123,456
  const leagueParam = searchParams.get('league');  // e.g. ?league=nhl,shl
  const fetchAllLeagues = searchParams.get('fetchAllLeagues') === 'true'; // e.g. ?fetchAllLeagues=true

  if (!playerIds || (!leagueParam && !fetchAllLeagues)) {
    return NextResponse.json(
      { error: 'playerIds and league are required unless fetching all leagues.' },
      { status: 400 }
    );
  }

  try {
    // Convert comma-separated IDs into a unique list
    const idsArray = playerIds.split(',').map((id) => id.trim());
    const uniqueIds = [...new Set(idsArray)].filter((id) => id);

    console.log(`Processing players: ${uniqueIds.join(', ')}`);

    // If user wants all leagues, pass null => In fetchTeamsByLeagues, you'd handle a 'fetchAll' scenario
    const leagues = fetchAllLeagues
      ? null
      : leagueParam
      ? leagueParam.split(',').map((l) => l.trim())
      : [];

    const playerDataPromises = uniqueIds.map(async (playerId) => {
      console.log(`Fetching data for player ${playerId}`);
      try {
        const [draftPick, teams] = await Promise.all([
          fetchDraftPick(playerId),
          fetchTeamsByLeagues(playerId, leagues),
        ]);

        console.log(`Draft pick for player ${playerId}: ${draftPick}`);
        console.log(`Teams for player ${playerId}:`, teams);

        // Create a consistent result object
        return {
          playerId,
          draftPick: draftPick || 'N/A',
          teams: teams.map((team) => ({
            name: team.name,
            leagueLevel: team.leagueLevel || 'unknown',
          })),
        };
      } catch (error) {
        console.error(`Error processing player ${playerId}:`, error);
        return {
          playerId,
          draftPick: 'N/A',
          teams: [],
        };
      }
    });

    // Wait for all players to finish
    const playerData = await Promise.all(playerDataPromises);
    console.log('Final player data:', playerData);

    return NextResponse.json({ players: playerData });
  } catch (error) {
    console.error('Error fetching player data:', error);
    return NextResponse.json({ error: 'Failed to fetch player data.' }, { status: 500 });
  }
}
