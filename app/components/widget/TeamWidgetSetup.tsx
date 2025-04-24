"use client";

import React, { useState, useMemo } from "react";
import Team from "@/app/components/team/Team";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColorsAndIframeHeight";
import TeamColumnSelector, {
  TeamColumnOptions,
} from "../team/TeamColumnSelector";

const DEFAULT_IFRAME_HEIGHT = 800;

const DEFAULT_COLUMNS: TeamColumnOptions = {
  name: true,
  number: true,
  position: true,
  age: true,
  birthYear: true,
  birthPlace: true,
  weight: true,
  height: true,
  shootsCatches: true,
  goals: true,
  assists: true,
  points: true,
};

interface TeamWidgetSetupProps {
  teamId: string;
}

const TeamWidgetSetup: React.FC<TeamWidgetSetupProps> = ({ teamId }) => {
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [selectedColumns, setSelectedColumns] =
    useState<TeamColumnOptions>(DEFAULT_COLUMNS);

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
      `&_t=${Date.now()}`
    );
  }, [teamId, customColors, selectedColumns]);

  const sourceLinks = useMemo(() => {
    if (!teamId) return '';
    
    return `<p> Source: <a href="https://www.eliteprospects.com/team/${teamId}" target="_blank" rel="noopener noreferrer">Team Page</a> @ Elite Prospects</p>`;
  }, [teamId]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${sourceLinks ? '\n' + sourceLinks : ''}`;

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
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode} />
    </div>
  );
};

export default TeamWidgetSetup;
