"use client";

import React, { useState, useEffect } from "react";
import { TournamentItem } from "@/app/types/tournament";
import TournamentSearchBar from "@/app/components/alumni/TournamentSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import HexColors from "@/app/components/common/color-picker/HexColors";
import EmbedCodeBlock from "@/app/components/iframe/IframePreview";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";
import LocalAlumni from "../alumni/LocalAlumni";

export default function AlumniTournamentWidgetSetup() {
  const [selectedTournaments, setSelectedTournaments] = useState<TournamentItem[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [finalPlayers, setFinalPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });

  const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

    useEffect(() => {
      handleFetchTournamentAlumni();
    }, [selectedTournaments, selectedLeagues]);
    
    async function handleFetchTournamentAlumni() {
      if (selectedTournaments.length === 0 || selectedLeagues.length === 0) {
        setFinalPlayers([]);
        return;
      }
      setLoading(true);
      setError(null);
    
      try {
        // Convert arrays to comma-separated strings
        const tSlugs = selectedTournaments.map((t) => t.slug).join(",");
        const lSlugs = selectedLeagues.join(",");
    
        // Single call to /api/tournament-alumni
        let url = `/api/tournament-alumni?tournaments=${encodeURIComponent(tSlugs)}&league=${encodeURIComponent(lSlugs)}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const data = await res.json();
    
        // data.players => players who played in "brick-invitational" and also have "nhl" in their career
        setFinalPlayers(data.players || []);
      } catch (err) {
        console.error("Tournament fetch error:", err);
        setError("Failed to fetch tournament data.");
        setFinalPlayers([]);
      } finally {
        setLoading(false);
      }
    }

  async function fetchPlayersByLeague(leagueParam: string) {
    const url = `/api/tournament-alumni=${encodeURIComponent(leagueParam)}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Fetch failed for league=${leagueParam}`);
    }
    const data = await res.json();
    return data.players || [];
  }

  function intersectById(a: any[], b: any[]): any[] {
    const setB = new Set(b.map((p) => p.id));
    return a.filter((p) => setB.has(p.id));
  }

  const iframeCode = `<iframe src="..." class="iframe"></iframe>`;

  return (
    <div>
      <TournamentSearchBar
        selectedTournaments={selectedTournaments}
        onCheckedTournamentsChange={setSelectedTournaments}
      />
      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}
        juniorLeagues={customJunLeagues}
        collegeLeagues={customCollegeLeagues}
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      <HexColors customColors={customColors} setCustomColors={setCustomColors} />

      {loading ? (
        <p>Loading players...</p>
      ) : (
        <>
          <p>Found {finalPlayers.length} players</p>
          {/* Render the local version that replicates old <Alumni> styling */}
          <LocalAlumni players={finalPlayers} customColors={customColors} />
        </>
      )}

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
}
