"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/league/LeagueSearch";
import LeagueWidgetSetup from "@/app/components/widget/LeagueWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const LeaguePage: React.FC = () => {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    <PageWrapper>
      <Header />  
      <PageTitle title="Search league" />
      <SearchBar 
        onSelect={handleLeagueSelect} 
        onError={setError} 
      />
      {error && (
        <p className="text-center text-red-600 mt-4">{error}</p>
      )}

      {selectedLeagueSlug && (
        <div className="mt-6">
          <LeagueWidgetSetup leagueSlug={selectedLeagueSlug} />
        </div>
      )}
    </PageWrapper>
  );
};

export default LeaguePage;
