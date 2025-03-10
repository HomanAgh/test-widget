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
  const backgroundColor = searchParams.get("backgroundColor") || "#052D41";
  const textColor = searchParams.get("textColor") || "#000000";
  const tableBackgroundColor = searchParams.get("tableBackgroundColor") || "#FFFFFF";
  const headerTextColor = searchParams.get("headerTextColor") || "#FFFFFF";
  const nameTextColor = searchParams.get("nameTextColor") || "#0D73A6";

  if (!teamId) {
    return <div>Missing team ID</div>;
  }

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <Team
          teamId={teamId}
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

export default EmbedTeam;
