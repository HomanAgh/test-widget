import { useState, useEffect } from 'react';
import { League } from '@/app/types/league';

export const useFetchLeagues = () => {
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [customJunLeagues, setCustomJunLeagues] = useState<League[]>([]);
  const [collegeLeagues, setCollegeLeagues] = useState<League[]>([]);
  const [customCollegeLeagues, setCustomCollegeLeagues] = useState<League[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        // Fetch all in parallel
        const [proResponse, junResponse, collegeResponse] = await Promise.all([
          fetch('/api/ProfLeague'),  // Professional leagues endpoint
          fetch('/api/JunLeague'),   // Junior leagues endpoint
          fetch('/api/CollLeague'),  // College leagues endpoint
        ]);

        // Check any failed responses
        if (!proResponse.ok || !junResponse.ok || !collegeResponse.ok) {
          throw new Error('Failed to fetch one or more league endpoints.');
        }

        // Parse all as JSON
        const [proData, junData, collegeData] = await Promise.all([
          proResponse.json(),
          junResponse.json(),
          collegeResponse.json(),
        ]);

        // 1) Professional Leagues
        const customLeagueSlugs = [
        //Womens Leagues
        'pwhl-w', 'nwhl-ca-w', 'sdhl-w', 'phf-w',
        //Mens Leagues
        'nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del', 'hockeyallsvenskan', 'liiga'
        ];
        setProLeagues(proData.leagues || []);
        setCustomLeagues(
          (proData.leagues || []).filter((league: League) =>
            customLeagueSlugs.includes(league.slug)
          )
        );

        // 2) College Leagues
        const customCollegeLeagueSlugs = [
        //Womens Leagues
        'ncaa-iii-w', 'ncaa-w','acha-w', 'acha-d2-w',
        //Mens Leagues
        'ncaa', 'acac', 'usports', 'acha'
        ];
        setCollegeLeagues(collegeData.leagues || []);
        setCustomCollegeLeagues(
          (collegeData.leagues || []).filter((league: League) =>
            customCollegeLeagueSlugs.includes(league.slug)
          )
        );

        // 3) Junior Leagues
        const customJuniorLeagueSlugs = [
        //Womens Leagues
        'jwhl-w',
        //Mens Leagues
        'ushl', 'cchl', 'ohl', 'whl', 'qmjhl', 'j20-nationell', 'mhl'
        ];
        setJunLeagues(junData.leagues || []);
        setCustomJunLeagues(
          (junData.leagues || []).filter((league: League) =>
            customJuniorLeagueSlugs.includes(league.slug)
          )
        );
      } catch (err) {
        setError('Failed to fetch leagues.');
        console.error('Error fetching leagues:', err);
      }
    };

    fetchLeagues();
  }, []);

  return {
    proLeagues,
    customLeagues,
    junLeagues,
    customJunLeagues,
    collegeLeagues,
    customCollegeLeagues,
    error,
  };
};
