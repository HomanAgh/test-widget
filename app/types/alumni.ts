export interface AlumniPlayer {
    position: string;
    id: number;
    name: string;
    birthYear?: number | null;
    gender?: string | null;
    draftPick: {
      year: number;
      round: number;
      overall: number;
      team?:{
        name: string;
        logo:string;
      }
    }
    teams: {
      name: string;
      leagueLevel: string | null;
    }[];
  }
  
  export interface AlumniAPIResponse {
    players: AlumniPlayer[];
    total: number;
    nextOffset: number | null;
    error?: string;
  }
  
  
  export interface DraftPickAPIResponse { // nytt interface, kolla om det funkar
    players: {
      playerId: number;
      draftPick?: string;
      teams?: string[];
    }[];
  }

  export interface PlayerTableProps {
    players: AlumniPlayer[];
    genderFilter: "men" | "women" | "all";
    pageSize?: number; // default number of players per page, e.g., 15
    headerBgColor?: string;
    headerTextColor?: string;
    tableBgColor?: string;
    tableTextColor?: string;
    nameTextColor?: string;
    oddRowColor?: string;
    evenRowColor?: string;
  }
  