// app/embed/tournament/page.tsx
"use client";

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

  // 1) Parse leagues from the URL query, e.g. ?leagues=brick-invitational,nhl
  const leaguesStr = searchParams.get("leagues") || "";
  const selectedLeagues = leaguesStr
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  // 2) Parse color params (with fallbacks)
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#000000";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  // 3) Render Alumni with no teams, just the selected leagues, and your colors
  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <Alumni
          selectedTeams={[]} // No teams for tournaments
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

export default EmbedTournament;
