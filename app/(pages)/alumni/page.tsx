"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import HomeButton from "@/app/components/common/HomeButton";
import LogoutButton from "@/app/components/common/LogoutButton";
import AlumniWidgetSetup from "@/app/components/widget/AlumniWidgetSetup";

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
    <div className="max-w-4xl mx-auto relative w-[768px]">
      {/* Top bar: Home & Logout */}
      <div className="flex justify-between items-center mb-4">
        <HomeButton />
        <LogoutButton />
      </div>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4 text-center">Alumni Page</h1>

      {/* Show the widget setup */}
      <AlumniWidgetSetup />
    </div>
  );
};

export default AlumniPage;
