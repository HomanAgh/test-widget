import React from "react";
import SearchBar from "@/app/components/player/PlayerSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientPlayerPage from "@/app/components/player/ClientPlayerPage";

export default function PlayerPage({ params }: any) {
  const { playerId } = params;

  return (
    <PageWrapper>
      <Header currentPath="/player" />
      <PageTitle title="Search player" />
      <AuthCheck>
        <SearchBar />
        <ClientPlayerPage playerId={playerId} />
      </AuthCheck>
    </PageWrapper>
  );
};

