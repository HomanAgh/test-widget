import React, { useState } from "react";
import PlayerTable from "./PlayerTable";
import { useFetchTournamentPlayers } from "./hooks/useFetchTournamentPlayers";
import { RxMagnifyingGlass } from "react-icons/rx";

interface TournamentAlumniProps {
  selectedTournaments?: string[];
  selectedLeagues?: string[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

const TournamentAlumni: React.FC<TournamentAlumniProps> = ({
  selectedTournaments = [],
  selectedLeagues = [],
  customColors = {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#000000",
  },
}) => {
  const [activeGenderTab, setActiveGenderTab] = useState<
    "men" | "women" | "all"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { results, loading, error } = useFetchTournamentPlayers(
    selectedTournaments,
    selectedLeagues.length > 0 ? selectedLeagues.join(",") : null
  );

  console.log("TournamentAlumni - Selected tournaments:", selectedTournaments);
  console.log("TournamentAlumni - Selected leagues:", selectedLeagues);
  console.log("TournamentAlumni - Results:", results);

  // Filter players based on search query
  const filteredPlayers = results.filter((player) => {
    const nameMatch = player.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const teamMatch = player.teams.some((team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return nameMatch || teamMatch;
  });

  // Filter players based on gender
  const genderFilteredPlayers = filteredPlayers.filter((player) => {
    if (activeGenderTab === "all") return true;
    if (activeGenderTab === "men" && player.gender === "MALE") return true;
    if (activeGenderTab === "women" && player.gender === "FEMALE") return true;
    return false;
  });

  return (
    <div
      className="p-4 rounded-lg"
      style={{ backgroundColor: customColors.backgroundColor }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2
          className="text-xl font-bold mb-2 md:mb-0"
          style={{ color: customColors.headerTextColor }}
        >
          Tournament Alumni
        </h2>

        <div className="flex items-center space-x-2">
          <div className="flex">
            <button
              className={`px-3 py-1 rounded-l-md ${
                activeGenderTab === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveGenderTab("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 ${
                activeGenderTab === "men"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveGenderTab("men")}
            >
              Men
            </button>
            <button
              className={`px-3 py-1 rounded-r-md ${
                activeGenderTab === "women"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => setActiveGenderTab("women")}
            >
              Women
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search players..."
              className="pl-8 pr-4 py-1 border rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <RxMagnifyingGlass className="absolute left-2 top-2 text-gray-400" />
          </div>
        </div>
      </div>

      {selectedTournaments.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 rounded-md">
          <p style={{ color: customColors.textColor }}>
            Showing players who participated in:
            <span className="font-semibold">
              {" "}
              {selectedTournaments.join(", ")}
            </span>
            {selectedLeagues.length > 0 && (
              <>
                <span> and also played in: </span>
                <span className="font-semibold">
                  {selectedLeagues.join(", ")}
                </span>
              </>
            )}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div
          className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
          role="alert"
        >
          <p>{error}</p>
        </div>
      ) : genderFilteredPlayers.length === 0 ? (
        <div
          className="p-4 text-center"
          style={{ color: customColors.textColor }}
        >
          {searchQuery
            ? "No players found matching your search criteria."
            : selectedTournaments.length === 0
            ? "Please select at least one tournament to see players."
            : "No players found matching the selected criteria."}
        </div>
      ) : (
        <PlayerTable
          players={genderFilteredPlayers}
          genderFilter={activeGenderTab}
          headerBgColor={customColors.backgroundColor}
          headerTextColor={customColors.headerTextColor}
          tableBgColor={customColors.tableBackgroundColor}
          tableTextColor={customColors.textColor}
          nameTextColor={customColors.nameTextColor}
        />
      )}
    </div>
  );
};

export default TournamentAlumni;
