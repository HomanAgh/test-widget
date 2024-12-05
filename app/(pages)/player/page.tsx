'use client';

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import { useRouter } from "next/navigation";
import SearchBar from "../../components/player/PlayerSearch";
import ErrorMessage from "../../components/common/ErrorMessage";
import WidgetSetup from "../../components/widgets/WidgetSetup";
import LogoutButton from "../../components/common/LogoutButton";
import LanguageButton from "../../components/common/LanguageButton";
import HomeButton from "@/app/components/common/HomeButton";

const PlayerPage = () => {
  const { t } = useTranslation();
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
    <div className="max-w-4xl mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <HomeButton />
        </div>

        <div>
          <LanguageButton />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        {t("PlayerSearchTitle")}
      </h1>

      <SearchBar
        onSelect={handlePlayerSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      {selectedPlayerId && <WidgetSetup playerId={selectedPlayerId} />}

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default PlayerPage;