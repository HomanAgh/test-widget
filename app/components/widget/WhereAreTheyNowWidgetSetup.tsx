"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SelectedTeam } from "@/app/types/team";
import TeamSearchBar from "@/app/components/alumni/TeamSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection";
import { useFetchLeagues } from "@/app/hooks/useFetchLeagues";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import WhereAreTheyNow from "@/app/components/where-are-they-now/WhereAreTheyNow";
import HexColors from "@/app/components/iframe/IframeHeightAndHexcolors";
import EmbedCodeBlock from "../iframe/IframePreview";

import SettingsFilter from "@/app/components/common/filters/SettingsFilter";
import { createClient } from "@/app/utils/client";
import {
  ColorPreferences,
  DEFAULT_COLORS,
} from "@/app/utils/organizationColors";
import { determineSelectedLeagueCategories } from "@/app/utils/leagueCategories";

const DEFAULT_IFRAME_HEIGHT = 1300;

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

const WhereAreTheyNowWidgetSetup: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState<boolean>(true);
  const [isLeagueGroupingEnabled, setIsLeagueGroupingEnabled] = useState<boolean>(false);
  const [customColors, setCustomColors] = useState<ColorPreferences>({
    ...DEFAULT_COLORS,
  });
  const [subHeaderColors, setSubHeaderColors] = useState({
    backgroundColor: "#f8f9fa",
    textColor: "#000000",
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const supabase = createClient();

  const { customLeagues, customJunLeagues, customCollegeLeagues } =
    useFetchLeagues();

  // Fetch organization colors when component loads
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

  // Determine which league categories are selected
  const selectedLeagueCategories = useMemo(() => {
    return determineSelectedLeagueCategories(selectedLeagues);
  }, [selectedLeagues]);

  const youthName =
    selectedTeams.length > 0 ? selectedTeams[0].name : "CHICAGO MISSION U16";

  // Create embed URL for "Where are they now"
  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const teamIds = selectedTeams.map((t) => t.id).join(",");
    const leagues = selectedLeagues.join(",");

    return (
      `${baseUrl}/embed/where-are-they-now` +
      `?teamIds=${encodeURIComponent(teamIds)}` +
      `&leagues=${encodeURIComponent(leagues)}` +
      `&teams=${encodeURIComponent(youthName)}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(
        customColors.tableBackgroundColor
      )}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}` +
      `&includeYouth=true` +
      `&isPaginationEnabled=${encodeURIComponent(isPaginationEnabled)}` +
      `&isLeagueGroupingEnabled=${encodeURIComponent(isLeagueGroupingEnabled)}` +
      `&subHeaderBackgroundColor=${encodeURIComponent(subHeaderColors.backgroundColor)}` +
      `&subHeaderTextColor=${encodeURIComponent(subHeaderColors.textColor)}` +
      `&_t=${Date.now()}`
    );
  }, [selectedTeams, selectedLeagues, customColors, youthName, isPaginationEnabled, isLeagueGroupingEnabled, subHeaderColors]);

  const sourceLinks = useMemo(() => {
    if (selectedTeams.length === 0) return "";

    const lastTeam = selectedTeams[selectedTeams.length - 1];
    return `<p> Source: <a href="https://www.eliteprospects.com/team/${
      lastTeam.id
    }/${lastTeam.name
      .toLowerCase()
      .replace(/\s+/g, "-")}" target="_blank" rel="noopener noreferrer">${
      lastTeam.name
    }</a> @ Elite Prospects</p>`;
  }, [selectedTeams]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${
    sourceLinks ? "\n" + sourceLinks : ""
  }`;

  return (
    <div>
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About &ldquo;Where Are They Now&rdquo;</h2>
        <p className="text-sm text-gray-700">
          This widget shows current teams and leagues where alumni players are actively playing. 
          Unlike the Alumni widget which shows all historical teams, this focuses only on current active seasons.
        </p>
        <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
          <li>Shows only players with active seasons (isActiveSeason = true)</li>
          <li>Displays current teams instead of historical career data</li>
          <li>Includes summary statistics for active players</li>
          <li>Real-time view of where alumni are playing now</li>
        </ul>
      </div>

      <TeamSearchBar
        onSelect={(team) => setSelectedTeams([team])}
        onError={(errMsg) => setError(errMsg)}
        selectedTeams={selectedTeams}
        onCheckedTeamsChange={setSelectedTeams}
      />

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}
        juniorLeagues={customJunLeagues}
        collegeLeagues={customCollegeLeagues}
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />



      <div className="mt-4">
        <SettingsFilter
          isPaginationEnabled={isPaginationEnabled}
          onPaginationToggle={setIsPaginationEnabled}
          isLeagueGroupingEnabled={isLeagueGroupingEnabled}
          onLeagueGroupingToggle={setIsLeagueGroupingEnabled}
          customColors={customColors}
        />
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center space-x-8">
        <HexColors
          customColors={customColors}
          setCustomColors={setCustomColors}
          height={iframeHeight}
          onHeightChange={setIframeHeight}
          defaultHeight={DEFAULT_IFRAME_HEIGHT}
          subHeaderColors={subHeaderColors}
          setSubHeaderColors={setSubHeaderColors}
          isPaginationEnabled={isPaginationEnabled}
          isLeagueGroupingEnabled={isLeagueGroupingEnabled}
          onResetSettings={() => {
            setIsPaginationEnabled(true);
            setIsLeagueGroupingEnabled(false);
          }}
        />
      </div>

      {selectedTeams.length > 0 && (
        <div className="mt-6">
          <WhereAreTheyNow
            selectedTeams={selectedTeams}
            selectedLeagues={selectedLeagues}
            customColors={customColors}
            includeYouth={true}
            selectedLeagueCategories={selectedLeagueCategories}
            isPaginationEnabled={isPaginationEnabled}
            isLeagueGroupingEnabled={isLeagueGroupingEnabled}
            subHeaderColors={subHeaderColors}
          />
        </div>
      )}

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default WhereAreTheyNowWidgetSetup; 