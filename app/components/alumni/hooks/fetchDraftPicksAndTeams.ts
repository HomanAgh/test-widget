import { DraftPickAPIResponse } from '@/app/types/player';

export const fetchDraftPicksAndTeams = async (
  playerIds: number[],
  league: string | null
): Promise<Record<number, { draftPick: string; teams: string[] }>> => {
  if (!playerIds || playerIds.length === 0) {
    console.warn('No player IDs provided.');
    return {};
  }

  try {
    const idsString = playerIds.join(',');
    let url = `/api/draftpicks?playerIds=${idsString}`;
    if (league) {
      url += `&league=${league}`;
    } else {
      url += `&fetchAllLeagues=true`;
    }

    console.log(`Fetching draft picks and teams from URL: ${url}`); // Debug log

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error response from API: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch draft picks and teams.');
    }

    const data = (await response.json()) as DraftPickAPIResponse;

    console.log('Draft pick and team data:', data); // Debug log

    return data.players.reduce((acc, entry) => {
      acc[entry.playerId] = {
        draftPick: entry.draftPick || 'N/A',
        teams: entry.teams || [],
      };
      return acc;
    }, {} as Record<number, { draftPick: string; teams: string[] }>);
  } catch (err) {
    console.error('Error fetching draft picks and teams:', err);
    return {};
  }
};
