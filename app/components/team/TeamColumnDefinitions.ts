 // Shared column definitions for team roster
export interface TeamColumnOptions {
    name: boolean; // Always true, can't be unchecked
    number: boolean;
    position: boolean;
    age: boolean;
    birthYear: boolean;
    birthPlace: boolean;
    weight: boolean;
    height: boolean;
    shootsCatches: boolean;
    goals: boolean;
    assists: boolean;
    points: boolean;
    excludeGoalies?: boolean;
  }
  
  // Column keys for sorting
  export type SortKey =
    | "number"
    | "player" // Special case for name/player column
    | "position"
    | "age"
    | "birthYear"
    | "birthPlace"
    | "weight"
    | "height"
    | "shootsCatches" // Standardized name (was shootOrCatch in RosterTable)
    | "goals"
    | "assists"
    | "points";
  
  // Default column selection state
  export const DEFAULT_COLUMNS: TeamColumnOptions = {
    name: true, // Always true
    number: true,
    position: true,
    age: true,
    birthYear: false,
    birthPlace: false,
    weight: true,
    height: true,
    shootsCatches: false,
    goals: false,
    assists: false,
    points: true,
    excludeGoalies: false,
  };
  
  // Helper function to convert camelCase to Title Case with spaces
  export const formatColumnName = (key: string): string => {
    // Special cases
    if (key === "shootsCatches") return "Shoots/Catches";
    if (key === "birthYear") return "Birth Year";
    if (key === "birthPlace") return "Birth Place";
    if (key === "excludeGoalies") return "Exclude Goaltenders";
  
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };
  
  // Helper to map column keys to their display names
  export const COLUMN_DISPLAY_NAMES: Record<keyof TeamColumnOptions, string> = {
    name: "Name",
    number: "#",
    position: "Position",
    age: "Age",
    birthYear: "Birth Year",
    birthPlace: "Birth Place",
    weight: "Weight",
    height: "Height",
    shootsCatches: "Shoots/Catches",
    goals: "G",
    assists: "A",
    points: "PTS",
    excludeGoalies: "Exclude Goaltenders",
  };
  
  // Helper function to get position priority (for sorting)
  export const getPositionPriority = (position: string): number => {
    if (position === "G") return 1;
    if (position === "D") return 2;
    return 3; // Forwards
  };