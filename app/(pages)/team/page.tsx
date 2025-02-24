"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/team/TeamSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function TeamSearchPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  const handleTeamSelect = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  return (
    <PageWrapper>
      <Header />
      <PageTitle title="Search team" />

      <SearchBar
        onSelect={handleTeamSelect}
        onError={(err) => setError(err)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
    </PageWrapper>
  );
}
