import React, { useState } from "react";
import { AlumniPlayer } from "@/app/types/player";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
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
  pageSize = 50,
}) => {
  const [sortColumn, setSortColumn] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc" | "none">("none");
  const [currentPage, setCurrentPage] = React.useState(0);
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
  // Added: Local state for dynamic color mapping
  const [colorMapping, setColorMapping] = useState([
    "backgroundColor",
    "textColor",
    "tableBackgroundColor",
  ]);
  // Added: Dynamically map colors based on the current mapping
  const mappedColors = {
    backgroundColor: teamColors[colorMapping.indexOf("backgroundColor")] || "white",
    textColor: teamColors[colorMapping.indexOf("textColor")] || "black",
    tableBackgroundColor: teamColors[colorMapping.indexOf("tableBackgroundColor")] || "white",
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
        backgroundColor: mappedColors.tableBackgroundColor, // Updated: Use dynamically mapped table background color
      }}
    >
      {/* Added: Dropdowns for color customization */}
      <div className="flex justify-between mb-4">
        {["Background Color", "Text Color", "Table Background"].map((label, index) => (
          <div key={index} className="flex items-center space-x-2">
            <label className="font-medium">{label}:</label>
            <select
              value={colorMapping[index]} // Bind dropdown to colorMapping state
              onChange={(e) => {
                const newMapping = [...colorMapping];
                newMapping[index] = e.target.value;
                setColorMapping(newMapping); // Update mapping dynamically
              }}
              className="border rounded p-1"
            >
              <option value="backgroundColor">1</option>
              <option value="textColor">2</option>
              <option value="tableBackgroundColor">3</option>
            </select>
          </div>
        ))}
      </div>
      <table
        className="min-w-full table-auto border-collapse"
        style={{
          backgroundColor: mappedColors.backgroundColor, // Updated: Use dynamically mapped row background
          color: mappedColors.textColor, // Updated: Use dynamically mapped text color
        }}
      >
        <thead className="bg-blue-700 text-white">
          <tr>
            <TableHeader align="center" onClick={() => handleSort("name")}>
              Player {renderSortSymbol("name")}
            </TableHeader>
            <TableHeader align="center" onClick={() => handleSort("birthYear")}>
              Birth Year {renderSortSymbol("birthYear")}
            </TableHeader>
            <TableHeader align="center" onClick={() => handleSort("draftPick")}>
              Draft Pick {renderSortSymbol("draftPick")}
            </TableHeader>
            <TableHeader align="center">Junior</TableHeader>
            <TableHeader align="center">College</TableHeader>
            <TableHeader align="center">Professional</TableHeader>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pagePlayers.map((player) => {
            const juniorTeams = player.teams?.filter((t) =>
              (t.leagueLevel ?? "").toLowerCase().includes("junior")
            ) || [];
            const collegeTeams = player.teams?.filter((t) =>
              (t.leagueLevel ?? "").toLowerCase().includes("college")
            ) || [];
            const professionalTeams = player.teams?.filter((t) =>
              (t.leagueLevel ?? "").toLowerCase().includes("professional")
            ) || [];
            return (
              <tr
                key={player.id}
                style={{
                  backgroundColor: mappedColors.backgroundColor, // Updated: Dynamically mapped row background
                  color: mappedColors.textColor, // Updated: Dynamically mapped text color
                }}
              >
                <Table align="center">{player.name}</Table>
                <Table align="center">{player.birthYear ?? "N/A"}</Table>
                <Table align="center">{player.draftPick ?? "N/A"}</Table>
                <Table align="center">
                  {juniorTeams.map((t) => t.name).join(", ") || "N/A"}
                </Table>
                <Table align="center">
                  {collegeTeams.map((t) => t.name).join(", ") || "N/A"}
                </Table>
                <Table align="center">
                  {professionalTeams.map((t) => t.name).join(", ") || "N/A"}
                </Table>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(0)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          First
        </button>
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          Next
        </button>
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(totalPages - 1)}
          className="px-4 py-2 bg-blue-700 text-white font-bold rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  );
};
export default PlayerTable;