"use client";

import React, { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

interface SettingsFilterProps {
  isPaginationEnabled: boolean;
  onPaginationToggle: (enabled: boolean) => void;
  isLeagueGroupingEnabled?: boolean;
  onLeagueGroupingToggle?: (enabled: boolean) => void;
  customColors?: {
    backgroundColor: string;
    textColor: string;
    tableBackgroundColor: string;
  };
}

const SettingsFilter: React.FC<SettingsFilterProps> = ({
  isPaginationEnabled,
  onPaginationToggle,
  isLeagueGroupingEnabled = false,
  onLeagueGroupingToggle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full bg-[#052D41] text-white text-sm font-montserrat font-bold p-2 rounded flex justify-between items-center"
      >
        SETTINGS
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded w-full z-10 p-4 font-montserrat">
          <div className="mt-2">
            <div className="flex flex-col gap-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isPaginationEnabled}
                  onChange={(e) => onPaginationToggle(e.target.checked)}
                />
                <span>Enable Pagination</span>
              </label>
              <div className="text-sm text-gray-600">
                {isPaginationEnabled 
                  ? "Results will be paginated with navigation controls" 
                  : "All results will be shown in a scrollable list"
                }
              </div>
              
              {onLeagueGroupingToggle && (
                <>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isLeagueGroupingEnabled}
                      onChange={(e) => onLeagueGroupingToggle(e.target.checked)}
                    />
                    <span>Enable League Grouping</span>
                  </label>
                  <div className="text-sm text-gray-600">
                    {isLeagueGroupingEnabled 
                      ? "Players will be grouped by league headers (NHL, AHL, North America, Europe)" 
                      : "Players will be displayed in a single list"
                    }
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsFilter; 