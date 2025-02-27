import React from "react";
import SearchBar from "@/app/components/player/PlayerSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";
import ClientPlayerPage from "@/app/components/player/ClientPlayerPage";

const PlayerPage = ({ params }: { params: { playerId: string } }) => {
  return (
    <PageWrapper>
      <Header currentPath="/player" />
      <PageTitle title="Search player" />
      <AuthCheck>
        <SearchBar />
        <ClientPlayerPage playerId={params.playerId} />
      </AuthCheck>
    </PageWrapper>
  );
};

export default PlayerPage;
