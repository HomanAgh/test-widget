"use client";

import React, { useMemo } from "react";
import ScoringLeaders from "@/app/components/league/ScoringLeaders";
import EmbedCodeBlock from "../iframe/IframePreview";

interface ScoringLeadersWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

const ScoringLeadersWidgetSetup: React.FC<ScoringLeadersWidgetSetupProps> = ({ leagueSlug, season }) => {
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      `${baseUrl}/embed/scoring-leaders?leagueSlug=${encodeURIComponent(leagueSlug)}&season=${encodeURIComponent(season)}`
    );
  }, [leagueSlug, season]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      <div className="mt-6">
        <ScoringLeaders 
          leagueSlug={leagueSlug}
          season={season}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default ScoringLeadersWidgetSetup;
