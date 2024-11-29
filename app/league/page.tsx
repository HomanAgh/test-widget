"use client";

import React, { useState } from "react";
import SearchBar from "../components/league/SearchBar";
import LeagueTable from "../components/league/LeagueTable";
import BackgroundSelector from "../components/widgets/BackgroundSelector";
import LogoutButton from "../components/common/LogoutButton";

const LeaguePage: React.FC = () => {
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
        throw new Error("Failed to fetch league standings.");
      }
      const data = await response.json();
      setStandings(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setStandings(null);
    }
  };

  return (
    <div className={`min-h-screen p-4 bg-gray-50`}>
      <h1 className="text-2xl font-bold mb-4 text-center">League Standings</h1>
      <BackgroundSelector
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      <SearchBar onSelect={handleLeagueSelect} onError={setError} />
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Add a padded container with dynamic background and text color */}
      <div
        className={`mt-6 p-6 rounded-md shadow-md ${backgroundColor} ${textColor}`}
      >
        {standings && <LeagueTable standings={standings} />}
      </div>
      <LogoutButton />
    </div>
  );
};

export default LeaguePage;
