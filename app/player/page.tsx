"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../components/player/SearchBar";
import ErrorMessage from "../components/common/ErrorMessage";
import Player from "../components/player/Player";
import LogoutButton from "../components/common/LogoutButton";

interface Player {
  id: string;
  name: string;
  league: string;
  team: string;
}

const PlayerPage = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  const handlePlayerSelect = (playerId: string) => {
    setSelectedPlayerId(playerId);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Player Search and Profile</h1>
      <SearchBar
        onSelect={handlePlayerSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}
      {selectedPlayerId && <Player playerId={selectedPlayerId} />}
      <LogoutButton />
    </div>
  );
};

export default PlayerPage;



