"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdAdminPanelSettings } from "react-icons/md";
import { useAdmin } from "@/app/hooks/useAdmin";

interface AdminButtonProps {
  isDisabled?: boolean;
}

const AdminButton: React.FC<AdminButtonProps> = ({ isDisabled = false }) => {
  const { isAdmin, loading } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    console.log('AdminButton state:', { isAdmin, loading });
  }, [isAdmin, loading]);

  const handleRedirect = () => {
    if (!isDisabled && isAdmin) {
      router.push("/admin");
    }
  };

  if (loading) {
    console.log('AdminButton is loading');
    return null;
  }

  if (!isAdmin) {
    console.log('User is not admin');
    return null;
  }

  console.log('Rendering admin button');

  return (
    <button
      onClick={handleRedirect}
      disabled={isDisabled}
      className={`flex items-center justify-center w-[82px] h-[28px] px-2 py-1 gap-[8px] rounded-md transition-all
        ${isDisabled ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-300"}
      `}
    >
      <MdAdminPanelSettings
        size={20}
        className={isDisabled ? "opacity-50" : "text-[#0B9D52] min-w-[20px] min-h-[20px]"}
      />
      <span
        className={`font-bold text-[12px] uppercase tracking-[0.5px] leading-[115%] ${
          isDisabled ? "text-gray-400" : "text-[#0B9D52]"
        }`}
        style={{ fontFamily: "var(--Typography-Font-family)" }}
      >
        Admin
      </span>
    </button>
  );
};

export default AdminButton; 