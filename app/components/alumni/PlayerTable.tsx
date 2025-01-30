import React from "react";
import { AlumniPlayer } from "@/app/types/player";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import Link from "../common/style/Link";

import {FaChevronLeft, FaChevronRight} from "react-icons/fa";

interface PlayerTableProps {
  players: AlumniPlayer[];
  teamColors?: string[];
  genderFilter: "men" | "women" | "all";
  pageSize?: number; // default number of players per page, e.g., 50
}

const PlayerTable: React.FC<PlayerTableProps> = ({
  players,
  teamColors = [],
  genderFilter,
  pageSize = 15,
}) => {
  const [sortColumn, setSortColumn] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | "none">("none");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [goToPageInput, setGoToPageInput] = React.useState<string>("");

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
    return players; // "all"
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
          sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
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
          const extractOverall = (draftPick: string | undefined) => {
            if (!draftPick) return Number.MAX_SAFE_INTEGER;
            const match = draftPick.match(/Overall\s+(\d+)/i);
            return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
          };
          return sortDirection === "asc"
            ? extractOverall(a.draftPick) - extractOverall(b.draftPick)
            : extractOverall(b.draftPick) - extractOverall(a.draftPick);
        });
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredPlayers, sortColumn, sortDirection]);

  // Pagination logic
  const totalPlayers = sortedPlayers.length;
  const totalPages = Math.ceil(totalPlayers / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePlayers = sortedPlayers.slice(startIndex, endIndex);

  const handleGoToPage = () => {
    const page =  parseInt(goToPageInput, 10);
    if(page >= 1 && page <= totalPages){
      setCurrentPage(page - 1);
      setGoToPageInput("");
    }
  }

  // Render sort symbol
  function renderSortSymbol(column: string) {
    if (sortColumn !== column) return "";
    if (sortDirection === "asc") return " ↑";
    if (sortDirection === "desc") return " ↓";
    return " -";
  }

  return (
    <div
      className="overflow-x-auto bg-white shadow-lg rounded-lg"
      style={{
        padding: "1rem",
        backgroundColor: teamColors[2] || "white", // Table background from teamColors
      }}
    >
      <div
        className=" rounded-lg overflow-hidden shadow-lg border border-customGrayMedium"
        style={{
          backgroundColor: teamColors[2] || "white", // Table background from teamColors
        }}
      >
        <table
          className="min-w-full table-auto border-collapse max-h-[828px]"
          style={{
            backgroundColor: teamColors[0] || "white", // Row background from teamColors
            color: teamColors[1] || "black", // Text color from teamColors
          }}
        >
          <thead className="bg-[#052D41] text-white pr-[12px] pl-[12px]">
            <tr className="rounded-t-lg">
              <th
                className="py-2 px-4 text-center font-bold whitespace-nowrap rounded-tl-lg"
                onClick={() => handleSort("name")}
              >
                NAME {renderSortSymbol("name")}
              </th>
              <th
                className="py-2 px-4 text-center font-bold whitespace-nowrap"
                onClick={() => handleSort("birthYear")}
              >
                BY {renderSortSymbol("birthYear")}
              </th>
              <th
                className="py-2 px-4 text-center font-bold whitespace-nowrap"
                onClick={() => handleSort("draftPick")}
              >
                DP {renderSortSymbol("draftPick")}
              </th>
              <th className="py-2 px-4 text-center font-bold whitespace-nowrap">JUNIOR</th>
              <th className="py-2 px-4 text-center font-bold whitespace-nowrap">COLLEGE</th>
              <th className="py-2 px-4 text-center font-bold whitespace-nowrap rounded-tr-lg">
                PROFESSIONAL
              </th>
            </tr>
          </thead>
          <tbody className=" pl-[12px] pr-[12px] text-[14px]">
            {pagePlayers.map((player) => {
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

              return (
                <tr
                  key={player.id}
                  className="h-[56px] odd:bg-gray-100 even:bg-white font-semibold text-sm leading-[21px]" 
                  style={{
                    /* backgroundColor: teamColors[0] || "white",  */
                    color: teamColors[1] || "black", // Text color from teamColors
                  }}
                >
                  <td align="center">
                    <Link href={`https://www.eliteprospects.com/player/${player.id}/${player.name}`}>
                      {player.name}
                    </Link>
                  </td>
                  <td align="center">{player.birthYear ?? "N/A"}</td>
                  <td align="center">{player.draftPick ?? "N/A"}</td>
                  <td align="center">
                    {juniorTeams.map((t) => t.name).join(", ") || "N/A"}
                  </td>
                  <td align="center">
                    {collegeTeams.map((t) => t.name).join(", ") || "N/A"}
                  </td>
                  <td align="center">
                    {professionalTeams.map((t) => t.name).join(", ") || "N/A"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>



      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4">
        {/* Left: Pagination Controls */}
        <div className="flex items-center space-x-4">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
            className=""
          >
            <FaChevronLeft
              className="w-[6px] h-[10px] top-[5px] bottom-[7px] text-black"
            />
          </button>

          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`w-[32px] h-[32px] border-[1px] rounded-[8px] gap-2.5 border-green-600 ${
                  currentPage === index
                    ? "bg-green-600 text-white font-sans"
                    : "bg-customGray text-blue-950 font-sans"
                }`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
            className=""
          >
            <FaChevronRight
              className="w-[6px] h-[10px] top-[5px] bottom-[7px] text-black"
            />
          </button>
        </div>

        {/* Right: Go To Page */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-sans text-customGrayDark">Go to page</span>
          <input
            value={goToPageInput}
            onChange={(e) => setGoToPageInput(e.target.value)}
            className="border p-1 w-[38px] h-[32px] gap-[8px] text-center rounded placeholder-blue-950"
            placeholder="#"
            min={1}
            max={totalPages}
          />
          <button
            onClick={handleGoToPage}
            className="text-[16px] font-bold px-[12px] py-[4px] gap-[4px] bg-green-600 text-white rounded-lg"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;




