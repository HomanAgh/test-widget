import React from "react";

interface TooltipProps {
  tooltip: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip: React.FC<TooltipProps> = ({
  tooltip,
  children,
  position = "top",
}) => {
  const lines = tooltip.split("\n");

  const positionClasses = {
    top: "bottom-[125%] left-1/2 -translate-x-1/2",
    bottom: "top-[125%] left-1/2 -translate-x-1/2",
    left: "right-[125%] top-1/2 -translate-y-1/2",
    right: "left-[125%] top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block group">
      {children}
      <div
        className={`absolute z-10 
                      ${positionClasses[position]}
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
                      group-hover:visible`}
      >
        {lines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default Tooltip;
