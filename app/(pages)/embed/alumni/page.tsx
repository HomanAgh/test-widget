"use client";

import React, { Suspense } from "react";
import Alumni from "@/app/components/alumni/Alumni";
import { useSearchParams } from "next/navigation";

const EmbedAlumni = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlumniEmbedContent />
    </Suspense>
  );
};

const AlumniEmbedContent = () => {
  const searchParams = useSearchParams();

  // Get comma-separated team IDs
  const teamIdsStr = searchParams.get("teamIds") || "";
  const leaguesStr = searchParams.get("leagues") || "";
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";
  const youthTeam = searchParams.get("teams") || "";

  // Convert "1,2,3" => array of selectedTeams
  const teamIds = teamIdsStr
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  // Build minimal { id, name } objects if needed
  const selectedTeams = teamIds.map((id) => ({
    id: parseInt(id, 10) || 0,
    name: youthTeam,
    league: selectedLeagues[0] || "", // Use the first league if available
  }));
  


  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Alumni
        selectedTeams={selectedTeams}
        selectedLeagues={selectedLeagues}
        customColors={{
          backgroundColor,
          textColor,
          tableBackgroundColor,
          nameTextColor
        }}
        includeYouth={true}
      />
    </div>
  );
};

export default EmbedAlumni;
