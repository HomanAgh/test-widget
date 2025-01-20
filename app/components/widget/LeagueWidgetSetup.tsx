"use client";

import React, { useState, useMemo } from "react";
import League from "@/app/components/league/League";

interface LeagueWidgetSetupProps {
  leagueSlug: string;
}

const LeagueWidgetSetup: React.FC<LeagueWidgetSetupProps> = ({ leagueSlug }) => {
  const [bgColor] = useState("#FFFFFF");
  const [textColor] = useState("#000000");
  const [showPreview, setShowPreview] = useState(false);

  // Build the final embed URL
  const embedUrl = useMemo(() => {
    const base = "http://localhost:3000/embed/league";
    const params = new URLSearchParams({
      leagueSlug: leagueSlug,
      backgroundColor: bgColor,
      textColor: textColor,
    });
    return `${base}?${params.toString()}`;
  }, [leagueSlug, bgColor, textColor]);

  // The embed code the user can copy
  const iframeCode = `<iframe src="${embedUrl}" style="width: 100%; height: 500px; border: none;"></iframe>`;

  return (
    <div>
      {/* Live Example Render */}
      <div className="mt-4">
        <League
          leagueSlug={leagueSlug}
          backgroundColor={bgColor}
          textColor={textColor}
        />
      </div>

      {/* Embed Code + Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Embed Code</h3>
        <div className="flex items-center space-x-4">
          <textarea
            readOnly
            value={iframeCode}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => setShowPreview(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
          >
            Preview
          </button>
        </div>

        <h3 className="text-lg font-medium mt-4 mb-2">Preview</h3>
        {showPreview && (
          <iframe
            src={embedUrl}
            style={{ width: "100%", height: "500px", border: "none" }}
          />
        )}
      </div>
    </div>
  );
};

export default LeagueWidgetSetup;
