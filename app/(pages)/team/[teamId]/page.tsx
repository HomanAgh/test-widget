import React from "react";
import SearchBar from "@/app/components/team/TeamSearch";
import WidgetSetup from "@/app/components/widget/TeamWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientTeamPage from "@/app/components/team/ClientTeamPage";

export default function TeamPage({ params }: { params: { teamId: string } }) {
  return (
    <PageWrapper>
      <Header currentPath="/team" />
      <PageTitle title="Search team" />
      <AuthCheck>
        <SearchBar />
        <ClientTeamPage teamId={params.teamId} />
      </AuthCheck>
    </PageWrapper>
  );
}
