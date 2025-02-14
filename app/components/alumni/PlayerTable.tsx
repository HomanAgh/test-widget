import React from "react";
import { AlumniPlayer } from "@/app/types/player";
import Link from "../common/style/Link";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,PaginationControls, PoweredBy } from "@/app/components/common/style";
import ToggleTeamList from "./ToggleTeamList";
import Tooltip from "../common/Tooltip";


interface PlayerTableProps {
  players: AlumniPlayer[];
  genderFilter: "men" | "women" | "all";
  pageSize?: number; // default number of players per page, e.g., 15

  // color overrides
  headerBgColor?: string;
  headerTextColor?: string;
  tableBgColor?: string;
  tableTextColor?: string;
  nameTextColor?: string;
  oddRowColor?: string;
  evenRowColor?: string;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
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
}) => {
  const [sortColumn, setSortColumn] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | "none">("none");
  const [currentPage, setCurrentPage] = React.useState(0);

  // Sorting logic
  const handleSort = (column: string) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
      return;
    }
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortDirection("none");
      setSortColumn("");
    } else {
      setSortDirection("asc");
      setSortColumn(column);
    }
  };

  // Filter players by gender
  const filteredPlayers = React.useMemo(() => {
    if (genderFilter === "men") {
      return players.filter((p) => p.gender === "male");
    } else if (genderFilter === "women") {
      return players.filter((p) => p.gender === "female");
    }
    return players;
  }, [players, genderFilter]);

  // Sorting logic
  const sortedPlayers = React.useMemo(() => {
    if (sortDirection === "none") {
      return filteredPlayers;
    }
    const sorted = [...filteredPlayers];
    switch (sortColumn) {
      case "name":
        sorted.sort((a, b) =>
          sortDirection === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
        );
        break;
      case "birthYear":
        sorted.sort((a, b) =>
          sortDirection === "asc"
            ? (a.birthYear || 0) - (b.birthYear || 0)
            : (b.birthYear || 0) - (a.birthYear || 0)
        );
        break;
        case "draftPick":
          sorted.sort((a, b) => {
            // If either player lacks a draftPick or 'overall', set to a big number so it sorts last
            const overallA = a.draftPick?.overall ?? Number.MAX_SAFE_INTEGER;
            const overallB = b.draftPick?.overall ?? Number.MAX_SAFE_INTEGER;
            return sortDirection === "asc"
              ? overallA - overallB
              : overallB - overallA;
          });
          break;        
        default:
        break;
    }
    return sorted;
  }, [filteredPlayers, sortColumn, sortDirection]);

  // Pagination logic
  const totalPlayers = sortedPlayers.length;
  const totalPages = Math.max(1, Math.ceil(totalPlayers / pageSize));
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePlayers = sortedPlayers.slice(startIndex, endIndex);

  // Decide if tableBgColor is truly "custom" or not
  const isCustomColor =
    tableBgColor.toLowerCase() !== "#ffffff" && tableBgColor.toLowerCase() !== "#fff";
  
  const renderSortArrow = (column: string) => {
    if (sortColumn !== column) return "-";
    if (sortDirection === "asc") return "↑";
    if (sortDirection === "desc") return "↓";
    return "-";
  };

  return (
    <div>
      {/* Table + Scroll Container */}
      <TableContainer>
        <Table tableBgColor={tableBgColor} tableTextColor={tableTextColor}>
          <TableHead bgColor={headerBgColor} textColor={headerTextColor}>
            <TableRow>
              <TableCell
                isHeader
                align="left"
                className="font-bold"
                onClick={() => handleSort("name")}
              >
                NAME {renderSortArrow("name")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("birthYear")}
              >
                BY {renderSortArrow("birthYear")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("draftPick")}
              >
                NHL DP {renderSortArrow("draftPick")}
              </TableCell>
              <TableCell 
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("junior")}
              >
                JUNIOR {renderSortArrow("junior")}
              </TableCell>
              <TableCell 
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("college")}
              >
                COLLEGE {renderSortArrow("college")}
              </TableCell>
              <TableCell 
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("professional")}
              >
                PRO {renderSortArrow("professional")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pagePlayers.map((player, index) => {

              const rowBackground = isCustomColor
                ? tableBgColor
                : index % 2 === 0
                ? evenRowColor
                : oddRowColor;

              const juniorTeams =
                player.teams?.filter((t) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("junior")
                ) || [];
              const collegeTeams =
                player.teams?.filter((t) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("college")
                ) || [];
              const professionalTeams =
                player.teams?.filter((t) =>
                  (t.leagueLevel ?? "").toLowerCase().includes("professional")
                ) || [];

              const fullName = player?.name || "";
              const [firstName, ...rest] = fullName.split(" ");
              const lastName = rest.join(" ");

              return (
                <TableRow key={player.id} bgColor={rowBackground}>
                  <TableCell align="center" style={{ color: nameTextColor }}>
                    <Link
                      href={`https://www.eliteprospects.com/player/${encodeURIComponent(
                        player?.id || ""
                      )}/${encodeURIComponent(fullName)}`}
                    >
                      <span className="block font-medium text-left">
                        {firstName || "Unknown"}
                      </span>
                      <span className="block text-left">
                        {lastName}
                        {player?.position ? ` (${player.position})` : ""}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {player.birthYear ?? "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {player.draftPick && player.draftPick.team ? (
                      <>
                        <div>
                          {player.draftPick.team.logo ? (
                            <Tooltip 
                              tooltip={`${player.draftPick.year} round ${player.draftPick.round} #${player.draftPick.overall} overall\nby ${player.draftPick.team.name}`}>
                              <img 
                                src={player.draftPick.team.logo} 
                                alt={player.draftPick.team.name} 
                                width={20} 
                                height={20} 
                                style={{ marginRight: "4px" }}
                              />
                            </Tooltip>
                          ) : null}
                          {"#" + player.draftPick.overall} 
                        </div>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <ToggleTeamList teams={juniorTeams} />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleTeamList teams={collegeTeams} />
                  </TableCell>
                  <TableCell align="center">
                    <ToggleTeamList teams= { professionalTeams} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4 w-full">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: React.SetStateAction<number>) => setCurrentPage(page)}
        />
      </div>

      {/* Powered By & Legend */}
      <div className="flex flex-col items-center justify-center mt-4">
        <PoweredBy/>
        <div className="flex justify-center items-center text-gray-600 mt-2 text-[12px] font-montserrat">
          <span className="font-semibold">Legend: </span>
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
