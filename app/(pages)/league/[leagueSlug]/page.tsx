import React from "react";
import SearchBar from "@/app/components/league/LeagueSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientLeaguePage from "@/app/components/league/ClientLeaguePage";

export default function LeaguePage({ params }: any) {
  const { leagueSlug } = params;
  
  return (
    <PageWrapper>
      <Header currentPath="/league" />
      <PageTitle title="Search league" />
      <AuthCheck>
        <SearchBar />
        <ClientLeaguePage leagueSlug={leagueSlug} season="2024-2025" />
      </AuthCheck>
    </PageWrapper>
  );
}