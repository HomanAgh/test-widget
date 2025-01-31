"use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "./PlayerTable";
import { SelectedTeam } from "./TeamSearchBar";
import { useFetchPlayers } from "./hooks/useFetchPlayers";

type GenderParam = "male" | "female" | null;

interface AlumniProps {
  selectedTeams?: SelectedTeam[];
  selectedLeagues?: string[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
  };
  includeYouth?: boolean; 
}

const Alumni: React.FC<AlumniProps> = ({
  selectedTeams = [],
  selectedLeagues = [],
  customColors = {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
  },
  includeYouth = false,
}) => {
  // ---- Filters & state ----
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");
  const [searchQuery, setSearchQuery] = useState("");

  // ---- Prepare IDs for player fetching ----
  const selectedTeamIds = useMemo(
    () => selectedTeams.map((t) => t.id),
    [selectedTeams]
  );
  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0]?.name : null;
  const genderParam: GenderParam = null;

  const { results, loading, error } = useFetchPlayers(
    selectedTeamIds,
    "customLeague",
    selectedLeagues.join(","), 
    includeYouth,
    youthTeam,
    genderParam
  );

  // ---- Filter by gender ----
  const filteredPlayers = useMemo(() => {
    return results.filter((player) =>
      activeGenderTab === "men"
        ? player.gender === "male"
        : player.gender === "female"
    );
  }, [results, activeGenderTab]);

  // ---- Filter by search query ----
  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return filteredPlayers;
    return filteredPlayers.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredPlayers, searchQuery]);

  // The final colors come from props.customColors
  const finalColors = customColors;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      {/* Search Field */}
      <input
        type="text"
        placeholder="Search players..."
        className="border p-2 mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Results */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

            {/* Men/Women Tabs */}
            <div className="flex justify-center space-x-4 my-6">
        <button
          className={`px-4 py-2 border rounded ${
            activeGenderTab === "men"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600"
          }`}
          onClick={() => setActiveGenderTab("men")}
        >
          Men
        </button>
        <button
          className={`px-4 py-2 border rounded ${
            activeGenderTab === "women"
              ? "bg-blue-600 text-white"
              : "bg-white text-blue-600"
          }`}
          onClick={() => setActiveGenderTab("women")}
        >
          Women
        </button>
      </div>

      {/* Pass color array to PlayerTable */}
      <PlayerTable
        players={searchedPlayers}
        genderFilter="all"
        teamColors={[
          finalColors.backgroundColor,
          finalColors.textColor,
          finalColors.tableBackgroundColor,
        ]}
      />
    </div>
  );
};

export default Alumni;
