import React from "react";
import SearchBar from "@/app/components/leaguePlayoff/LeaguePlayoffSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function LeaguePlayoffSearchPage() {
  return (
    <PageWrapper>
      <Header currentPath="/leaguePlayoff" />
      <PageTitle title="Search League Playoff" />
      <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-md mb-4 mx-auto max-w-3xl">
        <p className="font-medium">Note: Currently only NHL is available. Other leagues will be added soon.</p>
      </div>
      <SearchBar />
    </PageWrapper>
  );
}
