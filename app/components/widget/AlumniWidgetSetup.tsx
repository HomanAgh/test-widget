"use client";

import React, { useState, useMemo } from "react";
import { SelectedTeam } from "@/app/types/team";
import SearchBar from "@/app/components/alumni/TeamSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Alumni from "@/app/components/alumni/Alumni";
import HexColors from "@/app/components/common/color-picker/HexColors";
import EmbedCodeBlock from "../iframe/IframePreview";

const AlumniWidgetSetup: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [includeYouth] = useState<boolean>(true);
    const youthName = selectedTeams.length > 0
    ? selectedTeams[0].name
    : "CHICAGO MISSION U16";
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  const embedUrl = useMemo(() => {
    const teamIds = selectedTeams.map((t) => t.id).join(",");
    const leagues = selectedLeagues.join(",");
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';


    return (
      `${baseUrl}/embed/alumni` +
      `?teamIds=${encodeURIComponent(teamIds)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&teams=${encodeURIComponent(youthName)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&includeYouth=${encodeURIComponent(includeYouth)}` 
    );
  }, [selectedTeams, selectedLeagues, customColors, includeYouth, youthName]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      <SearchBar
        onSelect={(team) => setSelectedTeams([team])}
        onError={(errMsg) => setError(errMsg)}
        selectedTeams={selectedTeams}
        onCheckedTeamsChange={setSelectedTeams}
      />

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}
        juniorLeagues={customJunLeagues}
        collegeLeagues={customCollegeLeagues}
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />

      <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
        <HexColors customColors={customColors} setCustomColors={setCustomColors} />
      </div>

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
       <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default AlumniWidgetSetup;
