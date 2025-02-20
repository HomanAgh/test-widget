export interface AlumniPlayer {
    id: number;
    name: string;
    birthYear?: number | null;
    gender?: string | null;
    status: string | null;
    position: string;
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
    teamName: string;
  }
  
  export interface AlumniAPIResponse {
    players: AlumniPlayer[];
    total: number;
    nextOffset: number | null;
    error?: string;
  }
  
  
  export interface DraftPickAPIResponse {
    players: {
      playerId: number;
      draftPick?: string;
      teams?: string[];
    }[];
  }

  export interface PlayerTableProps {
    players: AlumniPlayer[];
    genderFilter: "men" | "women" | "all";
    pageSize?: number;
    headerBgColor?: string;
    headerTextColor?: string;
    tableBgColor?: string;
    tableTextColor?: string;
    nameTextColor?: string;
    oddRowColor?: string;
    evenRowColor?: string;
  }
  