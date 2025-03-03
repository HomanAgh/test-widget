"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-center w-[82px] h-[28px] px-2 py-1 gap-[8px] rounded-md hover:bg-gray-300 transition-all"
    >
      <MdLogout
        size={20}
        className="text-[#0B9D52] min-w-[20px] min-h-[20px]"
      />
      <span
        className="font-bold text-[12px] uppercase tracking-[0.5px] leading-[115%]"
        style={{ color: "#0B9D52", fontFamily: "var(--Typography-Font-family)" }}
      >
        Logout
      </span>
    </button>
  );
};

export default LogoutButton;
