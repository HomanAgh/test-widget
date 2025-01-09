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
  const backgroundColor = searchParams.get("backgroundColor") || "#FFFFFF";
  const textColor = searchParams.get("textColor") || "#000000";

  if (!teamId) {
    return <div>Missing team ID</div>;
  }

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Team
        teamId={teamId}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    </div>
  );
};

export default EmbedTeam;
