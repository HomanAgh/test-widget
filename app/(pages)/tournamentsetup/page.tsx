import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import AlumniTournamentWidgetSetup from "@/app/components/widget/AlumniTournamentWidgetSetup";

const TournamentSetupPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/tournamentsetup" />
        <PageTitle title="Search Tournaments" />
        <AuthCheck>
          <AlumniTournamentWidgetSetup />
        </AuthCheck>
      </div>
    </PageWrapper>
  );
};

export default TournamentSetupPage;
