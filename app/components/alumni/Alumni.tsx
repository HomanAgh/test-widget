"use client";

import React, { useState, useMemo } from "react";
import PlayerTable from "./PlayerTable";
import { SelectedTeam } from "./TeamSearchBar";
import TeamBackgroundColorSelector from "@/app/components/common/TeamBackgroundColorSelector";
import ColorPicker from "@/app/components/common/color-picker/ColorPicker";
import { useFetchPlayers } from "./hooks/useFetchPlayers";

type GenderParam = "male" | "female" | null;

interface AlumniProps {
  selectedTeams?: SelectedTeam[];
  selectedLeagues?: string[]; // <-- Accept selectedLeagues as a prop
}

const Alumni: React.FC<AlumniProps> = ({
  selectedTeams = [],
  selectedLeagues = [],
}) => {
  // Color-related state
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState(false);
  const [customColors, setCustomColors] = useState({
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
  });
  const [selectedTarget, setSelectedTarget] = useState<
    "backgroundColor" | "textColor" | "tableBackgroundColor"
  >("backgroundColor");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorMapping, setColorMapping] = useState([
    "backgroundColor",
    "textColor",
    "tableBackgroundColor",
  ]);

  // League & filter state
  const [includeYouth, setIncludeYouth] = useState(false);
  const [activeGenderTab, setActiveGenderTab] = useState<"men" | "women">("men");
  const [searchQuery, setSearchQuery] = useState("");

  // If you need to fetch the list of leagues for something else, you can still do so:
  // const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  // Prepare IDs for player fetching
  const selectedTeamIds = useMemo(
    () => selectedTeams.map((t) => t.id),
    [selectedTeams]
  );
  const youthTeam = selectedTeams.length > 0 ? selectedTeams[0]?.name : null;
  const genderParam: GenderParam = null;

  // Fetch players using the selected leagues passed down from the parent
  const { results, loading, error } = useFetchPlayers(
    selectedTeamIds,
    "customLeague",
    selectedLeagues.join(","), // <-- pass the selectedLeagues here
    includeYouth,
    youthTeam,
    genderParam
  );

  // Filter by gender
  const filteredPlayers = useMemo(() => {
    return results.filter((player) => {
      if (activeGenderTab === "men") return player.gender === "male";
      if (activeGenderTab === "women") return player.gender === "female";
      return true;
    });
  }, [results, activeGenderTab]);

  // Filter by search query
  const searchedPlayers = useMemo(() => {
    if (!searchQuery) return filteredPlayers;
    return filteredPlayers.filter((player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [filteredPlayers, searchQuery]);

  // Decide final colors (team or custom)
  const finalColors = useMemo(() => {
    if (useTeamColor && teamColors.length > 0) {
      return {
        backgroundColor:
          teamColors[colorMapping.indexOf("backgroundColor")] || "#FFFFFF",
        textColor: teamColors[colorMapping.indexOf("textColor")] || "#000000",
        tableBackgroundColor:
          teamColors[colorMapping.indexOf("tableBackgroundColor")] || "#FFFFFF",
      };
    }
    return customColors;
  }, [teamColors, useTeamColor, customColors, colorMapping]);

  // Handle color updates
  const handleColorChange = (color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [selectedTarget]: color,
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
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

      {/* Search Field for players */}
      <input
        type="text"
        placeholder="Search players..."
        className="border p-2 mb-4 w-full"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Include Youth */}
      <div className="flex items-center space-x-3 my-4">
        <label className="font-medium">Include Youth Team:</label>
        <input
          type="checkbox"
          checked={includeYouth}
          onChange={(e) => setIncludeYouth(e.target.checked)}
        />
      </div>

      {/* Team Background Color only if a team is selected */}
      {selectedTeams.length > 0 && (
        <div className="my-6">
          <TeamBackgroundColorSelector
            teamName={selectedTeams[0]?.name || "Default"}
            defaultEnabled={false}
            showColorPicker={false}
            onTeamColorsChange={(colors) => {
              if (JSON.stringify(colors) !== JSON.stringify(teamColors)) {
                setTeamColors(colors);
              }
            }}
            onUseTeamColorChange={(enabled) => setUseTeamColor(enabled)}
          />

          {/* Color Mapping Dropdowns */}
          <div className="flex justify-between mt-4 w-full">
            {["Background Color", "Text Color", "Table Background"].map(
              (label, index) => (
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
              )
            )}
          </div>

          {/* Show/Hide Color Picker */}
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
                    onChange={(e) =>
                      setSelectedTarget(e.target.value as any)
                    }
                    className="border rounded p-2"
                  >
                    <option value="backgroundColor">1</option>
                    <option value="textColor">2</option>
                    <option value="tableBackgroundColor">3</option>
                  </select>
                </div>
                <ColorPicker onColorSelect={handleColorChange} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
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
  );
};

export default Alumni;
