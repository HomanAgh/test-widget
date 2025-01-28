/* "use client";

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

            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => setShowColorPicker((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition"
              >
                {showColorPicker ? "Hide Color Picker" : "Show Color Picker"}
              </button>

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




 */

/* "use client";

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
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search functionality for player table

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

  const filteredPlayers = useMemo(() => {
    return results.filter((player) => {
      if (activeGenderTab === "men") return player.gender === "male";
      if (activeGenderTab === "women") return player.gender === "female";
      return true;
    });
  }, [results, activeGenderTab]);

  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return filteredPlayers;
    return filteredPlayers.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredPlayers, searchQuery]);

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
              showColorPicker={false}
            />

            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => setShowColorPicker((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition"
              >
                {showColorPicker ? "Hide Color Picker" : "Show Color Picker"}
              </button>

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

        <input
          type="text"
          placeholder="Search players..."
          className="border p-2 mb-4 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [includeYouth, setIncludeYouth] = useState<boolean>(false);
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [colorMapping, setColorMapping] = useState([
    "backgroundColor",
    "textColor",
    "tableBackgroundColor",
  ]);

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

  const filteredPlayers = useMemo(() => {
    return results.filter((player) => {
      if (activeGenderTab === "men") return player.gender === "male";
      if (activeGenderTab === "women") return player.gender === "female";
      return true;
    });
  }, [results, activeGenderTab]);

  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return filteredPlayers;
    return filteredPlayers.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredPlayers, searchQuery]);

  const finalColors = useMemo(() => {
    if (useTeamColor && teamColors.length > 0) {
      return {
        backgroundColor: teamColors[colorMapping.indexOf("backgroundColor")] || "#FFFFFF",
        textColor: teamColors[colorMapping.indexOf("textColor")] || "#000000",
        tableBackgroundColor: teamColors[colorMapping.indexOf("tableBackgroundColor")] || "#FFFFFF",
      };
    }
    return customColors;
  }, [teamColors, useTeamColor, customColors, colorMapping]);

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
              showColorPicker={false}
            />

            {/* Dropdowns for color customization under Enable Team Colors */}
            <div className="flex justify-between mt-4 w-full">
              {["Background Color", "Text Color", "Table Background"].map((label, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <label className="font-medium">{label}:</label>
                  <select
                    value={colorMapping[index]}
                    onChange={(e) => {
                      const newMapping = [...colorMapping];
                      newMapping[index] = e.target.value;
                      setColorMapping(newMapping);
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

            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => setShowColorPicker((prev) => !prev)}
                className="px-4 py-2 bg-blue-600 text-white rounded shadow-md hover:bg-blue-700 transition"
              >
                {showColorPicker ? "Hide Color Picker" : "Show Color Picker"}
              </button>

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

        <input
          type="text"
          placeholder="Search players..."
          className="border p-2 mb-4 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}

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
    </div>
  );
};

export default AlumniPage;

