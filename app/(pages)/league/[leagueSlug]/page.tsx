import React from "react";
import SearchBar from "@/app/components/league/LeagueSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientLeaguePage from "@/app/components/league/ClientLeaguePage";

type LeaguePageProps = {
  params: {
    leagueSlug: string;
  };
};

export default function LeaguePage({ params }: LeaguePageProps) {
  return (
    <PageWrapper>
      <Header currentPath="/league" />
      <PageTitle title="Search league" />
      <AuthCheck>
        <SearchBar />
        <ClientLeaguePage leagueSlug={params.leagueSlug} season="2024-2025" />
      </AuthCheck>
    </PageWrapper>
  );
}