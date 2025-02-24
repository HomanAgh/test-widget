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
    dateOfBirth: string; 
    flagUrl: string | null; 
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
    onSelect: (teamObj: SelectedTeam) => void; 
    onError: (err: string) => void;
    selectedTeams: SelectedTeam[];
    onCheckedTeamsChange: (teams: SelectedTeam[]) => void;
  }
  
  
  