// Team information from standings API
export interface PlayoffTeam {
  id: number;
  name: string;
  group: string;
  postseason: string | null;
  logo?: string;
}

// Teams grouped by conference/division
export interface ConferenceTeams {
  eastern: PlayoffTeam[];
  western: PlayoffTeam[];
}

// Game information from postseason API
export interface PlayoffGame {
  homeTeam: {
    id: number;
    name: string;
  };
  visitingTeam: {
    id: number;
    name: string;
  };
  homeTeamLogo?: {
    large: string;
  };
  visitingTeamLogo?: {
    large: string;
  };
  status: 'COMPLETED' | 'UPCOMING' | 'LIVE';
  scoreType: string | null;
  homeTeamScore: number | null;
  visitingTeamScore: number | null;
  dateTime?: string;
  date?: string;
}

// Series between two teams
export interface PlayoffSeries {
  team1: PlayoffTeam;
  team2: PlayoffTeam;
  team1Wins: number;
  team2Wins: number;
  winner?: PlayoffTeam;
  status: 'COMPLETED' | 'UPCOMING' | 'IN_PROGRESS';
  games: PlayoffGame[];
}

// Round in the playoff bracket
export interface PlayoffRound {
  name: string;
  series: PlayoffSeries[];
}

// Complete playoff bracket structure
export interface PlayoffBracket {
  eastern: PlayoffRound[];
  western: PlayoffRound[];
  final?: PlayoffSeries;
}

// API response format
export interface LeaguePlayoffResponse {
  bracket: PlayoffBracket;
  leagueId: string;
  season: string;
}

// Configuration for the widget
export interface LeaguePlayoffWidgetConfig {
  leagueId: string;
  season: string;
}

// Interface for react-d3-tree visualization items
export interface ReactD3TreeItem {
  name: string;
  attributes?: {
    [key: string]: any;
  };
  children: ReactD3TreeItem[];
}
