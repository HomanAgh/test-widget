import React from "react";
import AlumniWidgetSetup from "@/app/components/widget/AlumniWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";


const AlumniPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/alumni" />
        <PageTitle title="Search Teams" />
          <AlumniWidgetSetup/>
      </div>
    </PageWrapper>
  );
};

export default AlumniPage;
