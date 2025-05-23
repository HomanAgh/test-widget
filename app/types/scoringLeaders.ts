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

export interface PlayerStats {
  GP?: number; // Games played
  G?: number;  // Goals
  A?: number;  // Assists
  PTS?: number; // Total points (renamed from TP)
  PIM?: number; // Penalties in minutes
  PPG?: number; // Power play goals
  PM?: number;  // Plus/minus
}

export interface ScoringLeader {
  id: number;
  player: Player;
  team: Team;
  season: Season;
  regularStats: PlayerStats;
  postseasonStats?: PlayerStats;
  allTeams?: string;
}

export interface ScoringLeadersResponse {
  data: ScoringLeader[];
}

export interface ScoringLeadersTableProps {
  scoringLeaders: ScoringLeadersResponse;
  leagueDisplay?: string;
  selectedSeason?: string;
  statsType?: "regular" | "postseason";
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
    oddRowColor?: string;
    evenRowColor?: string;
  };
} 