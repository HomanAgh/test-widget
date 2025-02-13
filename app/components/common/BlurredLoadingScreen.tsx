import React, { useState } from "react";
import DotLoadingAnimation from "./DotLoadingAnimation"; // Your loading animation component

const BlurredLoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {/* Full-Screen Blurred Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 h-screen">
          <div className="flex flex-col items-center">
            <p className="mt-2 text-gray-700 text-xl font-semibold pb-4 font-montserrat">
                Retrieving player data...
            </p>
            <DotLoadingAnimation />
            <button
            className="mt-4 px-4 py-2 bg-[#052D41] font-semibold text-white font-montserrat rounded-md hover:bg-gray-800 transition"
            onClick={() => setIsLoading(false)}
          >
            Cancel
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlurredLoadingScreen;
