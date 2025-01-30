"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeButton from "@/app/components/common/HomeButton";
import LogoutButton from "@/app/components/common/LogoutButton";
import SearchBar, { SelectedTeam } from "@/app/components/alumni/TeamSearchBar";
import LeagueSelectionDropdown from "@/app/components/alumni/LeagueSelection"; 
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Alumni from "@/app/components/alumni/Alumni";
import { useFetchLeagues } from "@/app/components/alumni/hooks/useFetchLeagues";

const AlumniPage: React.FC = () => {
  const [selectedTeams, setSelectedTeams] = useState<SelectedTeam[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check login on mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

   const { customLeagues, customJunLeagues, customCollegeLeagues } = useFetchLeagues();

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      {/* Top bar: Home & Logout */}
      <div className="flex justify-between items-center mb-4">
        <HomeButton />
        <LogoutButton />
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">Team Search</h1>

      {/* Team SearchBar */}
      <SearchBar
        placeholder="Search for a team..."
        onSelect={(teamObj) => setSelectedTeams([teamObj])}
        onError={(errMsg) => setError(errMsg)}
        selectedTeams={selectedTeams}
        onCheckedTeamsChange={setSelectedTeams}
      />

      {/* Now move the League Selection below the search bar */}
      <LeagueSelectionDropdown
        professionalLeagues={customLeagues}     
        juniorLeagues={customJunLeagues}           
        collegeLeagues={customCollegeLeagues}          
        selectedLeagues={selectedLeagues}
        onChange={setSelectedLeagues}
      />

      {/* Error message if any */}
      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {/* The Alumni component now receives the selectedLeagues as a prop */}
      <div className="mt-6">
        <Alumni
          selectedTeams={selectedTeams}
          selectedLeagues={selectedLeagues}
        />
      </div>
    </div>
  );
};

export default AlumniPage;
