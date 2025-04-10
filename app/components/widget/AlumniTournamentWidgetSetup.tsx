"use client";

import React, { useState, useMemo } from "react";
import { TournamentItem } from "@/app/types/tournament";
import TournamentSearchBar from "@/app/components/alumni/TournamentSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import AlumniTournament from "@/app/components/alumni/AlumniTournament";
import HexColors from "@/app/components/common/color-picker/HexColorsAndIframeHeight";
import EmbedCodeBlock from "../iframe/IframePreview";
import ColumnSelector, { ColumnOptions } from "../alumni/ColumnSelector";

const DEFAULT_IFRAME_HEIGHT = 1300;

const AlumniTournamentWidgetSetup: React.FC = () => {
  const [selectedTournaments, setSelectedTournaments] = useState<TournamentItem[]>([]);
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

  // Initialize selected columns based on selected league categories
  const [selectedColumns, setSelectedColumns] = useState<ColumnOptions>({
    name: true, // Always true
    birthYear: true,
    draftPick: true, // Moved up to be after birthYear
    tournamentTeam: true,
    tournamentSeason: true,
    juniorTeams: true,
    collegeTeams: true,
    proTeams: true
  });

  // Update selected columns when league categories change
  React.useEffect(() => {
    setSelectedColumns(prevColumns => ({
      ...prevColumns,
      juniorTeams: selectedLeagueCategories.junior,
      collegeTeams: selectedLeagueCategories.college,
      proTeams: selectedLeagueCategories.professional
    }));
  }, [selectedLeagueCategories]);

  // Create embed URL
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const tournamentSlugs = selectedTournaments.map((t) => t.slug).join(",");
    const leagues = selectedLeagues.join(",");

    // Serialize selected columns for URL
    const columnsParam = encodeURIComponent(
      Object.entries(selectedColumns)
        .filter(([, value]) => value) // Only include enabled columns
        .map(([key]) => key)
        .join(",")
    );

    return (
      `${baseUrl}/embed/alumni-tournament` +
      `?tournaments=${encodeURIComponent(tournamentSlugs)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&columns=${columnsParam}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&_t=${Date.now()}`
    );
  }, [selectedTournaments, selectedLeagues, customColors, selectedColumns]);

  // Generate source attribution links
  const sourceLinks = useMemo(() => {
    if (selectedTournaments.length === 0) return '';
    
    return selectedTournaments.map(tournament => (
      `<p> Source: <a href="https://www.eliteprospects.com/league/${tournament.slug}" target="_blank" rel="noopener noreferrer">${tournament.name}</a> @ Elite Prospects</p>`
    )).join('\n');
  }, [selectedTournaments]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${sourceLinks ? '\n' + sourceLinks : ''}`;

  // Only show column selector when tournaments and leagues are selected
  const showColumnSelector = selectedTournaments.length > 0 && selectedLeagues.length > 0;

  return (
    <div>
      <TournamentSearchBar
        selectedTournaments={selectedTournaments}
        onCheckedTournamentsChange={setSelectedTournaments}
      />

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}
        juniorLeagues={customJunLeagues}
        collegeLeagues={customCollegeLeagues}
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />

      <div className="mt-8">
        <div className="flex flex-wrap md:flex-nowrap items-start">
          <HexColors
            customColors={customColors}
            setCustomColors={setCustomColors}
            height={iframeHeight}
            onHeightChange={setIframeHeight}
            defaultHeight={DEFAULT_IFRAME_HEIGHT}
          />
        </div>
      </div>

      {/* Column Selector - only show when tournaments and leagues are selected */}
      {showColumnSelector && (
        <div className="mt-4">
          <ColumnSelector
            selectedColumns={selectedColumns}
            onChange={setSelectedColumns}
            selectedLeagueCategories={selectedLeagueCategories}
          />
        </div>
      )}

      {selectedTournaments.length > 0 && selectedLeagues.length > 0 && (
        <div className="mt-6">
          <AlumniTournament
            selectedTournaments={selectedTournaments.map(t => t.slug)}
            selectedLeagues={selectedLeagues}
            customColors={customColors}
            selectedLeagueCategories={selectedLeagueCategories}
            selectedColumns={selectedColumns}
          />
        </div>
      )}

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default AlumniTournamentWidgetSetup;
