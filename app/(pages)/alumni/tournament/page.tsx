import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AlumniTournamentWidgetSetup from "@/app/components/widget//AlumniTournamentWidgetSetup";

const TournamentSetupPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/alumni/tournament" />
        <PageTitle title="Search Tournaments" />
        <AlumniTournamentWidgetSetup />
      </div>
    </PageWrapper>
  );
};

export default TournamentSetupPage;
