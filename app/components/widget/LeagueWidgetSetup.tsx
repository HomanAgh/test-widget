"use client";

import React, {useMemo } from "react";
import League from "@/app/components/league/League";
import EmbedCodeBlock from "../iframe/IframePreview";

interface LeagueWidgetSetupProps {
  leagueSlug: string;
}

const LeagueWidgetSetup: React.FC<LeagueWidgetSetupProps> = ({ leagueSlug }) => {

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const base = `${baseUrl}/embed/league`;
    const params = new URLSearchParams({
      leagueSlug: leagueSlug,
    });
    return `${base}?${params.toString()}`;
  }, [leagueSlug]);

  const iframeCode = `<iframe src="${embedUrl}" class="alumni-iframe"></iframe>`;

  return (
    <div>
      <div className="mt-4">
        <League
          leagueSlug={leagueSlug}
        />
      </div>
      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default LeagueWidgetSetup;
