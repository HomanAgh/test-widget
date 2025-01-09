"use client";

import React, { useState, useEffect } from "react";
import { League, LeaguesAPIResponse } from "@/app/types/league"; // Assume a Team type is defined

interface LeagueSearchBarProps {
  onSelect: (leagueSlug: string) => void;
  onError: (error: string) => void;
}

const LeagueSearchBar: React.FC<LeagueSearchBarProps> = ({ onSelect, onError }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [Leagues, setLeagues] = useState<League[]>([]);
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

  useEffect(() => {
    const fetchLeagues = async () => {
      if (!debouncedQuery) {
        setLeagues([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/searchLeague?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Search Failed");
        }

        const data: LeaguesAPIResponse = await res.json();

        // Sort teams alphabetically and limit to top 20
        const sortedLeagues= data.leagues
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 20);

        setLeagues(sortedLeagues);
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

    fetchLeagues();
  }, [debouncedQuery, onError]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || Leagues.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Leagues.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + Leagues.length) % Leagues.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < Leagues.length) {
        handleSelect(Leagues[highlightedIndex].slug);
      } else if (query.trim()) {
        setShowDropdown(false);
        onSelect(query.trim());
      }
    }
  };

  const handleSelect = (leagueSlug: string) => {
    setShowDropdown(false);
    setQuery("");
    onSelect(leagueSlug);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"Search for League..."}
        className="border p-2 rounded-md w-full"
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(Leagues.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
      />
      {showDropdown && (
        <ul className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10">
          {Leagues.map((Leagues, index) => (
            <li
              key={Leagues.slug}
              onClick={() => handleSelect(Leagues.slug)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                highlightedIndex === index ? "bg-gray-200" : ""
              }`}
            >
              {`${Leagues.name} - ${Leagues.fullName} (${Leagues.country})`}
            </li>
          ))}
          {isLoading && <li className="p-2 text-gray-500">{"Loading..."}</li>}
        </ul>
      )}
    </div>
  );
};

export default LeagueSearchBar;
