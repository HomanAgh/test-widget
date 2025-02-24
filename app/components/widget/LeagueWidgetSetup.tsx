"use client";

import React, { useMemo } from "react";
import League from "@/app/components/league/League";
import EmbedCodeBlock from "../iframe/IframePreview";

interface LeagueWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

const LeagueWidgetSetup: React.FC<LeagueWidgetSetupProps> = ({
  leagueSlug,
  season,
}) => {
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const base = `${baseUrl}/embed/league`;
    const params = new URLSearchParams({
      leagueSlug,
      season, 
    });
    return `${base}?${params.toString()}`;
  }, [leagueSlug, season]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      <div className="mt-4">
        <League leagueSlug={leagueSlug} />
      </div>
      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default LeagueWidgetSetup;
