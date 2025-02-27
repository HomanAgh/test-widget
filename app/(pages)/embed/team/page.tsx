"use client";

import React, { Suspense } from "react";
import Team from "@/app/components/team/Team";
import { useSearchParams } from "next/navigation";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedTeam = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeamPageContent />
    </Suspense>
  );
};

const TeamPageContent = () => {
  const searchParams = useSearchParams();

  const teamId = searchParams.get("teamId") || "";

  if (!teamId) {
    return <div>Missing team ID</div>;
  }

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <Team
          teamId={teamId}
        />
      </div>
    </ResizeObserver>
  );
};

export default EmbedTeam;
