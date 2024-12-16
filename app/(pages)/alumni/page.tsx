/* 'use client';

import React, { useState, useEffect } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar'; // Use the new TeamSearchBar
import { AlumniPlayer } from '@/app/types/player';
import { League } from '@/app/types/league';

const SearchPlayers = () => {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [customJunLeagues, setCustomJunLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [selectedJunLeague, setSelectedJunLeague] = useState<string | null>(null);
  const [selectedCustomJunLeague, setSelectedCustomJunLeague] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague' | 'junLeague' | 'customJunLeague'>('league');
  const [query, setQuery] = useState<string>(''); // Team name input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch leagues for filters
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const proResponse = await fetch('/api/ProfLeague');
        const junResponse = await fetch('/api/JunLeague');

        if (!proResponse.ok || !junResponse.ok) throw new Error('Failed to fetch leagues.');

        const proData = await proResponse.json();
        const junData = await junResponse.json();

        setProLeagues(proData.leagues || []);
        setJunLeagues(junData.leagues || []);

        const customLeagueSlugs = ['nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del'];
        const customJuniorLeagueSlugs = ['chl', 'ohl', 'whl', 'qmjhl'];

        setCustomLeagues(proData.leagues.filter((league: League) => customLeagueSlugs.includes(league.slug)));
        setCustomJunLeagues(junData.leagues.filter((league: League) => customJuniorLeagueSlugs.includes(league.slug)));
      } catch (err: any) {
        setError('Failed to fetch leagues.');
        console.error('Error fetching leagues:', err.message);
      }
    };

    fetchLeagues();
  }, []);

  // Fetch players whenever a valid team query is selected
  useEffect(() => {
    if (!query) return; // Do nothing if query is empty

    const fetchPlayers = async () => {
      setLoading(true);
      setError('');
      setResults([]);

      try {
        let url = `/api/alumni?query=${encodeURIComponent(query)}`;
        let leagueParam = '';

        // Append active filter league if applicable
        if (activeFilter === 'league' && selectedLeague) leagueParam = selectedLeague;
        else if (activeFilter === 'customLeague' && selectedCustomLeague) leagueParam = selectedCustomLeague;
        else if (activeFilter === 'junLeague' && selectedJunLeague) leagueParam = selectedJunLeague;
        else if (activeFilter === 'customJunLeague' && selectedCustomJunLeague)
          leagueParam = selectedCustomJunLeague;

        if (leagueParam) url += `&league=${leagueParam}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const data = await response.json();
        setResults(data.players || []);
      } catch (err: any) {
        setError('An error occurred while fetching players.');
        console.error('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [query, selectedLeague, selectedCustomLeague, selectedJunLeague, selectedCustomJunLeague, activeFilter]);

  // Update the query state when a team is selected
  const handleTeamSelect = (team: string) => {
    setQuery(team);
  };

  return (
    <div>
      <h1>Search Organization</h1>


      <TeamSearchBar
        placeholder="Search for a team..."
        onSelect={handleTeamSelect}
        onError={(err) => setError(err)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}


      <FilterToggle
        options={[
          { value: 'league', label: 'Use Professional League Filter' },
          { value: 'customLeague', label: 'Use Custom Professional League Filter' },
          { value: 'junLeague', label: 'Use Junior League Filter' },
          { value: 'customJunLeague', label: 'Use Custom Junior League Filter' },
        ]}
        activeFilter={activeFilter}
        onChange={(filter: string) => setActiveFilter(filter as 'league' | 'customLeague' | 'junLeague' | 'customJunLeague')}
      />

      <div className="flex space-x-4 mb-4">
        {activeFilter === 'league' && (
          <LeagueFilter id="leagueFilter" label="Filter by League:" leagues={proLeagues} selectedLeague={selectedLeague} onChange={setSelectedLeague} />
        )}
        {activeFilter === 'customLeague' && (
          <LeagueFilter id="customLeagueFilter" label="Filter by Custom League:" leagues={customLeagues} selectedLeague={selectedCustomLeague} onChange={setSelectedCustomLeague} />
        )}
        {activeFilter === 'junLeague' && (
          <LeagueFilter id="junLeagueFilter" label="Filter by Junior League:" leagues={junLeagues} selectedLeague={selectedJunLeague} onChange={setSelectedJunLeague} />
        )}
        {activeFilter === 'customJunLeague' && (
          <LeagueFilter id="customJunLeagueFilter" label="Filter by Custom Junior League:" leagues={customJunLeagues} selectedLeague={selectedCustomJunLeague} onChange={setSelectedCustomJunLeague} />
        )}
      </div>

      <PlayerTable players={results} />
    </div>
  );
};

export default SearchPlayers;
 */

'use client';

import React, { useState, useEffect } from 'react';
import PlayerTable from '@/app/components/alumni/PlayerTable';
import FilterToggle from '@/app/components/alumni/FilterToggle';
import LeagueFilter from '@/app/components/alumni/LeagueFilter';
import TeamSearchBar from '@/app/components/alumni/TeamSearchBar';
import { AlumniPlayer } from '@/app/types/player';
import { League } from '@/app/types/league';

