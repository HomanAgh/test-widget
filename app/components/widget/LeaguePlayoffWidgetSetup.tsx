"use client";

import React, { useMemo, useState } from "react";
import LeaguePlayoff from "@/app/components/leaguePlayoff/LeaguePlayoff";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "@/app/components/iframe/IframeHeightAndHexcolors";

const DEFAULT_IFRAME_HEIGHT = 800;

interface LeaguePlayoffWidgetSetupProps {
  leagueId: string;
  season: string;
}

const LeaguePlayoffWidgetSetup: React.FC<LeaguePlayoffWidgetSetupProps> = ({
  leagueId,
  season,
}) => {
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    
    const url = `${baseUrl}/embed/leaguePlayoff` +
      `?leagueId=${encodeURIComponent(leagueId)}` +
      `&season=${encodeURIComponent(season)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&_t=${Date.now()}`;
    
    return url;
  }, [leagueId, season, customColors]);

  const sourceLinks = useMemo(() => {
    if (!leagueId) return '';
    
    let leagueName = leagueId.toUpperCase();
    if (leagueId === 'nhl') {
      leagueName = 'NHL';
    }
    
    return `<p> Source: <a href="https://www.eliteprospects.com/league/${leagueId}" target="_blank" rel="noopener noreferrer">${leagueName} Playoff Bracket</a> @ Elite Prospects</p>`;
  }, [leagueId]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${sourceLinks ? '\n' + sourceLinks : ''}`;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Add Playoff Bracket to Your Website</h2>
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
      
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold mb-4">Playoff Bracket Preview</h2>
        <div style={{ 
          backgroundColor: customColors.backgroundColor,
          color: customColors.textColor,
          padding: '20px',
          borderRadius: '8px'
        }}>
          <LeaguePlayoff 
            leagueId={leagueId}
            customColors={customColors}
          />
        </div>
      </div>
      
      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default LeaguePlayoffWidgetSetup;
