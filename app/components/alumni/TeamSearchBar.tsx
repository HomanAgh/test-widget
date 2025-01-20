"use client";

import React, { useState, useEffect, useRef } from "react";

export interface TeamItem {
  id: number;
  name: string;
  league: string;
}

export interface SelectedTeam {
  id: number;
  name: string;
}

interface TeamSearchBarProps {
  placeholder: string;
  onSelect: (teamObj: SelectedTeam) => void;
  onError: (err: string) => void;
  selectedTeams: SelectedTeam[];
  onCheckedTeamsChange: (teams: SelectedTeam[]) => void;
}

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({
  placeholder,
  onSelect,
  onError,
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

  // Debounce the user’s input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch teams from API when debouncedQuery changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!debouncedQuery) {
        setTeams([]);
        setShowDropdown(false);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch teams.");
        }
        const data: { teams: TeamItem[] } = await response.json();
        setTeams(data.teams || []);
        setShowDropdown(true);

        // Reset scroll position to top when new results are fetched
        if (dropdownRef.current) {
          dropdownRef.current.scrollTop = 0;
        }
      } catch (err: any) {
        onError(err.message || "Failed to fetch teams.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeams();
  }, [debouncedQuery, onError]);

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation for single-select on Enter
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
        handleSelect(teams[highlightedIndex]);
      }
    }
  };

  // Handle selecting a team from the dropdown
  const handleSelect = (team: TeamItem) => {
    setShowDropdown(false);
    setQuery("");
    onSelect({ id: team.id, name: team.name });
  };

  // Handle checkbox for multi-select
  const handleCheckboxChange = (team: TeamItem) => {
    const isSelected = selectedTeams.some((t) => t.id === team.id);
    if (isSelected) {
      onCheckedTeamsChange(selectedTeams.filter((t) => t.id !== team.id));
    } else {
      onCheckedTeamsChange([...selectedTeams, { id: team.id, name: team.name }]);
    }
  };

  const handleInputFocus = () => {
    if (teams.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <input
        type="text"
        value={query}
        onFocus={handleInputFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="border p-2 rounded-md w-full"
        onKeyDown={handleKeyDown}
      />

      {showDropdown && (
        <ul
          ref={dropdownRef}
          className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10"
        >
          {teams.map((team, index) => {
            const isHighlighted = highlightedIndex === index;
            const isChecked = selectedTeams.some((t) => t.id === team.id);
            return (
              <li
                key={team.id}
                className={`p-2 hover:bg-gray-100 ${isHighlighted ? "bg-gray-200" : ""}`}
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(team)}
                  />
                  <span>
                    {team.name} - {team.league}
                  </span>
                </label>
              </li>
            );
          })}
          {isLoading && <li className="p-2 text-gray-500">Loading...</li>}
          {!isLoading && teams.length === 0 && <li className="p-2 text-gray-500">No results found</li>}
        </ul>
      )}

      {selectedTeams.length > 0 && (
        <div className="mt-2 bg-gray-100 p-2 rounded">
          <strong>Selected Teams:</strong>{" "}
          {selectedTeams.map((t) => t.name).join(", ")}
        </div>
      )}
    </div>
  );
};

export default TeamSearchBar;
