import React from "react";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import AlumniWidgetSetup from "@/app/components/widget/AlumniWidgetSetup";

const TournamentSetupPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/tournamentsetup" />
        <PageTitle title="Search Tournaments" />
        <AuthCheck>
        <AlumniWidgetSetup mode="tournament" />
        </AuthCheck>
      </div>
    </PageWrapper>
  );
};

export default TournamentSetupPage;
