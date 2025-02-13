import React from "react";

const DotLoadingAnimation: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-2">
    
        <div className="flex space-x-1">
            <span className="w-2 h-2 bg-blue-950 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
            <span className="w-2 h-2 bg-blue-950 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            <span className="w-2 h-2 bg-blue-950 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
            <span className="w-2 h-2 bg-blue-950 rounded-full animate-bounce" style={{ animationDelay: "0.6s" }}></span>
            <span className="w-2 h-2 bg-blue-950 rounded-full animate-bounce" style={{ animationDelay: "0.8s" }}></span>
        </div>
    </div>

    
  );
};

export default DotLoadingAnimation;
