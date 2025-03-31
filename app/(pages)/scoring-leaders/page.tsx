import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import ScoringLeadersSearch from "@/app/components/league/ScoringLeadersSearch";

export default function ScoringLeadersSearchPage() {
  return (
    <PageWrapper>
      <Header currentPath="/scoring-leaders" />
      <PageTitle title="Search League" />
        <ScoringLeadersSearch />
    </PageWrapper>
  );
} 