(function() {
  // Enable debug mode
  const DEBUG = true;
  
  // Debug log function
  const debug = (...args) => {
    if (DEBUG) console.log('[EP Widget]', ...args);
  };
  
  debug('Widget loader script loaded, waiting for DOM...');
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // If DOM is already loaded, wait a bit to ensure other scripts are loaded
    setTimeout(initialize, 1000);
  }
  
  function initialize() {
    debug('DOM loaded, starting widget initialization...');
    
    // Get the current script element and its widget ID
    var scriptElement = document.currentScript;
    var targetWidgetId = null;
    
    if (scriptElement && scriptElement.getAttribute('data-widget-id')) {
      targetWidgetId = scriptElement.getAttribute('data-widget-id');
      debug('Target widget ID:', targetWidgetId);
    }
    
    // Add preconnect for Google Fonts
    function addGoogleFontsPreconnect() {
      // Only add if they don't already exist
      if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
        const preconnect1 = document.createElement('link');
        preconnect1.rel = 'preconnect';
        preconnect1.href = 'https://fonts.googleapis.com';
        document.head.appendChild(preconnect1);
        
        debug('Added Google Fonts preconnect');
      }
    }
    
    // Add Google Fonts directly (minimal subset for faster loading)
    function addFontStylesheet() {
      if (!document.querySelector('link[href*="fonts.googleapis.com/css2"]')) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap';
        document.head.appendChild(fontLink);
        debug('Added font stylesheet link');
      }
    }
    
    // Add font preconnect
    addGoogleFontsPreconnect();
    
    // Add the fonts directly
    addFontStylesheet();
    
    // Find widget containers - either a specific one by ID or all with the class
    let widgets = [];
    if (targetWidgetId) {
      // If we have a target ID, only get that specific widget
      const targetWidget = document.getElementById(targetWidgetId);
      if (targetWidget) {
        widgets = [targetWidget];
        debug(`Found target widget with ID ${targetWidgetId}`);
      } else {
        debug(`Warning: Target widget with ID ${targetWidgetId} not found`);
      }
    } else {
      // Otherwise get all widgets with the class
      widgets = document.querySelectorAll('.ep-widget');
      debug(`Found ${widgets.length} widgets on page`);
    }
    
    if (!widgets.length) {
      console.warn('No EliteProspects widgets found on page');
      return;
    }
    
    // IMPORTANT: Determine environment from script URL or query param
    // Check if script URL has dev=true parameter
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
    debug(`API Base URL set to: ${API_BASE_URL}`);
    
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
    
    // Simplified XMLHttpRequest utility functions with minimal headers
    function requestGet(url, callback, id) {
      debug('Making GET request to:', url);
      var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          // Consider 2xx responses as success, including 204 No Content
          if (request.status >= 200 && request.status < 300) {
            debug('GET request successful:', url, request.status);
            // For 204 No Content, provide empty JSON object
            if (request.status === 204) {
              callback(id, '{}');
            } else {
              callback(id, request.responseText || '{}');
            }
          } else {
            debug('GET request failed:', url, request.status);
            // For all endpoints, provide empty response on failure rather than error
            debug('Request failed, providing empty response');
            callback(id, '{}');
          }
        }
      };
      request.open('GET', url, true);
      request.send();
    }
    
    function requestPost(url, callback, params, id) {
      debug('Making POST request to:', url);
      var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
      request.onreadystatechange = function() {
        if (request.readyState === 4) {
          // Consider 2xx responses as success, including 204 No Content
          if (request.status >= 200 && request.status < 300) {
            debug('POST request successful:', url, request.status);
            // For 204 No Content, provide empty JSON object
            if (request.status === 204) {
              callback('{}', id);
            } else {
              callback(request.responseText || '{}', id);
            }
          } else {
            debug('POST request failed:', url, request.status);
            // For all endpoints, provide empty response on failure rather than error
            debug('Request failed, providing empty response');
            callback('{}', id);
          }
        }
      };
      request.open('POST', url, true);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      request.send(params);
    }
    
    // Function to convert object to URL parameters (like the weatherwidget)
    function objectToUrlParams(obj) {
      return Object.keys(obj)
        .map(function(key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
        })
        .join('&');
    }
    
    // Load the React bundle (with injected CSS)
    const loadBundle = () => {
      debug('Loading widget bundle...');
      return new Promise((resolve, reject) => {
        // Only load the bundle if it hasn't been loaded already
        if (window.EPWidgets) {
          debug('Widget bundle already loaded, skipping load');
          resolve();
          return;
        }
        
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
            
            // Add the request functions to the bundle
            window.EPWidgets.requestGet = requestGet;
            window.EPWidgets.requestPost = requestPost;
            window.EPWidgets.objectToUrlParams = objectToUrlParams;
            
            // Add a helper to identify widget API calls
            window.EPWidgets.isWidgetApiCall = function(url) {
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
            };
            
            debug('Added XMLHttpRequest functions to widget bundle');
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
    
    // Super simplified fetch polyfill with minimal headers
    const monitorApiCalls = () => {
      if (typeof window.fetch === 'function') {
        const originalFetch = window.fetch;
        window.fetch = function(url, options = {}) {
          // Keep track of original fetch for special cases
          if (options && options.useOriginalFetch) {
            return originalFetch(url, options);
          }
          
          return new Promise((resolve, reject) => {
            // Explicitly check if this is an auth URL before any other checks
            const isAuthUrl = typeof url === 'string' && 
              (url.includes('/api/auth/') || url.includes('/api/auth/session'));
            
            if (isAuthUrl) {
              debug('Auth URL detected, skipping rewrite:', url);
              // Use original fetch for auth URLs to avoid any interference
              return originalFetch(url, options).then(resolve).catch(reject);
            }
            
            // Only rewrite URLs for EliteProspects widget API calls
            const isWidgetApiCall = 
              (options.epWidget === true || 
               (options.headers && options.headers['X-EP-Widget'])) ||
              (typeof url === 'string' && window.EPWidgets && 
               window.EPWidgets.isWidgetApiCall && 
               window.EPWidgets.isWidgetApiCall(url));
            
            if (isWidgetApiCall && typeof url === 'string' && url.match(/^\/api\//)) {
              const originalUrl = url;
              debug(`Before rewriting: URL=${originalUrl}, API_BASE_URL=${API_BASE_URL}`);
              
              // Force use of the hardcoded API_BASE_URL for consistency
              const forcedApiBaseUrl = isDev 
                ? "http://localhost:3000"
                : "https://widget.eliteprospects.com";
              
              url = forcedApiBaseUrl + url;
              debug(`Rewriting URL from ${originalUrl} to ${url} (using forcedApiBaseUrl=${forcedApiBaseUrl})`);
            }
            
            const method = options.method || 'GET';
            
            if (method.toUpperCase() === 'GET') {
              var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
              request.onreadystatechange = function() {
                if (request.readyState === 4) {
                  // Consider 2xx responses as success, including 204 No Content
                  if (request.status >= 200 && request.status < 300) {
                    let responseText = request.responseText || '{}';
                    // For 204 No Content, provide empty JSON object
                    if (request.status === 204) {
                      responseText = '{}';
                    }
                    
                    const response = {
                      ok: true,
                      status: request.status,
                      statusText: request.statusText,
                      url: url,
                      json: function() {
                        try {
                          return Promise.resolve(JSON.parse(responseText));
                        } catch (e) {
                          debug('Error parsing JSON, returning empty object:', e);
                          return Promise.resolve({});
                        }
                      },
                      text: function() {
                        return Promise.resolve(responseText);
                      }
                    };
                    resolve(response);
                  } else {
                    debug('GET request failed:', url, request.status);
                    // For all endpoints, resolve with empty response instead of rejecting
                    debug('Providing empty response for failed request');
                    const response = {
                      ok: true,
                      status: 200,
                      statusText: 'OK (Fallback)',
                      url: url,
                      json: function() {
                        return Promise.resolve({});
                      },
                      text: function() {
                        return Promise.resolve('{}');
                      }
                    };
                    resolve(response);
                  }
                }
              };
              
              request.onerror = function() {
                // Handle network errors for all endpoints
                debug('Network error, providing empty response:', url);
                const response = {
                  ok: true,
                  status: 200,
                  statusText: 'OK (Fallback - Network Error)',
                  url: url,
                  json: function() { return Promise.resolve({}); },
                  text: function() { return Promise.resolve('{}'); }
                };
                resolve(response);
              };
              
              try {
                request.open('GET', url, true);
                
                // Only add essential headers
                if (options.headers) {
                  try {
                    if (options.headers.get && typeof options.headers.get === 'function') {
                      // It's a Headers object
                      if (options.headers.get('Content-Type')) {
                        request.setRequestHeader('Content-Type', options.headers.get('Content-Type'));
                      }
                      if (options.headers.get('Authorization')) {
                        request.setRequestHeader('Authorization', options.headers.get('Authorization'));
                      }
                    } else {
                      // It's a plain object
                      if (options.headers['Content-Type']) {
                        request.setRequestHeader('Content-Type', options.headers['Content-Type']);
                      }
                      if (options.headers['Authorization']) {
                        request.setRequestHeader('Authorization', options.headers['Authorization']);
                      }
                    }
                  } catch (e) {
                    debug('Error setting headers:', e);
                  }
                }
                
                request.send();
              } catch (e) {
                debug('Error making request:', e);
                const response = {
                  ok: true,
                  status: 200,
                  statusText: 'OK (Fallback - Request Error)',
                  url: url,
                  json: function() { return Promise.resolve({}); },
                  text: function() { return Promise.resolve('{}'); }
                };
                resolve(response);
              }
              
            } else if (method.toUpperCase() === 'POST') {
              var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
              request.onreadystatechange = function() {
                if (request.readyState === 4) {
                  // Consider 2xx responses as success, including 204 No Content
                  if (request.status >= 200 && request.status < 300) {
                    let responseText = request.responseText || '{}';
                    // For 204 No Content, provide empty JSON object
                    if (request.status === 204) {
                      responseText = '{}';
                    }
                    
                    const response = {
                      ok: true,
                      status: request.status,
                      statusText: request.statusText,
                      url: url,
                      json: function() {
                        try {
                          return Promise.resolve(JSON.parse(responseText));
                        } catch (e) {
                          debug('Error parsing JSON, returning empty object:', e);
                          return Promise.resolve({});
                        }
                      },
                      text: function() {
                        return Promise.resolve(responseText);
                      }
                    };
                    resolve(response);
                  } else {
                    debug('POST request failed:', url, request.status);
                    // For all endpoints, resolve with empty response instead of rejecting
                    debug('Providing empty response for failed request');
                    const response = {
                      ok: true,
                      status: 200,
                      statusText: 'OK (Fallback)',
                      url: url,
                      json: function() {
                        return Promise.resolve({});
                      },
                      text: function() {
                        return Promise.resolve('{}');
                      }
                    };
                    resolve(response);
                  }
                }
              };
              
              request.onerror = function() {
                // Handle network errors for all endpoints
                debug('Network error, providing empty response:', url);
                const response = {
                  ok: true,
                  status: 200,
                  statusText: 'OK (Fallback - Network Error)',
                  url: url,
                  json: function() { return Promise.resolve({}); },
                  text: function() { return Promise.resolve('{}'); }
                };
                resolve(response);
              };
              
              try {
                request.open('POST', url, true);
                
                // Always use form-urlencoded like the weatherwidget
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                
                // Convert JSON body to URL parameters like the weatherwidget
                let body = options.body || '';
                if (typeof body === 'string' && body.startsWith('{')) {
                  try {
                    body = objectToUrlParams(JSON.parse(body));
                  } catch (e) {
                    debug('Error converting JSON to URL params:', e);
                  }
                } else if (typeof body === 'object') {
                  body = objectToUrlParams(body);
                }
                
                request.send(body);
              } catch (e) {
                debug('Error making request:', e);
                const response = {
                  ok: true,
                  status: 200,
                  statusText: 'OK (Fallback - Request Error)',
                  url: url,
                  json: function() { return Promise.resolve({}); },
                  text: function() { return Promise.resolve('{}'); }
                };
                resolve(response);
              }
            }
          });
        };
      }
    };
    
    // Initialize widgets when resources are loaded
    const initializeWidgets = () => {
      debug('Initializing widgets...');
      
      // Check API_BASE_URL before fetch monitoring
      debug('Current API_BASE_URL before monitorApiCalls:', API_BASE_URL);
      
      monitorApiCalls();
      
      // Check API_BASE_URL after fetch monitoring
      debug('Current API_BASE_URL after monitorApiCalls:', API_BASE_URL);
      
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
          config.widgetId = container.id || `widget-${index}`;
          
          // IMPORTANT: Add API base URL to config
          config.apiBaseUrl = API_BASE_URL;
          
          // Add flag to identify widget API calls
          config.markApiCalls = true;
          
          debug(`Initializing ${widgetType} widget:`, config);
          
          // Add loading indicator to container
          const loadingHtml = '<div class="ep-widget-loading" style="text-align: center; padding: 20px;">Loading widget...</div>';
          container.innerHTML = loadingHtml;
          
          // Initialize widget if the global widget renderer is available
          if (window.EPWidgets && typeof window.EPWidgets.renderWidget === 'function') {
            console.log('Rendering widget:', widgetType, config);
            
            // Set up custom fetch for this widget if not already done
            if (!window.EPWidgets.originalFetch && window.fetch) {
              window.EPWidgets.originalFetch = window.fetch;
              
              // Replace fetch to mark all widget API calls
              const widgetFetch = function(url, options = {}) {
                // Mark this as a widget API call
                options = options || {};
                options.epWidget = true;
                
                // Add header to identify widget API calls
                if (!options.headers) options.headers = {};
                if (typeof options.headers === 'object') {
                  options.headers['X-EP-Widget'] = 'true';
                }
                
                // Use the current fetch implementation (which includes our monitorApiCalls logic)
                return window.fetch(url, options);
              };
              
              // Store for widgets to use
              window.EPWidgets.fetch = widgetFetch;
            }
            
            // Wrap in try/catch to ensure rendering attempts don't fail silently
            try {
              window.EPWidgets.renderWidget(container, widgetType, config);
              
              // Set a safety timeout to check if widget has rendered properly
              setTimeout(() => {
                if (container.innerHTML === loadingHtml || container.innerHTML === '') {
                  debug('Widget rendering may have failed silently, attempting to re-render');
                  window.EPWidgets.renderWidget(container, widgetType, config);
                }
              }, 3000);
            } catch (renderError) {
              console.error('Error rendering widget:', renderError);
              container.innerHTML = `<div>Error rendering widget: ${renderError.message}</div>`;
            }
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
    //changes. 
    // Main initialization with retry mechanism
    function initializeWithRetry(maxRetries = 2) {
      let retryCount = 0;
      
      function tryInitialize() {
        loadBundle()
          .then(() => {
            // Wait a bit for the widget renderer to initialize
            debug('Waiting for widget renderer to initialize...');
            setTimeout(initializeWidgets, 500);
          })
          .catch(error => {
            console.error(`Failed to load widget resources (attempt ${retryCount + 1}):`, error);
            
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Retrying widget initialization (attempt ${retryCount + 1})...`);
              setTimeout(tryInitialize, 1000 * retryCount); // Increase delay with each retry
            } else {
              widgets.forEach(container => {
                container.innerHTML = `<div>Failed to load widget: ${error.message}</div>`;
              });
            }
          });
      }
      
      tryInitialize();
    }
    
    // Start initialization with retry support
    initializeWithRetry();
  }
})(); 