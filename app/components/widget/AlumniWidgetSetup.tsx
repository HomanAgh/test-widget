"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SelectedTeam } from "@/app/types/team";
import { TournamentItem } from "@/app/types/tournament";
import TeamSearchBar from "@/app/components/alumni/TeamSearchBar";
import TournamentSearchBar from "@/app/components/alumni/TournamentSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Alumni from "@/app/components/alumni/Alumni";
import LocalAlumni from "@/app/components/alumni/LocalAlumni";
import HexColors from "@/app/components/common/color-picker/HexColors";
import EmbedCodeBlock from "../iframe/IframePreview";

interface AlumniWidgetSetupProps {
  mode: "team" | "tournament";
}

const AlumniWidgetSetup: React.FC<AlumniWidgetSetupProps> = ({ mode }) => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedTournaments, setSelectedTournaments] = useState<
    TournamentItem[]
  >([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [includeYouth] = useState<boolean>(mode === "team");
  const [finalPlayers, setFinalPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });

  const { customLeagues, customJunLeagues, customCollegeLeagues } =
    useFetchLeagues();

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

  // For tournaments, fetch players when selections change
  useEffect(() => {
    if (mode === "tournament") {
      handleFetchTournamentAlumni();
    }
  }, [selectedTournaments, selectedLeagues, mode]);

  async function handleFetchTournamentAlumni() {
    if (selectedTournaments.length === 0 || selectedLeagues.length === 0) {
      setFinalPlayers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tSlugs = selectedTournaments.map((t) => t.slug).join(",");
      const lSlugs = selectedLeagues.join(",");

      const url = `/api/tournament-alumni?tournaments=${encodeURIComponent(
        tSlugs
      )}&league=${encodeURIComponent(lSlugs)}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`);
      }
      const data = await res.json();
      setFinalPlayers(data.players || []);
    } catch (err) {
      console.error("Tournament fetch error:", err);
      setError("Failed to fetch tournament data.");
      setFinalPlayers([]);
    } finally {
      setLoading(false);
    }
  }

  // Create appropriate embed URL based on mode
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    if (mode === "team") {
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
        `&includeYouth=${encodeURIComponent(includeYouth)}` +
        `&_t=${Date.now()}`
      );
    } else {
      const tournamentSlugs = selectedTournaments.map((t) => t.slug).join(",");
      const leagues = selectedLeagues.join(",");

      return (
        `${baseUrl}/embed/tournament` +
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
    }
  }, [
    mode,
    selectedTeams,
    selectedTournaments,
    selectedLeagues,
    customColors,
    includeYouth,
    youthName,
  ]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      {/* Render appropriate search bar based on mode */}
      {mode === "team" ? (
        <TeamSearchBar
          onSelect={(team) => setSelectedTeams([team])}
          onError={(errMsg) => setError(errMsg)}
          selectedTeams={selectedTeams}
          onCheckedTeamsChange={setSelectedTeams}
        />
      ) : (
        <TournamentSearchBar
          selectedTournaments={selectedTournaments}
          onCheckedTournamentsChange={setSelectedTournaments}
        />
      )}

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
        />
      </div>

      {/* Render appropriate component based on mode */}
      {mode === "team"
        ? selectedTeams.length > 0 && (
            <div className="mt-6">
              <Alumni
                selectedTeams={selectedTeams}
                selectedLeagues={selectedLeagues}
                customColors={customColors}
                includeYouth={includeYouth}
                selectedLeagueCategories={selectedLeagueCategories}
              />
            </div>
          )
        : selectedTournaments.length > 0 &&
          selectedLeagues.length > 0 && (
            <div className="mt-6">
              <LocalAlumni
                players={finalPlayers}
                loading={loading}
                customColors={customColors}
                selectedLeagueCategories={selectedLeagueCategories}
              />
            </div>
          )}

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default AlumniWidgetSetup;
