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

const ScoringLeadersWidgetSetup: React.FC<ScoringLeadersWidgetSetupProps> = ({
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
  const [positionFilter, setPositionFilter] = useState("all");
  const [nationalityFilter, setNationalityFilter] = useState("all");

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const url =
      `${baseUrl}/embed/scoring-leaders` +
      `?leagueSlug=${encodeURIComponent(leagueSlug)}` +
      `&season=${encodeURIComponent(season)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&positionFilter=${encodeURIComponent(positionFilter)}` +
      `&nationalityFilter=${encodeURIComponent(nationalityFilter)}` +
      `&_t=${Date.now()}`;

    return url;
  }, [leagueSlug, season, customColors, positionFilter, nationalityFilter]);

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
        <div className="flex items-center space-x-4 mt-4">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="p-2 border rounded-lg"
            style={{
              backgroundColor: customColors.tableBackgroundColor,
              color: customColors.textColor,
              borderColor: customColors.backgroundColor,
            }}
          >
            <option value="all">All Positions</option>
            <option value="C">Center</option>
            <option value="LW">Left Wing</option>
            <option value="RW">Right Wing</option>
            <option value="D">Defenseman</option>
          </select>
          <select
            value={nationalityFilter}
            onChange={(e) => setNationalityFilter(e.target.value)}
            className="p-2 border rounded-lg"
            style={{
              backgroundColor: customColors.tableBackgroundColor,
              color: customColors.textColor,
              borderColor: customColors.backgroundColor,
            }}
          >
            <option value="all">All Nationalities</option>
            <option value="swe">Sweden</option>
            <option value="fin">Finland</option>
            <option value="can">Canada</option>
            <option value="usa">USA</option>
            <option value="rus">Russia</option>
            <option value="cze">Czech Republic</option>
            <option value="svk">Slovakia</option>
            <option value="deu">Germany</option>
            <option value="che">Switzerland</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <ScoringLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={customColors}
          positionFilter={positionFilter}
          nationalityFilter={nationalityFilter}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default ScoringLeadersWidgetSetup;
