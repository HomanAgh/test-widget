"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import League from "@/app/components/league/League";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedLeague = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LeagueEmbedContent />
    </Suspense>
  );
};

const LeagueEmbedContent = () => {
  const searchParams = useSearchParams();

  const leagueSlug = searchParams.get("leagueSlug") || "";
  const backgroundColor = searchParams.get("backgroundColor") || "#052D41";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  if (!leagueSlug) {
    return <div>Missing leagueSlug parameter</div>;
  }

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <League
          leagueSlug={leagueSlug}
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

export default EmbedLeague;
