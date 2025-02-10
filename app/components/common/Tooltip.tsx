import React from 'react';

interface TooltipProps {
  tooltip: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-text">{tooltip}</div>
      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
        }
        .tooltip-text {
          visibility: hidden;
          width: max-content;
          background-color: #555;
          color: #fff;
          text-align: center;
          border-radius: 4px;
          padding: 4px 8px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Positions tooltip above the element */
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          transition: opacity 0.3s;
          white-space: nowrap;
          pointer-events: none;
        }
        .tooltip-container:hover .tooltip-text {
          visibility: visible;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
