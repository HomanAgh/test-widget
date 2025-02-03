"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AlumniWidgetSetup from "@/app/components/widget/AlumniWidgetSetup";
import Header from "@/app/components/Header";

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
    <div className="max-w-4xl mx-auto relative w-[768px] pt-[48px] pb-[24px]">
      {/* Reusable Header */}
      <Header />

      {/* Show the widget setup */}
      <AlumniWidgetSetup />
    </div>
  );  
};

export default AlumniPage;
