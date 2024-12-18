export interface Team {
    id: string;
    name: string;
    league: string;
    country: string;
    logoM: string;
  }
  
  export interface RosterPlayer {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    jerseyNumber: string;
    dateOfBirth: string; // Added to store player's date of birth
    flagUrl: string | null; // Added to store the flag URL for the player's nationality
  }
  

  export interface TeamsAPIResponse {
    teams: Team[];
  }
  
  