"use client";

import React from "react";
import Link from "next/link";

const EliteProspectsLogo: React.FC = () => {
  return (
    <Link
      href="/home"
      className="flex items-center justify-center flex-shrink-0"
    >
      {/* Logo Image */}
      <img src="/images/Logo.svg" alt="Elite Prospects Logo" width={48} height={48} />

      {/* Widget Admin Text */}
      <span className="text-[18px] font-montserrat font-bold ml-2 text-gray-800">
        Widget admin
      </span>
    </Link>
  );
};

export default EliteProspectsLogo;
