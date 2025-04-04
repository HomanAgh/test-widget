/**
 * Widget Loader Script (Combined Version)
 * 
 * This script loads and renders widgets directly inside the page without iframes.
 * It only loads the JS bundle which contains injected CSS.
 */
(function() {
  // Enable debug mode
  const DEBUG = true;
  
  // Debug log function
  const debug = (...args) => {
    if (DEBUG) console.log('[EP Widget]', ...args);
  };
  
  debug('Widget loader starting');
  
  // Find all widget containers
  const widgets = document.querySelectorAll('.ep-widget');
  
  if (!widgets.length) {
    console.warn('No EliteProspects widgets found on page');
    return;
  }
  
  debug(`Found ${widgets.length} widgets on page`);
  
  // IMPORTANT: Determine environment from script URL or query param
  // Check if script URL has dev=true parameter
  const scriptElement = document.currentScript;
  let isDev = false;
  
  try {
    // Check if there's a dev parameter in the script URL
    if (scriptElement && scriptElement.src) {
      const urlParams = new URL(scriptElement.src).searchParams;
      isDev = urlParams.get('dev') === 'true';
      debug('Dev mode from script URL:', isDev);
    }
  } catch (e) {
    debug('Error checking script URL params:', e);
  }
  
  // IMPORTANT: Configurable Base URLs based on environment
  const API_BASE_URL = isDev 
    ? "http://localhost:3000"  // Development environment
    : "https://widget.eliteprospects.com";  // Production environment
  
  debug(`Running in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);
  
  // Get the script base URL only for loading the bundle
  let scriptBaseURL;
  
  try {
    // Try to get script URL just for loading the bundle from the same place
    scriptBaseURL = new URL(scriptElement.src).origin;
    debug('Script Base URL:', scriptBaseURL);
  } catch (e) {
    // Fallback to the API base URL
    scriptBaseURL = API_BASE_URL;
    debug('Fallback Script Base URL:', scriptBaseURL);
  }
  
  debug('API Base URL (for data fetching):', API_BASE_URL);
  
  // Load the React bundle (with injected CSS)
  const loadBundle = () => {
    debug('Loading widget bundle...');
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // Load bundle from same location as this script
      script.src = `${isDev ? API_BASE_URL : scriptBaseURL}/widget-bundle.js`;
      script.async = true;
      script.onload = () => {
        debug('Widget bundle loaded successfully');
        
        // IMPORTANT: Set the API base URL for the bundle to use
        if (window.EPWidgets) {
          window.EPWidgets.API_BASE_URL = API_BASE_URL;
          debug('Set API base URL for widget bundle:', API_BASE_URL);
        }
        
        resolve();
      };
      script.onerror = (e) => {
        console.error('Failed to load widget bundle:', e);
        reject(new Error('Failed to load widget bundle'));
      };
      document.body.appendChild(script);
      
      // Add timeout to catch issues
      setTimeout(() => {
        if (!window.EPWidgets) {
          console.error('Widget bundle loaded but EPWidgets not initialized');
          reject(new Error('Widget bundle loaded but EPWidgets not initialized'));
        }
      }, 2000);
    });
  };
  
  // Track fetch calls to detect API issues
  const monitorApiCalls = () => {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      let url = args[0];
      const options = args[1] || {};
      
      // IMPORTANT: Rewrite API URLs to use our base URL
      if (typeof url === 'string' && url.match(/^\/api\//)) {
        // If API call starts with /api/, use our API base URL
        url = `${API_BASE_URL}${url}`;
        args[0] = url;
        debug('Rewritten API URL:', url);
      }
      
      debug('API Call:', url, options);
      
      // Add requestId to track which component made the call
      const requestId = options.headers?.get('X-Widget-Id') || 'unknown';
      
      const startTime = Date.now();
      return originalFetch.apply(this, args)
        .then(response => {
          const duration = Date.now() - startTime;
          debug(`API Response (${duration}ms):`, url, response.status);
          return response;
        })
        .catch(error => {
          debug('API Error:', url, error);
          throw error;
        });
    };
  };
  
  // Initialize widgets when resources are loaded
  const initializeWidgets = () => {
    debug('Initializing widgets...');
    
    monitorApiCalls();
    
    widgets.forEach((container, index) => {
      try {
        const widgetType = container.getAttribute('data-widget-type');
        if (!widgetType) {
          console.error('Widget type not specified');
          container.innerHTML = '<div>Widget type not specified</div>';
          return;
        }
        
        // Create widget configuration from data attributes
        const config = {};
        
        // Extract all data attributes
        Array.from(container.attributes)
          .filter(attr => attr.name.startsWith('data-'))
          .forEach(attr => {
            // Convert kebab-case to camelCase
            const key = attr.name.substring(5).replace(/-([a-z])/g, g => g[1].toUpperCase());
            config[key] = attr.value;
          });
        
        // Add widget index for tracking
        config.widgetId = `widget-${index}`;
        
        // IMPORTANT: Add API base URL to config
        config.apiBaseUrl = API_BASE_URL;
        
        debug(`Initializing ${widgetType} widget:`, config);
        
        // Initialize widget if the global widget renderer is available
        if (window.EPWidgets && typeof window.EPWidgets.renderWidget === 'function') {
          console.log('Rendering widget:', widgetType, config);
          console.log("hej");
          window.EPWidgets.renderWidget(container, widgetType, config);
        } else {
          console.error('Widget renderer not loaded properly');
          container.innerHTML = '<div>Widget renderer not available</div>';
        }
      } catch (error) {
        console.error('Error initializing widget:', error);
        container.innerHTML = `<div>Error initializing widget: ${error.message}</div>`;
      }
    });
    
    debug('All widgets initialized');
  };
  
  // Add global error handler
  window.addEventListener('error', function(e) {
    console.error('Global error in widget:', e.error || e.message);
  });
  
  // Main initialization
  loadBundle()
    .then(() => {
      // Wait a bit for the widget renderer to initialize
      debug('Waiting for widget renderer to initialize...');
      setTimeout(initializeWidgets, 500);
    })
    .catch(error => {
      console.error('Failed to load widget resources:', error);
      widgets.forEach(container => {
        container.innerHTML = `<div>Failed to load widget: ${error.message}</div>`;
      });
    });
})(); 