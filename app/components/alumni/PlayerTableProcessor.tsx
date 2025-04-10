// Server component - no "use client" needed
import { leagueRankings } from "./LeagueSelection";

export function sortTeamsByLeagueRankThenName(teams: any[]) {
  return [...teams].sort((a, b) => {
    // Special case: If one team is NHL and current, prioritize it
    const isNhlA = a.leagueSlug?.toLowerCase() === "nhl";
    const isNhlB = b.leagueSlug?.toLowerCase() === "nhl";

    // If A is current NHL team and B is not, A comes first
    if (isNhlA && a.isCurrentTeam && !(isNhlB && b.isCurrentTeam)) {
      return -1;
    }

    // If B is current NHL team and A is not, B comes first
    if (isNhlB && b.isCurrentTeam && !(isNhlA && a.isCurrentTeam)) {
      return 1;
    }

    // If both or neither are current NHL teams, fall back to normal sorting
    const slugA = a.leagueSlug?.toLowerCase() ?? "";
    const slugB = b.leagueSlug?.toLowerCase() ?? "";
    const rankA = leagueRankings[slugA] ?? Number.MAX_SAFE_INTEGER;
    const rankB = leagueRankings[slugB] ?? Number.MAX_SAFE_INTEGER;

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    const nameA = a.name ?? "";
    const nameB = b.name ?? "";
    return nameA.localeCompare(nameB);
  });
}

export function getBestCategoryRankAndTeam(
  player: any,
  category: "junior" | "college" | "professional"
) {
  let bestRank = Number.MAX_SAFE_INTEGER;
  let bestTeamName = "";
  /* const foundCurrentNhl = false; */

  // First pass: check if there's a current NHL team
  if (category === "professional") {
    for (const team of player.teams ?? []) {
      if ((team.leagueLevel ?? "").toLowerCase().includes(category)) {
        const slug = team.leagueSlug?.toLowerCase() ?? "";
        if (slug === "nhl" && team.isCurrentTeam) {
          // Current NHL team found! This is our priority.
          return {
            bestRank: -1, // Special rank that's better than any other
            bestTeamName: team.name ?? "",
          };
        }
      }
    }
  }

  // Normal ranking logic if no current NHL team was found
  for (const team of player.teams ?? []) {
    if ((team.leagueLevel ?? "").toLowerCase().includes(category)) {
      const slug = team.leagueSlug?.toLowerCase() ?? "";
      const rank = leagueRankings[slug] ?? Number.MAX_SAFE_INTEGER;

      if (rank < bestRank) {
        bestRank = rank;
        bestTeamName = team.name ?? "";
      } else if (rank === bestRank) {
        const currentName = team.name ?? "";
        if (currentName.localeCompare(bestTeamName) < 0) {
          bestTeamName = currentName;
        }
      }
    }
  }

  return { bestRank, bestTeamName };
}

export function filterAndSortPlayers(
  players: any[],
  genderFilter: string,
  sortColumn: string,
  sortDirection: string
) {
  const filteredPlayers =
    genderFilter === "men"
      ? players.filter((p) => p.gender === "male")
      : genderFilter === "women"
      ? players.filter((p) => p.gender === "female")
      : players;

  if (sortDirection === "none" || !sortColumn) return filteredPlayers;

  return [...filteredPlayers].sort((a, b) => {
    switch (sortColumn) {
      case "name":
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);

      case "position": {
        const positionRank: Record<string, number> = {
          G: 0,
          D: 1,
          F: 2,
        };
        const posA = a.position
          ? positionRank[a.position.toUpperCase()] ?? 999
          : 999;
        const posB = b.position
          ? positionRank[b.position.toUpperCase()] ?? 999
          : 999;
        return sortDirection === "asc" ? posA - posB : posB - posA;
      }

      case "status": {
        const sA = a.status ?? "";
        const sB = b.status ?? "";
        return sortDirection === "asc"
          ? sA.localeCompare(sB)
          : sB.localeCompare(sA);
      }

      case "birthYear": {
        const yearA = a.birthYear ?? 0;
        const yearB = b.birthYear ?? 0;
        return sortDirection === "asc" ? yearA - yearB : yearB - yearA;
      }

      case "draftPick": {
        const overallA = a.draftPick?.overall ?? Number.MAX_SAFE_INTEGER;
        const overallB = b.draftPick?.overall ?? Number.MAX_SAFE_INTEGER;
        return sortDirection === "asc"
          ? overallA - overallB
          : overallB - overallA;
      }

      case "draftYear": {
        // Get the draft year or use a fallback value
        // Players without draft information should be at the end (or beginning) of the list
        const yearA =
          a.draftPick && typeof a.draftPick === "object" && a.draftPick.year
            ? parseInt(a.draftPick.year, 10)
            : sortDirection === "asc"
            ? Number.MAX_SAFE_INTEGER
            : 0;

        const yearB =
          b.draftPick && typeof b.draftPick === "object" && b.draftPick.year
            ? parseInt(b.draftPick.year, 10)
            : sortDirection === "asc"
            ? Number.MAX_SAFE_INTEGER
            : 0;

        // Simply compare the years

        return sortDirection === "asc" ? yearA - yearB : yearB - yearA;
      }

      case "tournamentTeam": {
        const teamA = a.tournamentTeamName ?? "";
        const teamB = b.tournamentTeamName ?? "";
        return sortDirection === "asc"
          ? teamA.localeCompare(teamB)
          : teamB.localeCompare(teamA);
      }

      case "tournamentSeason": {
        const seasonA = a.tournamentSeason ?? "";
        const seasonB = b.tournamentSeason ?? "";
        return sortDirection === "asc"
          ? seasonA.localeCompare(seasonB)
          : seasonB.localeCompare(seasonA);
      }

      case "junior": {
        const { bestRank: rankA, bestTeamName: nameA } =
          getBestCategoryRankAndTeam(a, "junior");
        const { bestRank: rankB, bestTeamName: nameB } =
          getBestCategoryRankAndTeam(b, "junior");
        if (rankA === rankB) {
          return sortDirection === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        return sortDirection === "asc" ? rankA - rankB : rankB - rankA;
      }

      case "college": {
        const { bestRank: rankA, bestTeamName: nameA } =
          getBestCategoryRankAndTeam(a, "college");
        const { bestRank: rankB, bestTeamName: nameB } =
          getBestCategoryRankAndTeam(b, "college");
        if (rankA === rankB) {
          return sortDirection === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        return sortDirection === "asc" ? rankA - rankB : rankB - rankA;
      }

      case "pro": {
        const { bestRank: rankA, bestTeamName: nameA } =
          getBestCategoryRankAndTeam(a, "professional");
        const { bestRank: rankB, bestTeamName: nameB } =
          getBestCategoryRankAndTeam(b, "professional");
        if (rankA === rankB) {
          return sortDirection === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        return sortDirection === "asc" ? rankA - rankB : rankB - rankA;
      }

      default:
        return 0;
    }
  });
}
