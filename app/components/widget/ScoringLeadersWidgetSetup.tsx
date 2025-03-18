"use client";

import React, { useState, useMemo } from "react";
import ScoringLeaders from "@/app/components/league/ScoringLeaders";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColorsAndIframeHeight";

// Default height for iframes
const DEFAULT_IFRAME_HEIGHT = 1300;

interface ScoringLeadersWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

const ScoringLeadersWidgetSetup: React.FC<ScoringLeadersWidgetSetupProps> = ({ leagueSlug, season }) => {
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    const url = `${baseUrl}/embed/scoring-leaders` +
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

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>`;

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
          <HexColors 
            customColors={customColors} 
            setCustomColors={setCustomColors}
            height={iframeHeight}
            onHeightChange={setIframeHeight}
            defaultHeight={DEFAULT_IFRAME_HEIGHT}
          />
        </div>
      </div>

      <div className="mt-6">
        <ScoringLeaders 
          leagueSlug={leagueSlug}
          season={season}
          customColors={customColors}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default ScoringLeadersWidgetSetup;
