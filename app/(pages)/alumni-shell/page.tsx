import React from "react";
import AlumniShellWidgetSetup from "@/app/components/widget/AlumniShellWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";

const AlumniShellPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/alumni-shell" />
        <PageTitle title="Search team" />
        <AuthCheck>
          <AlumniShellWidgetSetup />
        </AuthCheck>
      </div>
    </PageWrapper>
  );
};

export default AlumniShellPage;
