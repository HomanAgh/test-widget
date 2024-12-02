"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import SearchBar from "@/app/components/teamroster/SearchBar";
import RosterTable from "@/app/components/teamroster/RosterTable";
import LanguageButton from "../../components/common/LanguageButton";
import LogoutButton from "@/app/components/common/LogoutButton";
import ColorPicker from "@/app/components/widgets/color-picker/ColorPicker";

const TeamRosterPage: React.FC = () => {
  const { t } = useTranslation(); // Hook for translations
  const [roster, setRoster] = useState<any[]>([]); // State for roster data
  const [error, setError] = useState<string | null>(null); // State for errors
  const [backgroundColor, setBackgroundColor] = useState<string>("#f9fafb"); // Default background color

  const handleColorChange = (color: string) => {
    setBackgroundColor(color); // Update background color dynamically
  };

  const handleTeamSelect = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teamroster?teamID=${teamId}`);
      if (!response.ok) {
        throw new Error(t("FetchError")); // Use translation for error message
      }
      const data = await response.json();
      setRoster(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || t("FetchError"));
      setRoster([]);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-center">{t("TeamRoster")}</h1>

      {/* Color Picker to choose background color */}
      <ColorPicker onColorChange={handleColorChange} />

      {/* Search Bar for selecting teams */}
      <SearchBar onSelect={handleTeamSelect} onError={setError} />
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Roster Table container with dynamic background */}
      <div
        className="mt-6 p-6 rounded-md shadow-md"
        style={{ backgroundColor }}
      >
        <RosterTable roster={roster} backgroundColor={backgroundColor} />
      </div>

      {/* Language and Logout Buttons */}
      <LanguageButton />
      <LogoutButton />
    </div>
  );
};

export default TeamRosterPage;
