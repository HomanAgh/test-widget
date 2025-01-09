"use client";

import React, { useState, useMemo } from "react";
import Team from "@/app/components/team/Team"; 
import TeamBackgroundColorSelector from "../common/TeamBackgroundColorSelector"; 

interface TeamWidgetSetupProps {
  teamId: string;
}

const TeamWidgetSetup: React.FC<TeamWidgetSetupProps> = ({ teamId }) => {
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [useTeamColor, setUseTeamColor] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");


  const [showPreview, setShowPreview] = useState(false);

  const finalBackgroundColor = useMemo(() => {
    if (useTeamColor && teamColors.length > 0) {
      return teamColors[0];
    }
    return customColor;
  }, [useTeamColor, teamColors, customColor]);

  const finalTextColor = useMemo(() => {
    if (useTeamColor && teamColors.length > 1) {
      return teamColors[1];
    }
    return "#000000";
  }, [useTeamColor, teamColors]);

  const embedUrl = useMemo(() => {
    return (
      `http://localhost:3000/embed/team?teamId=${encodeURIComponent(teamId)}` +
      `&backgroundColor=${encodeURIComponent(finalBackgroundColor)}` +
      `&textColor=${encodeURIComponent(finalTextColor)}`
    );
  }, [teamId, finalBackgroundColor, finalTextColor]);

  // The final <iframe> code that user can copy
  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      <TeamBackgroundColorSelector
        teamId={teamId}
        defaultEnabled={false}
        onTeamColorsChange={setTeamColors}
        onUseTeamColorChange={setUseTeamColor}
        onCustomColorChange={setCustomColor}
        enableText="Enable Team Colors"
        disableText="Disable Team Colors"
      />

      <div className="mt-6">
        <Team 
          teamId={teamId}
          backgroundColor={finalBackgroundColor}
          textColor={finalTextColor}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Embed Code</h3>
        <div className="flex items-center space-x-4">
          <textarea
            readOnly
            value={iframeCode}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          >
            Preview
          </button>
        </div>

        <h3 className="text-lg font-medium mt-4 mb-2">Preview</h3>
        {showPreview && (
          <iframe
            src={embedUrl}
            style={{ width: "100%", height: "500px", border: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default TeamWidgetSetup;
