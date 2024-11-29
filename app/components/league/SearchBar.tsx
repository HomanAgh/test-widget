"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

interface SearchBarProps {
  onSelect: (leagueSlug: string) => void;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onError }) => {
  const { t } = useTranslation(); // Hook for translations
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) {
      onError(t("EnterSlugError")); // Use translation for error message
      return;
    }

    setIsLoading(true);
    try {
      onSelect(query.trim());
    } catch (error) {
      onError(t("SearchError")); // Use translation for generic error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("EnterLeagueSlug")} // Translatable placeholder
        className="border p-2 rounded-md w-full"
      />
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className={`mt-2 p-2 rounded-md ${
          isLoading ? "bg-gray-400" : "bg-blue-500 text-white"
        }`}
      >
        {isLoading ? t("Loading") : t("Search")} {/* Translatable button text */}
      </button>
    </div>
  );
};

export default SearchBar;
