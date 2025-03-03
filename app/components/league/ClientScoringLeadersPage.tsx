'use client';

import React, { useState, useEffect } from 'react';
import ScoringLeadersWidgetSetup from '../widget/ScoringLeadersWidgetSetup';

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
        <ScoringLeadersWidgetSetup 
          leagueSlug={selectedLeagueSlug} 
          season={season}
        />
      )}
    </>
  );
};

export default ClientScoringLeadersPage; 