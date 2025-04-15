/**
 * Font Override Fix
 * 
 * This script directly targets and removes the font-family property from HTML selector
 * in any injected styles from the widget-bundle.js, without needing multiple scripts.
 */
(function() {
  // 1. First, add our own high-specificity override style that takes precedence
  const styleEl = document.createElement('style');
  styleEl.id = 'font-fix-override';
  styleEl.innerHTML = `
    /* Override any widget's attempt to set font-family on the html element */
    html:where(:not(.ep-widget)):where(:not(.ep-widget-container)) {
      font-family: inherit !important;
    }
  `;
  document.head.appendChild(styleEl);
  
  // 2. Patch document.createElement to intercept style elements
  const originalCreateElement = document.createElement;
  document.createElement = function(tagName) {
    const element = originalCreateElement.call(document, tagName);
    
    if (tagName.toLowerCase() === 'style') {
      // Track if this appears to be a widget style
      let isWidgetStyle = false;
      
      // Override appendChild for this style element
      const originalAppendChild = element.appendChild;
      element.appendChild = function(node) {
        if (node.nodeType === 3) { // Text node
          // Check if this looks like our widget's styles
          isWidgetStyle = node.textContent.includes('--font-open-sans') || 
                          node.textContent.includes('ep-widget-container') ||
                          node.textContent.includes('var(--font-open-sans)');
          
          if (isWidgetStyle) {
            // Modify the CSS text to remove font-family from html selector
            let modifiedText = node.textContent;
            
            // Remove html from selector targeting both html and :host
            modifiedText = modifiedText.replace(
              /html\s*,\s*:host\s*{/g, 
              ':host {'
            );
            
            // Remove font-family from any html selector
            modifiedText = modifiedText.replace(
              /(html[^{]*{[^}]*?)font-family\s*:\s*[^;]*;([^}]*})/g,
              '$1$2'
            );
            
            // Create new text node with modified content
            const newNode = document.createTextNode(modifiedText);
            return originalAppendChild.call(this, newNode);
          }
        }
        
        return originalAppendChild.call(this, node);
      };
    }
    
    return element;
  };
  
  // 3. Apply a mutation observer to catch styles added after our script runs
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          // Look for added style elements
          if (node.nodeName === 'STYLE') {
            // Check if this style element contains HTML font-family references
            if (node.textContent && 
                node.textContent.includes('html') && 
                node.textContent.includes('font-family')) {
              
              // Apply the same transformations
              node.textContent = node.textContent
                .replace(/html\s*,\s*:host\s*{/g, ':host {')
                .replace(/(html[^{]*{[^}]*?)font-family\s*:\s*[^;]*;([^}]*})/g, '$1$2');
            }
          }
        });
      }
    });
  });
  
  // Start observing the document
  observer.observe(document.documentElement, { 
    childList: true,
    subtree: true
  });
  
  // Add a data attribute to the HTML element to mark it as protected
  document.documentElement.setAttribute('data-font-protected', 'true');
  
  console.log('[Font Fix] Applied font protection successfully');
})(); 