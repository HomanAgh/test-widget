'use client';

import React, { useState, useEffect } from 'react';
import GoalieLeadersWidgetSetup from '../widget/GoalieLeadersWidgetSetup';

interface ClientGoalieLeadersPageProps {
  leagueSlug: string;
  season: string;
}

const ClientGoalieLeadersPage: React.FC<ClientGoalieLeadersPageProps> = ({ leagueSlug, season }) => {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string | null>(null);

  useEffect(() => {
    if (leagueSlug) {
      setSelectedLeagueSlug(leagueSlug);
    }
  }, [leagueSlug]);

  return (
    <>
      {selectedLeagueSlug && (
        <GoalieLeadersWidgetSetup 
          leagueSlug={selectedLeagueSlug} 
          season={season}
        />
      )}
    </>
  );
};

export default ClientGoalieLeadersPage;
