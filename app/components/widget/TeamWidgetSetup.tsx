"use client";

import React, { useState, useMemo, useEffect } from "react";
import Team from "@/app/components/team/Team";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColorsAndIframeHeight";
import TeamColumnSelector from "../team/TeamColumnSelector";
import {
  TeamColumnOptions,
  DEFAULT_COLUMNS,
} from "../team/TeamColumnDefinitions";
import { Team as TeamType } from "@/app/types/team";
import { createClient } from "@/app/utils/supabase/client";
import {
  getOrganizationColors,
  ColorPreferences,
  DEFAULT_COLORS,
} from "@/app/utils/organizationColors";

const DEFAULT_IFRAME_HEIGHT = 800;

interface TeamWidgetSetupProps {
  teamId: string;
}

// Function to make sure all color properties exist with valid values
function ensureCompleteColors(colors: any): ColorPreferences {
  // Create a copy of DEFAULT_COLORS
  const result = { ...DEFAULT_COLORS };

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

const TeamWidgetSetup: React.FC<TeamWidgetSetupProps> = ({ teamId }) => {
  const [customColors, setCustomColors] = useState<ColorPreferences>({
    ...DEFAULT_COLORS,
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [selectedColumns, setSelectedColumns] =
    useState<TeamColumnOptions>(DEFAULT_COLUMNS);
  const [teamData, setTeamData] = useState<TeamType | null>(null);
  const [statsType, setStatsType] = useState<"regular" | "postseason">(
    "regular"
  );
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch team data and organization colors
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

        // Fetch team data
        try {
          const response = await fetch(
            `/api/team/${encodeURIComponent(teamId)}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch team data");
          }
          const data = await response.json();
          setTeamData(data);
        } catch (teamError: any) {
          console.error("Error fetching team data:", teamError);
          setError(
            `Failed to load team data: ${
              teamError?.message || String(teamError)
            }`
          );
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
  }, [teamId, supabase]);

  const handleStatsTypeChange = (newStatsType: "regular" | "postseason") => {
    setStatsType(newStatsType);
  };

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    // Serialize selected columns for the URL
    const columnsParam = encodeURIComponent(
      Object.entries(selectedColumns)
        .filter(([, value]) => value) // Only include enabled columns
        .map(([key]) => key)
        .join(",")
    );

    return (
      `${baseUrl}/embed/team` +
      `?teamId=${encodeURIComponent(teamId)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&columns=${columnsParam}` +
      `&statsType=${encodeURIComponent(statsType)}` +
      `&_t=${Date.now()}`
    );
  }, [teamId, customColors, selectedColumns, statsType]);

  const sourceLinks = useMemo(() => {
    if (!teamId || !teamData) return "";

    return `<p> Source: <a href="https://www.eliteprospects.com/team/${teamId}/${teamData.name
      .toLowerCase()
      .replace(/\s+/g, "-")}" target="_blank" rel="noopener noreferrer">${
      teamData.name
    }</a> @ Elite Prospects</p>`;
  }, [teamId, teamData]);

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
      <div className="mt-6 mb-6">
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

      <div className="mt-4 mb-6">
        <TeamColumnSelector
          selectedColumns={selectedColumns}
          onChange={setSelectedColumns}
        />
      </div>

      <div className="mt-6">
        <Team
          teamId={teamId}
          customColors={customColors}
          selectedColumns={selectedColumns}
          onStatsTypeChange={handleStatsTypeChange}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default TeamWidgetSetup;
