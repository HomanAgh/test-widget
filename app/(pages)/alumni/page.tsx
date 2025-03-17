import React from "react";
import AlumniWidgetSetup from "@/app/components/widget/AlumniWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";
import AuthCheck from "@/app/components/AuthCheck";


const AlumniPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/alumni" />
        <PageTitle title="Search Teams" />
        <AuthCheck>
          <AlumniWidgetSetup mode="team"/>
        </AuthCheck>
      </div>
    </PageWrapper>
  );
};

export default AlumniPage;
