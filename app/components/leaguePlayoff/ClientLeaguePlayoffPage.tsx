'use client';

import React, { useState, useEffect } from 'react';
import LeaguePlayoffWidgetSetup from '@/app/components/widget/LeaguePlayoffWidgetSetup';

interface ClientLeaguePlayoffPageProps {
  leagueSlug: string;
  season: string;
}

const ClientLeaguePlayoffPage: React.FC<ClientLeaguePlayoffPageProps> = ({ leagueSlug, season }) => {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string>(leagueSlug);

  useEffect(() => {
    if (leagueSlug) {
      setSelectedLeagueSlug(leagueSlug);
    }
  }, [leagueSlug]);

  return (
    <>
      {selectedLeagueSlug && (
        <LeaguePlayoffWidgetSetup 
        leagueId={selectedLeagueSlug} 
        season={season} />
      )}
    </>
  );
} 

export default ClientLeaguePlayoffPage;