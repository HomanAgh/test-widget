'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import SearchBar from "@/app/components/player/PlayerSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import WidgetSetup from "@/app/components/widget/PlayerWidgetSetup";
import Header from "@/app/components/Header";
import { PageWrapper, PageTitle } from "@/app/components/common/style";

const PlayerPage = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Extract playerId from the URL with a fallback to null
  const playerIdFromURL: string | null = pathname.split("/").pop() || null;

  useEffect(() => {
    // Redirect to login if not logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    } else {
      setSelectedPlayerId(playerIdFromURL);
    }
  }, [router, playerIdFromURL]);

  const handlePlayerSelect = (playerId: string) => {
    if (playerId !== playerIdFromURL) {
      router.push(`/player/${playerId}`);
    }
    // If the same player is selected, you might want to refresh data or do nothing
  };

  return (
    <PageWrapper>
      <Header />
      <PageTitle title="Search player" />
      <SearchBar
        onSelect={handlePlayerSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      {selectedPlayerId && <WidgetSetup playerId={selectedPlayerId} />}
    </PageWrapper>
  );
};

export default PlayerPage;
