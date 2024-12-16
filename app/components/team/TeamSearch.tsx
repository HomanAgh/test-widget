"use client";

import React, { useState, useEffect } from "react";
import { Team, TeamsAPIResponse } from "@/app/types/team"; // Assume a Team type is defined

interface TeamSearchBarProps {
  onSelect: (teamId: string) => void;
  onError: (error: string) => void;
}

const TeamSearchBar: React.FC<TeamSearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500); // Adjust delay as needed

    return () => clearTimeout(handler);
  }, [query]);

  // Fetch and sort teams by name when the debounced query changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!debouncedQuery) {
        setTeams([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/searchTeam?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Search Failed");
        }

        const data: TeamsAPIResponse = await res.json();

        // Sort teams alphabetically and limit to top 20
        const sortedTeams = data.teams
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);

        setTeams(sortedTeams);
        setShowDropdown(true);
      } catch (err: unknown) {
        let errorMessage = "An error occurred during the search.";
        if (err instanceof Error) {
          errorMessage = err.message;
        }
        onError(errorMessage);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [debouncedQuery, onError]);

  // Handle keyboard events
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
        handleSelect(teams[highlightedIndex].id);
      } else if (query.trim()) {
        setShowDropdown(false);
        onSelect(query.trim());
      }
    }
  };

  const handleSelect = (teamId: string) => {
    setShowDropdown(false);
    setQuery("");
    onSelect(teamId);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"Search for Team..."}
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
              onClick={() => handleSelect(team.id)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              {`${team.name} - ${team.league} (${team.country})`}
            </li>
          ))}
          {isLoading && <li className="p-2 text-gray-500">{"Loading..."}</li>}
        </ul>
      )}
    </div>
  );
};

export default TeamSearchBar;
