"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  onSelect: (teamId: string) => void;
  onError: (error: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onError }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query) {
      onError(t("EnterTeamIDError"));
      return;
    }

    setIsLoading(true);
    try {
      onSelect(query.trim());
    } catch {
      onError(t("SearchError"));
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
        placeholder={t("EnterTeamID")}
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
