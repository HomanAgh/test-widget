"use client";

import React, { useState, useMemo } from "react";
import { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import SearchBar from "@/app/components/alumni/TeamSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Alumni from "@/app/components/alumni/Alumni";
import HexColors from "@/app/components/common/color-picker/HexColors";

const AlumniWidgetSetup: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [includeYouth] = useState<boolean>(true);
  const [showPreview, setShowPreview] = useState(false);
  const [customColors, setCustomColors] = useState({
    backgroundColor: "#052D41",
    textColor: "#FFFFFF",
    tableBackgroundColor: "#FFFFFF",
  });
  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  const embedUrl = useMemo(() => {
    const teamIds = selectedTeams.map((t) => t.id).join(",");
    const leagues = selectedLeagues.join(",");
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    return (
      `${baseUrl}/embed/alumni?teamIds=${encodeURIComponent(teamIds)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}` +
      `&includeYouth=${encodeURIComponent(includeYouth)}`
    );
  }, [selectedTeams, selectedLeagues, customColors, includeYouth]);

  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      {/* Search for one or more teams */}
      <SearchBar
        onSelect={(team) => setSelectedTeams([team])}
        onError={(errMsg) => setError(errMsg)}
        selectedTeams={selectedTeams}
        onCheckedTeamsChange={setSelectedTeams}
      />

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {/* League selection */}
      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}
        juniorLeagues={customJunLeagues}
        collegeLeagues={customCollegeLeagues}
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />

      {/* Colors only, without checkbox */}
      <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
        <HexColors customColors={customColors} setCustomColors={setCustomColors} />
      </div>


      {/* Preview the Alumni table (optional) */}
      {selectedTeams.length > 0 && (
        <div className="mt-6">
          <Alumni
            selectedTeams={selectedTeams}
            selectedLeagues={selectedLeagues}
            customColors={customColors}
            includeYouth={includeYouth}
          />
        </div>
      )}

      {/* Embed code output */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Embed Code</h3>
        <textarea
          readOnly
          value={iframeCode}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={() => setShowPreview(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 mt-2"
        >
          Preview
        </button>
      </div>

      <h3 className="text-lg font-medium mt-4 mb-2">Preview</h3>
      {showPreview && (
        <iframe
          src={embedUrl}
          style={{ width: "100%", height: "500px", border: "none" }}
        />
      )}
    </div>
  );
};

export default AlumniWidgetSetup;
