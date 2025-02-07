// PoweredBy.tsx
"use client";

import React from "react";
import Image from "next/image";

const PoweredBy: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <div className="flex items-center space-x-1">
        <span className="text-[12px] font-montserrat font-medium text-black lowercase">
          powered by
        </span>
        <a
          href="https://www.eliteprospects.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            className="h-[14px] w-[97.075px] cursor-pointer"
            alt="EliteProspects"
            src="/images/Group.svg"
            width={97.075}
            height={14}
          />
        </a>
      </div>
    </div>
  );
};

export default PoweredBy;
