import React from "react";
import SearchBar from "@/app/components/leaguePlayoff/LeaguePlayoffSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import ClientLeaguePlayoffPage from "@/app/components/leaguePlayoff/ClientLeaguePlayoffPage";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ leagueSlug: string }>;
}

export default async function LeaguePlayoffPage({ params}: PageProps) {
  const { leagueSlug } = await params;
  
  return (
    <PageWrapper>
      <Header currentPath="/leaguePlayoff" />
      <PageTitle title="League Playoff Bracket" />
      <div className="container mx-auto px-4 py-6">
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md mb-4">
          <p className="font-medium">Note: Currently only NHL is available. Other leagues will be added soon.</p>
        </div>
        <SearchBar />
        <Suspense fallback={<div>Loading...</div>}>
          <ClientLeaguePlayoffPage leagueSlug={leagueSlug} season={"2024-2025"} />
        </Suspense>
      </div>
    </PageWrapper>
  );
}
