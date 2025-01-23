"use client";
// The TeamSearchBar does an auto-search with 500ms debounce (like before).
// The final "Search" for players is done in the parent container, after picking leagues & teams.

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
  // Called when the user single-selects a team by pressing Enter (optional usage)
  onSelect: (teamObj: SelectedTeam) => void;
  // Error callback
  onError: (err: string) => void;
  // The currently selected teams
  selectedTeams: SelectedTeam[];
  // Called when the user toggles the checkboxes or removes teams
  onCheckedTeamsChange: (teams: SelectedTeam[]) => void;
}

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({
  placeholder,
  onSelect,
  onError,
  selectedTeams,
  onCheckedTeamsChange,
}) => {
  // The raw text the user is typing
  const [query, setQuery] = useState<string>("");

  // The debounced version of `query` (updated after 500ms of no typing)
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");

  // The list of teams returned by the API
  const [teams, setTeams] = useState<TeamItem[]>([]);

  // Whether the dropdown is currently shown
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // Index for arrow-key highlight
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  // Loading state while fetching
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs for outside-click detection
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  /**
   * 1) Debounce the user input by 500ms. 
   *    We'll do the actual fetch in a useEffect when 'debouncedQuery' changes.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  /**
   * 2) Fetch teams from the API whenever debouncedQuery changes
   *    (like before).
   */
  useEffect(() => {
    // If user cleared the input, remove old results
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

        // Reset highlight & scroll
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
  }, [debouncedQuery, onError]);

  /**
   * 3) Hide dropdown if user clicks outside
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * 4) Keyboard events for arrow up/down + Enter
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the dropdown isn't open or we have no teams, ignore
    if (!showDropdown || teams.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % teams.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + teams.length) % teams.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      // Single select if the user presses Enter on a highlighted item
      if (highlightedIndex >= 0 && highlightedIndex < teams.length) {
        handleSelect(teams[highlightedIndex]);
      }
    }
  };

  /**
   * Single-select: Press Enter or click on the row
   */
  const handleSelect = (team: TeamItem) => {
    setShowDropdown(false);
    setQuery("");
    onSelect({ id: team.id, name: team.name });
  };

  /**
   * Multi-select: toggling the checkboxes for each item
   */
  const handleCheckboxChange = (team: TeamItem) => {
    const isSelected = selectedTeams.some((t) => t.id === team.id);
    if (isSelected) {
      onCheckedTeamsChange(selectedTeams.filter((t) => t.id !== team.id));
    } else {
      onCheckedTeamsChange([...selectedTeams, { id: team.id, name: team.name }]);
    }
  };

  /**
   * Remove a single selected team (by clicking 'x')
   */
  const removeTeam = (teamId: number) => {
    onCheckedTeamsChange(selectedTeams.filter((t) => t.id !== teamId));
  };

  /**
   * Clear all selected teams
   */
  const clearAllTeams = () => {
    onCheckedTeamsChange([]);
  };

  /**
   * If user focuses in the input and we already have some teams, show dropdown
   */
  const handleInputFocus = () => {
    if (teams.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Text input */}
      <input
        type="text"
        value={query}
        onFocus={handleInputFocus}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="border p-2 rounded-md w-full"
        onKeyDown={handleKeyDown}
      />

      {/* The dropdown of search results */}
      {showDropdown && (
        <ul
          ref={dropdownRef}
          className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10"
        >
          {isLoading && (
            <li className="p-2 text-gray-500">Loading...</li>
          )}
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
                  // prevent blur from focusing input
                  className={`p-2 hover:bg-gray-100 ${
                    isHighlighted ? "bg-gray-200" : ""
                  }`}
                  // single-click on the label area => check the box
                >
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(team)}
                    />
                    <span onClick={() => handleSelect(team)}>
                      {team.name} - {team.league}
                    </span>
                  </label>
                </li>
              );
            })}
        </ul>
      )}

      {/* Display chosen teams with 'X' remove and "Clear All" */}
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
