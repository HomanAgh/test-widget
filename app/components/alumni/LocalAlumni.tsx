/* "use client";
import React from "react";
import PlayerTable from "./PlayerTable"; 
// or wherever you keep the table logic from your old <Alumni> code

interface AlumniLocalProps {
  players: any[]; // the final intersection array
  customColors: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

export default function AlumniLocal({
  players,
  customColors
}: AlumniLocalProps) {
  // Reuse the same <PlayerTable> or layout your old <Alumni> used:
  // That table shows columns for birth year, draft picks, etc.

  return (
    <div className="bg-white flex flex-col rounded-lg py-6 mt-4">

      <PlayerTable
        players={players}
        genderFilter="all"
        headerBgColor={customColors.backgroundColor}
        headerTextColor={customColors.headerTextColor}
        tableBgColor={customColors.tableBackgroundColor}
        tableTextColor={customColors.textColor}
        nameTextColor={customColors.nameTextColor}
        // any other props your table requires (like pageSize, sorting, etc.)
      />
    </div>
  );
}
 */

"use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "./PlayerTable"; // the same PlayerTable you used in old <Alumni>
import { RxMagnifyingGlass } from "react-icons/rx";

interface LocalAlumniProps {
  players: any[];  // final intersection array from parent
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
}

export default function LocalAlumni({
  players = [],
  customColors = {
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#000000",
  },
}: LocalAlumniProps) {
  // This replicates the same men/women tab logic
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter by men/women
  const filteredByGender = useMemo(() => {
    return activeGenderTab === "men"
      ? players.filter((p) => p.gender === "male")
      : players.filter((p) => p.gender === "female");
  }, [players, activeGenderTab]);

  // Search box filter
  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return filteredByGender;
    const q = searchQuery.toLowerCase();
    return filteredByGender.filter((p) => p.name.toLowerCase().includes(q));
  }, [filteredByGender, searchQuery]);

  return (
    <div className="bg-white flex flex-col rounded-lg py-6 mt-4">
      {/* The same search box code as old <Alumni> */}
      <div className="bg-white flex flex-col rounded-lg py-6 mt-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full border rounded-lg h-[36px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player"
          />
          <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-[20px] h-[20px]" />
        </div>
      </div>

      {/* Men/Women Tabs */}
      <div className="flex h-[48px] px-[10px] py-[12px] justify-center items-center font-montserrat font-semibold pb-[32px] pt-[32px]">
        <button
          className={`flex items-center justify-center w-1/2 px-4 py-2 text-[14px] leading-[18px]${
            activeGenderTab === "men"
              ? "bg-white text-[#010A0E] border-b-2 border-[#0D73A6]"
              : "bg-white text-[#010A0E] border-b-2 border-[#E7E7E7]"
          }`}
          onClick={() => setActiveGenderTab("men")}
        >
          MEN&apos;S LEAGUE
        </button>
        <button
          className={`flex items-center justify-center w-1/2 px-4 py-2 text-[14px] leading-[18px]${
            activeGenderTab === "women"
              ? "bg-white text-[#010A0E] border-b-2 border-[#0D73A6]"
              : "bg-white text-[#010A0E] border-b-2 border-[#E7E7E7]"
          }`}
          onClick={() => setActiveGenderTab("women")}
        >
          WOMEN&apos;S LEAGUE
        </button>
      </div>

      {/* The same <PlayerTable> from old <Alumni>, passing searchedPlayers */}
      <PlayerTable
        players={searchedPlayers}
        genderFilter="all" // or “men” if you want to apply the tab logic differently
        headerBgColor={customColors.backgroundColor}
        headerTextColor={customColors.headerTextColor}
        tableBgColor={customColors.tableBackgroundColor}
        tableTextColor={customColors.textColor}
        nameTextColor={customColors.nameTextColor}
        isWomenLeague={activeGenderTab === "women"}
      />
    </div>
  );
}
