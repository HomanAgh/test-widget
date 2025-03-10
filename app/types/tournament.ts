export interface TournamentItem {
    slug: string;
    name: string;
    leagueLevel: string;  // should be "tournament"
    country?: {
      name: string;
      slug: string;
    }
}