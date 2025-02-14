"use client";

import React, { useMemo } from "react";
import Team from "@/app/components/team/Team"; 
import EmbedCodeBlock from "../iframe/IframePreview";

interface TeamWidgetSetupProps {
  teamId: string;
}

const TeamWidgetSetup: React.FC<TeamWidgetSetupProps> = ({ teamId }) => {

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      `${baseUrl}/embed/team?teamId=${encodeURIComponent(teamId)}`
    );
  }, [teamId]);

  // The final <iframe> code that user can copy
  const iframeCode = `<iframe src="${embedUrl}" class="alumni-iframe"></iframe>`;

  return (
    <div>
      <div className="mt-6">
        <Team 
          teamId={teamId}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} embedUrl={embedUrl} />
    </div>
  );
};

export default TeamWidgetSetup;
