export interface League {
    slug: string;
    name: string;
    logo?: string;
    country: {
      name: string;
    }
    fullName: string;
  }

export interface LeaguesAPIResponse {
  leagues: League[];
  } 
  
  export interface LeagueTableProps {
    standings: {
      data: {
        id: number;
        group?: string;
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
          OTW?: number;
          OTL?: number;
          PTS?: number;
        };
      }[];
    };
    logoS: string;
  }

  export interface LeagueSelectionDropdownProps {
    professionalLeagues: League[];
    juniorLeagues: League[];
    collegeLeagues: League[];
    selectedLeagues: string[]; 
    onChange: (selected: string[]) => void;
  }
  export interface ExtendedTeam {
    id: number | string;
    team: {
      name: string;
      league: {
        name: string;
        logo?: {
          url?: string;
        };
      };
      links?: {
        eliteprospectsUrl?: string;
      };
    };
    season: {
      slug: string;
    };
    stats?: {
      GP: number;
      W: number;
      L: number;
      OTW?: number;
      OTL?: number;
      PTS: number;
    };
    logo?: string;
    conference: string;
    division: string | null;
  }
  

  