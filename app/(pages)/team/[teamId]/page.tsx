"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/app/components/team/TeamSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import WidgetSetup from "@/app/components/widget/TeamWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function TeamPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // For navigation & dynamic param
  const router = useRouter();
  const { teamId } = useParams() as { teamId?: string };

  useEffect(() => {
    // Check login
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    } else {
      if (teamId) {
        setSelectedTeamId(teamId);
      }
    }
  }, [router, teamId]);

  const handleTeamSelect = (newTeamId: string) => {
    if (newTeamId !== teamId) {
      router.push(`/team/${newTeamId}`);
    }
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

      {selectedTeamId && (
        <WidgetSetup teamId={selectedTeamId} />
      )}
    </PageWrapper>
  );
}
