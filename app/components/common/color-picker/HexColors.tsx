"use client";

import React, { Dispatch, SetStateAction } from "react";

interface HexColorsProps {
  customColors: {
    headerTextColor: string;
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
  };
  setCustomColors: Dispatch<
    SetStateAction<{
      headerTextColor: string;
      backgroundColor: string;
      textColor: string;
      tableBackgroundColor: string;
    }>
  >;
}

const HexColors: React.FC<HexColorsProps> = ({ customColors, setCustomColors }) => {
  return (
    <div className="my-4 flex flex-col md:flex-row items-left md:space-x-4 space-y-4 md:space-y-0">
      {/* 1) Header BG */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Header BG:</span>
        <input
          type="text"
          className="border p-1 rounded w-[141px]"
          value={customColors.backgroundColor}
          onChange={(e) =>
            setCustomColors((prev) => ({
              ...prev,
              backgroundColor: e.target.value,
            }))
          }
          placeholder="#052D41"
        />
      </label>

      {/* 2) Header Text */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Header Text:</span>
        <input
          type="text"
          className="border p-1 rounded w-[141px]"
          value={customColors.headerTextColor}
          onChange={(e) =>
            setCustomColors((prev) => ({
              ...prev,
              headerTextColor: e.target.value, // ← Fix this
            }))
          }
          placeholder="#FFFFFF"
        />
      </label>

      {/* 3) Table BG */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Table BG:</span>
        <input
          type="text"
          className="border p-1 rounded w-[141px]"
          value={customColors.tableBackgroundColor}
          onChange={(e) =>
            setCustomColors((prev) => ({
              ...prev,
              tableBackgroundColor: e.target.value,
            }))
          }
          placeholder="#FFFFFF"
        />
      </label>

      {/* 4) Table Text */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Table Text:</span>
        <input
          type="text"
          className="border p-1 rounded w-[141px]"
          value={customColors.textColor}
          onChange={(e) =>
            setCustomColors((prev) => ({
              ...prev,
              textColor: e.target.value,
            }))
          }
          placeholder="#000000"
        />
      </label>
    </div>
  );
};

export default HexColors;
