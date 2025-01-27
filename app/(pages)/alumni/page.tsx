/* "use client";

import React, { useState } from "react";
import PlayerTable from "@/app/components/alumni/PlayerTable";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import TeamSearchBar, { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import HomeButton from "@/app/components/common/HomeButton";
// Keep your existing custom hooks:
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import { useFetchPlayers } from "@/app/components/alumni/hooks/useFetchPlayers";
import TeamBackgroundColorSelector from "@/app/components/common/TeamBackgroundColorSelector";

type GenderParam = 'male' | 'female' | null;

const AlumniPage: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [includeYouth, setIncludeYouth] = useState<boolean>(false);

  // Active tab: "men" or "women"
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");

  // 1) Fetch custom leagues from your hook as before
  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  // 2) Convert selectedTeams -> ID array, plus optional youth team name
  const selectedTeamIds = selectedTeams.map((t) => t.id);
  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0].name : null;

  // 3) Call your custom "useFetchPlayers" but pass something like "all"
  //    for genderParam so we get all players in one go.
  const genderParam: GenderParam = null;

  // 4) Because genderParam = "all", your hook won't re-fetch on tab switch
  //    (it only re-fetches if teams, leagues, or includeYouth change).
  const { results, loading, error } = useFetchPlayers(
    selectedTeamIds,
    "customLeague",
    selectedLeagues.join(","),
    includeYouth,
    youthTeam,
    genderParam
  );

  // 5) Split the results into men/women client-side
  const menPlayers = results.filter((p) => p.gender === "male");
  const womenPlayers = results.filter((p) => p.gender === "female");
  // Decide which subset to display
  const displayedPlayers = activeGenderTab === "men" ? menPlayers : womenPlayers;

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

        <div className="flex justify-center space-x-4 mb-6">
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

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={displayedPlayers}
            // we already filtered by men/women above
            genderFilter="all"
            teamColors={useTeamColor ? teamColors : []}
            pageSize={50}
          />
        </div>
      </div>
    </div>
  );
};

export default AlumniPage;
 */

/* "use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "@/app/components/alumni/PlayerTable";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import TeamSearchBar, { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import HomeButton from "@/app/components/common/HomeButton";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import { useFetchPlayers } from "@/app/components/alumni/hooks/useFetchPlayers";
import TeamBackgroundColorSelector from "@/app/components/common/TeamBackgroundColorSelector";

type GenderParam = "male" | "female" | null;

const AlumniPage: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);
  const [customColor, setCustomColor] = useState<string>("#FFFFFF");
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [includeYouth, setIncludeYouth] = useState<boolean>(false);

  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");

  // Fetch leagues using custom hooks
  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  // Process selected teams
  const selectedTeamIds = selectedTeams.map((t) => t.id);
  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0].name : null;

  // Fetch players based on selected filters
  const genderParam: GenderParam = null;
  const { results, loading, error } = useFetchPlayers(
    selectedTeamIds,
    "customLeague",
    selectedLeagues.join(","),
    includeYouth,
    youthTeam,
    genderParam
  );

  // Filter players by gender
  const menPlayers = results.filter((p) => p.gender === "male");
  const womenPlayers = results.filter((p) => p.gender === "female");
  const displayedPlayers = activeGenderTab === "men" ? menPlayers : womenPlayers;

  // Combine custom color and team colors
  const finalColors = useMemo(() => {
    return useTeamColor && teamColors.length > 0 ? teamColors : [customColor];
  }, [teamColors, useTeamColor, customColor]);

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
              onCustomColorChange={setCustomColor}
              enableText="Enable Team Colors"
              disableText="Disable Team Colors"
            />
          </div>
        )}

        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="flex justify-center space-x-4 mb-6">
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

        <div className="mt-6 rounded-lg shadow-md">
          <PlayerTable
            players={displayedPlayers}
            genderFilter="all"
            teamColors={finalColors} // Pass combined team and custom colors
            pageSize={50}
          />
        </div>
      </div>
    </div>
  );
};

export default AlumniPage; */


