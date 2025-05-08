"use client";

import React, { useState, useMemo, useEffect } from "react";
import ScoringLeaders from "@/app/components/league/ScoringLeaders";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColorsAndIframeHeight";
import NationalityFilter from "../common/filters/NationalityFilter";
import PositionFilter from "../common/filters/PositionFilter";
import { createClient } from "@/app/utils/supabase/client";
import {
  getOrganizationColors,
  ColorPreferences,
  DEFAULT_COLORS,
} from "@/app/utils/organizationColors";

// Default height for iframes
const DEFAULT_IFRAME_HEIGHT = 1300;

interface ScoringLeadersWidgetSetupProps {
  leagueSlug: string;
  season: string;
}

// Function to make sure all color properties exist with valid values
function ensureCompleteColors(colors: any): ColorPreferences {
  // Create a copy of DEFAULT_COLORS with explicit assignments
  const result: ColorPreferences = {
    headerTextColor: DEFAULT_COLORS.headerTextColor,
    backgroundColor: DEFAULT_COLORS.backgroundColor,
    textColor: DEFAULT_COLORS.textColor,
    tableBackgroundColor: DEFAULT_COLORS.tableBackgroundColor,
    nameTextColor: DEFAULT_COLORS.nameTextColor,
  };

  // Override with any valid properties from colors
  if (colors && typeof colors === "object") {
    if (colors.headerTextColor && typeof colors.headerTextColor === "string")
      result.headerTextColor = colors.headerTextColor;

    if (colors.backgroundColor && typeof colors.backgroundColor === "string")
      result.backgroundColor = colors.backgroundColor;

    if (colors.textColor && typeof colors.textColor === "string")
      result.textColor = colors.textColor;

    if (
      colors.tableBackgroundColor &&
      typeof colors.tableBackgroundColor === "string"
    )
      result.tableBackgroundColor = colors.tableBackgroundColor;

    if (colors.nameTextColor && typeof colors.nameTextColor === "string")
      result.nameTextColor = colors.nameTextColor;
  }

  return result;
}

const ScoringLeadersWidgetSetup: React.FC<ScoringLeadersWidgetSetupProps> = ({
  leagueSlug,
  season,
}) => {
  const [customColors, setCustomColors] = useState<ColorPreferences>({
    ...DEFAULT_COLORS,
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedNationalities, setSelectedNationalities] = useState<string[]>(
    []
  );
  const [statsType, setStatsType] = useState<"regular" | "postseason">(
    "regular"
  );
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch organization colors
  useEffect(() => {
    const fetchOrgColors = async () => {
      try {
        setError(null);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("organization_id")
            .eq("id", user.id)
            .single();

          if (!userError && userData?.organization_id) {
            const { data: prefData } = await supabase
              .from("organization_preferences")
              .select("*")
              .eq("organization_id", userData.organization_id)
              .single();

            if (prefData?.colors) {
              const normalizedColors = ensureCompleteColors(prefData.colors);
              setCustomColors(normalizedColors);
            }
          }
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
        setError(
          `An error occurred while loading data: ${
            error?.message || String(error)
          }`
        );
      }
    };

    fetchOrgColors();
  }, [supabase]);

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const positionParam =
      selectedPositions.length > 0 ? selectedPositions.join(",") : "all";
    const nationalityParam =
      selectedNationalities.length > 0
        ? selectedNationalities.join(",")
        : "all";

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
      `&positionFilter=${encodeURIComponent(positionParam)}` +
      `&nationalityFilter=${encodeURIComponent(nationalityParam)}` +
      `&statsType=${encodeURIComponent(statsType)}` +
      `&_t=${Date.now()}`;

    return url;
  }, [
    leagueSlug,
    season,
    customColors,
    selectedPositions,
    selectedNationalities,
    statsType,
  ]);

  const sourceLinks = useMemo(() => {
    if (!leagueSlug) return "";

    const seasonInfo = season ? `${season}` : "";
    return `<p> Source: <a href="https://www.eliteprospects.com/league/${leagueSlug}/stats/${seasonInfo}" target="_blank" rel="noopener noreferrer">${leagueSlug.toUpperCase()} Scoring Leaders</a> @ Elite Prospects</p>`;
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
          <PositionFilter
            selectedValues={selectedPositions}
            onSelectionChange={setSelectedPositions}
            customColors={customColors}
          />
          <NationalityFilter
            selectedValues={selectedNationalities}
            onSelectionChange={setSelectedNationalities}
            customColors={customColors}
          />
        </div>
        <div
          className={`flex flex-wrap md:flex-nowrap items-center space-x-8 ${
            selectedNationalities.length > 0 || selectedPositions.length > 0
              ? "mt-3"
              : "mt-0"
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
        <ScoringLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={customColors}
          positionFilter={
            selectedPositions.length > 0 ? selectedPositions.join(",") : "all"
          }
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

export default ScoringLeadersWidgetSetup;
