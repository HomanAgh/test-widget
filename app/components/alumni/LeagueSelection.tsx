"use client";

import React, { useState } from "react";
import { League } from "@/app/types/league";
import { LeagueSelectionDropdownProps } from "@/app/types/league";
import { IoIosRemoveCircle } from "react-icons/io";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import Image from "next/image";

// Predefined league rankings (all keys in lower-case for consistency)
export const leagueRankings: Record<string, number> = {
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

export const sortLeaguesByRank = (slugs: string[]): string[] => {
  return [...slugs].sort(
    (a, b) =>
      (leagueRankings[a] ?? Number.MAX_SAFE_INTEGER) -
      (leagueRankings[b] ?? Number.MAX_SAFE_INTEGER)
  );
};

export const sortLeagueObjectsByRank = (leagues: League[]): League[] => {
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
    const normalizedSlug = leagueSlug.toLowerCase();
    const isSelected = selectedLeagues.includes(normalizedSlug);

    const updatedLeagues = isSelected
      ? selectedLeagues.filter((slug) => slug !== normalizedSlug)
      : [...selectedLeagues, normalizedSlug];

    onChange(sortLeaguesByRank(updatedLeagues));
  };

  const removeLeagueSlug = (slug: string) => {
    const updatedLeagues = selectedLeagues.filter((s) => s !== slug);
    onChange(sortLeaguesByRank(updatedLeagues));
  };

  const clearAllLeagues = () => {
    onChange([]);
  };

  const findLeagueDetails = (slug: string): { name: string; logo: string | null } => {
    const allLeagues = [...professionalLeagues, ...juniorLeagues, ...collegeLeagues];
    const found = allLeagues.find((l) => l.slug.toLowerCase() === slug);

    return {
      name: found ? found.name : slug, 
      logo: found?.logo ?? null, 
    };
  };

  const allLeagueSlugs = sortLeaguesByRank(
    [...professionalLeagues, ...collegeLeagues, ...juniorLeagues].map((league) =>
      league.slug.toLowerCase()
    )
  );

  const allSelected = allLeagueSlugs.every((slug) => selectedLeagues.includes(slug));

  const handleSelectAllToggle = () => {
    onChange(allSelected ? [] : allLeagueSlugs);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="w-full bg-[#052D41] text-white text-sm font-montserrat font-bold p-2 rounded flex justify-between items-center"
      >
        SELECT LEAGUES
        <span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bg-white border rounded w-full mt-2 z-10 p-4 font-montserrat">
          <button
            onClick={handleSelectAllToggle}
            className="absolute top-2 right-2 text-[#052D41] text-medium underline"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>

          {/* League Categories */}
          {[
            { title: "Professional Leagues", leagues: professionalLeagues },
            { title: "College Leagues", leagues: collegeLeagues },
            { title: "Junior Leagues", leagues: juniorLeagues },
          ].map(({ title, leagues }) => (
            <div key={title} className="mt-6">
              <h3 className="font-bold mb-2">{title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {sortLeagueObjectsByRank(leagues).map((league) => (
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
              <hr className="my-4" />
            </div>
          ))}
        </div>
      )}

      {/* Display Selected Leagues with Logos */}
      {selectedLeagues.length > 0 && (
        <div className="mt-2 bg-gray-100 p-2 rounded text-[#052D41] font-montserrat">
          <strong>Selected Leagues:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedLeagues.map((slug) => {
              const { name, logo } = findLeagueDetails(slug);

              return (
                <span key={slug} className="inline-flex items-center bg-white px-2 py-1 rounded text-sm text-[#052D41] border border-[#052D41]">
                  {logo && (
                    <Image 
                      src={logo} 
                      alt={`${name} logo`} 
                      className="w-6 h-6 mr-2 rounded" 
                      width={20}
                      height={20}
                    />
                  )}
                  {name}
                  <button
                    onClick={() => removeLeagueSlug(slug)}
                    className="ml-2 text-red-700 font-bold"
                  >
                    <IoIosRemoveCircle/>
                  </button>
                </span>
              );
            })}
          </div>
          <button onClick={clearAllLeagues} className="text-sm mt-2 underline">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default LeagueSelectionDropdown;
