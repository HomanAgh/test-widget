import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientScoringLeadersPage from "@/app/components/league/ClientScoringLeadersPage";
import ScoringLeadersSearch from "@/app/components/league/ScoringLeadersSearch";

interface PageProps {
  params: Promise<{ leagueSlug: string }>;
}

export default async function ScoringLeadersPage({ params }: PageProps) {
  const { leagueSlug } = await params;
  
  return (
    <PageWrapper>
      <Header currentPath="/scoring-leaders" />
      <PageTitle title="Scoring Leaders" />
      <AuthCheck>
        <ScoringLeadersSearch />
        <ClientScoringLeadersPage leagueSlug={leagueSlug} season="2024-2025" />
      </AuthCheck>
    </PageWrapper>
  );
} 