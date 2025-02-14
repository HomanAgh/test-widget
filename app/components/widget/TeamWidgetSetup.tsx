"use client";

import React, { useState, useMemo } from "react";
import Team from "@/app/components/team/Team"; 
import EmbedCodeBlock from "../iframe/IframePreview";

interface TeamWidgetSetupProps {
  teamId: string;
}

const TeamWidgetSetup: React.FC<TeamWidgetSetupProps> = ({ teamId }) => {
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");

  const finalBackgroundColor = useMemo(() => {
    if (useTeamColor && teamColors.length > 0) {
      return teamColors[0];
    }
    return customColor;
  }, [useTeamColor, teamColors, customColor]);

  const finalTextColor = useMemo(() => {
    if (useTeamColor && teamColors.length > 1) {
      return teamColors[1];
    }
    return "#000000";
  }, [useTeamColor, teamColors]);

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      `${baseUrl}/embed/team?teamId=${encodeURIComponent(teamId)}` +
      `&backgroundColor=${encodeURIComponent(finalBackgroundColor)}` +
      `&textColor=${encodeURIComponent(finalTextColor)}`
    );
  }, [teamId, finalBackgroundColor, finalTextColor]);

  // The final <iframe> code that user can copy
  const iframeCode = `<iframe src="${embedUrl}" class="alumni-iframe"></iframe>`;

  return (
    <div>
      <div className="mt-6">
        <Team 
          teamId={teamId}
          backgroundColor={finalBackgroundColor}
          textColor={finalTextColor}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} embedUrl={embedUrl} />
    </div>
  );
};

export default TeamWidgetSetup;
