"use client";

import React, { useState, useEffect, useRef } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";
import Image from "next/image";
import { TournamentItem } from "@/app/types/tournament";

// Extend these props if you want to handle "onSelect" single-click logic
// (like TeamSearchBar's `onSelect`), or if you have more advanced behaviors.
interface TournamentSearchBarProps {
  // Called whenever the user selects/deselects tournaments by checkbox
  onCheckedTournamentsChange: (tournaments: TournamentItem[]) => void;
  // Array of tournaments currently selected
  selectedTournaments: TournamentItem[];

  // Optional: If you want single-selection on "Enter" key,
  // you can replicate what `TeamSearchBar` does:
  onSelect?: (tournament: TournamentItem) => void;
}

const TournamentSearchBar: React.FC<TournamentSearchBarProps> = ({
  onCheckedTournamentsChange,
  selectedTournaments,
  onSelect,
}) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Refs to detect outside clicks
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  // --- 1) Debounce the "query"
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  // --- 2) Fetch tournaments whenever "debouncedQuery" changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setTournaments([]);
      setShowDropdown(false);
      return;
    }

    const fetchTournaments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/TournamentSearch?query=${encodeURIComponent(debouncedQuery)}`
        );
        if (!response.ok) {
          setTournaments([]);
          return;
        }
        const data: { tournaments: TournamentItem[] } = await response.json();

        // If needed, map or transform the data. Example:
        // const transformed = data.tournaments.map((t) => ({ ...t }));
        setTournaments(data.tournaments || []);
        setShowDropdown(true);
        setHighlightedIndex(-1);

        if (dropdownRef.current) {
          dropdownRef.current.scrollTop = 0;
        }
      } catch {
        setTournaments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, [debouncedQuery]);

  // --- 3) Outside click => hide the dropdown
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

  // --- 4) Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || tournaments.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % tournaments.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex(
        (prev) => (prev - 1 + tournaments.length) % tournaments.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < tournaments.length) {
        const highlightedTournament = tournaments[highlightedIndex];

        // If you want single-select behavior (like TeamSearchBar's onSelect):
        onSelect?.(highlightedTournament);

        // Or you can also toggle checkbox selection at the same time:
        handleCheckboxChange(highlightedTournament);
      }
    }
  };

  // --- 5) Checkbox toggle logic
  const handleCheckboxChange = (tour: TournamentItem) => {
    const isSelected = selectedTournaments.some((t) => t.slug === tour.slug);
    if (isSelected) {
      onCheckedTournamentsChange(
        selectedTournaments.filter((t) => t.slug !== tour.slug)
      );
    } else {
      onCheckedTournamentsChange([...selectedTournaments, tour]);
    }
  };

  // Remove one
  const removeTournament = (slug: string) => {
    onCheckedTournamentsChange(
      selectedTournaments.filter((t) => t.slug !== slug)
    );
  };

  // Clear all
  const clearAllTournaments = () => {
    onCheckedTournamentsChange([]);
  };

  // Show dropdown if we already have results
  const handleInputFocus = () => {
    if (tournaments.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="pb-[20px]" ref={containerRef}>
      {/* --- Search Input --- */}
      <div className="relative">
        <RxMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-[20px] h-[20px]" />
        <input
          type="text"
          value={query}
          onFocus={handleInputFocus}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border p-2 pl-10 rounded-md w-full font-montserrat"
          placeholder="Search tournament..."
        />
      </div>

      {/* --- Dropdown List --- */}
      {showDropdown && (
        <ul
          ref={dropdownRef}
          className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto z-10 font-montserrat"
        >
          {isLoading && <li className="p-2 text-gray-500">Loading...</li>}
          {!isLoading && tournaments.length === 0 && (
            <li className="p-2 text-gray-500">No results found</li>
          )}
          {!isLoading &&
            tournaments.map((tour, index) => {
              const isHighlighted = highlightedIndex === index;
              const isChecked = selectedTournaments.some(
                (t) => t.slug === tour.slug
              );
              return (
                <li
                  key={tour.slug}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleCheckboxChange(tour)}
                  className={`p-2 hover:bg-gray-100 ${
                    isHighlighted ? "bg-gray-200" : ""
                  } cursor-pointer`}
                >
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" checked={isChecked} readOnly />
                    <span>
                      {tour.name}
                      {/* If you store more fields, you could display them here */}
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      )}

      {/* --- Selected Tournaments --- */}
      {selectedTournaments.length > 0 && (
        <div className="mt-4 p-2 font-montserrat text-lg">
          <strong>Selected Tournaments</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedTournaments.map((tour) => (
              <span
                key={tour.slug}
                className=" inline-flex items-center bg-white text-[#0D73A6] px-2 py-1 text-sm font-sans font-semibold border-[1.5px] border-[#0D73A6] rounded-[36px]"
              >
                {(tour.logoUrl || tour.imageUrl || tour.logo?.url) && (
                  <Image
                    src={tour.logoUrl || tour.imageUrl || tour.logo?.url || ""}
                    alt={`${tour.name} logo`}
                    className="mr-2 rounded"
                    width={20}
                    height={20}
                  />
                )}
                {tour.name}
                <button
                  onClick={() => removeTournament(tour.slug)}
                  className="ml-2 flex items-center justify-center self-center"
                  aria-label="Remove tournament"
                >
                  <Image
                    src="/images/close (x).svg"
                    alt="Remove tournament"
                    width={16}
                    height={16}
                    className="relative top-[0.5px] transform scale-110"
                  />
                </button>
              </span>
            ))}
          </div>
          <button
            onClick={clearAllTournaments}
            className="my-2 px-4 py-2 rounded uppercase text-sm tracking-wider text-left cursor-pointer"
            style={{
              fontFamily: "Montserrat, sans-serif",
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
  );
};

export default TournamentSearchBar;
