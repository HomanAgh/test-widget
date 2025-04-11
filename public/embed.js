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
  
  // Load the main widget loader
  var script = document.createElement('script');
  script.src = currentScript.src.split('embed.js')[0] + 'widget-loader-combined.js';
  if (widgetId) {
    // Add the widget ID as a data attribute
    script.setAttribute('data-widget-id', widgetId);
  }
  script.async = true;
  document.body.appendChild(script);
})(); 