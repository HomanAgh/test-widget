import { AlumniPlayer, DraftPickAPIResponse } from '@/app/types/player';

export const fetchDraftPicksAndTeams = async (
  playerIds: number[],
  league: string | null
): Promise<Record<number, { draftPick: string; teams: string[] }>> => {
  try {
    const idsString = playerIds.join(',');
    let url = `/api/draftpicks?playerIds=${idsString}`;
    if (league) url += `&league=${league}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch draft picks and teams.');

    const data = (await response.json()) as DraftPickAPIResponse;
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
