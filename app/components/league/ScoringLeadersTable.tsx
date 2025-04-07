"use client";

import React, { useState } from "react";
import { ScoringLeadersTableProps } from "@/app/types/scoringLeaders";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Link,
  PoweredBy,
} from "@/app/components/common/style";
import AdvancedPaginationControls from "@/app/components/common/style/PaginationControls";
import {
  HiMiniChevronUpDown,
  HiMiniChevronUp,
  HiMiniChevronDown,
} from "react-icons/hi2";

const ScoringLeadersTable: React.FC<ScoringLeadersTableProps> = ({
  scoringLeaders,
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
    oddRowColor: "#F3F4F6",
    evenRowColor: "#ffffff",
  },
}) => {
  // Sorting state - default to TP column with descending order (highest first)
  const [sortColumn, setSortColumn] = useState<string>("TP");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "none">(
    "desc"
  );
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(0);
  const PLAYERS_PER_PAGE = 15;
  const MAX_PLAYERS = 75;

  const isCustomColor =
    customColors.tableBackgroundColor.toLowerCase() !== "#ffffff" &&
    customColors.tableBackgroundColor.toLowerCase() !== "#fff";

  // Use custom row colors if provided, otherwise use defaults
  const evenRowColor = customColors.evenRowColor || "#ffffff";
  const oddRowColor = customColors.oddRowColor || "#F3F4F6";

  if (
    !scoringLeaders ||
    !scoringLeaders.data ||
    scoringLeaders.data.length === 0
  ) {
    return <div className="text-center py-4">No scoring data available</div>;
  }

  // Helper function to get nationality name
  const getNationalityName = (nationality: any): string => {
    if (!nationality) return "Country";
    if (typeof nationality === "string") return nationality;
    if (typeof nationality === "object" && nationality.name)
      return nationality.name;
    return "Country";
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection((prev) => {
        if (prev === "desc") return "asc";
        if (prev === "asc") return "none";
        return "desc";
      });
    } else {
      // Set new sort column and default to ascending
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  // Render sort arrow
  const renderSortArrow = (column: string) => {
    if (sortColumn !== column) {
      return (
        <React.Fragment key={`${column}-updown`}>
          <HiMiniChevronUpDown className="inline-block text-gray-300" />
        </React.Fragment>
      );
    }

    if (sortDirection === "desc") {
      return (
        <React.Fragment key={`${column}-down`}>
          <HiMiniChevronDown className="inline-block text-gray-300" />
        </React.Fragment>
      );
    }

    if (sortDirection === "asc") {
      return (
        <React.Fragment key={`${column}-up`}>
          <HiMiniChevronUp className="inline-block text-gray-300" />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment key={`${column}-default`}>
        <HiMiniChevronUpDown className="inline-block text-gray-300" />
      </React.Fragment>
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Sort the data
  const sortedData = [...scoringLeaders.data].sort((a, b) => {
    let result = 0;

    switch (sortColumn) {
      case "player":
        const playerNameA =
          `${a.player.firstName} ${a.player.lastName}`.toLowerCase();
        const playerNameB =
          `${b.player.firstName} ${b.player.lastName}`.toLowerCase();
        result = playerNameB.localeCompare(playerNameA);
        break;
      case "team":
        const teamNameA = a.team.name.toLowerCase();
        const teamNameB = b.team.name.toLowerCase();
        result = teamNameB.localeCompare(teamNameA);
        break;
      case "GP":
        result = (a.regularStats?.GP || 0) - (b.regularStats?.GP || 0);
        break;
      case "G":
        result = (a.regularStats?.G || 0) - (b.regularStats?.G || 0);
        break;
      case "A":
        result = (a.regularStats?.A || 0) - (b.regularStats?.A || 0);
        break;
      case "TP":
        // For TP, we want highest first when desc (default)
        result = (a.regularStats?.PTS || 0) - (b.regularStats?.PTS || 0);
        break;
      default:
        // Default sort by points
        result = (a.regularStats?.PTS || 0) - (b.regularStats?.PTS || 0);
    }

    // If sort direction is 'none', return to default sort (points descending)
    if (sortDirection === "none") {
      return (a.regularStats?.PTS || 0) - (b.regularStats?.PTS || 0);
    }

    // For desc, we want highest values first (negative result)
    // For asc, we want lowest values first (positive result)
    return sortDirection === "desc" ? -result : result;
  });

  // First, create initial ranking by points (TP) for all players
  const initialRanking = [...scoringLeaders.data]
    .sort((a, b) => (b.regularStats?.PTS || 0) - (a.regularStats?.PTS || 0))
    .map((player, index) => {
      // Ensure we have a valid ID for matching
      const playerId =
        player.id ||
        `${player.player.firstName}-${player.player.lastName}-${player.team.name}`
          .toLowerCase()
          .replace(/\s+/g, "-");

      return {
        id: playerId,
        playerId: player.player.id,
        playerName: `${player.player.firstName} ${player.player.lastName}`,
        rank: index + 1,
      };
    });

  // Map the ranking to each player in the sorted data
  const rankedData = sortedData.map((player) => {
    // Create a backup ID in case the primary ID is missing
    const playerId =
      player.id ||
      `${player.player.firstName}-${player.player.lastName}-${player.team.name}`
        .toLowerCase()
        .replace(/\s+/g, "-");

    // Try to find the rank info by primary ID or by player ID
    let rankInfo = initialRanking.find((r) => r.id === playerId);

    // If not found by ID, try to find by player name as a fallback
    if (!rankInfo) {
      rankInfo = initialRanking.find(
        (r) =>
          r.playerName ===
          `${player.player.firstName} ${player.player.lastName}`
      );
    }

    return {
      ...player,
      originalRank: rankInfo ? rankInfo.rank : 999, // Fallback rank if not found
    };
  });

  // Limit to MAX_PLAYERS and paginate the data
  const limitedData = rankedData.slice(0, MAX_PLAYERS);
  const totalPages = Math.ceil(limitedData.length / PLAYERS_PER_PAGE);
  const paginatedData = limitedData.slice(
    currentPage * PLAYERS_PER_PAGE,
    (currentPage + 1) * PLAYERS_PER_PAGE
  );

  return (
    <div>
      <TableContainer>
        <Table
          tableBgColor={customColors.tableBackgroundColor}
          tableTextColor={customColors.textColor}
        >
          <TableHead
            bgColor={customColors.backgroundColor}
            textColor={customColors.headerTextColor}
          >
            <TableRow key="header-row" bgColor={customColors.backgroundColor}>
              <TableCell
                key="rank-header"
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("TP")}
              >
                <span>Rank</span> {renderSortArrow("TP")}
              </TableCell>
              <TableCell
                key="player-header"
                isHeader
                align="left"
                className="cursor-pointer"
                onClick={() => handleSort("player")}
              >
                <span>Player</span> {renderSortArrow("player")}
              </TableCell>
              <TableCell
                key="team-header"
                isHeader
                align="left"
                className="cursor-pointer"
                onClick={() => handleSort("team")}
              >
                <span>Team</span> {renderSortArrow("team")}
              </TableCell>
              <TableCell
                key="gp-header"
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("GP")}
              >
                <span>GP</span> {renderSortArrow("GP")}
              </TableCell>
              <TableCell
                key="g-header"
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("G")}
              >
                <span>G</span> {renderSortArrow("G")}
              </TableCell>
              <TableCell
                key="a-header"
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("A")}
              >
                <span>A</span> {renderSortArrow("A")}
              </TableCell>
              <TableCell
                key="tp-header"
                isHeader
                align="center"
                className="cursor-pointer"
                onClick={() => handleSort("TP")}
              >
                <span>TP</span> {renderSortArrow("TP")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((player, index) => {
              const nationalityName = getNationalityName(
                player.player.nationality
              );
              const playerUrl =
                player.player.links?.eliteprospectsUrl ||
                (player.player.id ? `https://www.eliteprospects.com/player/${player.player.id}/${player.player.lastName?.toLowerCase()}-${player.player.firstName?.toLowerCase()}` : 
                (player.player.slug ? `/player/${player.player.slug}` : '#'));

              const teamUrl =
                player.team.links?.eliteprospectsUrl ||
                (player.team.id ? `https://www.eliteprospects.com/team/${player.team.id}/${player.team.name?.toLowerCase().replace(/\s+/g, '-')}` : 
                (player.team.slug ? `/team/${player.team.slug}` : `#team-${player.team.id}`));

              return (
                <TableRow
                  key={player.id}
                  bgColor={
                    isCustomColor
                      ? customColors.tableBackgroundColor
                      : index % 2 === 0
                      ? evenRowColor
                      : oddRowColor
                  }
                >
                  <TableCell align="left">{player.originalRank}.</TableCell>
                  <TableCell align="left">
                    <div className="flex items-center">
                      {player.player.flagUrl && (
                        <div className="flex-shrink-0 mr-2">
                          <img
                            src={player.player.flagUrl}
                            alt={`${nationalityName} flag`}
                            width={16}
                            height={12}
                            className="inline-block"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={playerUrl}
                          style={{ color: customColors.nameTextColor }}
                        >
                          <span className="block font-medium text-left hover:underline">
                            {typeof player.player.firstName === "string"
                              ? player.player.firstName
                              : ""}{" "}
                            {typeof player.player.lastName === "string"
                              ? player.player.lastName
                              : ""}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="left">
                    <div className="flex items-center">
                      {player.team.logo?.small && (
                        <div className="flex-shrink-0 mr-2">
                          <img
                            src={player.team.logo.small}
                            alt={`${player.team.name} logo`}
                            width={20}
                            height={20}
                            className="inline-block"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={teamUrl}
                          style={{ color: customColors.nameTextColor }}
                        >
                          <span className="block font-medium text-left hover:underline">
                            {player.team.name}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {player.regularStats?.GP || 0}
                  </TableCell>
                  <TableCell align="center">
                    {player.regularStats?.G || 0}
                  </TableCell>
                  <TableCell align="center">
                    {player.regularStats?.A || 0}
                  </TableCell>
                  <TableCell align="center">
                    {player.regularStats?.PTS || 0}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <div className="mt-4">
          <AdvancedPaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <PoweredBy />
    </div>
  );
};

// Export the component and the URL generation function
export const getEliteProspectsStatsUrl = (
  leagueSlug: string,
  season: string
) => {
  return `https://www.eliteprospects.com/league/${leagueSlug}/stats/${season}`;
};

export default ScoringLeadersTable;
