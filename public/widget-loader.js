/**
 * Widget Loader Script
 * 
 * This script loads and renders widgets directly inside the page without iframes.
 * It loads the necessary CSS (including Tailwind output) and JS bundles.
 */
(function() {
  // Find all widget containers
  const widgets = document.querySelectorAll('.ep-widget');
  
  if (!widgets.length) {
    console.warn('No EliteProspects widgets found on page');
    return;
  }
  
  // Get the script base URL
  const scriptElement = document.currentScript;
  let baseURL;
  
  try {
    // Try to get base URL from script src
    baseURL = new URL(scriptElement.src).origin;
  } catch (e) {
    // Fallback to window.location.origin
    baseURL = window.location.origin;
  }
  
  // Load CSS (Tailwind output)
  const loadCSS = () => {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${baseURL}/widget-style.css`;
      link.onload = resolve;
      document.head.appendChild(link);
    });
  };
  
  // Load the React bundle
  const loadBundle = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = `${baseURL}/widget-bundle.js`;
      script.async = true;
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };
  
  // Initialize widgets when resources are loaded
  const initializeWidgets = () => {
    widgets.forEach(container => {
      const widgetType = container.getAttribute('data-widget-type');
      if (!widgetType) {
        console.error('Widget type not specified');
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
      
      // Initialize widget if the global widget renderer is available
      if (window.EPWidgets && typeof window.EPWidgets.renderWidget === 'function') {
        window.EPWidgets.renderWidget(container, widgetType, config);
      } else {
        console.error('Widget renderer not loaded properly');
      }
    });
  };
  
  // Main initialization
  Promise.all([loadCSS(), loadBundle()])
    .then(initializeWidgets)
    .catch(error => console.error('Failed to load widget resources:', error));
})(); 