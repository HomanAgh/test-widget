/* export interface TournamentItem {
    slug: string;
    name: string;
    leagueLevel: string;  // should be "tournament"
    country?: {
      name: string;
      slug: string;
    }
} */

    export interface TournamentItem {
      slug: string;
      name: string;
      leagueLevel: string;  // should be "tournament"
      country?: {
        name: string;
        slug: string;
      }
      // Add these fields for logo support
      logo?: {
        url: string;
        colors?: string[];
        hasTransparency?: boolean;
      };
      logoUrl?: string;
      imageUrl?: string;
  }