"use client";

import React from "react";
import Image from "next/image";

const EliteProspectsLogo: React.FC = () => {
  return (
    <a
      href="https://www.eliteprospects.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center w-[48px] h-[48px] flex-shrink-0"
    >
      <Image src="/images/Logo.svg" alt="Elite Prospects Logo" width={48} height={48} />
    </a>
  );
};

export default EliteProspectsLogo;
