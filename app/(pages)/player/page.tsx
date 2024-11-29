"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { useRouter } from "next/navigation";
import SearchBar from "../../components/player/SearchBar";
import ErrorMessage from "../../components/common/ErrorMessage";
import WidgetSetup from "../../components/widgets/WidgetSetup";
import LogoutButton from "../../components/common/LogoutButton";
import LanguageButton from "../../components/common/LanguageButton";

const PlayerPage = () => {
  const { t } = useTranslation(); // Hook for translations
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId); // Set selected player ID for WidgetSetup
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("PlayerSearchTitle")}</h1> {/* Translated title */}

      {/* Search Bar for Player Selection */}
      <SearchBar
        onSelect={handlePlayerSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      {/* Widget Setup for Player */}
      {selectedPlayerId && <WidgetSetup playerId={selectedPlayerId} />}

      {/* Language and Logout Buttons */}
      <LanguageButton />
      <LogoutButton />
    </div>
  );
};

export default PlayerPage;
