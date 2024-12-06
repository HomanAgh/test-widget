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
    gamesPlayed: number;
    shotsAgainst: number;
    saves: number;
    goalsAgainst: number;
    savePercentage: number;
  }
  
  export type  SkaterSummary = {
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    plusMinusRating: number;
  }

  

