"use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "./PlayerTable";
import { useFetchTournamentPlayers } from "../../hooks/useFetchTournamentPlayers";
import { RxMagnifyingGlass } from "react-icons/rx";
import { ColumnOptions } from "./ColumnSelector";

type GenderParam = "male" | "female" | null;

interface AlumniTournamentProps {
  selectedTournaments?: string[];
  selectedLeagues?: string[];
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
    headerTextColor?: string;
    nameTextColor?: string;
  };
  selectedLeagueCategories?: {
    junior: boolean;
    college: boolean;
    professional: boolean;
  };
  selectedColumns?: ColumnOptions;
  onLoadingChange?: (
    loading: boolean,
    currentLeague?: string | null,
    progress?: { current: number; total: number }
  ) => void;
}

const AlumniTournament: React.FC<AlumniTournamentProps> = ({
  selectedTournaments = [],
  selectedLeagues = [],
  customColors = {
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    headerTextColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  },
  selectedLeagueCategories = {
    junior: true,
    college: true,
    professional: true,
  },
  selectedColumns = {
    name: true, // Always true
    birthYear: true,
    draftPick: true,
    tournamentTeam: true,
    tournamentSeason: true,
    juniorTeams: true,
    collegeTeams: true,
    proTeams: true,
  },
  onLoadingChange,
}) => {
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">(
    "men"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [resetPagination, setResetPagination] = useState(Date.now());

  const genderParam: GenderParam = null;

  const { results, loading, error, currentLeague, progress } =
    useFetchTournamentPlayers(
      selectedTournaments,
      selectedLeagues, // Now passing array directly
      genderParam
    );

  // Notify parent component of loading state changes
  React.useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loading, currentLeague, progress);
    }
  }, [loading, currentLeague, progress, onLoadingChange]);

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
        <div className="relative w-full px-4">
          <input
            type="text"
            className="w-full border rounded-lg h-[36px] pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search player"
          />
          <RxMagnifyingGlass className="absolute left-7 top-1/2 transform -translate-y-1/2 text-black w-[20px] h-[20px]" />
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="pt-3 px-4">
            <p className="text-red-600 font-montserrat font-semibold">
              {error}
            </p>
          </div>
        )}
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
        selectedColumns={selectedColumns}
      />
    </div>
  );
};

export default AlumniTournament;
