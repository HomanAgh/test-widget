/* "use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Alumni from "@/app/components/alumni/Alumni";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedTournament = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TournamentEmbedContent />
    </Suspense>
  );
};

const TournamentEmbedContent = () => {
  const searchParams = useSearchParams();

  // Add tournament parameter handling
  const tournamentsStr = searchParams.get("tournaments") || "";
  const selectedTournaments = tournamentsStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const leaguesStr = searchParams.get("leagues") || "";
  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  // Color parameters (already correct)
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#000000";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <Alumni
          selectedTournaments={selectedTournaments} // Add this prop
          selectedLeagues={selectedLeagues}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor,
          }}
          includeYouth={false}
        />
      </div>
    </ResizeObserver>
  );
};

export default EmbedTournament; */

// app/(pages)/embed/tournament/page.tsx
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LocalAlumni from "@/app/components/alumni/LocalAlumni";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedTournament = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TournamentEmbedContent />
    </Suspense>
  );
};

const TournamentEmbedContent = () => {
  const searchParams = useSearchParams();
  const [finalPlayers, setFinalPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get parameters from URL
  const tournamentsStr = searchParams.get("tournaments") || "";
  const leaguesStr = searchParams.get("leagues") || "";
  
  // Color parameters
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#000000";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  // Fetch tournament player data
  useEffect(() => {
    async function fetchTournamentData() {
      if (!tournamentsStr || !leaguesStr) {
        setLoading(false);
        return;
      }
      
      try {
        const url = `/api/tournament-alumni?tournaments=${encodeURIComponent(tournamentsStr)}&league=${encodeURIComponent(leaguesStr)}`;
        const res = await fetch(url);
        const data = await res.json();
        setFinalPlayers(data.players || []);
      } catch (err) {
        console.error("Tournament fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTournamentData();
  }, [tournamentsStr, leaguesStr]);

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        {loading ? (
          <p className="flex justify-center pt-3 font-montserrat font-semibold">Loading...</p>
        ) : (
          <LocalAlumni 
            players={finalPlayers} 
            customColors={{
              backgroundColor,
              textColor,
              tableBackgroundColor,
              headerTextColor,
              nameTextColor,
            }} 
          />
        )}
      </div>
    </ResizeObserver>
  );
};

export default EmbedTournament;