'use client';

import React, { useState } from "react";
import  {LeagueTableProps} from "@/app/types/league";
import SearchBar from "@/app/components/league/LeagueSearch";
import LeagueTable from "../../components/league/LeagueTable";
import LogoutButton from "../../components/common/LogoutButton";
import HomeButton from "@/app/components/common/HomeButton";
import ToggleableColorPicker from "@/app/components/common/color-picker/ToggleableColorPicker"; // Import ToggleableColorPicker

const LeaguePage: React.FC = () => {
  const [standings, setStandings] = useState<LeagueTableProps["standings"] | null>(null);
  const [error, setError] = useState<string | null>(null); // Error state
  const [backgroundStyle, setBackgroundStyle] = useState<{ backgroundColor?: string; backgroundImage?: string }>({
    backgroundColor: "#f9fafb", // Default background color
  });

  // Handle color or gradient selection
  const handleColorChange = (color: string) => {
    if (color.startsWith("linear-gradient")) {
      // Apply gradient as backgroundImage
      setBackgroundStyle({ backgroundImage: color });
    } else {
      // Apply solid color as backgroundColor
      setBackgroundStyle({ backgroundColor: color });
    }
  };

  // Handle league selection from SearchBar
  const handleLeagueSelect = async (leagueSlug: string) => {
    try {
      const response = await fetch(`/api/league?league=${leagueSlug}`);
      if (!response.ok) {
        throw new Error("Fetch Error"); // Use translation for error message
      }
      const data = await response.json();
      setStandings(data); // Update standings data
      setError(null); // Clear previous errors
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setStandings(null); // Clear standings on error
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Home Button - Top Left */}
        <div>
          <HomeButton />
        </div>
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        {"League Standings"}
      </h1>

      {/* Toggleable Color Picker */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-center">
          {"Choose BackgroundColor"}
        </h2>
        <div className="flex justify-center">
          <ToggleableColorPicker onColorSelect={handleColorChange} />
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar onSelect={handleLeagueSelect} onError={setError} />
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {/* League Table */}
      <div
        className="mt-6 p-6 rounded-md shadow-md"
        style={{
          ...backgroundStyle, // Apply the dynamic background style
        }}
      >
        {standings ? (
          <LeagueTable standings={standings} backgroundColor={backgroundStyle.backgroundColor || "#f9fafb"} />
        ) : (
          <p className="text-center">{"No Standings"}</p>
        )}
      </div>

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default LeaguePage;



