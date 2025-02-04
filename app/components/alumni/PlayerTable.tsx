import React from "react";
import { AlumniPlayer } from "@/app/types/player";
import Link from "../common/style/Link";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PlayerTableProps {
  players: AlumniPlayer[];
  genderFilter: "men" | "women" | "all";
  pageSize?: number; // default number of players per page, e.g., 15
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
  const [goToPageInput, setGoToPageInput] = React.useState<string>("");

  // Handle table sorting
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
  const totalPages = Math.max(1, Math.ceil(totalPlayers / pageSize));
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const pagePlayers = sortedPlayers.slice(startIndex, endIndex);

  // Handle go to page
  const handleGoToPage = () => {
    const page = parseInt(goToPageInput, 10);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page - 1);
      setGoToPageInput("");
    }
  };

  // Decide if tableBgColor is truly "custom" or not
  const isCustomColor =
    tableBgColor.toLowerCase() !== "#ffffff" && tableBgColor.toLowerCase() !== "#fff";

  return (
    <div
      className="bg-white rounded-lg w-full"
      style={{
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x",
      }}
    >
      {/* Table Wrapper for horizontal scroll */}
      <div className="overflow-x-auto rounded-lg overflow-hidden  border border-customGrayMedium">
        <table
          className="min-w-[718px] table-auto border-collapse"
          style={{
            backgroundColor: tableBgColor,
            color: tableTextColor,
          }}
        >
          <thead
            className="pr-[12px] pl-[12px] font-montserrat"
            style={{
              backgroundColor: headerBgColor,
              color: headerTextColor,
            }}
          >
            <tr className="rounded-t-lg">
              <th
                className="py-2 px-4 text-center font-bold whitespace-nowrap rounded-tl-lg cursor-pointer"
                onClick={() => handleSort("name")}
              >
                NAME{" "}
                {sortColumn === "name" &&
                  (sortDirection === "asc"
                    ? " ↑"
                    : sortDirection === "desc"
                    ? " ↓"
                    : " -")}
              </th>
              <th
                className="py-2 px-4 text-center font-bold whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("birthYear")}
              >
                BY{" "}
                {sortColumn === "birthYear" &&
                  (sortDirection === "asc"
                    ? " ↑"
                    : sortDirection === "desc"
                    ? " ↓"
                    : " -")}
              </th>
              <th
                className="py-2 px-4 text-center font-bold whitespace-nowrap cursor-pointer"
                onClick={() => handleSort("draftPick")}
              >
                DP{" "}
                {sortColumn === "draftPick" &&
                  (sortDirection === "asc"
                    ? " ↑"
                    : sortDirection === "desc"
                    ? " ↓"
                    : " -")}
              </th>
              <th className="py-2 px-4 text-center font-bold whitespace-nowrap">
                JUNIOR
              </th>
              <th className="py-2 px-4 text-center font-bold whitespace-nowrap">
                COLLEGE
              </th>
              <th className="py-2 px-4 text-center font-bold whitespace-nowrap rounded-tr-lg">
                PROFESSIONAL
              </th>
            </tr>
          </thead>

          <tbody className="pl-[12px] pr-[12px] text-[14px]">
            {pagePlayers.map((player, index) => {
              // Decide the background color for this row
              const rowBackground = isCustomColor
                ? tableBgColor // user-chosen color
                : index % 2 === 0
                ? evenRowColor // even row
                : oddRowColor; // odd row

              // Player data
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
                <tr
                  key={player.id}
                  className="h-[56px] font-medium text-sm leading-[21px]"
                  style={{ backgroundColor: rowBackground }}
                >
                  <td className="flex justify-center">
                    <Link
                      href={`https://www.eliteprospects.com/player/${encodeURIComponent(
                        player?.id || ""
                      )}/${encodeURIComponent(fullName)}`}
                    >
                      <a className="block">
                        <span className="block font-medium text-blue-600">
                          {firstName || "Unknown"}
                        </span>
                        <span className="block text-blue-600">
                          {lastName}
                          {player?.position ? ` (${player.position})` : ""}
                        </span>
                      </a>
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
      <div className="flex flex-col md:flex-row items-center justify-between mt-4 w-full gap-2 md:gap-4">
        {/* Left side - Pagination Controls */}
        <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2">
          {/* Previous Button */}
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-2 disabled:opacity-50"
          >
            <FaChevronLeft className="w-3 h-3 md:w-4 md:h-4 text-black" />
          </button>

          {/* First Page */}
          <button
            className={`w-8 h-8 border rounded-lg ${
              currentPage === 0
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(0)}
          >
            1
          </button>

          {/* Ellipsis for larger page ranges */}
          {currentPage > 3 && <span className="text-gray-500">...</span>}

          {/* Dynamic Page Numbers */}
          {Array.from({ length: totalPages }, (_, index) => index)
            .filter((index) => {
              if (index === 0 || index === totalPages - 1) return false;
              if (currentPage < 3) return index >= 1 && index <= 4;
              if (currentPage > totalPages - 4) return index >= totalPages - 5;
              return index >= currentPage - 1 && index <= currentPage + 3;
            })
            .map((index) => (
              <button
                key={index}
                className={`w-8 h-8 border rounded-lg ${
                  currentPage === index
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}

          {/* Ellipsis before last page */}
          {currentPage < totalPages - 4 && (
            <span className="text-gray-500">...</span>
          )}

          {/* Last Page */}
          {totalPages > 1 && (
            <button
              className={`w-8 h-8 border rounded-lg ${
                currentPage === totalPages - 1
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage(totalPages - 1)}
            >
              {totalPages}
            </button>
          )}

          {/* Next Button */}
          <button
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-2 disabled:opacity-50"
          >
            <FaChevronRight className="w-3 h-3 md:w-4 md:h-4 text-black" />
          </button>
        </div>

        {/* Right Side - Go to Page Input */}
        <div className="flex items-center space-x-2 justify-center md:justify-start">
          <span className="text-sm md:text-base text-gray-700">Go to page</span>
          <input
            value={goToPageInput}
            onChange={(e) => setGoToPageInput(e.target.value)}
            className="border p-1 w-10 h-8 text-center rounded text-sm"
            placeholder="#"
            min={1}
            max={totalPages}
          />
          <button
            onClick={handleGoToPage}
            className="text-sm md:text-base font-bold px-3 py-1 bg-green-600 text-white rounded-lg"
          >
            Go
          </button>
        </div>
      </div>

      {/* "Powered by EliteProspects" Logo & Legend */}
      <div className="flex flex-col items-center justify-center mt-4">
        <div className="flex items-center space-x-1">
          <span className="text-[12px] font-montserrat font-medium text-black lowercase">
            powered by
          </span>
          <a
            href="https://www.eliteprospects.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="h-[14px] w-[97.075px] cursor-pointer"
              alt="EliteProspects"
              src={"/images/Group.svg"}
              width={97.075}
              height={14}
            />
          </a>
        </div>
        <div className="flex justify-center items-center text-gray-600 mt-2 text-[12px] font-montserrat">
          <span className="font-semibold">Legend: </span>
          <span className="mx-2 text-[#000] font-bold">BY</span>
          <span className="text-[#000]">Birth Year</span>
          <span className="mx-2 text-[#000] font-bold">NHL DP</span>
          <span className="text-[#000]">Draft Pick</span>
        </div>
      </div>
    </div>
  );
};

export default PlayerTable;