const SearchPlayers = () => {
  const [results, setResults] = useState<AlumniPlayer[]>([]);
  const [proLeagues, setProLeagues] = useState<League[]>([]);
  const [customLeagues, setCustomLeagues] = useState<League[]>([]);
  const [junLeagues, setJunLeagues] = useState<League[]>([]);
  const [customJunLeagues, setCustomJunLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [selectedCustomLeague, setSelectedCustomLeague] = useState<string | null>(null);
  const [selectedJunLeague, setSelectedJunLeague] = useState<string | null>(null);
  const [selectedCustomJunLeague, setSelectedCustomJunLeague] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'league' | 'customLeague' | 'junLeague' | 'customJunLeague'>('league');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const proResponse = await fetch('/api/ProfLeague');
        const junResponse = await fetch('/api/JunLeague');

        if (!proResponse.ok || !junResponse.ok) throw new Error('Failed to fetch leagues.');

        const proData = await proResponse.json();
        const junData = await junResponse.json();

        setProLeagues(proData.leagues || []);
        setJunLeagues(junData.leagues || []);

        const customLeagueSlugs = ['nhl', 'ahl', 'shl', 'khl', 'liiga', 'nl', 'del'];
        const customJuniorLeagueSlugs = ['chl', 'ohl', 'whl', 'qmjhl'];

        setCustomLeagues(proData.leagues.filter((league: League) => customLeagueSlugs.includes(league.slug)));
        setCustomJunLeagues(junData.leagues.filter((league: League) => customJuniorLeagueSlugs.includes(league.slug)));
      } catch (err: any) {
        setError('Failed to fetch leagues.');
        console.error('Error fetching leagues:', err.message);
      }
    };

    fetchLeagues();
  }, []);

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchPlayers = async () => {
      setLoading(true);
      setError('');
      setResults([]);

      try {
        let url = `/api/alumni?query=${encodeURIComponent(selectedTeam)}`;
        let leagueParam = '';

        if (activeFilter === 'league' && selectedLeague) leagueParam = selectedLeague;
        else if (activeFilter === 'customLeague' && selectedCustomLeague) leagueParam = selectedCustomLeague;
        else if (activeFilter === 'junLeague' && selectedJunLeague) leagueParam = selectedJunLeague;
        else if (activeFilter === 'customJunLeague' && selectedCustomJunLeague)
          leagueParam = selectedCustomJunLeague;

        if (leagueParam) url += `&league=${leagueParam}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch players.');

        const data = await response.json();
        const players = data.players.map((player: any) => ({
          id: player.id,
          name: player.name,
          birthYear: player.dateOfBirth
            ? new Date(player.dateOfBirth).getFullYear().toString() // Extract year from dateOfBirth
            : 'Unknown',
        }));
        

        const draftPickAndTeamData = await fetchDraftPicksAndTeams(players.map((p: { id: number }) => p.id), leagueParam);

        const playersWithAdditionalData = players.map((player: { id: number }) => ({
          ...player,
          draftPick: draftPickAndTeamData[player.id]?.draftPick || 'N/A',
          teams: draftPickAndTeamData[player.id]?.teams || 'N/A',
        }));

        setResults(playersWithAdditionalData);
      } catch (err: any) {
        setError('An error occurred while fetching players.');
        console.error('Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [selectedTeam, selectedLeague, selectedCustomLeague, selectedJunLeague, selectedCustomJunLeague, activeFilter]);

  // Fetch draft picks and teams function
  const fetchDraftPicksAndTeams = async (playerIds: number[], league: string | null) => {
    try {
      const idsString = playerIds.join(',');
      let url = `/api/draftpicks?playerIds=${idsString}`;
      if (league) url += `&league=${league}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch draft picks and teams.');

      const data = await response.json();
      return data.players.reduce((acc: { [key: number]: any }, entry: any) => {
        acc[entry.playerId] = {
          draftPick: entry.draftPick || 'N/A',
          teams: entry.teams || 'N/A',
        };
        return acc;
      }, {});
    } catch (err) {
      console.error('Error fetching draft picks and teams:', err);
      return {};
    }
  };

  return (
    <div>
      <h1>Search Organization</h1>

      <TeamSearchBar
        placeholder="Search for a team..."
        onSelect={(team) => setSelectedTeam(team)}
        onError={(err) => setError(err)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <FilterToggle
        options={[
          { value: 'league', label: 'Use Professional League Filter' },
          { value: 'customLeague', label: 'Use Custom Professional League Filter' },
          { value: 'junLeague', label: 'Use Junior League Filter' },
          { value: 'customJunLeague', label: 'Use Custom Junior League Filter' },
        ]}
        activeFilter={activeFilter}
        onChange={(filter: string) => setActiveFilter(filter as 'league' | 'customLeague' | 'junLeague' | 'customJunLeague')}
      />

      <div className="flex space-x-4 mb-4">
        {activeFilter === 'league' && <LeagueFilter id="leagueFilter" label="Filter by League:" leagues={proLeagues} selectedLeague={selectedLeague} onChange={setSelectedLeague} />}
        {activeFilter === 'customLeague' && <LeagueFilter id="customLeagueFilter" label="Filter by Custom League:" leagues={customLeagues} selectedLeague={selectedCustomLeague} onChange={setSelectedCustomLeague} />}
        {activeFilter === 'junLeague' && <LeagueFilter id="junLeagueFilter" label="Filter by Junior League:" leagues={junLeagues} selectedLeague={selectedJunLeague} onChange={setSelectedJunLeague} />}
        {activeFilter === 'customJunLeague' && <LeagueFilter id="customJunLeagueFilter" label="Filter by Custom Junior League:" leagues={customJunLeagues} selectedLeague={selectedCustomJunLeague} onChange={setSelectedCustomJunLeague} />}
      </div>

      <PlayerTable players={results} />
    </div>
  );
};

export default SearchPlayers;

