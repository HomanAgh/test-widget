"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AlumniWidgetSetup from "@/app/components/widget/AlumniWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const AlumniPage: React.FC = () => {
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  return (
    <PageWrapper>
      <div>
        <Header />
        <PageTitle title="Search team" />
        <AlumniWidgetSetup />
      </div>
    </PageWrapper>
  );
}
  
export default AlumniPage;
  
