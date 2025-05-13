'use client';

import React, { useState, useEffect } from 'react';
import LeaguePlayoffWidgetSetup from '@/app/components/widget/LeaguePlayoffWidgetSetup';

interface ClientLeaguePlayoffPageProps {
  leagueSlug: string;
  season: string;
}

export default function ClientLeaguePlayoffPage({ leagueSlug, season }: ClientLeaguePlayoffPageProps) {
  const [selectedLeagueSlug, setSelectedLeagueSlug] = useState<string>(leagueSlug);

  useEffect(() => {
    if (leagueSlug) {
      setSelectedLeagueSlug(leagueSlug);
    }
  }, [leagueSlug]);

  return (
    <>
      {selectedLeagueSlug && (
        <LeaguePlayoffWidgetSetup leagueId={selectedLeagueSlug} season={season} />
      )}
    </>
  );
} 