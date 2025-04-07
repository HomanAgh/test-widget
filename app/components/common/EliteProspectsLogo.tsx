"use client";

import React from "react";

const EliteProspectsLogo: React.FC = () => {
  return (
    <a
      href="https://www.eliteprospects.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center flex-shrink-0"
    >
      {/* Logo Image */}
      <img src="/images/Logo.svg" alt="Elite Prospects Logo" width={48} height={48} />

      {/* Widget Admin Text */}
      <span className="text-[18px] font-montserrat font-bold ml-2 text-gray-800">
        Widget admin
      </span>
    </a>
  );
};

export default EliteProspectsLogo;
