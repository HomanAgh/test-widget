"use client";

import React, { useState } from "react";
import { League } from "@/app/types/league";

interface LeagueSelectionDropdownProps {
  professionalLeagues: League[];
  juniorLeagues: League[];
  collegeLeagues: League[];
  selectedLeagues: string[]; // array of slugs
  onChange: (selected: string[]) => void;
}

/**
 * Example of a single league object:
 * interface League {
 *   slug: string;
 *   name: string;
 * }
 */
const LeagueSelectionDropdown: React.FC<LeagueSelectionDropdownProps> = ({
  professionalLeagues,
  juniorLeagues,
  collegeLeagues,
  selectedLeagues,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleCheckboxChange = (leagueSlug: string) => {
    const isSelected = selectedLeagues.includes(leagueSlug);
    const updatedLeagues = isSelected
      ? selectedLeagues.filter((slug) => slug !== leagueSlug)
      : [...selectedLeagues, leagueSlug];
    onChange(updatedLeagues);
  };

  /**
   * Remove one league from selected
   */
  const removeLeagueSlug = (slug: string) => {
    onChange(selectedLeagues.filter((s) => s !== slug));
  };

  /**
   * Clear all selected leagues
   */
  const clearAllLeagues = () => {
    onChange([]);
  };

  /**
   * Helper to find a league by slug, so we can display the name
   */
  const findLeagueName = (slug: string): string => {
    // Search in all arrays combined
    const allLeagues = [
      ...professionalLeagues,
      ...juniorLeagues,
      ...collegeLeagues,
    ];
    const found = allLeagues.find((l) => l.slug === slug);
    return found ? found.name : slug;
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full bg-blue-500 text-white font-bold p-2 rounded flex justify-between items-center"
      >
        Select Leagues
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg w-full mt-2 z-10 p-4">
          {/* Professional Leagues */}
          <div>
            <h3 className="font-bold mb-2">Professional Leagues</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {professionalLeagues.map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug)}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          {/* College Leagues */}
          <div>
            <h3 className="font-bold mb-2">College Leagues</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {collegeLeagues.map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug)}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>

          <hr className="my-4" />

          {/* Junior Leagues */}
          <div>
            <h3 className="font-bold mb-2">Junior Leagues</h3>
            <div className="grid grid-cols-2 gap-2">
              {juniorLeagues.map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug)}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Show currently selected leagues below, with 'x' and clearAll */}
      {selectedLeagues.length > 0 && (
        <div className="mt-2 bg-gray-100 p-2 rounded">
          <strong>Selected Leagues:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedLeagues.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center bg-blue-200 px-2 py-1 rounded text-sm"
              >
                {findLeagueName(slug)}
                <button
                  onClick={() => removeLeagueSlug(slug)}
                  className="ml-2 text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={clearAllLeagues}
            className="text-sm text-blue-500 mt-2 underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default LeagueSelectionDropdown;
