"use client";

import React, { Dispatch, SetStateAction } from "react";

interface HexColorsProps {
  customColors: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
  };
  setCustomColors: Dispatch<
    SetStateAction<{
      backgroundColor: string;
      textColor: string;
      tableBackgroundColor: string;
    }>
  >;
}

const HexColors: React.FC<HexColorsProps> = ({
  customColors,
  setCustomColors,
}) => {
  return (
    // On mobile (default) use flex-col (stacked vertically) and on md (desktop) use flex-row
    <div className="my-4 flex flex-col md:flex-row items-left md:space-x-4 space-y-4 md:space-y-0">
      {/* Background Color */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Header:</span>
        <input
          type="text"
          className="border p-1 rounded w-[181px]"
          value={customColors.backgroundColor}
          onChange={(e) =>
            setCustomColors((prev) => ({
              ...prev,
              backgroundColor: e.target.value,
            }))
          }
          placeholder="#ffffff"
        />
      </label>

      {/* Text Color */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Text:</span>
        <input
          type="text"
          className="border p-1 rounded w-[181px]"
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

      {/* Table Background Color */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Table BG:</span>
        <input
          type="text"
          className="border p-1 rounded w-[181px]"
          value={customColors.tableBackgroundColor}
          onChange={(e) =>
            setCustomColors((prev) => ({
              ...prev,
              tableBackgroundColor: e.target.value,
            }))
          }
          placeholder="#ffffff"
        />
      </label>
    </div>
  );
};

export default HexColors;
