'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LeagueSearchBar from './LeagueSearch';

const ScoringLeadersSearch: React.FC = () => {
  const router = useRouter();

  const handleLeagueSelect = (leagueSlug: string): boolean => {
    router.push(`/scoring-leaders/${leagueSlug}`);
    return true;
  };

  return <LeagueSearchBar onSelect={handleLeagueSelect} />;
};

export default ScoringLeadersSearch; 