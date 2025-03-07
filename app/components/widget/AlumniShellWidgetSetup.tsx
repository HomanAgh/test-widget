"use client";

import React, { useState, useMemo } from "react";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import TournamentSelection from "@/app/components/alumni/TournamentSelection";
import TournamentAlumni from "@/app/components/alumni/TournamentAlumni";
import HexColors from "@/app/components/common/color-picker/HexColors";
import EmbedCodeBlock from "../iframe/IframePreview";

const AlumniShellWidgetSetup: React.FC = () => {
  const [selectedTournaments, setSelectedTournaments] = useState<string[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const { customLeagues, customJunLeagues, customCollegeLeagues } =
    useFetchLeagues();

  const embedUrl = useMemo(() => {
    const tournaments = selectedTournaments.join(",");
    const leagues = selectedLeagues.join(",");
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    return (
      `${baseUrl}/embed/alumni-shell` +
      `?tournaments=${encodeURIComponent(tournaments)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}`
    );
  }, [selectedTournaments, selectedLeagues, customColors]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tournament Alumni Widget</h1>
      <p className="mb-4">
        This widget displays players who have participated in selected
        tournaments and optionally have also played in specific leagues.
      </p>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">How to Use This Widget</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Select one or more tournaments from the options below</li>
          <li>
            Optionally, select leagues to further filter players (e.g., NHL,
            SHL, KHL)
          </li>
          <li>
            The widget will show players who participated in the selected
            tournaments AND (if specified) also played in at least one of your
            selected leagues
          </li>
          <li>Customize the colors to match your website</li>
          <li>Copy the embed code to add this widget to your site</li>
        </ol>
      </div>

      <TournamentSelection
        selectedTournaments={selectedTournaments}
        onChange={setSelectedTournaments}
      />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Filter by Leagues (Optional)
        </h2>
        <p className="mb-2">
          Additionally filter players who have also played in these leagues:
        </p>
        <LeagueSelectionDropdown
          professionalLeagues={customLeagues}
          juniorLeagues={customJunLeagues}
          collegeLeagues={customCollegeLeagues}
          selectedLeagues={selectedLeagues}
          onChange={setSelectedLeagues}
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Customize Colors</h2>
        <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
          <HexColors
            customColors={customColors}
            setCustomColors={setCustomColors}
          />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <TournamentAlumni
          selectedTournaments={selectedTournaments}
          selectedLeagues={selectedLeagues}
          customColors={customColors}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Embed Code</h2>
        <EmbedCodeBlock iframeCode={iframeCode} />
      </div>
    </div>
  );
};

export default AlumniShellWidgetSetup;
