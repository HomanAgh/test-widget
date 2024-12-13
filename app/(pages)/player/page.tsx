'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/app/components/player/PlayerSearch";
import ErrorMessage from "@/app/components/common/ErrorMessage";
import LogoutButton from "@/app/components/common/LogoutButton";
import HomeButton from "@/app/components/common/HomeButton";

const PlayerSearchPage = () => {
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.replace("/auth");
    }
  }, [router]);

  const handlePlayerSelect = (playerId: string) => {
    router.push(`/player/${playerId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <div>
          <HomeButton />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4 text-center">
        {"Player Search"}
      </h1>

      <SearchBar
        onSelect={handlePlayerSelect}
        onError={(error) => setError(error)}
      />
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
};

export default PlayerSearchPage;
