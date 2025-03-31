import React from "react";
import SearchBar from "@/app/components/team/TeamSearch";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

export default function TeamSearchPage() {
  return (
    <PageWrapper>
      <Header currentPath="/team" />
      <PageTitle title="Search Team" />
        <SearchBar />
    </PageWrapper>
  );
}
