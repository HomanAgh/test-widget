import React from "react";
import SearchBar from "@/app/components/team/TeamSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import ClientTeamPage from "@/app/components/team/ClientTeamPage";

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params;

  return (
    <PageWrapper>
      <Header currentPath="/team" />
      <PageTitle title="Search Team" />
        <SearchBar />
        <ClientTeamPage teamId={teamId} />
    </PageWrapper>
  );
}
