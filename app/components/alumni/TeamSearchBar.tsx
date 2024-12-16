"use client";

import React, { useState, useEffect } from "react";

interface Team {
  id: string;
  name: string;
  league: string; // Includes league name for display purposes
}

interface TeamSearchBarProps {
  placeholder: string;
  onSelect: (team: string) => void;
  onError: (err: string) => void;
}

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({ onSelect, onError, placeholder }) => {
  const [query, setQuery] = useState<string>(""); // User's input
  const [debouncedQuery, setDebouncedQuery] = useState<string>(""); // Debounced query
  const [teams, setTeams] = useState<Team[]>([]); // Team objects
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Debounce input to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch teams from the new AlumniSearchTeam route
  useEffect(() => {
    const fetchTeams = async () => {
      if (!debouncedQuery) {
        setTeams([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use the new AlumniSearchTeam route
        const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(debouncedQuery)}`);
        if (!response.ok) throw new Error("Failed to fetch teams.");

        const data: { teams: Team[] } = await response.json();

        // Sort and limit to 20 teams
        const sortedTeams = data.teams
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);

        setTeams(sortedTeams);
        setShowDropdown(true);
      } catch (err: any) {
        onError(err.message || "Failed to fetch teams.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [debouncedQuery, onError]);

  // Handle keyboard navigation
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
        handleSelect(teams[highlightedIndex].name);
      }
    }
  };

  const handleSelect = (team: string) => {
    setShowDropdown(false);
    setQuery("");
    onSelect(team);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="border p-2 rounded-md w-full"
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(teams.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && (
        <ul className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
          {teams.map((team, index) => (
            <li
              key={team.id}
              onClick={() => handleSelect(team.name)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              {team.name} - {team.league} {/* Display team name and league */}
            </li>
          ))}
          {isLoading && <li className="p-2 text-gray-500">Loading...</li>}
          {!isLoading && teams.length === 0 && <li className="p-2 text-gray-500">No results found</li>}
        </ul>
      )}
    </div>
  );
};

export default TeamSearchBar;
