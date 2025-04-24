"use client";

import React, { useMemo, useState } from "react";
import League from "@/app/components/league/League";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "@/app/components/common/color-picker/HexColorsAndIframeHeight";

const DEFAULT_IFRAME_HEIGHT = 800;

interface LeagueWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

const LeagueWidgetSetup: React.FC<LeagueWidgetSetupProps> = ({
  leagueSlug,
  season,
}) => {
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
    
    const url = `${baseUrl}/embed/league` +
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

  const sourceLinks = useMemo(() => {
    if (!leagueSlug) return '';
    
    return `<p> Source: <a href="https://www.eliteprospects.com/league/${leagueSlug}" target="_blank" rel="noopener noreferrer">${leagueSlug.toUpperCase()} League Page</a> @ Elite Prospects</p>`;
  }, [leagueSlug]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${sourceLinks ? '\n' + sourceLinks : ''}`;

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
      
      <div className="mt-4">
        <League 
          leagueSlug={leagueSlug}
          customColors={customColors}
        />
      </div>
      
      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default LeagueWidgetSetup;
