"use client";

import React, { useState } from "react";
import { League } from "@/app/types/league";
import { LeagueSelectionDropdownProps } from "@/app/types/league";

// Predefined league rankings (all keys in lower-case for consistency)
const leagueRankings: Record<string, number> = {
  // Professional Leagues
  "nhl": 1,
  "shl": 2,
  "ahl": 3,
  "khl": 4,
  "nl": 5,
  "liiga": 6,
  "czechia": 7,
  "del": 8,
  "echl": 9,
  "icehl": 10,
  "slovakia": 11,
  "hockeyallsvenskan": 12,
  // College Leagues
  "ncaa": 13,
  "usports": 14,
  "acac": 15,
  "acha": 16,
  // Junior Leagues
  "ohl": 17,
  "whl": 18,
  "ushl": 19,
  "qmjhl": 20,
  "j20-nationell": 21,
  "mhl": 22,
  "cchl": 23,
  // Womens Professional Leagues
  "pwhl-w": 24,
  "sdhl-w": 25,
  "nwhl-ca-w": 26,
  "phf-w": 27,
  // Womens College Leagues
  "ncaa-w": 28,
  "ncaa-iii-w": 29,
  "acha-w": 30,
  "acha-d2-w": 31,
  // Womens Junior Leagues
  "jwhl-w": 32,
};

// This function sorts an array of league slugs (for selected leagues)
const sortLeaguesByRank = (slugs: string[]): string[] => {
  slugs.forEach((slug) => {
    if (!(slug in leagueRankings)) {
      console.warn(`League slug "${slug}" not found in leagueRankings`);
    }
  });

  return [...slugs].sort(
    (a, b) =>
      (leagueRankings[a] ?? Number.MAX_SAFE_INTEGER) -
      (leagueRankings[b] ?? Number.MAX_SAFE_INTEGER)
  );
};

// New helper: sorts an array of League objects based on the ranking map
const sortLeagueObjectsByRank = (leagues: League[]): League[] => {
  return [...leagues].sort((a, b) => {
    const rankA = leagueRankings[a.slug.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
    const rankB = leagueRankings[b.slug.toLowerCase()] ?? Number.MAX_SAFE_INTEGER;
    return rankA - rankB;
  });
};

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
    const normalizedSlug = leagueSlug.toLowerCase(); // Normalize slug
    const isSelected = selectedLeagues.includes(normalizedSlug);

    let updatedLeagues = isSelected
      ? selectedLeagues.filter((slug) => slug !== normalizedSlug)
      : [...selectedLeagues, normalizedSlug];

    updatedLeagues = sortLeaguesByRank(updatedLeagues);
    onChange(updatedLeagues);
  };

  const removeLeagueSlug = (slug: string) => {
    const updatedLeagues = selectedLeagues.filter((s) => s !== slug);
    onChange(sortLeaguesByRank(updatedLeagues));
  };

  const clearAllLeagues = () => {
    onChange([]);
  };

  const findLeagueName = (slug: string): string => {
    const allLeagues = [
      ...professionalLeagues,
      ...juniorLeagues,
      ...collegeLeagues,
    ];
    const found = allLeagues.find((l) => l.slug.toLowerCase() === slug);
    return found ? found.name : slug;
  };

  // Combine all league slugs and sort them (used for the "Select All" button)
  const allLeagueSlugs = sortLeaguesByRank(
    [...professionalLeagues, ...collegeLeagues, ...juniorLeagues].map((league) =>
      league.slug.toLowerCase()
    )
  );

  // Check if all leagues are selected
  const allSelected = allLeagueSlugs.every((slug) =>
    selectedLeagues.includes(slug)
  );

  // Toggle function for select all / deselect all
  const handleSelectAllToggle = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(allLeagueSlugs);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full bg-blue-500 text-white font-bold p-2 rounded flex justify-between items-center"
      >
        Select Leagues
        <span
          className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded w-full mt-2 z-10 p-4 relative">
          {/* Select All / Deselect All Button */}
          <button
            onClick={handleSelectAllToggle}
            className="absolute top-2 right-2 text-blue-500 text-sm underline"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>

          {/* Professional Leagues */}
          <div className="mt-6">
            <h3 className="font-bold mb-2">Professional Leagues</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sortLeagueObjectsByRank(professionalLeagues).map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug.toLowerCase())}
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
              {sortLeagueObjectsByRank(collegeLeagues).map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug.toLowerCase())}
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
              {sortLeagueObjectsByRank(juniorLeagues).map((league) => (
                <label key={league.slug} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedLeagues.includes(league.slug.toLowerCase())}
                    onChange={() => handleCheckboxChange(league.slug)}
                  />
                  <span>{league.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

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
