"use client";

import React, { useState } from "react";
import PlayerTable from "@/app/components/alumni/PlayerTable";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import TeamSearchBar, { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import HomeButton from "@/app/components/common/HomeButton";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import { useFetchPlayers } from "@/app/components/alumni/hooks/useFetchPlayers";
import TeamBackgroundColorSelector from "@/app/components/common/TeamBackgroundColorSelector";

const SearchPlayers: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [includeYouth, setIncludeYouth] = useState<boolean>(false);
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");

  // If men => "male", if women => "female"
  const genderParam = activeGenderTab === "men" ? "male" : "female";

  // Custom leagues from your hook (professional, junior, college)
  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  // Convert selectedTeams => number[]
  const selectedTeamIds = selectedTeams.map((t) => t.id);
  // For youth, we might just pick the first team's name as "youthTeam"
  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0].name : null;

  const {
    results,
    loading,
    error,
  } = useFetchPlayers(
    selectedTeamIds,
    "customLeague",
    selectedLeagues.join(","),
    includeYouth,
    youthTeam,
    genderParam
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <HomeButton />
        <h1 className="text-2xl font-bold text-center mb-6">Search Players</h1>

        <TeamSearchBar
          placeholder="Search for a team..."
          onSelect={(teamObj) => setSelectedTeams([teamObj])}
          onError={(err) => console.error(err)}
          selectedTeams={selectedTeams}
          onCheckedTeamsChange={setSelectedTeams}
        />

        <LeagueSelectionDropdown
          professionalLeagues={customLeagues}
          juniorLeagues={customJunLeagues}
          collegeLeagues={customCollegeLeagues}
          selectedLeagues={selectedLeagues}
          onChange={setSelectedLeagues}
        />

        <div className="flex items-center space-x-3 my-4">
          <label className="font-medium">Include Youth Team:</label>
          <input
            type="checkbox"
            checked={includeYouth}
            onChange={(e) => setIncludeYouth(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {selectedTeams.length > 0 && (
          <div className="my-6">
            <TeamBackgroundColorSelector
              teamName={selectedTeams[0].name}
              defaultEnabled={false}
              onTeamColorsChange={setTeamColors}
              onUseTeamColorChange={setUseTeamColor}
              enableText="Enable Team Colors"
              disableText="Disable Team Colors"
            />
          </div>
        )}

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {/* Gender Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 border rounded ${
              activeGenderTab === "men" ? "bg-blue-600 text-white" : "bg-white text-blue-600"
            }`}
            onClick={() => setActiveGenderTab("men")}
          >
            Men
          </button>
          <button
            className={`px-4 py-2 border rounded ${
              activeGenderTab === "women" ? "bg-blue-600 text-white" : "bg-white text-blue-600"
            }`}
            onClick={() => setActiveGenderTab("women")}
          >
            Women
          </button>
        </div>

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={results}
            genderFilter={activeGenderTab}
            teamColors={useTeamColor ? teamColors : []}
            pageSize={50}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers;
