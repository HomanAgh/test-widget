"use client";

import { useEffect, useRef } from 'react';

interface ResizeObserverProps {
  children: React.ReactNode;
}

/**
 * ResizeObserver component that monitors content height changes
 * and sends messages to the parent window to resize the iframe.
 */
const ResizeObserver: React.FC<ResizeObserverProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastHeight = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Function to send height to parent window
    const sendHeight = () => {
      if (!containerRef.current) return;
      
      const height = containerRef.current.scrollHeight;
      
      // Only send message if height has changed
      if (height !== lastHeight.current) {
        lastHeight.current = height;
        
        try {
          // Send message to parent window
          window.parent.postMessage(
            JSON.stringify({
              type: 'resize',
              height: height
            }),
            '*'
          );
        } catch (e) {
          console.error('Failed to send resize message', e);
        }
      }
    };

    // Create ResizeObserver instance
    const resizeObserver = new window.ResizeObserver(() => {
      sendHeight();
    });

    // Observe the container
    resizeObserver.observe(containerRef.current);

    // Send initial height
    sendHeight();

    // Clean up observer on unmount
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      {children}
    </div>
  );
};

export default ResizeObserver; 