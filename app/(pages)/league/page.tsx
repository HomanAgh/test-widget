'use client';

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SearchBar from "../../components/league/SearchBar";
import LeagueTable from "../../components/league/LeagueTable";
import LogoutButton from "../../components/common/LogoutButton";
import LanguageButton from "@/app/components/common/LanguageButton";
import HomeButton from "@/app/components/common/HomeButton";
import ColorPicker from "@/app/components/widgets/color-picker/ColorPicker";

const LeaguePage: React.FC = () => {
  const { t } = useTranslation();
  const [standings, setStandings] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>("#f9fafb");

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  const handleLeagueSelect = async (leagueSlug: string) => {
    try {
      const response = await fetch(`/api/league?league=${leagueSlug}`);
      if (!response.ok) {
        throw new Error(t("FetchError"));
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
    <div className="min-h-screen p-4 bg-gray-50 relative">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Home Button - Top Left */}
        <div>
          <HomeButton />
        </div>

        {/* Language Button - Top Right */}
        <div>
          <LanguageButton />
        </div>
      </div>

      {/* Main Content */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        {t("LeagueStandings")}
      </h1>

      {/* Color Picker */}
      <ColorPicker onColorChange={handleColorChange} />

      {/* Search Bar */}
      <SearchBar onSelect={handleLeagueSelect} onError={setError} />
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* League Table */}
      <div
        className="mt-6 p-6 rounded-md shadow-md"
        style={{ backgroundColor }}
      >
        {standings ? (
          <LeagueTable standings={standings} backgroundColor={backgroundColor} />
        ) : (
          <p>{t("NoStandings")}</p>
        )}
      </div>

      {/* Logout Button - Positioned Below */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default LeaguePage;
