import { useCallback, useState } from "react";
import { ReactD3TreeItem, PlayoffBracket, PlayoffSeries, PlayoffTeam } from "@/app/types/leaguePlayoff";

// This helper hook returns dimensions, translate, and containerRef for the tree
export const useCenteredTree = () => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const containerRef = useCallback((containerElem: HTMLElement) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 6 });
    }
  }, []);

  return [dimensions, translate, containerRef];
};

// Convert the playoff bracket data into a hierarchical tree structure
export const convertBracketToTree = (bracket: PlayoffBracket): ReactD3TreeItem => {
  // Helper function to create a matchup node
  const createMatchupNode = (series: PlayoffSeries | undefined): ReactD3TreeItem => {
    if (!series) {
      return {
        name: "TBD vs TBD",
        attributes: {
          series: {
            team1: { name: "TBD" },
            team2: { name: "TBD" },
            team1Wins: 0,
            team2Wins: 0,
            status: "UPCOMING",
            games: [] // Empty games array
          }
        },
        children: []
      };
    }
    
    const { team1, team2, team1Wins, team2Wins, status, games } = series;
    const nodeName = `${team1.name} vs ${team2.name}`;
    
    return {
      name: nodeName,
      attributes: {
        series: {
          team1,
          team2,
          team1Wins,
          team2Wins,
          status,
          winner: series.winner,
          games: games || [] // Preserve the games array, essential for next game date
        },
        originalSeries: series // Store reference to original series for access to all data
      },
      children: []
    };
  };

  // Create Finals Node (root)
  const rootNode = createMatchupNode(bracket.final);
  
  // Eastern Conference Branch
  // Conference Finals
  const easternConferenceFinals = bracket.eastern[2]?.series[0];
  const easternFinalsNode = createMatchupNode(easternConferenceFinals);
  
  // Eastern Conference Semifinals
  const easternSemifinals = bracket.eastern[1]?.series || [];
  easternSemifinals.forEach(semifinal => {
    const semifinalNode = createMatchupNode(semifinal);
    
    // Find corresponding quarterfinals (first round) for this semifinal
    const eastQuarterfinals = bracket.eastern[0]?.series || [];
    eastQuarterfinals.forEach(quarterfinal => {
      // Check if this quarterfinal feeds into this semifinal
      if (semifinal.team1?.id === quarterfinal.winner?.id || 
          semifinal.team2?.id === quarterfinal.winner?.id) {
        const quarterfinalNode = createMatchupNode(quarterfinal);
        semifinalNode.children.push(quarterfinalNode);
      }
    });
    
    // Add to conference finals node
    if (semifinalNode) {
      easternFinalsNode.children.push(semifinalNode);
    }
  });

  // Western Conference Branch
  // Conference Finals
  const westernConferenceFinals = bracket.western[2]?.series[0];
  const westernFinalsNode = createMatchupNode(westernConferenceFinals);
  
  // Western Conference Semifinals
  const westernSemifinals = bracket.western[1]?.series || [];
  westernSemifinals.forEach(semifinal => {
    const semifinalNode = createMatchupNode(semifinal);
    
    // Find corresponding quarterfinals (first round) for this semifinal
    const westQuarterfinals = bracket.western[0]?.series || [];
    westQuarterfinals.forEach(quarterfinal => {
      // Check if this quarterfinal feeds into this semifinal
      if (semifinal.team1?.id === quarterfinal.winner?.id || 
          semifinal.team2?.id === quarterfinal.winner?.id) {
        const quarterfinalNode = createMatchupNode(quarterfinal);
        semifinalNode.children.push(quarterfinalNode);
      }
    });
    
    // Add to conference finals node
    if (semifinalNode) {
      westernFinalsNode.children.push(semifinalNode);
    }
  });

  // Add conference finals to root/finals node
  rootNode.children.push(easternFinalsNode);
  rootNode.children.push(westernFinalsNode);
  
  return rootNode;
}; 