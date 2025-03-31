import React from "react";
import SearchBar from "@/app/components/player/PlayerSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const PlayerSearchPage = () => {
  return (
    <PageWrapper> 
      <Header currentPath="/player" />
      <PageTitle title="Search Player" />
        <SearchBar />
    </PageWrapper>
  );
};

export default PlayerSearchPage;
