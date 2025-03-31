import React from "react";
import SearchBar from "@/app/components/league/LeagueSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import ClientLeaguePage from "@/app/components/league/ClientLeaguePage";

interface PageProps {
  params: Promise<{ leagueSlug: string }>;
} 

export default async function LeaguePage({ params }: PageProps) {
  const { leagueSlug } = await params;
  
  return (
    <PageWrapper>
      <Header currentPath="/league" />
      <PageTitle title="Search League" />
        <SearchBar />
        <ClientLeaguePage leagueSlug={leagueSlug} season="2024-2025" />
    </PageWrapper>
  );
}