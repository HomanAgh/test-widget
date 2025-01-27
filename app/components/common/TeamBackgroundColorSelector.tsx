"use client";

import React, { useState, useEffect } from "react";
import ToggleableColorPicker from "../common/color-picker/ToggleableColorPicker";

interface TeamBackgroundColorSelectorProps {
  playerId?: string;
  teamName?: string;
  teamId?: string;
  defaultEnabled?: boolean;
  onTeamColorsChange?: (colors: string[]) => void;
  onUseTeamColorChange?: (useTeamColor: boolean) => void;
  onCustomColorChange?: (color: string) => void;
  enableText?: string;
  disableText?: string;
  showColorPicker?: boolean; //nytt för att den inte ska dyka upp på alumnipage
}

const TeamBackgroundColorSelector: React.FC<TeamBackgroundColorSelectorProps> = ({
  playerId,
  teamName,
  teamId,
  defaultEnabled = false,
  onTeamColorsChange,
  onUseTeamColorChange,
  onCustomColorChange,
  enableText = "Enable Team Colors",
  disableText = "Disable Team Colors",
  showColorPicker = true, // Default to true
}) => {
  const [resolvedTeamId, setResolvedTeamId] = useState<string | null>(teamId ?? null);
  const [teamColors, setTeamColors] = useState<string[]>([]);

  // When we disable "Use Team Color", we allow a custom color
  const [customColor, setCustomColor] = useState("#FFFFFF");

  // Whether team colors are currently enabled
  const [useTeamColor, setUseTeamColor] = useState(defaultEnabled);

  /**
   * Step 1: Figure out the final Team ID from either:
   *  - direct teamId
   *  - playerId => fetch player's team
   *  - teamName => fetch team by name
   */
  useEffect(() => {
    // If we have an explicit teamId, use it directly
    if (teamId) {
      setResolvedTeamId(teamId);
      return;
    }

    // If we have a playerId, fetch player's info => get teamId
    if (playerId) {
      const fetchPlayerTeamId = async () => {
        try {
          const playerResponse = await fetch(`/api/player/${encodeURIComponent(playerId)}`);
          const playerData = await playerResponse.json();
          const fetchedTeamId = playerData?.playerInfo?.team?.id;
          setResolvedTeamId(fetchedTeamId || null);
        } catch (err) {
          console.error("Failed to fetch team from player:", err);
          setResolvedTeamId(null);
        }
      };
      fetchPlayerTeamId();
      return;
    }

    // If we have a teamName, fetch the ID
    if (teamName) {
      const fetchTeamIdByName = async () => {
        try {
          const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(teamName)}`);
          const data = await response.json();
          const foundTeam = data?.teams?.[0];
          setResolvedTeamId(foundTeam?.id || null);
        } catch (err) {
          console.error("Failed to fetch team by name:", err);
          setResolvedTeamId(null);
        }
      };
      fetchTeamIdByName();
      return;
    }

    // If none of the above, no team to fetch
    setResolvedTeamId(null);
  }, [playerId, teamName, teamId]);

  /**
   * Step 2: With the resolvedTeamId, fetch that team's colors
   */
  useEffect(() => {
    if (!resolvedTeamId) {
      setTeamColors([]);
      onTeamColorsChange?.([]);
      return;
    }

    const fetchColors = async () => {
      try {
        const colorResponse = await fetch(`/api/team?teamId=${resolvedTeamId}`);
        const colorData = await colorResponse.json();
        if (Array.isArray(colorData.colors)) {
          setTeamColors(colorData.colors);
          onTeamColorsChange?.(colorData.colors);
        } else {
          setTeamColors([]);
          onTeamColorsChange?.([]);
        }
      } catch (err) {
        console.error("Failed to fetch team colors:", err);
        setTeamColors([]);
        onTeamColorsChange?.([]);
      }
    };
    fetchColors();
  }, [resolvedTeamId, onTeamColorsChange]);

  /**
   * Step 3: Whenever user toggles "useTeamColor", tell parent
   */
  useEffect(() => {
    onUseTeamColorChange?.(useTeamColor);
  }, [useTeamColor, onUseTeamColorChange]);

  /**
   * Step 4: Whenever user picks a custom color, tell parent
   */
  useEffect(() => {
    onCustomColorChange?.(customColor);
  }, [customColor, onCustomColorChange]);

  return (
    <div>
      {/* Toggle Team Colors on/off */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-md ${useTeamColor ? "bg-blue-500" : "bg-gray-500"} text-white`}
          onClick={() => setUseTeamColor((prev) => !prev)}
        >
          {useTeamColor ? disableText : enableText}
        </button>
      </div>

      {/* If using team colors and we have them, show them */}
      {useTeamColor && teamColors.length > 0 && (
        <p className="text-center">Team Colors: {teamColors.join(", ")}</p>
      )}

      {/* If not using team color, show a color picker */}
      {!useTeamColor && showColorPicker && (
        <div className="flex justify-center mt-4">
          <ToggleableColorPicker
            onColorSelect={(color) => {
              setCustomColor(color);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TeamBackgroundColorSelector;
