"use client";

import React, { useMemo, useState, useEffect } from "react";
import League from "@/app/components/league/League";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "@/app/components/common/color-picker/HexColorsAndIframeHeight";
import { createClient } from "@/app/utils/supabase/client";
import {
  getOrganizationColors,
  ColorPreferences,
  DEFAULT_COLORS,
} from "@/app/utils/organizationColors";

const DEFAULT_IFRAME_HEIGHT = 800;

interface LeagueWidgetSetupProps {
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

const LeagueWidgetSetup: React.FC<LeagueWidgetSetupProps> = ({
  leagueSlug,
  season,
}) => {
  const [customColors, setCustomColors] = useState<ColorPreferences>({
    ...DEFAULT_COLORS,
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch organization colors
  useEffect(() => {
    const fetchData = async () => {
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

    fetchData();
  }, [supabase]);

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const url =
      `${baseUrl}/embed/league` +
      `?leagueSlug=${encodeURIComponent(leagueSlug)}` +
      `&season=${encodeURIComponent(season)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&_t=${Date.now()}`;

    return url;
  }, [leagueSlug, season, customColors]);

  const sourceLinks = useMemo(() => {
    if (!leagueSlug) return "";

    return `<p> Source: <a href="https://www.eliteprospects.com/league/${leagueSlug}" target="_blank" rel="noopener noreferrer">${leagueSlug.toUpperCase()} League Page</a> @ Elite Prospects</p>`;
  }, [leagueSlug]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${
    sourceLinks ? "\n" + sourceLinks : ""
  }`;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded mb-6">
        <p className="font-semibold">Error:</p>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

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
        <League leagueSlug={leagueSlug} customColors={customColors} />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default LeagueWidgetSetup;
