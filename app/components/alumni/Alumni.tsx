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
    <div className="bg-white  flex flex-col rounded-lg py-6 mt-4 w-[768px]">
      {/* Search Field */}
      <input
        type="text"
        placeholder=""
        className="w-full border rounded-lg mb-4 h-[36px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Results */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

            {/* Men/Women Tabs */}
            <div className="flex h-[48px] px-[10px] py-[12px] justify-center items-center font-montserrat font-semibold">
        <button
          className={`flex items-center justify-center w-1/2 px-4 py-2 text-[14px] leading-[18px]${
            activeGenderTab === "men"
              ? "bg-white text-[#010A0E] border-b-2 border-[#0D73A6]"
              : "bg-white text-[#010A0E] border-b-2 border-[#E7E7E7]"
          }`}
          onClick={() => setActiveGenderTab("men")}
        >
          MEN'S LEAGUE
        </button>
        <button
          className={`flex items-center justify-center w-1/2 px-4 py-2 text-[14px] leading-[18px]${
            activeGenderTab === "women"
              ? "bg-white text-[#010A0E] border-b-2 border-[#0D73A6]"
              : "bg-white text-[#010A0E] border-b-2 border-[#E7E7E7]"
          }`}
          onClick={() => setActiveGenderTab("women")}
        >
          WOMEN'S LEAGUE
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
