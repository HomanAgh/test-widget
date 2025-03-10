"use client";

import React, { Suspense } from "react";
import ScoringLeaders from "@/app/components/league/ScoringLeaders";
import { useSearchParams } from "next/navigation";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedScoringLeaders = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScoringLeadersPageContent />
    </Suspense>
  );
};

const ScoringLeadersPageContent = () => {
  const searchParams = useSearchParams();

  const leagueSlug = searchParams.get("leagueSlug") || "";
  const season = searchParams.get("season") || "";
  const backgroundColor = searchParams.get("backgroundColor") || "#052D41";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  if (!leagueSlug || !season) {
    return <div>Missing league slug or season</div>;
  }

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <ScoringLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor
          }}
        />
      </div>
    </ResizeObserver>
  );
};

export default EmbedScoringLeaders; 