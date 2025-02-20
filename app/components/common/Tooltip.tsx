import React from 'react';

interface TooltipProps {
  tooltip: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltip, children }) => {
  const lines = tooltip.split('\n');

  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute z-10 
                      bottom-[125%] 
                      left-1/2 
                      -translate-x-1/2 
                      bg-gray-700 
                      text-white 
                      text-center 
                      rounded 
                      px-2 py-1 
                      opacity-0 
                      invisible 
                      transition-opacity 
                      duration-300 
                      pointer-events-none 
                      max-w-xs 
                      group-hover:opacity-100 
                      group-hover:visible">
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default Tooltip;
