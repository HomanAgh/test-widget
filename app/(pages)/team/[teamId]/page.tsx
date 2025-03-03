import React from "react";
import SearchBar from "@/app/components/team/TeamSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientTeamPage from "@/app/components/team/ClientTeamPage";

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params;

  return (
    <PageWrapper>
      <Header currentPath="/team" />
      <PageTitle title="Search team" />
      <AuthCheck>
        <SearchBar />
        <ClientTeamPage teamId={teamId} />
      </AuthCheck>
    </PageWrapper>
  );
}
