'use client';

import { PlayoffBracket, PlayoffRound, PlayoffSeries, PlayoffTeam } from '@/app/types/leaguePlayoff';
import PoweredBy from '../common/style/PoweredBy';
import SeriesCard from './SeriesCard';
import { useState } from 'react';
import LeaguePlayoffTree from './LeaguePlayoffTree';

interface LeaguePlayoffBracketProps {
  bracket: PlayoffBracket;
}

export default function LeaguePlayoffBracket({ bracket }: LeaguePlayoffBracketProps) {
  const [activeTab, setActiveTab] = useState<'cards' | 'bracket'>('cards');

  // Function to create a placeholder empty team
  const createEmptyTeam = (): PlayoffTeam => ({
    id: 0,
    name: "",
    group: "",
    postseason: null
  });

  // Function to create an empty series
  const createEmptySeries = (): PlayoffSeries => ({
    team1: createEmptyTeam(),
    team2: createEmptyTeam(),
    team1Wins: 0,
    team2Wins: 0,
    status: 'UPCOMING',
    games: []
  });

  // Prepare fallback rounds structure regardless of what exists in the data
  const createFullBracket = () => {
    // Define standard round names and series counts
    const rounds = [
      { name: 'First Round', count: 4 },
      { name: 'Semi-Finals', count: 2 },
      { name: 'Conference Finals', count: 1 }
    ];
    
    // Create eastern rounds
    const eastern: PlayoffRound[] = rounds.map((round, roundIndex) => {
      // Check if this round exists in the data
      const existingRound = bracket.eastern[roundIndex];
      
      if (existingRound) {
        // If round exists but doesn't have enough series, fill with empty ones
        const series = [...existingRound.series];
        while (series.length < round.count) {
          series.push(createEmptySeries());
        }
        
        return {
          name: existingRound.name || round.name,
          series
        };
      }
      
      // Create an empty round with the right number of series
      return {
        name: round.name,
        series: Array(round.count).fill(0).map(() => createEmptySeries())
      };
    });
    
    // Create western rounds
    const western: PlayoffRound[] = rounds.map((round, roundIndex) => {
      // Check if this round exists in the data
      const existingRound = bracket.western[roundIndex];
      
      if (existingRound) {
        // If round exists but doesn't have enough series, fill with empty ones
        const series = [...existingRound.series];
        while (series.length < round.count) {
          series.push(createEmptySeries());
        }
        
        return {
          name: existingRound.name || round.name,
          series
        };
      }
      
      // Create an empty round with the right number of series
      return {
        name: round.name,
        series: Array(round.count).fill(0).map(() => createEmptySeries())
      };
    });
    
    // Create or use the final
    const final = bracket.final || createEmptySeries();
    
    return { eastern, western, final };
  };
  
  // Create the full bracket structure with fallbacks
  const fullBracket = createFullBracket();

  const renderCardsView = () => (
    <div className="flex flex-col w-full gap-8">
      {/* Conference Brackets */}
      <div className="flex flex-col lg:flex-row w-full justify-between gap-4">
        {/* Eastern Conference */}
        <div className="w-full lg:w-[48%]">
          <h3 className="text-xl font-bold text-center mb-4">Eastern Conference</h3>
          <div className="flex flex-col gap-8">
            {fullBracket.eastern.map((round, roundIndex) => (
              <div key={`east-${roundIndex}`} className="flex flex-col gap-4">
                {roundIndex > 0 && (
                  <div className="border-t border-gray-700 w-full my-2"></div>
                )}
                <h4 className="text-lg font-semibold text-center">{round.name}</h4>
                <div className="flex flex-col gap-6">
                  {round.series.map((series, seriesIndex) => (
                    <SeriesCard 
                      key={`east-${roundIndex}-${seriesIndex}`} 
                      series={series} 
                      align="left"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Western Conference */}
        <div className="w-full lg:w-[48%]">
          <h3 className="text-xl font-bold text-center mb-4">Western Conference</h3>
          <div className="flex flex-col gap-8">
            {fullBracket.western.map((round, roundIndex) => (
              <div key={`west-${roundIndex}`} className="flex flex-col gap-4">
                {roundIndex > 0 && (
                  <div className="border-t border-gray-700 w-full my-2"></div>
                )}
                <h4 className="text-lg font-semibold text-center">{round.name}</h4>
                <div className="flex flex-col gap-6">
                  {round.series.map((series, seriesIndex) => (
                    <SeriesCard 
                      key={`west-${roundIndex}-${seriesIndex}`} 
                      series={series} 
                      align="right"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separator before Stanley Cup Final */}
      <div className="border-t border-gray-700 w-full my-2"></div>

      {/* Stanley Cup Final */}
      <div className="w-full flex flex-col items-center justify-center mt-4">
        <h3 className="text-xl font-bold text-center mb-4">Stanley Cup Finals</h3>
        <div className="w-full max-w-md mx-auto">
          <SeriesCard series={fullBracket.final} align="center" />
        </div>
      </div>
    </div>
  );

  const renderBracketView = () => (
    <div className="w-full overflow-auto flex justify-center items-center">
      <LeaguePlayoffTree bracket={bracket} />
    </div>
  );
  
  return (
    <div className="flex flex-col w-full">
      {/* Tabs */}
      <div>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'cards'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('cards')}
        >
          Cards
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'bracket'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('bracket')}
        >
          Bracket
        </button>
      </div>

      {/* Content */}
      <div className="flex-1">
        {activeTab === 'cards' ? renderCardsView() : renderBracketView()}
      </div>

      {/* Powered By */}
      <div className="mt-8">
        <PoweredBy />
      </div>
    </div>
  );
}
