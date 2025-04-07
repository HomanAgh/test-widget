"use client";

import React from "react";

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
          <img
            className="h-[14px] w-[97.075px] cursor-pointer"
            alt="EliteProspects"
            src="https://widget.eliteprospects.com/images/Group.svg"
            width={97.075}
            height={14}
          />
        </a>
      </div>
    </div>
  );
};

export default PoweredBy;
