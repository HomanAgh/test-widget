import React from "react";
import SearchBar from "@/app/components/player/PlayerSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import ClientPlayerPage from "@/app/components/player/ClientPlayerPage";

interface PageProps {
  params: Promise<{ playerId: string }>;
}

export default async function PlayerPage({ params }: PageProps) {
  const { playerId } = await params;

  return (
    <PageWrapper>
      <Header currentPath="/player" />
      <PageTitle title="Search Player" />
        <SearchBar />
        <ClientPlayerPage playerId={playerId} />
    </PageWrapper>
  );
};

