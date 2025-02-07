import React from "react";
import { AlumniPlayer } from "@/app/types/player";
import Link from "../common/style/Link";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,PaginationControls, PoweredBy } from "@/app/components/common/style";
import ToggleTeamList from "./ToggleTeamList";


interface PlayerTableProps {
  players: AlumniPlayer[];
  genderFilter: "men" | "women" | "all";
  pageSize?: number; // default number of players per page, e.g., 15

  // color overrides
  headerBgColor?: string;
  headerTextColor?: string;
  tableBgColor?: string;
  tableTextColor?: string;
  oddRowColor?: string;
  evenRowColor?: string;
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  genderFilter,
  pageSize = 15,
  headerBgColor = "#052D41",
  headerTextColor = "#ffffff",
  tableBgColor = "#ffffff",
  tableTextColor = "#000000",
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

  return (
    <div>
      {/* Table + Scroll Container */}
      <TableContainer>
        <Table tableBgColor={tableBgColor} tableTextColor={tableTextColor}>
          <TableHead bgColor={headerBgColor} textColor={headerTextColor}>
            <TableRow>
              <TableCell
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("name")}
              >
                NAME{" "}
                {sortColumn === "name" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : sortDirection === "desc"
                    ? "↓"
                    : "-")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("birthYear")}
              >
                BY{" "}
                {sortColumn === "birthYear" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : sortDirection === "desc"
                    ? "↓"
                    : "-")}
              </TableCell>
              <TableCell
                isHeader
                align="center"
                className="font-bold"
                onClick={() => handleSort("draftPick")}
              >
                NHL DP{" "}
                {sortColumn === "draftPick" &&
                  (sortDirection === "asc"
                    ? "↑"
                    : sortDirection === "desc"
                    ? "↓"
                    : "-")}
              </TableCell>
              <TableCell isHeader align="center" className="font-bold">
                JUNIOR
              </TableCell>
              <TableCell isHeader align="center" className="font-bold">
                COLLEGE
              </TableCell>
              <TableCell isHeader align="center" className="font-bold">
                PROFESSIONAL
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
                  <TableCell align="center">
                    <Link
                      href={`https://www.eliteprospects.com/player/${encodeURIComponent(
                        player?.id || ""
                      )}/${encodeURIComponent(fullName)}`}
                    >
                      <span className="block font-medium text-blue-600">
                        {firstName || "Unknown"}
                      </span>
                      <span className="block text-blue-600">
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
                        {"Round " + player.draftPick.year} {player.draftPick.round} {"Overall " + player.draftPick.overall}
                        <br />
                        By {player.draftPick.team.name}
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
                    <ToggleTeamList teams={professionalTeams} />
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
