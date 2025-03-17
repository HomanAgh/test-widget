(function() {
  // Get the current script element
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  // Get widget type and parameters
  const widgetType = currentScript.getAttribute('data-widget-type') || '';
  const width = currentScript.getAttribute('data-width') || '100%';
  const height = currentScript.getAttribute('data-height') || '600px';
  
  // Common color parameters
  const backgroundColor = currentScript.getAttribute('data-background-color') || '#052D41';
  const textColor = currentScript.getAttribute('data-text-color') || '#000000';
  const tableBackgroundColor = currentScript.getAttribute('data-table-background-color') || '#FFFFFF';
  const headerTextColor = currentScript.getAttribute('data-header-text-color') || '#FFFFFF';
  const nameTextColor = currentScript.getAttribute('data-name-text-color') || '#0D73A6';
  
  // Base URL for the application
  let baseUrl;
  try {
    // Try to get base URL from script src
    baseUrl = new URL(currentScript.src).origin;
  } catch (e) {
    // Fallback to window.location.origin if script src is relative
    baseUrl = window.location.origin;
  }
  
  // Create iframe element
  const iframe = document.createElement('iframe');
  iframe.style.width = width;
  iframe.style.height = height;
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.allow = 'fullscreen';
  
  // Set iframe source based on widget type
  let iframeSrc = '';
  
  switch(widgetType.toLowerCase()) {
    case 'player':
      const playerId = currentScript.getAttribute('data-player-id') || '';
      const gameLimit = currentScript.getAttribute('data-game-limit') || '5';
      const viewMode = currentScript.getAttribute('data-view-mode') || 'stats';
      const showSummary = currentScript.getAttribute('data-show-summary') || 'false';
      
      if (!playerId) {
        console.error('Player widget requires data-player-id attribute');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/player?playerId=${playerId}&gameLimit=${gameLimit}&viewMode=${viewMode}&showSummary=${showSummary}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}`;
      break;
      
    case 'team':
      const teamId = currentScript.getAttribute('data-team-id') || '';
      
      if (!teamId) {
        console.error('Team widget requires data-team-id attribute');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/team?teamId=${teamId}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}`;
      break;
      
    case 'league':
      const leagueSlug = currentScript.getAttribute('data-league-slug') || '';
      
      if (!leagueSlug) {
        console.error('League widget requires data-league-slug attribute');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/league?leagueSlug=${leagueSlug}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}`;
      break;

    case 'scoring-leaders':
      const scoringLeagueSlug = currentScript.getAttribute('data-league-slug') || '';
      const season = currentScript.getAttribute('data-season') || '';
      
      if (!scoringLeagueSlug || !season) {
        console.error('Scoring Leaders widget requires data-league-slug and data-season attributes');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/scoring-leaders?leagueSlug=${scoringLeagueSlug}&season=${season}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}`;
      break;
      
    case 'goalie-leaders':
      const goalieLeagueSlug = currentScript.getAttribute('data-league-slug') || '';
      const goalieSeason = currentScript.getAttribute('data-season') || '';
      
      if (!goalieLeagueSlug || !goalieSeason) {
        console.error('Goalie Leaders widget requires data-league-slug and data-season attributes');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/goalie-leaders?leagueSlug=${goalieLeagueSlug}&season=${goalieSeason}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}`;
      break;
      
    case 'alumni':
      const teamIds = currentScript.getAttribute('data-team-ids') || '';
      const leagues = currentScript.getAttribute('data-leagues') || '';
      const teams = currentScript.getAttribute('data-teams') || '';
      
      if (!teamIds || !leagues) {
        console.error('Alumni widget requires data-team-ids and data-leagues attributes');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/alumni?teamIds=${teamIds}&leagues=${leagues}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}&teams=${encodeURIComponent(teams)}`;
      break;
      
    case 'tournament':
      const tournaments = currentScript.getAttribute('data-tournaments') || '';
      const tournamentLeagues = currentScript.getAttribute('data-leagues') || '';
      
      if (!tournaments || !tournamentLeagues) {
        console.error('Tournament widget requires data-tournaments and data-leagues attributes');
        return;
      }
      
      iframeSrc = `${baseUrl}/embed/tournament?tournaments=${encodeURIComponent(tournaments)}&leagues=${encodeURIComponent(tournamentLeagues)}&backgroundColor=${encodeURIComponent(backgroundColor)}&textColor=${encodeURIComponent(textColor)}&tableBackgroundColor=${encodeURIComponent(tableBackgroundColor)}&headerTextColor=${encodeURIComponent(headerTextColor)}&nameTextColor=${encodeURIComponent(nameTextColor)}`;
      break;
      
    default:
      console.error('Invalid widget type. Use "player", "team", "league", "scoring-leaders", "goalie-leaders", "alumni", or "tournament"');
      return;
  }
  
  // Set iframe source
  iframe.src = iframeSrc;
  
  // Insert iframe after the script
  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
  
  // Add window message listener for responsive height
  window.addEventListener('message', function(event) {
    if (event.origin !== baseUrl) return;
    
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'resize' && data.height) {
        iframe.style.height = data.height + 'px';
      }
    } catch (e) {
      // Ignore invalid messages
    }
  });
})(); 