import { useState, useEffect } from 'react';
import { League } from '@/app/types/league';
import { getLeagueSlugs } from '@/app/config/leagues';

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
        const [proResponse, junResponse, collegeResponse] = await Promise.all([
          fetch('/api/ProfLeague'),
          fetch('/api/JunLeague'),
          fetch('/api/CollLeague'),
        ]);

        if (!proResponse.ok || !junResponse.ok || !collegeResponse.ok) {
          throw new Error('Failed to fetch one or more league endpoints.');
        }

        const [proData, junData, collegeData] = await Promise.all([
          proResponse.json(),
          junResponse.json(),
          collegeResponse.json(),
        ]);

        // Get league slugs from centralized config
        const professionalLeagueSlugs = getLeagueSlugs('professional');
        const collegeLeagueSlugs = getLeagueSlugs('college');
        const juniorLeagueSlugs = getLeagueSlugs('junior');

        // 1) Professional Leagues
        setProLeagues(proData.leagues || []);
        setCustomLeagues(
          (proData.leagues || []).filter((league: League) =>
            professionalLeagueSlugs.includes(league.slug.toLowerCase())
          )
        );

        // 2) College Leagues
        setCollegeLeagues(collegeData.leagues || []);
        setCustomCollegeLeagues(
          (collegeData.leagues || []).filter((league: League) =>
            collegeLeagueSlugs.includes(league.slug.toLowerCase())
          )
        );

        // 3) Junior Leagues
        setJunLeagues(junData.leagues || []);
        setCustomJunLeagues(
          (junData.leagues || []).filter((league: League) =>
            juniorLeagueSlugs.includes(league.slug.toLowerCase())
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
