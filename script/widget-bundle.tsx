import React from 'react';
import ReactDOM from 'react-dom/client';
import './widget-styles.css';

// Polyfill for process in browser environment
// This is needed because some React code might expect process.env to exist
if (typeof window !== 'undefined' && !window.process) {
  window.process = {
    env: {
      NODE_ENV: 'production'
    }
  } as any;
}

// Define a global namespace for the widgets
declare global {
  interface Window {
    process?: any;
    EPWidgets: {
      renderWidget: (container: HTMLElement, widgetType: string, config: any) => void;
      API_BASE_URL?: string;
      isWidgetApiCall?: (url: string) => boolean;
    };
    _epWidgetFetchEnhanced?: boolean;
  }
}

// Create a dummy component for fallbacks
const DummyComponent = (props: any) => (
  <div>
    <h3>Widget Component Error</h3>
    <p>This widget is not available. Please check console for details.</p>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
);

// Initialize with dummy components by default
const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  player: DummyComponent,
  team: DummyComponent,
  league: DummyComponent,
  'scoring-leaders': DummyComponent,
  'goalie-leaders': DummyComponent,
  alumni: DummyComponent,
  'alumni-tournament': DummyComponent,
};

// In a browser environment, we need to directly import the components
// rather than using dynamic require which is Node.js specific
// Using static imports to ensure they're included in the bundle
import Player from '../app/components/player/Player';
import Team from '../app/components/team/Team';
import League from '../app/components/league/League';
import ScoringLeaders from '../app/components/league/ScoringLeaders';
import GoalieLeaders from '../app/components/league/GoalieLeaders';
import Alumni from '../app/components/alumni/Alumni';
import AlumniTournament from '../app/components/alumni/AlumniTournament';

// Set up components with error handling
try {
  // Assign the imported components to the mapping
  WIDGET_COMPONENTS.player = Player;
  WIDGET_COMPONENTS.team = Team;
  WIDGET_COMPONENTS.league = League;
  WIDGET_COMPONENTS['scoring-leaders'] = ScoringLeaders;
  WIDGET_COMPONENTS['goalie-leaders'] = GoalieLeaders;
  WIDGET_COMPONENTS.alumni = Alumni;
  WIDGET_COMPONENTS['alumni-tournament'] = AlumniTournament;
} catch (e) {
  console.error('Error setting up widget components:', e);
}

