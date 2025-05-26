import React from "react";

// League grouping utility functions
export const getPlayerLeagueGroup = (player: any) => {
  if (!player.teams || player.teams.length === 0) return "Other";
  
  // Get the highest priority league from player's teams
  const leagueSlugs = player.teams.map((team: any) => team.leagueSlug?.toLowerCase()).filter(Boolean);
  
  // Priority order: NHL > AHL > North America > Europe > Other
  if (leagueSlugs.includes("nhl")) return "NHL";
  if (leagueSlugs.includes("ahl")) return "AHL";
  
  // North American leagues (excluding NHL/AHL)
  const northAmericanLeagues = ["ushl", "ohl", "whl", "qmjhl", "ncaa", "echl", "usports", "acac", "acha", "cchl"];
  if (leagueSlugs.some((slug: string) => northAmericanLeagues.includes(slug))) return "Other North American Leagues";
  
  // European leagues
  const europeanLeagues = ["shl", "khl", "nl", "liiga", "czechia", "del", "icehl", "slovakia", "hockeyallsvenskan", "j20-nationell", "mhl", "del2", "alpshl", "norway", "hockeyettan", "sl", "denmark", "mestis", "eihl", "ligue-magnus"];
  if (leagueSlugs.some((slug: string) => europeanLeagues.includes(slug))) return "European Leagues";
  
  return "Other";
};

// Function to get league group icon
export const getLeagueGroupIcon = (groupName: string) => {
  switch (groupName) {
    case "NHL":
      return (
        <img 
          src="https://files.eliteprospects.com/layout/league-logos/6bd23dcd-5599-4699-80d5-607e91eedafc.svg" 
          alt="NHL" 
          width={28} 
          height={28}
          className="object-contain"
        />
      );
    case "AHL":
      return (
        <img 
          src="https://files.eliteprospects.com/layout/league-logos/365560fe-9f9c-4d3f-a137-724d840867cd.svg" 
          alt="AHL" 
          width={28} 
          height={28}
          className="object-contain"
        />
      );
    case "Other North American Leagues":
      return (
        <div className="flex gap-1">
          <img 
            src="https://flagcdn.com/w20/us.png" 
            alt="USA" 
            width={24} 
            height={18}
            className="object-contain"
          />
          <img 
            src="https://flagcdn.com/w20/ca.png" 
            alt="Canada" 
            width={24} 
            height={18}
            className="object-contain"
          />
        </div>
      );
    case "European Leagues":
      return (
        <img 
          src="https://flagcdn.com/w20/eu.png" 
          alt="Europe" 
          width={24} 
          height={18}
          className="object-contain"
        />
      );
    default:
      return null;
  }
};

// Hook for grouping players by league
export const useLeagueGrouping = (players: any[], isLeagueGroupingEnabled: boolean) => {
  return React.useMemo(() => {
    if (!isLeagueGroupingEnabled) return { "All Players": players };
    
    const groups: { [key: string]: any[] } = {
      "NHL": [],
      "AHL": [],
      "Other North American Leagues": [],
      "European Leagues": [],
      "Other": []
    };
    
    players.forEach(player => {
      const group = getPlayerLeagueGroup(player);
      groups[group].push(player);
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  }, [players, isLeagueGroupingEnabled]); 
};
