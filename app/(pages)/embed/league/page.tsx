"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import League from "@/app/components/league/League";

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
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";

  if (!leagueSlug) {
    return <div>Missing leagueSlug parameter</div>;
  }

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <League
        leagueSlug={leagueSlug}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    </div>
  );
};

export default EmbedLeague;
