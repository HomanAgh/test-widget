import React from "react";
import SearchBar from "@/app/components/team/TeamSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";

export default function TeamSearchPage() {
  return (
    <PageWrapper>
      <Header currentPath="/team" />
      <PageTitle title="Search team" />
      <AuthCheck>
        <SearchBar />
      </AuthCheck>
    </PageWrapper>
  );
}
