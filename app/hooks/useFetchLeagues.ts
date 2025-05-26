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

        // 1) Professional Leagues
        const customLeagueSlugs = [
        //Womens Leagues
        'pwhl-w', 'sdhl-w', 'nwhl-ca-w', 'phf-w',
        //Mens Leagues
        'nhl', 'shl', 'ahl', 'khl','nl', 'liiga', 'czechia', 'del', 'echl', 'icehl', 'slovakia', 'hockeyallsvenskan','alpshl','norway','del2','denmark', 'hockeyettan', 'sl', 'mestis', 'eihl', 'ligue-magnus'
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
        'ncaa-w', 'ncaa-iii-w', 'acha-w', 'acha-d2-w', 'usports-w',
        //Mens Leagues
        'ncaa', 'usports', 'acac', 'acha'
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
        'ohl', 'whl', 'ushl', 'qmjhl', 'j20-nationell', 'mhl', 'cchl',"nahl"    
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
