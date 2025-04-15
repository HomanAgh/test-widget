// Save original methods
const originalCreateElement = document.createElement;
const originalAppendChild = Element.prototype.appendChild;

// Override createElement to intercept style elements
document.createElement = function(tagName) {
  const element = originalCreateElement.call(document, tagName);
  
  if (tagName.toLowerCase() === 'style') {
    // We're creating a hook for when content is added to this style element
    const originalAppendText = element.appendChild;
    element.appendChild = function(textNode) {
      if (textNode.nodeType === 3) { // Text node
        // Replace the problematic CSS rule
        const modifiedText = textNode.textContent.replace(
          /html\s*,\s*:host\s*{([^}]*)font-family\s*:\s*var\(--font-open-sans\)\s*,\s*sans-serif\s*;([^}]*)}/g,
          ':host{$1$2}' // Keep styles for :host but remove the html selector
        );
        
        // Create a new text node with our modified content
        const newTextNode = document.createTextNode(modifiedText);
        return originalAppendText.call(this, newTextNode);
      }
      return originalAppendText.call(this, textNode);
    };
  }
  
  return element;
}; 