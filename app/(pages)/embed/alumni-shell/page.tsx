"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TournamentAlumni from "@/app/components/alumni/TournamentAlumni";

const EmbedAlumniShell = () => {
  return (
    <div className="p-0 m-0">
      <Suspense fallback={<div>Loading...</div>}>
        <AlumniShellEmbedContent />
      </Suspense>
    </div>
  );
};

const AlumniShellEmbedContent = () => {
  const searchParams = useSearchParams();

  const tournaments = searchParams.get("tournaments") || "";
  const leagues = searchParams.get("leagues") || "";
  const backgroundColor = searchParams.get("backgroundColor") || "#052D41";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor =
    searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  const selectedTournaments = tournaments ? tournaments.split(",") : [];
  const selectedLeagues = leagues ? leagues.split(",") : [];

  const customColors = {
    backgroundColor,
    textColor,
    tableBackgroundColor,
    headerTextColor: "#FFFFFF",
    nameTextColor,
  };

  return (
    <TournamentAlumni
      selectedTournaments={selectedTournaments}
      selectedLeagues={selectedLeagues}
      customColors={customColors}
    />
  );
};

export default EmbedAlumniShell;
