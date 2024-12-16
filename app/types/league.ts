export interface League {
    slug: string;
    name: string;
  }
  
  export interface LeagueTableProps {
    standings: {
      data: {
        id: number;
        group?: string; // Optional group field
        team: {
          name: string;
          league: {
            name: string;
          };
          links?: { eliteprospectsUrl?: string };
        };
        season: {
          slug: string;
        };
        stats?: {
          GP?: number;
          W?: number;
          L?: number;
          PTS?: number;
        };
      }[];
    };
    backgroundColor?: string; // Prop for dynamic background color
  }