"use client";

import React, { useState, useEffect, useRef } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";
import { TeamItem, TeamSearchBarProps } from "@/app/types/team";

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({
  onSelect,
  selectedTeams,
  onCheckedTeamsChange,
}) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setTeams([]);
      setShowDropdown(false);
      return;
    }
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/AlumniSearchTeam?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!response.ok) {
          setTeams([]);
          return;
        }
        const data: { teams: TeamItem[] } = await response.json();

        const teamsWithLogos = data.teams.map((team) => ({
          id: team.id,
          name: team.name,
          league: team.league,
          logo: team.logo || null,
        }));

        setTeams(teamsWithLogos || []);
        setShowDropdown(true);
        setHighlightedIndex(-1);
        if (dropdownRef.current) {
          dropdownRef.current.scrollTop = 0;
        }
      } catch {
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, [debouncedQuery]);

  // Outside click => hide dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard nav
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || teams.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % teams.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + teams.length) % teams.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < teams.length) {
        const highlightedTeam = teams[highlightedIndex];
        onSelect({
          id: highlightedTeam.id,
          name: highlightedTeam.name,
          league: highlightedTeam.league,
          logo: highlightedTeam.logo || null,
        });
      }
    }
  };

  const handleCheckboxChange = (team: TeamItem) => {
    const isSelected = selectedTeams.some((t) => t.id === team.id);
    if (isSelected) {
      onCheckedTeamsChange(selectedTeams.filter((t) => t.id !== team.id));
    } else {
      onCheckedTeamsChange([
        ...selectedTeams,
        {
          id: team.id,
          name: team.name,
          league: team.league,
          logo: team.logo || null,
        },
      ]);
    }
  };

  // Remove one
  const removeTeam = (teamId: number) => {
    onCheckedTeamsChange(selectedTeams.filter((t) => t.id !== teamId));
  };

  // Clear all
  const clearAllTeams = () => {
    onCheckedTeamsChange([]);
  };

  // Show dropdown if we have results
  const handleInputFocus = () => {
    if (teams.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="pb-[20px]">
      <div className="w-full" ref={containerRef}>
        <div className="relative">
          <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-[20px] h-[20px]" />
          <input
            type="text"
            value={query}
            onFocus={handleInputFocus}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-2 pl-10 rounded-md w-full font-montserrat"
            placeholder="Search teams..."
          />
        </div>

        {showDropdown && (
          <ul
            ref={dropdownRef}
            className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10 font-montserrat"
          >
            {isLoading && <li className="p-2 text-gray-500">Loading...</li>}
            {!isLoading && teams.length === 0 && (
              <li className="p-2 text-gray-500">No results found</li>
            )}
            {!isLoading &&
              teams.map((team, index) => {
                const isHighlighted = highlightedIndex === index;
                const isChecked = selectedTeams.some((t) => t.id === team.id);
                return (
                  <li
                    key={team.id}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleCheckboxChange(team)}
                    className={`p-2 hover:bg-gray-100 ${
                      isHighlighted ? "bg-gray-200" : ""
                    } cursor-pointer`}
                  >
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" checked={isChecked} readOnly />
                      <span>
                        {team.name} - {team.league}
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}

        {selectedTeams.length > 0 && (
          <div className="mt-4 p-2 font-montserrat text-lg">
            <strong>Selected Teams</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {selectedTeams.map((team) => (
                <span
                  key={team.id}
                  className="inline-flex items-center bg-white text-[#0D73A6] px-2 py-1 text-sm font-sans font-semibold border-[1.5px] border-[#0D73A6] rounded-[36px]"
                >
                  {team.logo && (
                    <img
                      src={team.logo}
                      alt={`${team.name} logo`}
                      className="mr-2 rounded"
                      width={24}
                      height={24}
                    />
                  )}
                  {team.name}
                  <button
                    onClick={() => removeTeam(team.id)}
                    className="ml-2 flex items-center justify-center self-center"
                    aria-label="Remove team"
                  >
                    <img
                      src="/images/close (x).svg"
                      alt="Remove team"
                      width={16}
                      height={16}
                      className="relative top-[0.5px] transform scale-110"
                    />
                  </button>
                </span>
              ))}
            </div>
            <button
              onClick={clearAllTeams}
              className="my-2 px-4 py-2 rounded uppercase text-sm tracking-wider text-left cursor-pointer"
              style={{
                fontFamily: "Montserrat",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: "24px",
                backgroundColor: "transparent",
                color: "#0B9D52",
                border: "none",
                letterSpacing: "0.05em",
                display: "block",
                textAlign: "left",
                padding: "0",
              }}
            >
              CLEAR ALL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSearchBar;
