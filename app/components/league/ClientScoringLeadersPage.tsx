'use client';

import React, { useState, useEffect } from 'react';
import ScoringLeaders from './ScoringLeaders';

interface ClientScoringLeadersPageProps {
  leagueSlug: string;
  season: string;
}

const ClientScoringLeadersPage: React.FC<ClientScoringLeadersPageProps> = ({ leagueSlug, season }) => {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string | null>(null);

  useEffect(() => {
    if (leagueSlug) {
      setSelectedLeagueSlug(leagueSlug);
    }
  }, [leagueSlug]);

  return (
    <>
      {selectedLeagueSlug && (
        <ScoringLeaders leagueSlug={selectedLeagueSlug} season={season} />
      )}
    </>
  );
};

export default ClientScoringLeadersPage; 