import React from "react";
import WhereAreTheyNowWidgetSetup from "@/app/components/widget/WhereAreTheyNowWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const WhereAreTheyNowPage = () => {
  return (
    <PageWrapper>
      <div>
        <Header currentPath="/where-are-they-now" />
        <PageTitle title="Where Are They Now" />
        <WhereAreTheyNowWidgetSetup />
      </div>
    </PageWrapper>
  );
};

export default WhereAreTheyNowPage; 