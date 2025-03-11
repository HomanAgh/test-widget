"use client";

import React, { useMemo, useState } from "react";
import League from "@/app/components/league/League";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "@/app/components/common/color-picker/HexColors";

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

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const base = `${baseUrl}/embed/league`;
    const params = new URLSearchParams({
      leagueSlug,
      season,
      backgroundColor: customColors.backgroundColor,
      textColor: customColors.textColor,
      tableBackgroundColor: customColors.tableBackgroundColor,
      headerTextColor: customColors.headerTextColor,
      nameTextColor: customColors.nameTextColor,
    });
    return `${base}?${params.toString()}`;
  }, [leagueSlug, season, customColors]);

  const iframeCode = `<iframe src="${embedUrl}" class="iframe"></iframe>`;

  return (
    <div>
      <div className="mt-6 mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
          <HexColors customColors={customColors} setCustomColors={setCustomColors} />
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
