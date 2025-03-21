export interface ApiResponse<T> {
    data?: T[];
    _meta?: {
      totalRecords?: number;
      [key: string]: any;
    };
  }
  
  export interface PlayerStatsItem {
    player: {
      id: number;
      name?: string;
      yearOfBirth?: string;
      gender?: string;
      status?:string;
      youthTeam: null;
      position: string;
    };
    team: {
      id?: number;
      name?: string;
      league?: {
        slug?: string;
        leagueLevel?: string;
      };
    };
    isActiveSeason?: boolean;
    season?: string;
  }
  
  export interface TeamStatsItem {
    league?: {
      leagueLevel?: string;
      slug?: string;
    };
  }
  
  export interface DraftSelection {
    year?: number;
    round?: number;
    overall?: number;
    team?:{
      name?: string;
      logo?: string
    }
    draftType?: {
      slug?: string;
    };
  }
  
  export interface CombinedPlayer {
    player: {
      id: number;
      name: string;
      yearOfBirth: string | null;
      gender: string | null;
      status: string | null;
      position: string;
      youthTeam?: string | null;
    }
    teams: {
      name: string;
      leagueLevel: string | null;
      leagueSlug: string | null;
      isCurrentTeam?: boolean;
    }[];
    draftPick?: DraftSelection | null; 
  }

  //Interfaces for Auth route

  export interface User {
    username: string;
    password: string;
  }

  //Interfaces for all League route

  export interface LeagueDetails {
    slug: string;
    name: string;
    logo?: { url?: string } | null;
  }
  
  export interface LeagueApiResponse {
    data?: LeagueDetails[];
  }

  