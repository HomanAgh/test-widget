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
  onSelect: (teamObj: SelectedTeam) => void; // optional single-select usage
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

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // Fetch
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
          throw new Error("Failed to fetch teams.");
        }
        const data: { teams: TeamItem[] } = await response.json();
        setTeams(data.teams || []);
        setShowDropdown(true);

        // Reset highlight ONLY after new search
        setHighlightedIndex(-1);
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
      // Single-select usage if you want that on Enter:
      if (highlightedIndex >= 0 && highlightedIndex < teams.length) {
        // If you want multi-select on Enter instead, just call handleCheckboxChange
        const highlightedTeam = teams[highlightedIndex];
        onSelect({ id: highlightedTeam.id, name: highlightedTeam.name });
        // Optionally keep the dropdown open for further multi-selections
        // setShowDropdown(false);
        // setQuery("");
      }
    }
  };

  // Multi-select
  const handleCheckboxChange = (team: TeamItem) => {
    const isSelected = selectedTeams.some((t) => t.id === team.id);
    if (isSelected) {
      onCheckedTeamsChange(selectedTeams.filter((t) => t.id !== team.id));
    } else {
      onCheckedTeamsChange([...selectedTeams, { id: team.id, name: team.name }]);
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
                  onClick={() => handleCheckboxChange(team)} // move onClick here
                  className={`p-2 hover:bg-gray-100 ${
                    isHighlighted ? "bg-gray-200" : ""
                  } cursor-pointer`} // ensure cursor is pointer
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                    />
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
        <div className="mt-2 bg-gray-100 p-2 rounded">
          <strong>Selected Teams:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedTeams.map((team) => (
              <span
                key={team.id}
                className="inline-flex items-center bg-blue-200 px-2 py-1 rounded text-sm"
              >
                {team.name}
                <button
                  onClick={() => removeTeam(team.id)}
                  className="ml-2 text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={clearAllTeams}
            className="text-sm text-blue-500 mt-2 underline"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamSearchBar;
