"use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "./PlayerTable";
import { SelectedTeam } from "@/app/types/team";
import { useFetchPlayers } from "../../hooks/useFetchPlayers";
import { RxMagnifyingGlass } from "react-icons/rx";

type GenderParam = "male" | "female" | null;

interface AlumniProps {
  selectedTeams?: SelectedTeam[];
  selectedLeagues?: string[];
  selectedTournaments?: string[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  includeYouth?: boolean;
  selectedLeagueCategories?: {
    junior: boolean;
    college: boolean;
    professional: boolean;
  };
}

const Alumni: React.FC<AlumniProps> = ({
  selectedTeams = [],
  selectedLeagues = [],
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6"
  },
  includeYouth = false,
  selectedLeagueCategories = {
    junior: true,
    college: true,
    professional: true,
  },
}) => {
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">(
    "men"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [resetPagination, setResetPagination] = useState(Date.now());

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

  const filteredPlayers = useMemo(() => {
    return results.filter((player) =>
      activeGenderTab === "men"
        ? player.gender === "male"
        : player.gender === "female"
    );
  }, [results, activeGenderTab]);

  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return filteredPlayers;
    return filteredPlayers.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredPlayers, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setResetPagination(Date.now());
  };

  return (
    <div className="bg-white flex flex-col rounded-lg py-6 mt-4">
      <div className="bg-white flex flex-col rounded-lg py-6 mt-4">
        <div className="relative w-full">
          <input
            type="text"
            className="w-full border rounded-lg h-[36px] pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search player"
          />
          <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-[20px] h-[20px]" />
        </div>
        {loading && (
          <p className="flex justify-center pt-3 font-montserrat font-semibold">
            Loading...
          </p>
        )}
        {error && <p>{error}</p>}
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

      <PlayerTable
        players={searchedPlayers}
        genderFilter="all"
        headerBgColor={customColors.backgroundColor}
        headerTextColor={customColors.headerTextColor}
        tableBgColor={customColors.tableBackgroundColor}
        tableTextColor={customColors.textColor}
        nameTextColor={customColors.nameTextColor}
        isWomenLeague={activeGenderTab === "women"}
        resetPagination={resetPagination}
        selectedLeagueCategories={selectedLeagueCategories}

      />
    </div>
  );
};

export default Alumni;
