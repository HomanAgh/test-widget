"use client";

import React, { useState, useMemo } from "react";
import Team from "@/app/components/team/Team"; 
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColors";

interface TeamWidgetSetupProps {
  teamId: string;
}

const TeamWidgetSetup: React.FC<TeamWidgetSetupProps> = ({ teamId }) => {
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    return (
      `${baseUrl}/embed/team` +
      `?teamId=${encodeURIComponent(teamId)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&_t=${Date.now()}`
    );
  }, [teamId, customColors]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      <div className="mt-6 mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
          <HexColors customColors={customColors} setCustomColors={setCustomColors} />
        </div>
      </div>

      <div className="mt-6">
        <Team 
          teamId={teamId}
          customColors={customColors}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default TeamWidgetSetup;
