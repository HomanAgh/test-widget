// Server component - no "use client" needed
import { leagueRankings } from "./LeagueSelection";

export function sortTeamsByLeagueRankThenName(teams: any[]) {
  return [...teams].sort((a, b) => {
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
