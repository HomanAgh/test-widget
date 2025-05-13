import { NextRequest, NextResponse } from 'next/server';
import { 
  PlayoffTeam, 
  PlayoffGame, 
  PlayoffSeries, 
  PlayoffRound, 
  PlayoffBracket, 
  LeaguePlayoffResponse 
} from '@/app/types/leaguePlayoff';

const apiKey = process.env.API_KEY;
const apiBaseUrl = process.env.API_BASE_URL;

interface StandingsResponse {
  data: {
    team: {
      id: number;
      name: string;
    };
    group: string;
    postseason: string | null;
  }[];
}

interface GamesResponse {
  data: PlayoffGame[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leagueSlug: string }> }
) {
  try {
    console.log("API Route: /api/leaguePlayoff/[leagueSlug] started");
    
    // Await the params object
    const resolvedParams = await params;
    console.log("Resolved params:", resolvedParams);
    
    // Ensure we have the leagueSlug parameter
    if (!resolvedParams || !resolvedParams.leagueSlug) {
      console.error("Missing leagueSlug parameter");
      return NextResponse.json({ error: 'Missing leagueSlug parameter' }, { status: 400 });
    }

    const leagueSlug = resolvedParams.leagueSlug;
    
    const { searchParams } = new URL(request.url);
    const season = searchParams.get('season') || '2023-2024';
    console.log(`Processing request for league: ${leagueSlug}, season: ${season}`);

    // Fetch standings data 
    const standingsFields = [
      'postseason',
      'team.name',
      'team.id',
      'group'
    ];
    const standingsParams = [
      `season=${season}`,
      `apiKey=${apiKey}`,
      `fields=${standingsFields.join(',')}`,
      'limit=1000'
    ];
    const standingsUrl = `${apiBaseUrl}/leagues/${leagueSlug}/standings?${standingsParams.join('&')}`;
    console.log("Fetching standings from:", standingsUrl);
    
    const standingsResponse = await fetch(standingsUrl);
    
    if (!standingsResponse.ok) {
      console.error(`Failed to fetch standings: ${standingsResponse.status} ${standingsResponse.statusText}`);
      return NextResponse.json({ 
        error: `Failed to fetch standings data: ${standingsResponse.statusText}` 
      }, { status: standingsResponse.status });
    }
    
    const standingsData: StandingsResponse = await standingsResponse.json();
    console.log(`Standings data received: ${standingsData.data.length} teams`);

    // Get all teams that are NOT explicitly marked as "Did not make playoffs"
    const allPlayoffEligibleTeams = standingsData.data
      .filter(team => team.postseason !== "Did not make playoffs")
      .map(team => ({
        id: team.team.id,
        name: team.team.name,
        group: team.group,
        postseason: team.postseason,
      }));
    
    console.log(`Playoff eligible teams: ${allPlayoffEligibleTeams.length} teams`);
    console.log("Playoff eligible teams:", allPlayoffEligibleTeams.map(team => `${team.name} (${team.group})`));

    // Further filter to create our best estimate of actual playoff teams
    const playoffTeams: PlayoffTeam[] = allPlayoffEligibleTeams
      .filter(team => {
        // Include teams with specific playoff designations
        if (team.postseason && team.postseason.includes("loss")) {
          return true;
        }
        
        // For teams with null postseason, we need to infer if they're in playoffs
        // NHL typically has 16 playoff teams (8 from each conference)
        if (team.postseason === null) {
          // Count how many teams from this team's group/division are already in the list
          const divisionalPrefix = team.group.split('/')[0]; // e.g., "Eastern", "Western"
          const teamsInSameConference = standingsData.data.filter(t => 
            t.group.startsWith(divisionalPrefix) && 
            t.postseason !== "Did not make playoffs"
          );
          
          // If we don't have enough teams from this conference yet, include this one
          // NHL has 8 playoff teams per conference
          return teamsInSameConference.length < 8;
        }
        
        return true;
      });

    console.log(`Playoff teams identified: ${playoffTeams.length} teams`);
    console.log("Playoff teams:", playoffTeams.map(team => `${team.name} (${team.group})`));

    // Separate teams by conference
    const easternTeams = playoffTeams.filter(team => team.group.startsWith('Eastern'));
    const westernTeams = playoffTeams.filter(team => team.group.startsWith('Western'));
    console.log(`Teams by conference: Eastern (${easternTeams.length}), Western (${westernTeams.length})`);

    // If we don't have enough teams (should be 16 for NHL), force the top teams from each conference
    if (playoffTeams.length < 16) {
      console.log("Not enough playoff teams identified. Using top teams from each conference.");
      
      // Use the eligible teams (those not explicitly marked as "Did not make playoffs")
      const easternEligible = allPlayoffEligibleTeams.filter(team => team.group.startsWith('Eastern'));
      const westernEligible = allPlayoffEligibleTeams.filter(team => team.group.startsWith('Western'));
      
      // Clear the current list
      playoffTeams.length = 0;
      
      // Take up to 8 teams from each conference
      const easternConferenceTeams = easternEligible.slice(0, 8);
      const westernConferenceTeams = westernEligible.slice(0, 8);
      
      // If we don't have enough eligible teams, we might need to include some that didn't make playoffs
      if (easternConferenceTeams.length < 8 || westernConferenceTeams.length < 8) {
        console.log("Not enough eligible teams, including some that didn't make playoffs");
        
        // Get all Eastern teams, including those that didn't make playoffs
        if (easternConferenceTeams.length < 8) {
          const allEasternTeams = standingsData.data
            .filter(team => team.group.startsWith('Eastern'))
            .slice(0, 8)
            .map(team => ({
              id: team.team.id,
              name: team.team.name,
              group: team.group,
              postseason: team.postseason,
            }));
          
          easternConferenceTeams.length = 0;
          easternConferenceTeams.push(...allEasternTeams);
        }
        
        // Get all Western teams, including those that didn't make playoffs
        if (westernConferenceTeams.length < 8) {
          const allWesternTeams = standingsData.data
            .filter(team => team.group.startsWith('Western'))
            .slice(0, 8)
            .map(team => ({
              id: team.team.id,
              name: team.team.name,
              group: team.group,
              postseason: team.postseason,
            }));
          
          westernConferenceTeams.length = 0;
          westernConferenceTeams.push(...allWesternTeams);
        }
      }
      
      // Combine the teams
      playoffTeams.push(...easternConferenceTeams, ...westernConferenceTeams);
      
      console.log(`Forced playoff teams: ${playoffTeams.length} teams`);
      console.log("Forced playoff teams:", playoffTeams.map(team => `${team.name} (${team.group})`));
      
      // Update conference teams
      easternTeams.length = 0;
      westernTeams.length = 0;
      easternTeams.push(...easternConferenceTeams);
      westernTeams.push(...westernConferenceTeams);
    }

    // Only fetch games for teams that are in the playoffs (ignore "Did not make playoffs")
    const teamsToFetch = playoffTeams.filter(team => team.postseason !== "Did not make playoffs");
    
    console.log(`Teams to fetch games for: ${teamsToFetch.length} teams`);
    console.log("Teams to fetch:", teamsToFetch.map(team => `${team.name} (${team.id})`));
    
    // Fetch games for all playoff teams in a single API call
    const allGames: PlayoffGame[] = [];
    
    // Get all team IDs in a single comma-separated string
    const allTeamIds = teamsToFetch.map(team => team.id).join(',');
    
    console.log("Fetching games for all playoff teams in a single call...");
    
    // Make a single API call with all team IDs
    const gamesFields = [
      'homeTeam.id',
      'homeTeam.name',
      'visitingTeam.id',
      'visitingTeam.name',
      'status',
      'scoreType',
      'homeTeamScore',
      'visitingTeamScore',
      'visitingTeamLogo.large',
      'homeTeamLogo.large',
      'dateTime',
      'date'
    ];
    const gamesParams = [
      'seasonType=POSTSEASON',
      `team=${allTeamIds}`,
      `season=${season}`,
      `apiKey=${apiKey}`,
      `fields=${gamesFields.join(',')}`,
      'limit=1000'
    ];
    const gamesUrl = `${apiBaseUrl}/games?${gamesParams.join('&')}`;
    console.log(`Fetching games for all ${teamsToFetch.length} teams`);
    console.log(gamesUrl);
    
    try {
      const gamesResponse = await fetch(gamesUrl);
      
      if (!gamesResponse.ok) {
        console.error(`Failed to fetch games: ${gamesResponse.statusText}`);
        // Continue execution - we'll generate mock data if needed
      } else {
        const gamesData: GamesResponse = await gamesResponse.json();
        console.log(`Received ${gamesData.data.length} games for all teams`);
        
        // Add all games (no need to check for duplicates as we're making a single call)
        allGames.push(...gamesData.data);
        
        console.log(`Added ${gamesData.data.length} games to the collection`);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
    }
    
    console.log(`Total playoff games found: ${allGames.length}`);
    
    // Sample the games received
    if (allGames.length > 0) {
      console.log(`Sample of games:`, 
        allGames.slice(0, 3).map(g => 
          `${g.homeTeam.name} ${g.homeTeamScore || '-'} vs ${g.visitingTeamScore || '-'} ${g.visitingTeam.name} (${g.status})`
        )
      );
    }

    // If no games were found, we might need to generate mock data for testing
    if (allGames.length === 0) {
      console.log("No games found. Generating mock series data for visualization.");
      
      // Create mock series for Eastern Conference
      const easternSeries = [];
      for (let i = 0; i < Math.min(4, easternTeams.length / 2); i++) {
        if (2*i + 1 < easternTeams.length) {
          easternSeries.push({
            team1: easternTeams[2*i],
            team2: easternTeams[2*i+1],
            team1Wins: Math.floor(Math.random() * 4),
            team2Wins: Math.floor(Math.random() * 4),
            status: 'UPCOMING' as const,
            games: []
          });
        }
      }
      
      // Create mock series for Western Conference
      const westernSeries = [];
      for (let i = 0; i < Math.min(4, westernTeams.length / 2); i++) {
        if (2*i + 1 < westernTeams.length) {
          westernSeries.push({
            team1: westernTeams[2*i],
            team2: westernTeams[2*i+1],
            team1Wins: Math.floor(Math.random() * 4),
            team2Wins: Math.floor(Math.random() * 4),
            status: 'UPCOMING' as const,
            games: []
          });
        }
      }
      
      // Create rounds with mock series
      const easternRounds: PlayoffRound[] = [
        {
          name: 'First Round',
          series: easternSeries
        },
        {
          name: 'Second Round',
          series: []
        },
        {
          name: 'Conference Finals',
          series: []
        }
      ];
      
      const westernRounds: PlayoffRound[] = [
        {
          name: 'First Round',
          series: westernSeries
        },
        {
          name: 'Second Round',
          series: []
        },
        {
          name: 'Conference Finals',
          series: []
        }
      ];
      
      console.log(`Generated ${easternSeries.length} Eastern and ${westernSeries.length} Western mock series`);
      
      // Create the playoff bracket with mock data
      const bracket: PlayoffBracket = {
        eastern: easternRounds,
        western: westernRounds
      };
      
      // Construct the response with mock data
      const response: LeaguePlayoffResponse = {
        bracket,
        leagueId: leagueSlug,
        season
      };
      
      console.log("Mock API response prepared successfully");
      return NextResponse.json(response);
    }

    // Process games to create playoff series
    const seriesMap = new Map<string, PlayoffSeries>();
    
    // Create a map to store team logos
    const teamLogoMap = new Map<number, string>();
    
    // Extract logos from games and store them in the map
    allGames.forEach(game => {
      if (game.homeTeamLogo?.large) {
        teamLogoMap.set(game.homeTeam.id, game.homeTeamLogo.large);
      }
      if (game.visitingTeamLogo?.large) {
        teamLogoMap.set(game.visitingTeam.id, game.visitingTeamLogo.large);
      }
    });
    
    // Add logos to playoff teams
    playoffTeams.forEach(team => {
      if (teamLogoMap.has(team.id)) {
        team.logo = teamLogoMap.get(team.id);
      }
    });
    
    allGames.forEach(game => {
      const team1Id = Math.min(game.homeTeam.id, game.visitingTeam.id);
      const team2Id = Math.max(game.homeTeam.id, game.visitingTeam.id);
      const seriesKey = `${team1Id}-${team2Id}`;
      
      const team1 = playoffTeams.find(t => t.id === team1Id);
      const team2 = playoffTeams.find(t => t.id === team2Id);
      
      if (!team1 || !team2) return;
      
      if (!seriesMap.has(seriesKey)) {
        seriesMap.set(seriesKey, {
          team1,
          team2,
          team1Wins: 0,
          team2Wins: 0,
          status: 'UPCOMING',
          games: []
        });
      }
      
      const series = seriesMap.get(seriesKey)!;
      series.games.push(game);
      
      // Count wins if game is completed
      if (game.status === 'COMPLETED' && game.homeTeamScore !== null && game.visitingTeamScore !== null) {
        if (game.homeTeam.id === team1Id && game.homeTeamScore > game.visitingTeamScore) {
          series.team1Wins++;
        } else if (game.visitingTeam.id === team1Id && game.visitingTeamScore > game.homeTeamScore) {
          series.team1Wins++;
        } else if (game.homeTeam.id === team2Id && game.homeTeamScore > game.visitingTeamScore) {
          series.team2Wins++;
        } else if (game.visitingTeam.id === team2Id && game.visitingTeamScore > game.homeTeamScore) {
          series.team2Wins++;
        }
      }
      
      // Determine series status
      if (series.team1Wins >= 4 || series.team2Wins >= 4) {
        series.status = 'COMPLETED';
        series.winner = series.team1Wins >= 4 ? series.team1 : series.team2;
      } else if (series.games.some(g => g.status === 'COMPLETED')) {
        series.status = 'IN_PROGRESS';
      }
    });

    // Organize series into rounds
    const allSeries = Array.from(seriesMap.values());
    console.log(`Total playoff series created: ${allSeries.length}`);
    
    // Log series details
    allSeries.forEach(series => {
      console.log(`Series: ${series.team1.name} vs ${series.team2.name}, Score: ${series.team1Wins}-${series.team2Wins}, Status: ${series.status}`);
    });
    
    // Create a mapping of completed series winners to track advancement
    const winnerMap = new Map<number, PlayoffSeries>();
    allSeries.forEach(series => {
      if (series.status === 'COMPLETED' && series.winner) {
        winnerMap.set(series.winner.id, series);
      }
    });
    
    // Helper function to check if a team has won a previous series (meaning this is a later round)
    function hasTeamWonPreviousSeries(teamId: number, series: PlayoffSeries): boolean {
      for (const otherSeries of allSeries) {
        // Skip comparing with itself
        if (otherSeries === series) continue;
        
        // If a team won another series, they must be in a later round
        if (otherSeries.status === 'COMPLETED' && 
            otherSeries.winner && 
            otherSeries.winner.id === teamId) {
          return true;
        }
      }
      return false;
    }
    
    // Special helper function for identifying likely first round matchups
    // in NHL, division leaders play wildcard teams in first round
    function isLikelyFirstRoundMatchup(series: PlayoffSeries): boolean {
      // First-round matchups often have more disparate team quality (1st vs 8th, 2nd vs 7th, etc.)
      // This is a heuristic and may need adjustment
      
      // For completed series, rely more on the result
      if (series.status === 'COMPLETED') {
        // Check if neither team has won a previous series
        const team1HasWon = hasTeamWonPreviousSeries(series.team1.id, series);
        const team2HasWon = hasTeamWonPreviousSeries(series.team2.id, series);
        
        // If neither team has won a previous series, it's likely first round
        if (!team1HasWon && !team2HasWon) return true;
        
        // If both teams have won previous series, it's not first round
        if (team1HasWon && team2HasWon) return false;
      }
      
      // Default to true for IN_PROGRESS or UPCOMING series that don't show clear patterns
      return true;
    }
    
    // Helper function to determine the round a team was eliminated in
    function getTeamRound(team: PlayoffTeam): number {
      if (!team.postseason) {
        // null means still in playoffs
        return 4; // Still active (could be any round)
      }
      
      if (team.postseason.includes('Champion')) {
        return 5; // Champion (won all rounds)
      }
      
      if (team.postseason.includes('Final loss')) {
        return 4; // Lost in finals
      }
      
      if (team.postseason.includes('Conference Final loss')) {
        return 3; // Lost in conference finals
      }
      
      if (team.postseason.includes('Conference SF loss')) {
        return 2; // Lost in second round
      }
      
      if (team.postseason.includes('Conference QF loss')) {
        return 1; // Lost in first round
      }
      
      // Default case if nothing matches
      return 0;
    }

    // First, identify all series for each conference
    // Eastern Conference
    const easternSeries = allSeries.filter(series => 
      easternTeams.some(team => team.id === series.team1.id) && 
      easternTeams.some(team => team.id === series.team2.id)
    );
    
    // Western Conference
    const westernSeries = allSeries.filter(series => 
      westernTeams.some(team => team.id === series.team1.id) && 
      westernTeams.some(team => team.id === series.team2.id)
    );
    
    // Series between conferences is the Stanley Cup Finals
    const stanleyCupFinals = allSeries.find(series => {
      const team1InEastern = easternTeams.some(team => team.id === series.team1.id);
      const team2InWestern = westernTeams.some(team => team.id === series.team2.id);
      const team1InWestern = westernTeams.some(team => team.id === series.team1.id);
      const team2InEastern = easternTeams.some(team => team.id === series.team2.id);
      
      return (team1InEastern && team2InWestern) || (team1InWestern && team2InEastern);
    });

    // Function to get the best estimate of which round a series belongs to
    function assignSeriesToRounds(conferenceSeries: PlayoffSeries[]) {
      // For NHL playoffs:
      // First Round: 8 teams, 4 matchups
      // Second Round: 4 teams, 2 matchups
      // Conference Finals: 2 teams, 1 matchup
      
      // Initialize rounds
      const firstRound: PlayoffSeries[] = [];
      const secondRound: PlayoffSeries[] = [];
      const conferenceFinals: PlayoffSeries[] = [];
      
      // For the current season, use the original logic to make sure in-progress and upcoming series appear
      // 2023-2024 is a completed season, so use the postseason data instead
      if (season !== '2023-2024') {
        // Pre-sort the series by our best guess of round
        const preRoundSort = [...conferenceSeries].sort((a, b) => {
          // First, check for teams that have won previous series
          const aTeam1Won = hasTeamWonPreviousSeries(a.team1.id, a);
          const aTeam2Won = hasTeamWonPreviousSeries(a.team2.id, a);
          const bTeam1Won = hasTeamWonPreviousSeries(b.team1.id, b);
          const bTeam2Won = hasTeamWonPreviousSeries(b.team2.id, b);
          
          // Count how many teams in each series have won previous series
          const aWinners = (aTeam1Won ? 1 : 0) + (aTeam2Won ? 1 : 0);
          const bWinners = (bTeam1Won ? 1 : 0) + (bTeam2Won ? 1 : 0);
          
          // Series with more previous winners should be in later rounds
          if (aWinners !== bWinners) {
            return aWinners - bWinners; // Lower first (0 winners = first round)
          }
          
          // If that doesn't separate them, use status as a tiebreaker
          const statusOrder = { 'COMPLETED': 0, 'IN_PROGRESS': 1, 'UPCOMING': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        
        // After pre-sorting, now split into first, second, conference finals
        const probableFirstRound = preRoundSort.filter(isLikelyFirstRoundMatchup);
        const notFirstRound = preRoundSort.filter(s => !isLikelyFirstRoundMatchup(s));
        
        // Sort series: COMPLETED first, then IN_PROGRESS, then UPCOMING
        const sortedFirstRound = [...probableFirstRound].sort((a, b) => {
          const statusOrder = { 'COMPLETED': 0, 'IN_PROGRESS': 1, 'UPCOMING': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        
        const sortedLaterRounds = [...notFirstRound].sort((a, b) => {
          const statusOrder = { 'COMPLETED': 0, 'IN_PROGRESS': 1, 'UPCOMING': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
        
        // First, assign all probable first round matchups
        firstRound.push(...sortedFirstRound.slice(0, Math.min(4, sortedFirstRound.length)));
        
        // Then handle the later rounds
        if (sortedLaterRounds.length > 0) {
          // If we have 1-2 series left, one is conference finals, others are second round
          if (sortedLaterRounds.length <= 3) {
            // Last one is conference finals
            conferenceFinals.push(sortedLaterRounds[sortedLaterRounds.length - 1]);
            
            // Any remaining are second round
            secondRound.push(...sortedLaterRounds.slice(0, sortedLaterRounds.length - 1));
          } else {
            // If we have more than 3, add first to second round until we have 2
            secondRound.push(...sortedLaterRounds.slice(0, Math.min(2, sortedLaterRounds.length)));
            
            // Add one more to conference finals
            if (sortedLaterRounds.length > 2) {
              conferenceFinals.push(sortedLaterRounds[2]);
            }
            
            // Any remaining go to first round
            if (sortedLaterRounds.length > 3) {
              firstRound.push(...sortedLaterRounds.slice(3));
            }
          }
        }
        
        // If we still don't have enough for each round, add some from completed/remaining series
        const completedSeries = conferenceSeries.filter(s => 
          s.status === 'COMPLETED' && 
          !firstRound.includes(s) && 
          !secondRound.includes(s) && 
          !conferenceFinals.includes(s)
        );
        
        const inProgressSeries = conferenceSeries.filter(s => 
          s.status === 'IN_PROGRESS' && 
          !firstRound.includes(s) && 
          !secondRound.includes(s) && 
          !conferenceFinals.includes(s)
        );
        
        const upcomingSeries = conferenceSeries.filter(s => 
          s.status === 'UPCOMING' && 
          !firstRound.includes(s) && 
          !secondRound.includes(s) && 
          !conferenceFinals.includes(s)
        );
        
        // Fill any remaining spots
        // First Round (should have 4)
        while (firstRound.length < 4) {
          if (completedSeries.length > 0) {
            firstRound.push(completedSeries.shift()!);
          } else if (inProgressSeries.length > 0) {
            firstRound.push(inProgressSeries.shift()!);
          } else if (upcomingSeries.length > 0) {
            firstRound.push(upcomingSeries.shift()!);
          } else {
            break; // No more series to add
          }
        }
        
        // Second Round (should have 2)
        while (secondRound.length < 2) {
          if (completedSeries.length > 0) {
            secondRound.push(completedSeries.shift()!);
          } else if (inProgressSeries.length > 0) {
            secondRound.push(inProgressSeries.shift()!);
          } else if (upcomingSeries.length > 0) {
            secondRound.push(upcomingSeries.shift()!);
          } else if (firstRound.length > 4) {
            // If we have extra in first round, move one up
            secondRound.push(firstRound.pop()!);
          } else {
            break; // No more series to add
          }
        }
        
        // Conference Finals (should have 1)
        while (conferenceFinals.length < 1) {
          if (completedSeries.length > 0) {
            conferenceFinals.push(completedSeries.shift()!);
          } else if (inProgressSeries.length > 0) {
            conferenceFinals.push(inProgressSeries.shift()!);
          } else if (upcomingSeries.length > 0) {
            conferenceFinals.push(upcomingSeries.shift()!);
          } else if (secondRound.length > 2) {
            // If we have extra in second round, move one up
            conferenceFinals.push(secondRound.pop()!);
          } else {
            break; // No more series to add
          }
        }
        
        // Special case for historical data: if we have only 3 series total, it's likely 0/2/1 distribution
        if (conferenceSeries.length === 3 && conferenceFinals.length === 0) {
          conferenceFinals.push(secondRound.pop()!);
        }
      } else {
        // For previous seasons, use postseason status to determine the round
        for (const series of conferenceSeries) {
          const team1Round = getTeamRound(series.team1);
          const team2Round = getTeamRound(series.team2);
          
          // If one team was eliminated in round 1, this is a first round matchup
          if (team1Round === 1 || team2Round === 1) {
            firstRound.push(series);
            continue;
          }
          
          // If one team was eliminated in round 2, this is a second round matchup
          if (team1Round === 2 || team2Round === 2) {
            secondRound.push(series);
            continue;
          }
          
          // If one team was eliminated in conference finals, this is a conference finals matchup
          if (team1Round === 3 || team2Round === 3) {
            conferenceFinals.push(series);
            continue;
          }
        }
        
        // Handle any unassigned series for previous seasons
        const remainingSeries = conferenceSeries.filter(
          series => !firstRound.includes(series) && 
                  !secondRound.includes(series) && 
                  !conferenceFinals.includes(series)
        );
        
        // If we have any unassigned series, distribute them to appropriate rounds
        if (remainingSeries.length > 0) {
          // Sort by completion status
          const sortedRemaining = [...remainingSeries].sort((a, b) => {
            const statusOrder = { 'COMPLETED': 0, 'IN_PROGRESS': 1, 'UPCOMING': 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          });
          
          // Distribute remaining series to appropriate rounds
          for (const series of sortedRemaining) {
            if (firstRound.length < 4) {
              firstRound.push(series);
            } else if (secondRound.length < 2) {
              secondRound.push(series);
            } else if (conferenceFinals.length < 1) {
              conferenceFinals.push(series);
            } else {
              // Default to first round if all slots are full
              firstRound.push(series);
            }
          }
        }
      }
      
      // Ensure we have proper distribution for all seasons
      // Special case: if we have 7 series (a complete playoff bracket), ensure 4-2-1 distribution
      if (conferenceSeries.length === 7) {
        if (firstRound.length !== 4 || secondRound.length !== 2 || conferenceFinals.length !== 1) {
          // Clear and redistribute
          const allSeries = [...firstRound, ...secondRound, ...conferenceFinals];
          firstRound.length = 0;
          secondRound.length = 0;
          conferenceFinals.length = 0;
          
          // First, sort by status
          allSeries.sort((a, b) => {
            const statusOrder = { 'COMPLETED': 0, 'IN_PROGRESS': 1, 'UPCOMING': 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          });
          
          // Assign to rounds with proper distribution
          firstRound.push(...allSeries.slice(0, 4));
          secondRound.push(...allSeries.slice(4, 6));
          conferenceFinals.push(allSeries[6]);
        }
      }
      
      return { firstRound, secondRound, conferenceFinals };
    }
    
    // Apply the round assignment function to each conference
    const { firstRound: easternFirstRound, secondRound: easternSecondRound, conferenceFinals: easternConferenceFinals } = 
      assignSeriesToRounds(easternSeries);
    
    const { firstRound: westernFirstRound, secondRound: westernSecondRound, conferenceFinals: westernConferenceFinals } = 
      assignSeriesToRounds(westernSeries);
    
    // Log round assignments for debugging
    console.log(`Eastern Conference: First Round (${easternFirstRound.length}), Second Round (${easternSecondRound.length}), Conference Finals (${easternConferenceFinals.length})`);
    console.log(`Western Conference: First Round (${westernFirstRound.length}), Second Round (${westernSecondRound.length}), Conference Finals (${westernConferenceFinals.length})`);
    console.log(`Stanley Cup Finals: ${stanleyCupFinals ? 1 : 0}`);
    
    // Create the finalized playoff bracket structure
    const bracket: PlayoffBracket = {
      eastern: [
        { name: 'First Round', series: easternFirstRound },
        { name: 'Second Round', series: easternSecondRound },
        { name: 'Conference Finals', series: easternConferenceFinals }
      ],
      western: [
        { name: 'First Round', series: westernFirstRound },
        { name: 'Second Round', series: westernSecondRound },
        { name: 'Conference Finals', series: westernConferenceFinals }
      ],
      final: stanleyCupFinals
    };
    
    // Construct the response
    const response: LeaguePlayoffResponse = {
      bracket,
      leagueId: leagueSlug,
      season
    };
    
    console.log("API response prepared successfully");
    console.log("Response JSON:", JSON.stringify(response).substring(0, 1000) + "...");
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching playoff data:', error);
    return NextResponse.json({ error: 'Failed to fetch playoff data' }, { status: 500 });
  }
}


