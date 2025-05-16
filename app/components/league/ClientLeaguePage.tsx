'use client';

import React, { useState, useEffect } from 'react';
import LeagueWidgetSetup from "@/app/components/widget/LeagueWidgetSetup";

interface ClientLeaguePageProps {
  leagueSlug: string;
  season: string;
}

const ClientLeaguePage: React.FC<ClientLeaguePageProps> = ({ leagueSlug, season }) => {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string | null>(null);

  useEffect(() => {
    if (leagueSlug) {
      setSelectedLeagueSlug(leagueSlug);
    }
  }, [leagueSlug]);

  return (
    <>
      {selectedLeagueSlug && (
        <LeagueWidgetSetup 
        leagueSlug={selectedLeagueSlug} 
        season={season} />
      )}
    </>
  );
};

export default ClientLeaguePage; 