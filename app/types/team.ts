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
    placeOfBirth: string;
    shoots: string;
    catches: string;
    weight: string
    height: string;
    jerseyNumber: string;
    dateOfBirth: string; 
    flagUrl: string | null; 
    playerRole: string;
    stats: {
      goals: number;
      assists: number;
      points: number;
    };
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
  
  
  