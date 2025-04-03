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

  // Create embed URL
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const tournamentSlugs = selectedTournaments.map((t) => t.slug).join(",");
    const leagues = selectedLeagues.join(",");

    return (
      `${baseUrl}/embed/alumni-tournament` +
      `?tournaments=${encodeURIComponent(tournamentSlugs)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&_t=${Date.now()}`
    );
  }, [selectedTournaments, selectedLeagues, customColors]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>`;

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

      <div className="flex flex-wrap md:flex-nowrap items-center space-x-8">
        <HexColors
          customColors={customColors}
          setCustomColors={setCustomColors}
          height={iframeHeight}
          onHeightChange={setIframeHeight}
          defaultHeight={DEFAULT_IFRAME_HEIGHT}
        />
      </div>

      {selectedTournaments.length > 0 && selectedLeagues.length > 0 && (
        <div className="mt-6">
          <AlumniTournament
            selectedTournaments={selectedTournaments.map(t => t.slug)}
            selectedLeagues={selectedLeagues}
            customColors={customColors}
            selectedLeagueCategories={selectedLeagueCategories}
          />
        </div>
      )}

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default AlumniTournamentWidgetSetup;
