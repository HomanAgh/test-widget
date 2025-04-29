"use client";

import React, { useState, useMemo } from "react";
import { SelectedTeam } from "@/app/types/team";
import TeamSearchBar from "@/app/components/alumni/TeamSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Alumni from "@/app/components/alumni/Alumni";
import HexColors from "@/app/components/common/color-picker/HexColorsAndIframeHeight";
import EmbedCodeBlock from "../iframe/IframePreview";

const DEFAULT_IFRAME_HEIGHT = 1300;

const AlumniWidgetSetup: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);

  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  // Determine which league categories are selected
  const selectedLeagueCategories = useMemo(() => {
    const categories = {
      junior: false,
      college: false,
      professional: false,
    };

    // Check each selected league against available leagues to determine its category
    selectedLeagues.forEach((selectedSlug) => {
      const allLeagues = [
        ...customLeagues,
        ...customJunLeagues,
        ...customCollegeLeagues,
      ];
      const league = allLeagues.find(
        (l) => l.slug.toLowerCase() === selectedSlug
      );

      if (league) {
        if (
          customJunLeagues.some((l) => l.slug.toLowerCase() === selectedSlug)
        ) {
          categories.junior = true;
        } else if (
          customCollegeLeagues.some(
            (l) => l.slug.toLowerCase() === selectedSlug
          )
        ) {
          categories.college = true;
        } else if (
          customLeagues.some((l) => l.slug.toLowerCase() === selectedSlug)
        ) {
          categories.professional = true;
        }
      }
    });

    return categories;
  }, [selectedLeagues, customLeagues, customJunLeagues, customCollegeLeagues]);

  const youthName =
    selectedTeams.length > 0 ? selectedTeams[0].name : "CHICAGO MISSION U16";

  // Create embed URL
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const teamIds = selectedTeams.map((t) => t.id).join(",");
    const leagues = selectedLeagues.join(",");

    return (
      `${baseUrl}/embed/alumni` +
      `?teamIds=${encodeURIComponent(teamIds)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&teams=${encodeURIComponent(youthName)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&includeYouth=true` +
      `&_t=${Date.now()}`
    );
  }, [selectedTeams, selectedLeagues, customColors, youthName]);

  const sourceLinks = useMemo(() => {
    if (selectedTeams.length === 0) return '';
    
    const lastTeam = selectedTeams[selectedTeams.length - 1];
    return `<p> Source: <a href="https://www.eliteprospects.com/team/${lastTeam.id}/${lastTeam.name.toLowerCase().replace(/\s+/g, '-')}" target="_blank" rel="noopener noreferrer">${lastTeam.name}</a> @ Elite Prospects</p>`;
  }, [selectedTeams]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${sourceLinks ? '\n' + sourceLinks : ''}`;

  return (
    <div>
      <TeamSearchBar
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

      <div className="flex flex-wrap md:flex-nowrap items-center space-x-8">
        <HexColors
          customColors={customColors}
          setCustomColors={setCustomColors}
          height={iframeHeight}
          onHeightChange={setIframeHeight}
          defaultHeight={DEFAULT_IFRAME_HEIGHT}
        />
      </div>

      {selectedTeams.length > 0 && (
        <div className="mt-6">
          <Alumni
            selectedTeams={selectedTeams}
            selectedLeagues={selectedLeagues}
            customColors={customColors}
            includeYouth={true}
            selectedLeagueCategories={selectedLeagueCategories}
          />
        </div>
      )}

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default AlumniWidgetSetup;
