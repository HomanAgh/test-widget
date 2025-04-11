/**
 * EliteProspects Widget Embed Script
 * 
 * This lightweight script loads the full widget loader
 * and passes the widget ID to connect script to widget.
 */
(function() {
  // Get the current script tag
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  
  // Get the ID parameter from the script URL
  var widgetId = null;
  try {
    var scriptSrc = currentScript.src;
    var urlParams = scriptSrc.split('?')[1];
    if (urlParams) {
      var params = urlParams.split('&');
      for (var i = 0; i < params.length; i++) {
        var param = params[i].split('=');
        if (param[0] === 'id') {
          widgetId = param[1];
          break;
        }
      }
    }
  } catch (e) {
    console.error('Error parsing widget ID:', e);
  }
  
  // Always use absolute URL to widget domain, not relative path
  var scriptDomain = "https://widget.eliteprospects.com";
  
  // Check if we're in dev mode
  var isDev = false;
  try {
    if (scriptSrc.indexOf('dev=true') > -1) {
      isDev = true;
      scriptDomain = "http://localhost:3000";
    }
  } catch (e) {
    console.error('Error checking dev mode:', e);
  }
  
  // Load the main widget loader with absolute URL
  var script = document.createElement('script');
  script.src = scriptDomain + '/widget-loader-combined.js';
  
  if (widgetId) {
    // Add the widget ID as a data attribute
    script.setAttribute('data-widget-id', widgetId);
  }
  
  // Pass dev mode if needed
  if (isDev) {
    script.src += '?dev=true';
  }
  
  script.async = true;
  document.body.appendChild(script);
})(); 