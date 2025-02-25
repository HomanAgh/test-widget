"use client";

import React from "react";
import { PlayerTableProps } from "@/app/types/alumni";
import Link from "../common/style/Link";
import {
  HiMiniChevronUpDown,
  HiMiniChevronUp,
  HiMiniChevronDown,
} from "react-icons/hi2";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  PaginationControls,
  PoweredBy,
} from "@/app/components/common/style";
import ToggleTeamList from "./ToggleTeamList";
import Tooltip from "../common/Tooltip";
import Image from "next/image";
import { leagueRankings } from "./LeagueSelection";

interface ExtendedPlayerTableProps extends PlayerTableProps {
  isWomenLeague?: boolean;
}

const PlayerTable: React.FC<ExtendedPlayerTableProps> = ({
  players,
  genderFilter,
  pageSize = 15,
  headerBgColor,
  headerTextColor = "#ffffff",
  tableBgColor = "#ffffff",
  tableTextColor = "#000000",
  nameTextColor = "#0D73A6",
  oddRowColor = "#F3F4F6",
  evenRowColor = "#ffffff",
  isWomenLeague = false, 
}) => {
  function sortTeamsByLeagueRankThenName(teams: any[]) {
  return [...teams].sort((a, b) => {
    const slugA = a.leagueSlug?.toLowerCase() ?? "";
    const slugB = b.leagueSlug?.toLowerCase() ?? "";
    const rankA = leagueRankings[slugA] ?? Number.MAX_SAFE_INTEGER;
    const rankB = leagueRankings[slugB] ?? Number.MAX_SAFE_INTEGER;

    // 1) If ranks differ, return the difference
    if (rankA !== rankB) {
      return rankA - rankB; 
    }

    // 2) If ranks are the same, tie-break alphabetically by team name
    const nameA = a.name ?? "";
    const nameB = b.name ?? "";
    return nameA.localeCompare(nameB);
  });
}


function getBestCategoryRankAndTeam(
  player: any,
  category: "junior" | "college" | "professional"
) {
  let bestRank = Number.MAX_SAFE_INTEGER;
  let bestTeamName = "";

  for (const team of player.teams ?? []) {
    // Only consider teams in the given category
    if ((team.leagueLevel ?? "").toLowerCase().includes(category)) {
      // Look up rank from leagueRankings
      const slug = team.leagueSlug?.toLowerCase() ?? "";
      const rank = leagueRankings[slug] ?? Number.MAX_SAFE_INTEGER;

      // If this team is better (lower) rank, update
      if (rank < bestRank) {
        bestRank = rank;
        bestTeamName = team.name ?? "";
      } else if (rank === bestRank) {
        // If there's a tie in rank, pick whichever team name is alphabetically first
        const currentName = team.name ?? "";
        if (currentName.localeCompare(bestTeamName) < 0) {
          bestTeamName = currentName;
        }
      }
    }
  }

  return { bestRank, bestTeamName };
}

  

  const [sortColumn, setSortColumn] = React.useState<
    "name" | "position" | "status" | "birthYear" | "draftPick" | "junior" | "college" | "pro" | ""
  >("name");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | "none">("asc");
  const [showNameMenu, setShowNameMenu] = React.useState(false);

  const [pages, setPages] = React.useState<{ men: number; women: number }>({
    men: 0,
    women: 0,
  });
  const currentPage = isWomenLeague ? pages.women : pages.men;

  const isInNameGroup = ["name", "position", "status"].includes(sortColumn);

  const nameGroupLabel = React.useMemo(() => {
    if (sortColumn === "position") return "POSITION";
    if (sortColumn === "status") return "STATUS";
    return "NAME";
  }, [sortColumn]);

  const handleSort = (col: string) => {
    if (col === "nameGroup") {
      if (isInNameGroup) {
        setSortDirection((prev) => {
          if (prev === "asc") return "desc";
          if (prev === "desc") return "none";
          return "asc";
        });
      } else {
        setSortColumn("name");
        setSortDirection("asc");
      }
      return;
    }
    if (sortColumn === col) {
      setSortDirection((prev) => {
        if (prev === "asc") return "desc";
        if (prev === "desc") return "none";
        return "asc";
      });
    } else {
      setSortColumn(col as any);
      setSortDirection("asc");
    }
  };

  const handlePickNameField = (field: "name" | "position" | "status") => {
    setSortColumn(field);
    setSortDirection("asc");
    setShowNameMenu(false);
  };

  const renderSortArrow = (col: string) => {
    if (col === "nameGroup") {
      if (!isInNameGroup)
        return <HiMiniChevronUpDown className="inline-block text-gray-300" />;
      if (sortDirection === "asc")
        return <HiMiniChevronDown className="inline-block text-gray-300" />;
      if (sortDirection === "desc")
        return <HiMiniChevronUp className="inline-block text-gray-300" />;
      return <HiMiniChevronUpDown className="inline-block text-gray-300" />;
    }

    if (sortColumn !== col)
      return <HiMiniChevronUpDown className="inline-block text-gray-300" />;
    if (sortDirection === "asc")
      return <HiMiniChevronDown className="inline-block text-gray-300" />;
    if (sortDirection === "desc")
      return <HiMiniChevronUp className="inline-block text-gray-300" />;

    return <HiMiniChevronUpDown className="inline-block text-gray-300" />;
  };

  const renderNameBlock = (
    firstName: string,
    lastName: string,
    position?: string | null,
    status?: string | null,
    teamName = ""
  ) => {
    const isActive = status?.toLowerCase() === "active";
    const isRetired = status?.toLowerCase() === "retired";
    const displayStatus = status ? `[${status.toUpperCase()}]` : "";

    let contentForStatus: JSX.Element;
    if (isActive) {
      contentForStatus = (
        <Tooltip tooltip={teamName ? `Player is active` : "Player is active"}>
          <span>{displayStatus}</span>
        </Tooltip>
      );
    } else if (isRetired) {
      contentForStatus = (
        <Tooltip tooltip="Player is Retired">
          <span>{displayStatus}</span>
        </Tooltip>
      );
    } else {
      contentForStatus = <span>{displayStatus}</span>;
    }

    switch (sortColumn) {
      case "name":
        return (
          <div>
            <div>
              {firstName} {lastName} {position ? `(${position})` : ""}
            </div>
            <div>{contentForStatus}</div>
          </div>
        );
      case "position":
        return (
          <div>
            <div>
              {position ? `(${position}) ` : ""}
              {firstName} {lastName}
            </div>
            <div>{contentForStatus}</div>
          </div>
        );
      case "status":
        return (
          <div>
            <div>{contentForStatus}</div>
            <div>
              {firstName} {lastName} {position ? `(${position})` : ""}
            </div>
          </div>
        );
      default:
        return (
          <div>
            <div>
              {firstName} {lastName} {position ? `(${position})` : ""}
            </div>
            <div>{contentForStatus}</div>
          </div>
        );
        
    }
  };

  const filteredPlayers = React.useMemo(() => {
    if (genderFilter === "men") {
      return players.filter((p) => p.gender === "male");
    } else if (genderFilter === "women") {
      return players.filter((p) => p.gender === "female");
    }
    return players;
  }, [players, genderFilter]);

  const sortedPlayers = React.useMemo(() => {
    if (sortDirection === "none" || !sortColumn) return filteredPlayers;
    const arr = [...filteredPlayers];

    switch (sortColumn) {
      case "name":
        arr.sort((a, b) =>
          sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
        break;
      case "position":
        const positionRank: Record<string, number> = {
          G: 0,
          D: 1,
          F: 2,
        };

        arr.sort((a, b) => {
          const posA = a.position
            ? positionRank[a.position.toUpperCase()] ?? 999
            : 999;
          const posB = b.position
            ? positionRank[b.position.toUpperCase()] ?? 999
            : 999;

          return sortDirection === "asc" ? posA - posB : posB - posA;
        });
        break;
      case "status":
        arr.sort((a, b) => {
          const sA = a.status ?? "";
          const sB = b.status ?? "";
          return sortDirection === "asc"
            ? sA.localeCompare(sB)
            : sB.localeCompare(sA);
        });
        break;
      case "birthYear":
        arr.sort((a, b) => {
          const A = a.birthYear ?? 0;
          const B = b.birthYear ?? 0;
          return sortDirection === "asc" ? A - B : B - A;
        });
        break;
      case "draftPick":
        arr.sort((a, b) => {
          const overallA = a.draftPick?.overall ?? Number.MAX_SAFE_INTEGER;
          const overallB = b.draftPick?.overall ?? Number.MAX_SAFE_INTEGER;
          return sortDirection === "asc"
            ? overallA - overallB
            : overallB - overallA;
        });
        break;
        case "junior": {
          arr.sort((a, b) => {
            const { bestRank: rankA, bestTeamName: nameA } = getBestCategoryRankAndTeam(a, "junior");
            const { bestRank: rankB, bestTeamName: nameB } = getBestCategoryRankAndTeam(b, "junior");
        
            if (rankA === rankB) {
              // Tie-break alphabetically by bestTeamName
              return sortDirection === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            } else {
              // Otherwise, sort by rank
              return sortDirection === "asc"
                ? rankA - rankB
                : rankB - rankA;
            }
          });
          break;
        }
        
    
        case "college": {
          arr.sort((a, b) => {
            const { bestRank: rankA, bestTeamName: nameA } = getBestCategoryRankAndTeam(a, "college");
            const { bestRank: rankB, bestTeamName: nameB } = getBestCategoryRankAndTeam(b, "college");
        
            if (rankA === rankB) {
              return sortDirection === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            } else {
              return sortDirection === "asc"
                ? rankA - rankB
                : rankB - rankA;
            }
          });
          break;
        }
        
        case "pro": {
          arr.sort((a, b) => {
            const { bestRank: rankA, bestTeamName: nameA } = getBestCategoryRankAndTeam(a, "professional");
            const { bestRank: rankB, bestTeamName: nameB } = getBestCategoryRankAndTeam(b, "professional");
        
            if (rankA === rankB) {
              return sortDirection === "asc"
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            } else {
              return sortDirection === "asc"
                ? rankA - rankB
                : rankB - rankA;
            }
          });
          break;
        }
        
    
      default:
        break;
    }
    return arr;
  }, [filteredPlayers, sortColumn, sortDirection]);

  const totalPlayers = sortedPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalPlayers / pageSize));
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePlayers = sortedPlayers.slice(startIndex, endIndex);
  const isCustomColor =
    tableBgColor.toLowerCase() !== "#ffffff" &&
    tableBgColor.toLowerCase() !== "#fff";

  return (
    <div className="relative">
      <TableContainer>
        <Table tableBgColor={tableBgColor} tableTextColor={tableTextColor}>
          <TableHead bgColor={headerBgColor} textColor={headerTextColor}>
            <TableRow>
              <TableCell
                isHeader
                align="left"
                className="font-bold cursor-pointer relative"
                onClick={() => handleSort("nameGroup")}
              >
                {nameGroupLabel} {renderSortArrow("nameGroup")}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowNameMenu((prev) => !prev);
                  }}
                  className="absolute right-2 px-2 rounded bg-gray-200 text-black cursor-pointer text-sm"
                >
                  +
                </span>
                {showNameMenu && (
                  <div
                    className="absolute bg-white text-black border border-gray-300 rounded px-2 py-1 mt-1 z-10 text-sm"
                    style={{ minWidth: "120px" }}
                  >
                    <div
                      className="cursor-pointer hover:bg-gray-100 p-1 font-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickNameField("name");
                      }}
                    >
                      Sort by Name
                    </div>
                    <div
                      className="cursor-pointer hover:bg-gray-100 p-1 font-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickNameField("position");
                      }}
                    >
                      Sort by Position
                    </div>
                    <div
                      className="cursor-pointer hover:bg-gray-100 p-1 font-normal"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickNameField("status");
                      }}
                    >
                      Sort by Status
                    </div>
                  </div>
                )}
              </TableCell>

              {/* Birth Year */}
              <TableCell
                isHeader
                align="center"
                className="font-bold cursor-pointer"
                onClick={() => handleSort("birthYear")}
              >
                BY {renderSortArrow("birthYear")}
              </TableCell>

              {/* Conditionally render NHL DP column */}
              {!isWomenLeague && (
                <TableCell
                  isHeader
                  align="center"
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("draftPick")}
                >
                  NHL DP {renderSortArrow("draftPick")}
                </TableCell>
              )}

              <TableCell
                isHeader
                align="center"
                className="font-bold cursor-pointer"
                onClick={() => handleSort("junior")}
              >
                JUNIOR {renderSortArrow("junior")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="font-bold cursor-pointer"
                onClick={() => handleSort("college")}
              >
                COLLEGE {renderSortArrow("college")}
              </TableCell>

              {/* Conditionally render PRO column */}
              {!isWomenLeague && (
                <TableCell
                  isHeader
                  align="center"
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("pro")}
                >
                  PRO {renderSortArrow("pro")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {pagePlayers.map((player, idx) => {
              const rowBackground = isCustomColor
                ? tableBgColor
                : idx % 2 === 0
                ? evenRowColor
                : oddRowColor;

              const juniorTeams = sortTeamsByLeagueRankThenName(
                (player.teams ?? []).filter((t) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("junior")
                )
              );
              const collegeTeams = sortTeamsByLeagueRankThenName(
                (player.teams ?? []).filter((t) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("college")
                )
              );
              const professionalTeams = sortTeamsByLeagueRankThenName(
                (player.teams ?? []).filter((t) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("professional")
                )
              );

              const fullName = player?.name || "";
              const [firstName, ...rest] = fullName.split(" ");
              const lastName = rest.join(" ");
              const pos = player?.position || null;
              const stat = player?.status || null;

              return (
                <TableRow key={player.id} bgColor={rowBackground}>
                  <TableCell align="center" style={{ color: nameTextColor }}>
                    <Link
                      href={`https://www.eliteprospects.com/player/${encodeURIComponent(
                        player?.id || ""
                      )}/${encodeURIComponent(fullName)}`}
                    >
                      <span className="block font-medium text-left">
                        {renderNameBlock(firstName, lastName, pos, stat)}
                      </span>
                    </Link>
                  </TableCell>

                  <TableCell align="center">
                    {player.birthYear ?? "-"}
                  </TableCell>

                  {/* Render NHL DP cell only if not women's league */}
                  {!isWomenLeague && (
                    <TableCell align="center">
                      {player.draftPick && player.draftPick.team ? (
                        <div className="flex items-center justify-center gap-1">
                          {player.draftPick.team.logo && (
                            <Tooltip
                              tooltip={`${player.draftPick.year} round ${player.draftPick.round} #${player.draftPick.overall} overall\nby ${player.draftPick.team.name}`}
                            >
                              <Image
                                src={player.draftPick.team.logo}
                                alt={player.draftPick.team.name}
                                width={20}
                                height={20}
                              />
                            </Tooltip>
                          )}
                          <span>{"#" + player.draftPick.overall}</span>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  )}

                  <TableCell align="center">
                    <ToggleTeamList teams={juniorTeams} />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleTeamList teams={collegeTeams} />
                  </TableCell>

                  {/* Render PRO cell only if not women's league */}
                  {!isWomenLeague && (
                    <TableCell align="center">
                      <ToggleTeamList teams={professionalTeams} />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="flex items-center justify-center mt-4 w-full">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) =>
            setPages((prev) =>
              isWomenLeague ? { ...prev, women: page } : { ...prev, men: page }
            )
          }
        />
      </div>

      <div className="flex flex-col items-center justify-center mt-4">
        <PoweredBy />
        <div className="flex justify-center items-center text-gray-600 mt-2 text-[12px] font-montserrat">
          <span className="font-semibold">Legend:</span>
          <span className="mx-2 text-[#000] font-bold">BY</span>
          <span className="text-[#000]">Birth year</span>
          <span className="mx-2 text-[#000] font-bold">NHL DP</span>
          <span className="text-[#000]">Draft pick</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;
