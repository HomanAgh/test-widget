"use client";

import React, { useState, useMemo } from "react";
import GoalieLeaders from "@/app/components/league/GoalieLeaders";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColors";

interface GoalieLeadersWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

const GoalieLeadersWidgetSetup: React.FC<GoalieLeadersWidgetSetupProps> = ({ leagueSlug, season }) => {
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    const url = `${baseUrl}/embed/goalie-leaders` +
      `?leagueSlug=${encodeURIComponent(leagueSlug)}` +
      `&season=${encodeURIComponent(season)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&_t=${Date.now()}`;
    
    return url;
  }, [leagueSlug, season, customColors]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="800" style="border:none;" class="iframe"></iframe>`;

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
          <HexColors customColors={customColors} setCustomColors={setCustomColors} />
        </div>
      </div>

      <div className="mt-6">
        <GoalieLeaders 
          leagueSlug={leagueSlug}
          season={season}
          customColors={customColors}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default GoalieLeadersWidgetSetup;
