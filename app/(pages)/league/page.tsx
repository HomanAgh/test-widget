"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/league/LeagueSearch";
import LeagueWidgetSetup from "@/app/components/widget/LeagueWidgetSetup";
import LogoutButton from "@/app/components/common/LogoutButton";
import HomeButton from "@/app/components/common/HomeButton";

const LeaguePage: React.FC = () => {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Example: If you have a login check
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  const handleLeagueSelect = (leagueSlug: string) => {
    setSelectedLeagueSlug(leagueSlug);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Top Buttons */}
      <div className="flex justify-between items-center mb-4">
        <HomeButton />
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">{"League Search"}</h1>

      {/* Search Bar for League Selection */}
      <SearchBar 
        onSelect={handleLeagueSelect} 
        onError={setError} 
      />
      {error && (
        <p className="text-center text-red-600 mt-4">{error}</p>
      )}

      {/* Once a league is selected, show the LeagueWidgetSetup */}
      {selectedLeagueSlug && (
        <div className="mt-6">
          <LeagueWidgetSetup leagueSlug={selectedLeagueSlug} />
        </div>
      )}

      {/* Logout Button */}
      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default LeaguePage;
