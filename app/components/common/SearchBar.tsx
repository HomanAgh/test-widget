"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  type: "team" | "league"; // Determines the type of search
  onSelect: (value: string) => void;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ type, onSelect, onError }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query) {
      // Error messages based on type
      const errorMessage =
        type === "team"
          ? t("EnterTeamNameError") // Updated for team names
          : t("EnterLeagueSlugError");
      onError(errorMessage);
      return;
    }

    setIsLoading(true);
    try {
      onSelect(query.trim());
    } catch {
      // General error message
      onError(t("SearchError"));
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder text based on type
  const placeholderText =
    type === "team"
      ? t("EnterTeamName") // Updated for team names
      : t("EnterLeagueSlug");

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholderText}
        className="border p-2 rounded-md w-full"
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className={`mt-2 p-2 rounded-md ${
          isLoading ? "bg-gray-400" : "bg-blue-500 text-white"
        }`}
      >
        {isLoading ? t("Loading") : t("Search")}
      </button>
    </div>
  );
};

export default SearchBar;
