import React from "react";
import SearchBar from "@/app/components/league/LeagueSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function LeagueSearchPage() {
  return (
    <PageWrapper>
      <Header currentPath="/league" />
      <PageTitle title="Search League" />
        <SearchBar />
    </PageWrapper>
  );
}
