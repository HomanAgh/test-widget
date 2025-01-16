/* "use client";

import React, { useState } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import LeagueSelectionDropdown from '@/app/components/alumni/LeagueSelection';
import TeamSearchBar, { SelectedTeam } from '@/app/components/alumni/TeamSearchBar';
import HomeButton from '@/app/components/common/HomeButton';
import { useFetchLeagues } from '@/app/components/alumni/hooks/useFetchLeagues';
import { useFetchPlayers } from '@/app/components/alumni/hooks/useFetchPlayers';
import TeamBackgroundColorSelector from '@/app/components/common/TeamBackgroundColorSelector';

const SearchPlayers = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]); // Selected leagues from dropdown
  const [activeFilter, setActiveFilter] = useState<'customLeague' | 'customJunLeague'>('customLeague');
  const [includeYouth, setIncludeYouth] = useState<boolean>(false); // Toggle for youth team
  const [activeTab, setActiveTab] = useState<'boys' | 'girls'>('boys'); // NEW: Tab selection for boys or girls

  const { customLeagues, customJunLeagues } = useFetchLeagues();

  const leagues = selectedLeagues.length > 0 ? selectedLeagues : ['all'];
  const selectedTeamIds = selectedTeams.map((t) => t.id);

  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0].name : null;

  const { results, loading, error, hasMore, fetchPlayers } = useFetchPlayers(
    selectedTeamIds,
    activeFilter,
    leagues.join(','),
    includeYouth,
    youthTeam
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <HomeButton />
        <h1 className="text-2xl font-bold text-center mb-6">Search Organization</h1>

        {}
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l ${activeTab === 'boys' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('boys')}
          >
            Boys Alumni
          </button>
          <button
            className={`px-4 py-2 rounded-r ${activeTab === 'girls' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('girls')}
          >
            Girls Alumni
          </button>
        </div>

        <TeamSearchBar
          placeholder={`Search for a ${activeTab === 'boys' ? 'boys' : 'girls'} team...`}
          onSelect={(teamObj) => {
            setSelectedTeams([teamObj]);
          }}
          onError={(err) => console.error(err)}
          selectedTeams={selectedTeams}
          onCheckedTeamsChange={setSelectedTeams}
          // Pass the `activeTab` to filter teams by gender
          activeTab={activeTab}
        />

        <LeagueSelectionDropdown
          professionalLeagues={customLeagues}
          juniorLeagues={customJunLeagues}
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

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={results}
            teamColors={useTeamColor ? teamColors : []}
            hasMore={hasMore}
            fetchMore={() => fetchPlayers(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers; */

"use client";

import React, { useState } from "react";
import PlayerTable from "@/app/components/alumni/PlayerTable";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import TeamSearchBar, { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import HomeButton from "@/app/components/common/HomeButton";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import { useFetchPlayers } from "@/app/components/alumni/hooks/useFetchPlayers";
import TeamBackgroundColorSelector from "@/app/components/common/TeamBackgroundColorSelector";

const SearchPlayers = () => {
  // Separate state for boys and girls tabs
  const [boysState, setBoysState] = useState({
    selectedTeams: [] as SelectedTeam[],
    selectedLeagues: [] as string[],
  });

  const [girlsState, setGirlsState] = useState({
    selectedTeams: [] as SelectedTeam[],
    selectedLeagues: [] as string[],
  });

  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);
  const [activeFilter] = useState<"customLeague" | "customJunLeague">("customLeague");
  const [includeYouth, setIncludeYouth] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"boys" | "girls">("boys");

  const { customLeagues, customJunLeagues } = useFetchLeagues();

  // Use appropriate state based on the active tab
  const currentTabState = activeTab === "boys" ? boysState : girlsState;
  const setCurrentTabState = activeTab === "boys" ? setBoysState : setGirlsState;

  const leagues = currentTabState.selectedLeagues.length > 0 ? currentTabState.selectedLeagues : ["all"];
  const selectedTeamIds = currentTabState.selectedTeams.map((t) => t.id);

  const youthTeam = currentTabState.selectedTeams.length > 0 ? currentTabState.selectedTeams[0].name : null;

  const { results, loading, error, hasMore, fetchPlayers } = useFetchPlayers(
    selectedTeamIds,
    activeFilter,
    leagues.join(","),
    includeYouth,
    youthTeam
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <HomeButton />
        <h1 className="text-2xl font-bold text-center mb-6">Search Organization</h1>

        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l ${activeTab === "boys" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("boys")}
          >
            Boys Alumni
          </button>
          <button
            className={`px-4 py-2 rounded-r ${activeTab === "girls" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("girls")}
          >
            Girls Alumni
          </button>
        </div>

        <TeamSearchBar
          placeholder={`Search for a ${activeTab === "boys" ? "boys" : "girls"} team...`}
          onSelect={(teamObj) => {
            setCurrentTabState((prev) => ({
              ...prev,
              selectedTeams: [teamObj],
            }));
          }}
          onError={(err) => console.error(err)}
          selectedTeams={currentTabState.selectedTeams}
          onCheckedTeamsChange={(teams) =>
            setCurrentTabState((prev) => ({
              ...prev,
              selectedTeams: teams,
            }))
          }
          activeTab={activeTab}
        />

        <LeagueSelectionDropdown
          professionalLeagues={customLeagues}
          juniorLeagues={customJunLeagues}
          selectedLeagues={currentTabState.selectedLeagues}
          onChange={(leagues) =>
            setCurrentTabState((prev) => ({
              ...prev,
              selectedLeagues: leagues,
            }))
          }
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

        {currentTabState.selectedTeams.length > 0 && (
          <div className="my-6">
            <TeamBackgroundColorSelector
              teamName={currentTabState.selectedTeams[0].name}
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

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={results}
            teamColors={useTeamColor ? teamColors : []}
            hasMore={hasMore}
            fetchMore={() => fetchPlayers(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchPlayers;

