"use client";

import React, { useState, useMemo } from "react";
import League from "@/app/components/league/League";
import EmbedCodeBlock from "../iframe/IframePreview";

interface LeagueWidgetSetupProps {
  leagueSlug: string;
}

const LeagueWidgetSetup: React.FC<LeagueWidgetSetupProps> = ({ leagueSlug }) => {
  const [bgColor] = useState("#FFFFFF");
  const [textColor] = useState("#000000");

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const base = `${baseUrl}/embed/league`;
    const params = new URLSearchParams({
      leagueSlug: leagueSlug,
      backgroundColor: bgColor,
      textColor: textColor,
    });
    return `${base}?${params.toString()}`;
  }, [leagueSlug, bgColor, textColor]);

  // The embed code the user can copy
  const iframeCode = `<iframe src="${embedUrl}" class="alumni-iframe"></iframe>`;

  return (
    <div>
      {/* Live Example Render */}
      <div className="mt-4">
        <League
          leagueSlug={leagueSlug}
          backgroundColor={bgColor}
          textColor={textColor}
        />
      </div>
      <EmbedCodeBlock iframeCode={iframeCode} embedUrl={embedUrl} />
    </div>
  );
};

export default LeagueWidgetSetup;
