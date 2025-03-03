"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ImEmbed } from "react-icons/im";

interface EmbedButtonProps {
  isDisabled?: boolean;
}

const EmbedButton: React.FC<EmbedButtonProps> = ({ isDisabled = false }) => {
  const router = useRouter();

  const handleRedirect = () => {
    if (!isDisabled) {
      router.push("/embed");
    }
  };

  return (
    <button
      onClick={handleRedirect}
      disabled={isDisabled}
      className={`flex items-center justify-center w-[82px] h-[28px] px-2 py-1 gap-[8px] rounded-md transition-all
        ${isDisabled ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-300"}
      `}
    >
      <ImEmbed
        size={20}
        className={isDisabled ? "opacity-50" : "text-[#0B9D52]"}
      />
      <span
        className={`font-bold text-[12px] uppercase tracking-[0.5px] leading-[115%] ${
          isDisabled ? "text-gray-400" : "text-[#0B9D52]"
        }`}
        style={{ fontFamily: "var(--Typography-Font-family)" }}
      >
        Embed
      </span>
    </button>
  );
};

export default EmbedButton;
