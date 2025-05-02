export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  position?: string;
  shoots?: string;
  height?: {
    metrics: number;
    imperial: string;
  };
  weight?: {
    metrics: number;
    imperial: number;
  };
  nationality?: {
    slug: string;
    name: string;
  } | string;
  flagUrl?: string;
  dateOfBirth?: string;
  age?: number;
  imageUrl?: string;
  slug: string;
  links?: {
    eliteprospectsUrl?: string;
  };
}

export interface Team {
  id: number;
  name: string;
  fullName?: string;
  logo?: {
    small?: string;
    medium?: string;
    large?: string;
  };
  links?: {
    eliteprospectsUrl?: string;
  };
  slug: string;
  league?: {
    name: string;
    slug: string;
  };
}

export interface Season {
  slug: string;
  startYear: number;
  endYear: number;
}

export interface GoalieStats {
  GP?: number;    // Games played
  GAA?: number;   // Goals against average
  SVP?: number;   // Save percentage
  SO?: number;    // Shutouts
  W?: number;     // Wins
  L?: number;     // Losses
  T?: number;     // Ties
  TOI?: string;   // Time on ice
  SA?: number;    // Shots against
  GA?: number;    // Goals against
  SVS?: number;   // Saves
}

export interface GoalieLeader {
  id: number;
  player: Player;
  team: Team;
  season: Season;
  regularStats: GoalieStats;
  postseasonStats?: GoalieStats;
}

export interface GoalieLeadersResponse {
  _meta?: {
    generatedAt: string;
    offset: number;
    limit: number;
    totalRecords: number;
  };
  data: GoalieLeader[];
}

export interface GoalieLeadersTableProps {
  goalieLeaders: GoalieLeadersResponse;
  leagueDisplay?: string;
  selectedSeason?: string;
  statsType?: "regular" | "postseason";
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}
