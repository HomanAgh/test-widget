"use client";

import React, { Suspense } from "react";
import Alumni from "@/app/components/alumni/Alumni";
import { useSearchParams } from "next/navigation";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedAlumni = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AlumniEmbedContent />
    </Suspense>
  );
};

const AlumniEmbedContent = () => {
  const searchParams = useSearchParams();
  const teamIdsStr = searchParams.get("teamIds") || "";
  const leaguesStr = searchParams.get("leagues") || "";
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";
  const headerTextColor = searchParams.get("headerTextColor") || "#FFFFFF";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";
  const youthTeam = searchParams.get("teams") || "";
  const teamIds = teamIdsStr
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
  const selectedTeams = teamIds.map((id) => ({
    id: parseInt(id, 10) || 0,
    name: youthTeam,
    league: selectedLeagues[0] || "", 
  }));
  
  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <Alumni
          selectedTeams={selectedTeams}
          selectedLeagues={selectedLeagues}
          customColors={{
            backgroundColor,
            textColor,
            headerTextColor,
            tableBackgroundColor,
            nameTextColor
          }}
          includeYouth={true}
        />
      </div>
    </ResizeObserver>
  );
};

export default EmbedAlumni;
