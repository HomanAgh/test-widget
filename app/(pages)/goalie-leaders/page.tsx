import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import GoalieLeadersSearch from "@/app/components/league/GoalieLeadersSearch";

export default function GoalieLeadersSearchPage() {
  return (
    <PageWrapper>
      <Header currentPath="/goalie-leaders" />
      <PageTitle title="Search League" />
        <GoalieLeadersSearch />
    </PageWrapper>
  );
} 