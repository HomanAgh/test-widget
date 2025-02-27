import React from "react";
import SearchBar from "@/app/components/player/PlayerSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";

const PlayerSearchPage = () => {
  return (
    <PageWrapper> 
      <Header currentPath="/player" />
      <PageTitle title="Search player" />
      <AuthCheck>
        <SearchBar />
      </AuthCheck>
    </PageWrapper>
  );
};

export default PlayerSearchPage;