"use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "@/app/components/alumni/PlayerTable";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import TeamSearchBar, { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import HomeButton from "@/app/components/common/HomeButton";
import ColorPicker from "@/app/components/common/color-picker/ColorPicker";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import { useFetchPlayers } from "@/app/components/alumni/hooks/useFetchPlayers";
import TeamBackgroundColorSelector from "@/app/components/common/TeamBackgroundColorSelector";

type GenderParam = "male" | "female" | null;

const AlumniPage: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState<boolean>(false);
  const [customColors, setCustomColors] = useState({
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
  });
  const [selectedTarget, setSelectedTarget] = useState<
    "backgroundColor" | "textColor" | "tableBackgroundColor"
  >("backgroundColor");
  const [showColorPicker, setShowColorPicker] = useState(false); // State for toggling color picker visibility
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [includeYouth, setIncludeYouth] = useState<boolean>(false);
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");

  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  const selectedTeamIds = useMemo(() => selectedTeams.map((t) => t.id), [selectedTeams]);
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

  const menPlayers = results.filter((p) => p.gender === "male");
  const womenPlayers = results.filter((p) => p.gender === "female");
  const displayedPlayers = activeGenderTab === "men" ? menPlayers : womenPlayers;

  const finalColors = useMemo(() => {
    if (useTeamColor && teamColors.length > 0) {
      return {
        backgroundColor: teamColors[0] || "#FFFFFF",
        textColor: teamColors[1] || "#000000",
        tableBackgroundColor: teamColors[2] || "#FFFFFF",
      };
    }
    return customColors;
  }, [teamColors, useTeamColor, customColors]);

  const handleColorChange = (color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [selectedTarget]: color,
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <HomeButton />
        <h1 className="text-2xl font-bold text-center mb-6">Search Players</h1>

        <TeamSearchBar
          placeholder="Search for a team..."
          onSelect={(teamObj) => setSelectedTeams([teamObj])}
          onError={(error) => console.error("Error selecting team:", error)}
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
          />
        </div>

        {selectedTeams.length > 0 && (
          <div className="my-6">
            <TeamBackgroundColorSelector
              teamName={selectedTeams[0]?.name || "Default"}
              defaultEnabled={false}
              onTeamColorsChange={(colors) => {
                if (JSON.stringify(colors) !== JSON.stringify(teamColors)) {
                  setTeamColors(colors);
                }
              }}
              onUseTeamColorChange={(enabled) => {
                if (enabled !== useTeamColor) {
                  setUseTeamColor(enabled);
                }
              }}
              showColorPicker={false} // Disable the ToggleableColorPicker for AlumniPage
            />

            {/* Show Color Picker Button */}
            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => setShowColorPicker((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition"
              >
                {showColorPicker ? "Hide Color Picker" : "Show Color Picker"}
              </button>

              {/* Display Color Picker */}
              {showColorPicker && (
                <div className="mt-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <label className="font-medium">Customize:</label>
                    <select
                      value={selectedTarget}
                      onChange={(e) => setSelectedTarget(e.target.value as any)}
                      className="border rounded p-2"
                    >
                      <option value="backgroundColor">Background Color</option>
                      <option value="textColor">Text Color</option>
                      <option value="tableBackgroundColor">Table Background Color</option>
                    </select>
                  </div>
                  <ColorPicker onColorSelect={handleColorChange} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gender Tabs */}
        <div className="flex justify-center space-x-4 my-6">
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

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

        <PlayerTable
          players={displayedPlayers}
          genderFilter="all"
          teamColors={[
            finalColors.backgroundColor,
            finalColors.textColor,
            finalColors.tableBackgroundColor,
          ]}
        />
      </div>
    </div>
  );
};

export default AlumniPage;




