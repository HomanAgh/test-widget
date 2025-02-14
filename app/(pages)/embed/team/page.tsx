"use client";

import React, { Suspense } from "react";
import Team from "@/app/components/team/Team";
import { useSearchParams } from "next/navigation";

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
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Team
        teamId={teamId}

      />
    </div>
  );
};

export default EmbedTeam;
