/* "use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import SearchBar from "../../components/league/SearchBar";
import LeagueTable from "../../components/league/LeagueTable";
import BackgroundSelector from "../../components/widgets/BackgroundSelector";
import LogoutButton from "../../components/common/LogoutButton";
import LanguageButton from "@/app/components/common/LanguageButton";

const LeaguePage: React.FC = () => {
  const { t } = useTranslation(); // Hook for translations
  const [standings, setStandings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("bg-blue-100");
  
  // Determine appropriate text color based on background color
  const textColor =
    backgroundColor === "bg-gray-800 text-white" ? "text-black" : "text-gray-800";

  const handleLeagueSelect = async (leagueSlug: string) => {
    try {
      const response = await fetch(`/api/league?league=${leagueSlug}`);
      if (!response.ok) {
        throw new Error(t("FetchError")); // Use translation for error message
      }
      const data = await response.json();
      setStandings(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || t("FetchError"));
      setStandings(null);
    }
  };

  return (
    <div className={`min-h-screen p-4 bg-gray-50`}>
      <h1 className="text-2xl font-bold mb-4 text-center">{t("LeagueStandings")}</h1>
      <BackgroundSelector
        backgroundColor={backgroundColor}       
        setBackgroundColor={setBackgroundColor}
      />
      <SearchBar onSelect={handleLeagueSelect} onError={setError} />
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div
        className={`mt-6 p-6 rounded-md shadow-md ${backgroundColor} ${textColor}`}
      >
        {standings ? (
          <LeagueTable standings={standings} />
        ) : (
          <p>{t("NoStandings")}</p>
        )}
      </div>
      <LanguageButton />
      <LogoutButton />
    </div>
  );
};

export default LeaguePage;
 */

"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import SearchBar from "../../components/league/SearchBar";
import LeagueTable from "../../components/league/LeagueTable";
import LogoutButton from "../../components/common/LogoutButton";
import LanguageButton from "@/app/components/common/LanguageButton";
import ColorPicker from "@/app/components/widgets/color-picker/ColorPicker";

const LeaguePage: React.FC = () => {
  const { t } = useTranslation(); // Hook for translations
  const [standings, setStandings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#f9fafb"); // Default background color

  const handleColorChange = (color: string) => {
    setBackgroundColor(color); // Update background color dynamically
  };

  const handleLeagueSelect = async (leagueSlug: string) => {
    try {
      const response = await fetch(`/api/league?league=${leagueSlug}`);
      if (!response.ok) {
        throw new Error(t("FetchError")); // Use translation for error message
      }
      const data = await response.json();
      setStandings(data);
      setError(null);
    } catch (error: any) {
      setError(error.message || t("FetchError"));
      setStandings(null);
    }
  };

  return (
    <div className={`min-h-screen p-4 bg-gray-50`}>
      <h1 className="text-2xl font-bold mb-4 text-center">
        {t("LeagueStandings")}
      </h1>

      {/* Color Picker to choose background color */}
      <ColorPicker onColorChange={handleColorChange} />

      {/* Search Bar for selecting leagues */}
      <SearchBar onSelect={handleLeagueSelect} onError={setError} />
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* League Table container with dynamic background */}
      <div
        className="mt-6 p-6 rounded-md shadow-md"
        style={{ backgroundColor }} // Apply dynamic background color
      >
        {standings ? (
          <LeagueTable standings={standings} backgroundColor={backgroundColor} />
        ) : (
          <p>{t("NoStandings")}</p>
        )}
      </div>

      {/* Language and Logout Buttons */}
      <LanguageButton />
      <LogoutButton />
    </div>
  );
};

export default LeaguePage;
