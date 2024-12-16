export interface Team {
    id: string;
    name: string;
    league: string;
    country: string;
  }
  
  export interface RosterPlayer {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    jerseyNumber: string;
    nationality: string;
  }

  export interface TeamsAPIResponse {
    teams: Team[];
  }
  