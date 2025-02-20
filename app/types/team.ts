export interface Team {
    id: string;
    name: string;
    league: string;
    country: string;
    logoM: string;
  }
  
  export interface TeamsAPIResponse {
    teams: Team[];
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
  
  export interface TeamItem {
    id: number;
    name: string;
    league: string;
    logo?: string | null;
  }


  export interface SelectedTeam {
    id: number;
    name: string;
    league : string;
    logo?: string | null;
  }
  
  export interface TeamSearchBarProps {
    onSelect: (teamObj: SelectedTeam) => void; // optional single-select usage
    onError: (err: string) => void;
    selectedTeams: SelectedTeam[];
    onCheckedTeamsChange: (teams: SelectedTeam[]) => void;
  }
  
  