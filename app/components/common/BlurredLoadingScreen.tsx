import React, { useState } from "react";
import DotLoadingAnimation from "./DotLoadingAnimation"; // Your loading animation component

const BlurredLoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative min-h-screen">
      {/* Main content - will be blurred when loading */}
      <div className={`transition-all duration-300 ${isLoading ? "blur-lg" : "blur-0"}`}>
        <h1 className="text-3xl font-bold text-center mt-20">Player Probability Tool</h1>
        <p className="text-center text-gray-600 mt-4">
          Determine the probability of advancing to various levels by entering your information below.
        </p>
        {/* Other page content */}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md">
          <DotLoadingAnimation />
          <p className="mt-2 text-gray-700 text-lg font-semibold">
            Please wait while we calculate the probabilities...
          </p>
          <button
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            onClick={() => setIsLoading(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BlurredLoadingScreen;
