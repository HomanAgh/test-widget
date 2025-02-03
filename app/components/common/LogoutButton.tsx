"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
      <Image src="/images/SignOut.svg" alt="Sign Out" width={20} height={20} />
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
