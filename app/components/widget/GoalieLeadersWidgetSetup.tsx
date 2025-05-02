"use client";

import React, { useState, useMemo } from "react";
import GoalieLeaders from "@/app/components/league/GoalieLeaders";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColorsAndIframeHeight";
import NationalityFilter from "../common/filters/NationalityFilter";

const DEFAULT_IFRAME_HEIGHT = 1300;

interface GoalieLeadersWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

const GoalieLeadersWidgetSetup: React.FC<GoalieLeadersWidgetSetupProps> = ({
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
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>(
    []
  );
  const [statsType, setStatsType] = useState<"regular" | "postseason">(
    "regular"
  );

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const nationalityParam =
      selectedNationalities.length > 0
        ? selectedNationalities.join(",")
        : "all";

    const url =
      `${baseUrl}/embed/goalie-leaders` +
      `?leagueSlug=${encodeURIComponent(leagueSlug)}` +
      `&season=${encodeURIComponent(season)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&nationality=${encodeURIComponent(nationalityParam)}` +
      `&statsType=${encodeURIComponent(statsType)}` +
      `&_t=${Date.now()}`;

    return url;
  }, [leagueSlug, season, customColors, selectedNationalities, statsType]);

  const sourceLinks = useMemo(() => {
    if (!leagueSlug) return "";

    const seasonInfo = season ? `${season}` : "";
    return `<p> Source: <a href="https://www.eliteprospects.com/league/${leagueSlug}/stats/${seasonInfo}#goalies" target="_blank" rel="noopener noreferrer">${leagueSlug.toUpperCase()} Goalie Leaders</a> @ Elite Prospects</p>`;
  }, [leagueSlug, season]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${
    sourceLinks ? "\n" + sourceLinks : ""
  }`;

  const handleStatsTypeChange = (newStatsType: "regular" | "postseason") => {
    setStatsType(newStatsType);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="space-y-4">
          <NationalityFilter
            selectedValues={selectedNationalities}
            onSelectionChange={setSelectedNationalities}
            customColors={customColors}
          />
        </div>
        <div
          className={`flex flex-wrap md:flex-nowrap items-center space-x-8 ${
            selectedNationalities.length > 0 ? "mt-3" : "mt-0"
          }`}
        >
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
        <GoalieLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={customColors}
          nationalityFilter={
            selectedNationalities.length > 0
              ? selectedNationalities.join(",")
              : "all"
          }
          onStatsTypeChange={handleStatsTypeChange}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default GoalieLeadersWidgetSetup;
