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

  if (!leagueSlug) {
    return <div>Missing leagueSlug parameter</div>;
  }

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <League
          leagueSlug={leagueSlug}
        />
      </div>
    </ResizeObserver>
  );
};

export default EmbedLeague;
