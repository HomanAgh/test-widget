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
    <div className="my-4 flex items-center space-x-4">
      {/* Background Color */}
      <label className="flex items-center space-x-2">
        <span className="font-medium">Background:</span>
        <input
          type="text"
          className="border p-1 rounded"
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
          className="border p-1 rounded"
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
          className="border p-1 rounded"
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
