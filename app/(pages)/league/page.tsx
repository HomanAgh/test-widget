"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/league/LeagueSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function LeagueSearchPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  const handleLeagueSelect = (leagueSlug: string) => {
    router.push(`/league/${leagueSlug}`);
  };

  return (
    <PageWrapper>
      <Header />
      <PageTitle title="Search league" />

      <SearchBar
        onSelect={handleLeagueSelect}
        onError={(err) => setError(err)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
    </PageWrapper>
  );
}
