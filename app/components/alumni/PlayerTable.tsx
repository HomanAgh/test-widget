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
import {
  sortTeamsByLeagueRankThenName,
  filterAndSortPlayers,
} from "./PlayerTableProcessor";

interface ExtendedPlayerTableProps extends PlayerTableProps {
  isWomenLeague?: boolean;
  resetPagination?: number;
  selectedLeagueCategories?: {
    junior: boolean;
    college: boolean;
    professional: boolean;
  };
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
  resetPagination,
  selectedLeagueCategories = {
    junior: true,
    college: true,
    professional: true,
  },
}) => {
  const [sortColumn, setSortColumn] = React.useState<
    | "name"
    | "position"
    | "status"
    | "birthYear"
    | "draftPick"
    | "draftYear"
    | "junior"
    | "college"
    | "pro"
    | ""
  >("draftPick");
  const [sortDirection, setSortDirection] = React.useState<
    "asc" | "desc" | "none"
  >("asc");
  const [showNameMenu, setShowNameMenu] = React.useState(false);
  const [showDraftMenu, setShowDraftMenu] = React.useState(false);

  const [pages, setPages] = React.useState<{ men: number; women: number }>({
    men: 0,
    women: 0,
  });
  const currentPage = isWomenLeague ? pages.women : pages.men;

  React.useEffect(() => {
    if (resetPagination) {
      setPages({ men: 0, women: 0 });
    }
  }, [resetPagination]);

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
    status?: string | null
  ) => {
    const isActive = status?.toLowerCase() === "active";
    const isRetired = status?.toLowerCase() === "retired";
    const isDeceased = status?.toLowerCase() === "deceased";
    const displayStatus = isRetired || isDeceased ? "[R]" : "";

    let contentForStatus: JSX.Element;
    if (isActive) {
      contentForStatus = <span></span>;
    } else if (isRetired || isDeceased) {
      contentForStatus = (
        <Tooltip
          tooltip={isDeceased ? "Player is Deceased" : "Player is Retired"}
          position="right"
        >
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

  const processedPlayers = React.useMemo(
    () =>
      filterAndSortPlayers(players, genderFilter, sortColumn, sortDirection),
    [players, genderFilter, sortColumn, sortDirection]
  );

  const totalPlayers = processedPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalPlayers / pageSize));
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePlayers = processedPlayers.slice(startIndex, endIndex);
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
                  className="absolute ml-1 px-2 rounded bg-gray-200 text-black cursor-pointer text-sm"
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
                  className="font-bold cursor-pointer relative"
                  onClick={() =>
                    handleSort(
                      sortColumn === "draftYear" ? "draftYear" : "draftPick"
                    )
                  }
                >
                  <span>
                    {sortColumn === "draftYear" ? "NHL DY" : "NHL DP"}
                  </span>{" "}
                  {renderSortArrow(
                    sortColumn === "draftYear" ? "draftYear" : "draftPick"
                  )}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDraftMenu((prev) => !prev);
                    }}
                    className="absolute ml-1 px-2 rounded bg-gray-200 text-black cursor-pointer text-sm"
                  >
                    +
                  </span>
                  {showDraftMenu && (
                    <div
                      className="absolute bg-white text-black border border-gray-300 rounded px-2 py-1 mt-1 z-10 text-sm"
                      style={{ minWidth: "150px", right: 0 }}
                    >
                      <div
                        className={`cursor-pointer hover:bg-gray-100 p-1 font-normal ${
                          sortColumn === "draftPick" ? "bg-blue-50" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortColumn("draftPick");
                          setSortDirection("asc");
                          setShowDraftMenu(false);
                        }}
                      >
                        Sort by Overall Pick
                      </div>
                      <div
                        className={`cursor-pointer hover:bg-gray-100 p-1 font-normal ${
                          sortColumn === "draftYear" ? "bg-blue-50" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSortColumn("draftYear");
                          setSortDirection("desc");
                          setShowDraftMenu(false);
                        }}
                      >
                        Sort by Draft Year
                      </div>
                    </div>
                  )}
                </TableCell>
              )}

              {/* Conditionally render JUNIOR column */}
              {selectedLeagueCategories.junior && (
                <TableCell
                  isHeader
                  align="center"
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("junior")}
                >
                  JUNIOR {renderSortArrow("junior")}
                </TableCell>
              )}

              {/* Conditionally render COLLEGE column */}
              {selectedLeagueCategories.college && (
                <TableCell
                  isHeader
                  align="center"
                  className="font-bold cursor-pointer"
                  onClick={() => handleSort("college")}
                >
                  COLLEGE {renderSortArrow("college")}
                </TableCell>
              )}

              {/* Conditionally render PRO column */}
              {!isWomenLeague && selectedLeagueCategories.professional && (
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
                (player.teams ?? []).filter((t: { leagueLevel?: string }) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("junior")
                )
              );
              const collegeTeams = sortTeamsByLeagueRankThenName(
                (player.teams ?? []).filter((t: { leagueLevel?: string }) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("college")
                )
              );
              const professionalTeams = sortTeamsByLeagueRankThenName(
                (player.teams ?? []).filter((t: { leagueLevel?: string }) =>
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
                              tooltip={`${player.draftPick.year} NHL Draft\nRound ${player.draftPick.round}, #${player.draftPick.overall} overall\nby ${player.draftPick.team.name}`}
                            >
                              <Image
                                src={player.draftPick.team.logo}
                                alt={player.draftPick.team.name}
                                width={20}
                                height={20}
                              />
                            </Tooltip>
                          )}
                          <Tooltip
                            tooltip={`${player.draftPick.year} NHL Draft\nRound ${player.draftPick.round}, #${player.draftPick.overall} overall\nby ${player.draftPick.team.name}`}
                          >
                            {sortColumn === "draftYear" ? (
                              <span className="text-sm">
                                {player.draftPick.year}
                              </span>
                            ) : (
                              <span>{"#" + player.draftPick.overall}</span>
                            )}
                          </Tooltip>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </TableCell>
                  )}

                  {/* Conditionally render JUNIOR cell */}
                  {selectedLeagueCategories.junior && (
                    <TableCell align="center">
                      <ToggleTeamList teams={juniorTeams} />
                    </TableCell>
                  )}

                  {/* Conditionally render COLLEGE cell */}
                  {selectedLeagueCategories.college && (
                    <TableCell align="center">
                      <ToggleTeamList teams={collegeTeams} />
                    </TableCell>
                  )}

                  {/* Conditionally render PRO cell only if not women's league */}
                  {!isWomenLeague && selectedLeagueCategories.professional && (
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
          <span className="mx-2 text-[#000] font-bold">NHL DY</span>
          <span className="text-[#000]">Draft year</span>
          <span className="mx-2 text-[#000] font-bold">R</span>
          <span className="text-[#000]">Retired</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;
