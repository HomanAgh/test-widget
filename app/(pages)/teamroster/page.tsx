/* 'use client';

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import SearchBar from "@/app/components/common/SearchBar";
import RosterTable from "@/app/components/teamroster/RosterTable";
import LanguageButton from "../../components/common/LanguageButton";
import LogoutButton from "@/app/components/common/LogoutButton";
import ColorPicker from "@/app/components/widgets/color-picker/ColorPicker";
import HomeButton from "@/app/components/common/HomeButton";

const TeamRosterPage: React.FC = () => {
  const { t } = useTranslation();
  const [roster, setRoster] = useState<any[]>([]); // State for roster data
  const [error, setError] = useState<string | null>(null); // State for errors
  const [backgroundStyle, setBackgroundStyle] = useState<{ backgroundColor?: string; backgroundImage?: string }>({
    backgroundColor: "#f9fafb", // Default background color
  });

  const handleColorChange = (color: string) => {
    if (color.startsWith("linear-gradient")) {
      // Apply gradient as backgroundImage
      setBackgroundStyle({ backgroundImage: color });
    } else {
      // Apply solid color as backgroundColor
      setBackgroundStyle({ backgroundColor: color });
    }
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
    <div className="min-h-screen p-4 bg-gray-50 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <HomeButton />
        </div>
        <div>
          <LanguageButton />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        {t("TeamRoster")}
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          {t("ChooseBackgroundColor")}
        </h2>
        <ColorPicker onColorSelect={handleColorChange} />
      </div>

      <SearchBar onSelect={handleTeamSelect} onError={setError} type={"team"} />
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      <div
        className="mt-6 p-6 rounded-md shadow-md"
        style={{
          ...backgroundStyle, // Dynamically apply backgroundColor or backgroundImage
        }}
      >
        {roster.length > 0 ? (
          <RosterTable roster={roster} backgroundColor={backgroundStyle.backgroundColor || "#f9fafb"} />
        ) : (
          <p className="text-center">{t("NoRosterData")}</p>
        )}
      </div>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default TeamRosterPage; */

'use client';

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "@/app/components/common/SearchBar";
import RosterTable from "@/app/components/teamroster/RosterTable";
import LanguageButton from "../../components/common/LanguageButton";
import LogoutButton from "@/app/components/common/LogoutButton";
import ColorPicker from "@/app/components/widgets/color-picker/ColorPicker";
import HomeButton from "@/app/components/common/HomeButton";

const TeamRosterPage: React.FC = () => {
  const { t } = useTranslation();
  const [roster, setRoster] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<{ backgroundColor?: string; backgroundImage?: string }>({
    backgroundColor: "#f9fafb",
  });

  const handleColorChange = (color: string) => {
    if (color.startsWith("linear-gradient")) {
      setBackgroundStyle({ backgroundImage: color });
    } else {
      setBackgroundStyle({ backgroundColor: color });
    }
  };

  const handleTeamSearch = async (teamName: string) => {
    try {
      // Fetch roster based on team name
      const response = await fetch(`/api/teamroster?query=${encodeURIComponent(teamName)}`);
      if (!response.ok) {
        throw new Error(t("FetchError"));
      }
      const rosterData = await response.json();
      setRoster(rosterData);
      setError(null);
    } catch (error: any) {
      setError(error.message || t("FetchError"));
      setRoster([]);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50 relative">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <HomeButton />
        </div>
        <div>
          <LanguageButton />
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        {t("TeamRoster")}
      </h1>

      {/* Color Picker */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          {t("ChooseBackgroundColor")}
        </h2>
        <div className="flex justify-center">
          <ColorPicker onColorSelect={handleColorChange} />
        </div> 
      </div>

      {/* Search Bar */}
      <SearchBar onSelect={handleTeamSearch} onError={setError} type={"team"} />
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* Roster Table with Dynamic Background */}
      <div
        className="mt-6 p-6 rounded-md shadow-md"
        style={{
          ...backgroundStyle,
        }}
      >
        {roster.length > 0 ? (
          <RosterTable roster={roster} backgroundColor={backgroundStyle.backgroundColor || "#f9fafb"} />
        ) : (
          <p className="text-center">{t("NoRosterData")}</p>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default TeamRosterPage;