// Define the widget renderer
const renderWidget = (container: HTMLElement, widgetType: string, config: any) => {
  // Check if the widget type is supported
  if (!WIDGET_COMPONENTS[widgetType]) {
    console.error(`Widget type '${widgetType}' not supported`);
    container.innerHTML = `<div>Widget type '${widgetType}' not supported</div>`;
    return;
  }

  // Get the API base URL from config or global setting
  const API_BASE_URL = "https://widget.eliteprospects.com";
  
  console.log(`[EP Widget] Using API base URL: ${API_BASE_URL}`);

  // Add API call tracking
  const originalFetch = window.fetch;
  const enhanceFetch = () => {
    if (window._epWidgetFetchEnhanced) return;
    window._epWidgetFetchEnhanced = true;
    
    // Add isWidgetApiCall function to window.EPWidgets
    window.EPWidgets.isWidgetApiCall = (url: string): boolean => {
      if (typeof url !== 'string') return false;
      
      // Exclude authentication endpoints
      if (url.includes('/api/auth/') || url.includes('/api/auth/session')) {
        return false;
      }
      
      // Check if URL is for one of our widget API endpoints
      const widgetApiPatterns = [
        '/api/player/',
        '/api/team/',
        '/api/league/',
        '/api/tournament-alumni/',
        '/api/alumni/',
        '/api/playerStats/',
        '/api/playerSeasons/',
        '/api/playerCareer/',
        '/api/teamroster/',
        '/api/seasons/'
      ];
      
      return widgetApiPatterns.some(pattern => url.includes(pattern));
    };
    
    window.fetch = function(input, init) {
      // Get the URL from the input
      let inputUrl = typeof input === 'string' 
        ? input 
        : (input instanceof Request ? input.url : input.toString());
      
      // Explicitly check if this is an auth URL before any other processing
      const isAuthUrl = typeof inputUrl === 'string' && 
        (inputUrl.includes('/api/auth/') || inputUrl.includes('/api/auth/session'));
      
      if (isAuthUrl) {
        console.log(`[EP Widget] Auth URL detected, skipping rewrite:`, inputUrl);
        // Use original fetch for auth URLs
        return originalFetch.call(this, input, init);
      }
      
      // Add a header to track which widget is making the request
      const headers = new Headers(init?.headers || {});
      headers.set('X-Widget-Id', config.widgetId || widgetType);
      headers.set('X-EP-Widget', 'true'); // Mark as EP widget request
      
      const enhancedInit = {
        ...init,
        headers,
        epWidget: true // Add flag to identify widget requests
      };
      
      // Only rewrite URLs for our specific widget API endpoints
      const isWidgetApiCall = window.EPWidgets.isWidgetApiCall ? 
        window.EPWidgets.isWidgetApiCall(inputUrl) : 
        checkIsWidgetApiCall(inputUrl);
      
      // Helper function to check if this is a widget API call
      function checkIsWidgetApiCall(url: string): boolean {
        if (typeof url !== 'string') return false;
        
        // Exclude authentication endpoints
        if (url.includes('/api/auth/') || url.includes('/api/auth/session')) {
          return false;
        }
        
        // Check if URL is for one of our widget API endpoints
        const widgetApiPatterns = [
          '/api/player/',
          '/api/team/',
          '/api/league/',
          '/api/tournament-alumni',
          '/api/alumni',
          '/api/playerStats',
          '/api/playerSeasons',
          '/api/playerCareer',
          '/api/teamroster',
          '/api/seasons'
        ];
        
        return widgetApiPatterns.some(pattern => url.includes(pattern));
      }
      
      if (isWidgetApiCall && typeof inputUrl === 'string' && inputUrl.startsWith('/api/')) {
        console.log(`[EP Widget] Before rewriting: URL=${inputUrl}, API_BASE_URL=${API_BASE_URL}`);
        
        // Force use of the hardcoded API_BASE_URL for consistency
        const forcedApiBaseUrl = "https://widget.eliteprospects.com";
        
        inputUrl = `${forcedApiBaseUrl}${inputUrl}`;
        input = inputUrl;
        console.log(`[EP Widget] Rewriting URL to: ${inputUrl} (using forcedApiBaseUrl=${forcedApiBaseUrl})`);
      }
      
      // Only log widget API calls
      if (isWidgetApiCall) {
        console.log(`[EP Widget] ${widgetType} API call:`, inputUrl);
      }
      
      return originalFetch.call(this, input, enhancedInit)
        .then(response => {
          if (!response.ok && isWidgetApiCall) {
            console.error(`[EP Widget] ${widgetType} API error (${response.status}):`, inputUrl);
          }
          return response;
        })
        .catch(error => {
          if (isWidgetApiCall) {
            console.error(`[EP Widget] ${widgetType} API fetch error:`, error);
          }
          throw error;
        });
    };
  };
  
  // Enhance fetch for API tracking
  enhanceFetch();

  try {
    // Check for required parameters for each widget type
    const missingParams: string[] = [];
    
    switch (widgetType) {
      case 'player':
        if (!config.playerId) missingParams.push('data-player-id');
        break;
      case 'team':
        if (!config.teamId) missingParams.push('data-team-id');
        break;
      case 'league':
        if (!config.leagueSlug) missingParams.push('data-league-slug');
        break;
      case 'scoring-leaders':
        if (!config.leagueSlug) missingParams.push('data-league-slug');
        if (!config.season) missingParams.push('data-season');
        break;
      case 'goalie-leaders':
        if (!config.leagueSlug) missingParams.push('data-league-slug');
        if (!config.season) missingParams.push('data-season');
        break;
      case 'alumni':
        if (!config.selectedTeams) missingParams.push('data-selected-teams');
        if (!config.selectedLeagues) missingParams.push('data-selected-leagues');
        break;
      case 'alumni-tournament':
        if (!config.selectedTournaments) missingParams.push('data-selected-tournaments');
        if (!config.selectedLeagues) missingParams.push('data-selected-leagues');
        break;
    }
    
    if (missingParams.length > 0) {
      console.error(`Missing required parameters for ${widgetType} widget:`, missingParams);
      container.innerHTML = `
        <div style="padding: 1rem; border: 1px solid #f44336; border-radius: 4px;">
          <h3 style="color: #f44336; margin: 0 0 0.5rem;">Configuration Error</h3>
          <p>Missing required parameters: ${missingParams.join(', ')}</p>
        </div>
      `;
      return;
    }

    // Create a root element for React
    const root = ReactDOM.createRoot(container);
    
    // Convert string boolean values to actual booleans and parse JSON string values
    const processedConfig = Object.entries(config).reduce((acc, [key, value]) => {
      if (typeof value === 'string') {
        if (value === 'true') {
          acc[key] = true;
        } else if (value === 'false') {
          acc[key] = false;
        } else if (!isNaN(Number(value)) && value !== '') {
          acc[key] = Number(value);
        } else if (
          (value.startsWith('[') && value.endsWith(']')) || 
          (value.startsWith('{') && value.endsWith('}'))
        ) {
          // Try to parse as JSON
          try {
            acc[key] = JSON.parse(value);
          } catch (e) {
            console.error(`Failed to parse JSON for ${key}:`, e);
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Convert colors to a customColors object if needed
    const customColors = {
      backgroundColor: config.backgroundColor || '#052D41',
      textColor: config.textColor || '#000000',
      tableBackgroundColor: config.tableBackgroundColor || '#FFFFFF',
      headerTextColor: config.headerTextColor || '#FFFFFF',
      nameTextColor: config.nameTextColor || '#0D73A6',
    };
    
    // Special handling for alumni and tournament widgets
    if (widgetType === 'alumni' || widgetType === 'tournament') {
      // Extra checks and formats for specific widgets
      if (processedConfig.selectedLeagueCategories) {
        console.log('Using selectedLeagueCategories from config');
      } else {
        // Default league categories if not provided
        processedConfig.selectedLeagueCategories = {
          junior: true,
          college: true,
          professional: true
        };
      }
      
      if (widgetType === 'alumni') {
        processedConfig.includeYouth = processedConfig.includeYouth || false;
      }
    }
    
    // Log widget configuration for debugging
    console.log(`Rendering ${widgetType} widget with config:`, processedConfig);
    
    // Render the component with error boundary
    const Component = WIDGET_COMPONENTS[widgetType];
    const ErrorFallback = (props: any) => (
      <div style={{ padding: '1rem', border: '1px solid #f44336', borderRadius: '4px', margin: '0.5rem 0' }}>
        <h3 style={{ color: '#f44336', margin: '0 0 0.5rem' }}>Widget Error</h3>
        <p>{props.error?.message || 'An unknown error occurred'}</p>
        <pre style={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '200px' }}>
          {props.error?.stack || ''}
        </pre>
      </div>
    );
    
    const WidgetWithErrorHandling = (props: any) => {
      try {
        return <Component {...props} />;
      } catch (error) {
        console.error('Error rendering widget component:', error);
        return <ErrorFallback error={error} />;
      }
    };
    
    root.render(<WidgetWithErrorHandling {...processedConfig} customColors={customColors} />);
  } catch (error) {
    console.error(`Error rendering widget:`, error);
    container.innerHTML = `<div>Failed to load widget: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
  }
};

// Initialize the global namespace
window.EPWidgets = {
  renderWidget,
};

// Expose the widget renderer globally
export { renderWidget }; 