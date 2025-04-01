"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";
import { useAdmin } from "@/app/hooks/useAdmin";

interface AdminButtonProps {
  isDisabled?: boolean;
}

const AdminButton: React.FC<AdminButtonProps> = ({ isDisabled }) => {
  const { isAdmin, loading } = useAdmin();

  useEffect(() => {
    console.log('AdminButton state:', { isAdmin, loading });
  }, [isAdmin, loading]);

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
    <Link
      href="/admin"
      className={`flex items-center justify-center w-[82px] h-[28px] px-2 py-1 gap-[8px] rounded-md transition-all ${
        isDisabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-gray-300"
      }`}
    >
      <MdAdminPanelSettings
        size={20}
        className="text-[#0B9D52] min-w-[20px] min-h-[20px]"
      />
      <span
        className="font-bold text-[12px] uppercase tracking-[0.5px] leading-[115%]"
        style={{ color: "#0B9D52", fontFamily: "var(--Typography-Font-family)" }}
      >
        Admin
      </span>
    </Link>
  );
};

export default AdminButton; 