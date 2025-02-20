
export type Player = {
  id: string;
  name: string;
  team?: { id: number; name: string };
  league?: { slug: string; name: string };
  jerseyNumber: string;
  views: number;
  weightMet: string;
  weightImp: string;
  heightMet: string;
  heightImp: string;
  flagUrls?: {
    primary: string | null;
    secondary: string | null;
  };
  capHit: string;
  age: number;
  teamLogo:string
  season: {
    slug: string;
  }
  placeOfBirth: string;
};

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

export interface SeasonStats {
  season: string;
  teamName: string;
  teamId: number;
  league: string;
  role: "GOALTENDER" | "SKATER";
  gamesPlayed: number;
  goalsAgainstAverage?: number;
  savePercentage?: number; 
  shutouts?: number; 
  goals?: number; 
  assists?: number; 
  points?: number; 
  plusMinus?: number; 
}

export interface CareerStats {
  league: string;
  numberOfSeasons: number;
  gamesPlayed: number;
  goals?: number; 
  assists?: number; 
  points?: number; 
  goalsAgainstAverage?: number; 
  savePercentage?: number; 
  shutouts?: number; 
  plusMinus?: number; 
}






  
