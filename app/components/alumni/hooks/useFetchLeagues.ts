import { useState, useEffect } from 'react';
import { League } from '@/app/types/league';

export const useFetchLeagues = () => {
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [customJunLeagues, setCustomJunLeagues] = useState<League[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const proResponse = await fetch('/api/ProfLeague'); // Professional leagues endpoint
        const junResponse = await fetch('/api/JunLeague'); // Junior leagues endpoint

        if (!proResponse.ok || !junResponse.ok) throw new Error('Failed to fetch leagues.');

        const proData = await proResponse.json();
        const junData = await junResponse.json();

        // Professional leagues
        const customLeagueSlugs = ['pwhl-w', 'nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del'];
        setProLeagues(proData.leagues || []);
        setCustomLeagues(proData.leagues.filter((league: League) => customLeagueSlugs.includes(league.slug)));

        // Junior leagues
        const customJuniorLeagueSlugs = ['jwhl-w', 'ushl', 'cchl', 'ohl', 'whl', 'qmjhl'];
        setJunLeagues(junData.leagues || []); // Set all junior leagues
        setCustomJunLeagues(junData.leagues.filter((league: League) => customJuniorLeagueSlugs.includes(league.slug)));
      } catch (err: unknown) {
        setError('Failed to fetch leagues.');
        console.error('Error fetching leagues:', err);
      }
    };

    fetchLeagues();
  }, []);

  return { proLeagues, customLeagues, junLeagues, customJunLeagues, error };
};
