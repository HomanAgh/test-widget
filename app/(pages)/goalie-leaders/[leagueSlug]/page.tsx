import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import GoalieLeadersSearch from "@/app/components/league/GoalieLeadersSearch";
import ClientGoalieLeadersPage from "@/app/components/league/ClientGoalieLeadersPage";

interface PageProps {
  params: Promise<{ leagueSlug: string }>;
}

export default async function GoalieLeadersPage({ params }: PageProps) {
  const { leagueSlug } = await params;
  
  return (
    <PageWrapper>
      <Header currentPath="/goalie-leaders" />
      <PageTitle title="Goalie Leaders" />
      <AuthCheck>
        <GoalieLeadersSearch />
        <ClientGoalieLeadersPage leagueSlug={leagueSlug} season="2024-2025" />
      </AuthCheck>
    </PageWrapper>
  );
}
