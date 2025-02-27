"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/app/components/league/LeagueSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import LeagueWidgetSetup from "@/app/components/widget/LeagueWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function LeaguePage() {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const router = useRouter();
  const { leagueSlug } = useParams() as { leagueSlug?: string };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    } else if (leagueSlug) {
      setSelectedLeagueSlug(leagueSlug);
    }
  }, [router, leagueSlug]);

  const handleLeagueSelect = (newLeagueSlug: string) => {
    if (newLeagueSlug !== leagueSlug) {
      router.push(`/league/${newLeagueSlug}`);
    }
  };

  return (
    <PageWrapper>
      <Header />
      <PageTitle title="Search league" />

      {/* Optional search bar to switch to another league */}
      <SearchBar
        onSelect={handleLeagueSelect}
        onError={(err) => setError(err)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      {selectedLeagueSlug && (
        <LeagueWidgetSetup leagueSlug={selectedLeagueSlug} season="2024-2025" />
      )}
    </PageWrapper>
  );
}
