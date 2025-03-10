 "use client";

import React, { useState, useMemo } from "react";
import { TournamentItem } from "@/app/types/tournament";
import TournamentSearchBar from "@/app/components/alumni/TournamentSearchBar"; 
// Or wherever you placed your new search bar
import Alumni from "@/app/components/alumni/Alumni";
import HexColors from "@/app/components/common/color-picker/HexColors";
import EmbedCodeBlock from "../iframe/IframePreview";
import ErrorMessage from "@/app/components/common/ErrorMessage";
// If you still want to allow selection of regular leagues, import and use the same hook:
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection"; 
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";

// If you do NOT want to support normal leagues, you can remove the LeagueSelectionDropdown stuff.

const AlumniTournamentWidgetSetup: React.FC = () => {
  // Tournaments selected by the user
  const [selectedTournaments, setSelectedTournaments] = useState<TournamentItem[]>([]);
  // (OPTIONAL) If you want to also filter by normal leagues, keep this. Otherwise remove it.
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  // For demonstration, I'm leaving this in case you want to show an error message
  const [error, setError] = useState<string | null>(null);

  // Colors for customizing the alumni table
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });

  // If you want a “live preview” of the tournaments’ alumni
  // we pass them to <Alumni> as a "league" param.
  // e.g. if selectedTournaments = [ { slug: "brick-invitational" }, { slug: "spengler-cup" } ]
  // Then we pass `league=brick-invitational,spengler-cup` to /api/alumni.

  // (OPTIONAL) If you want to fetch extra leagues (professional, junior, college),
  // use the existing useFetchLeagues:
  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  // Build an embed URL for the <iframe>
  // This is similar to how your AlumniWidgetSetup does it, but focusing on tournaments.
  const embedUrl = useMemo(() => {
    // Gather the user’s chosen tournament slugs
    const tournamentSlugs = selectedTournaments.map((t) => t.slug);

    // If you also want to combine normal leagues:
    const allLeagueSlugs = [...selectedLeagues, ...tournamentSlugs];
    const leaguesParam = allLeagueSlugs.join(",");

    // We'll construct an embed route, e.g. /embed/alumni
    // If you only want it to revolve around tournaments, that’s fine.
    // It doesn’t matter if there’s no "teamIds" param—just omit it.
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${baseUrl}/embed/alumni?leagues=${encodeURIComponent(leaguesParam)}`
      + `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}`
      + `&textColor=${encodeURIComponent(customColors.textColor)}`
      + `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}`
      + `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}`;

    return url;
  }, [selectedTournaments, selectedLeagues, customColors]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Tournament Alumni Widget Setup</h2>

      {/* -- If you want to let user search & pick multiple tournaments: -- */}
      <TournamentSearchBar
        selectedTournaments={selectedTournaments}
        onCheckedTournamentsChange={setSelectedTournaments}
      />

      {/* -- Optional: If you want a normal league dropdown as well: -- */}
      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}
        juniorLeagues={customJunLeagues}
        collegeLeagues={customCollegeLeagues}
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {/* -- Color pickers, if you want to keep them -- */}
      <div className="my-4">
        <HexColors customColors={customColors} setCustomColors={setCustomColors} />
      </div>

      {/* -- Show a live preview using <Alumni> if we have tournaments selected -- */}
      {selectedTournaments.length > 0 && (
        <div className="border border-gray-300 p-4 rounded">
          <Alumni
            // We pass an empty array for "selectedTeams"
            selectedTeams={[]}
            // Combine normal leagues + tournaments
            selectedLeagues={[...selectedLeagues, ...selectedTournaments.map((t) => t.slug)]}
            customColors={customColors}
            includeYouth={false} // or true if you want
          />
        </div>
      )}

      {/* -- Embed code snippet -- */}
      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default AlumniTournamentWidgetSetup;
