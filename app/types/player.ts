export type Player = {
    id: string;
    name: string;
    imageUrl: string;
    team?: { id: number; name: string };
    league?: { slug: string; name: string };
    nationality: string;
    jerseyNumber: string;
    views: number;
  }

  export type PlayerType = "SKATER" | "GOALTENDER";
  
  export type GameLog = {
    gameLimit: number,
    date: string;
    goals?: number;
    assists?: number;
    points?: number;
    plusMinusRating?: number;
    shotsAgainst?: number;
    saves?: number;
    goalsAgainst?: number;
    savePercentage?: number;
  };

  export type GoaltenderSummary = {
    shotsAgainst: number;
    saves: number;
    goalsAgainst: number;
    savePercentage: number;
  }
  
  export type  SkaterSummary = {
    goals: number;
    assists: number;
    points: number;
    plusMinusRating: number;
  }

  export type Skater = {
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    plusMinusRating: number;
  }

  export type Goalie = {
    gamesPlayed: number;
    shotsAgainst: number;
    saves: number;
    goalsAgainst: number;
    savePercentage: number;
  }

  // Type for a single season's stats
export interface SeasonStats {
  season: string;
  teamName: string;
  teamId: number;
  league: string;
  role: "GOALTENDER" | "SKATER";
  gamesPlayed: number;
  goalsAgainstAverage?: number; // GOALTENDER only
  savePercentage?: number; // GOALTENDER only
  shutouts?: number; // GOALTENDER only
  goals?: number; // SKATER only
  assists?: number; // SKATER only
  points?: number; // SKATER only
}

export interface CareerStats {
  league: string;
  numberOfSeasons: number;
  gamesPlayed: number;
  goals?: number; // Only for skaters
  assists?: number; // Only for skaters
  points?: number; // Only for skaters
  goalsAgainstAverage?: number; // Only for goalies
  savePercentage?: number; // Only for goalies
  shutouts?: number; // Only for goalies
}

export interface AlumniPlayer { // nytt interface, kolla om det funkar
  id: number;
  name: string;
  birthYear: number;
  draftPick?: string;  
  teams?: string[];
}

export interface AlumniAPIResponse { // nytt interface, kolla om det funkar
  players: {
    id: number;
    name: string;
    dateOfBirth?: string; // or possibly null if not always present
  }[];
}

export interface DraftPickAPIResponse { // nytt interface, kolla om det funkar
  players: {
    playerId: number;
    draftPick?: string;
    teams?: string[];
  }[];
}




  

