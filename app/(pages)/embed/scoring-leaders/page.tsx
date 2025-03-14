"use client";

import React, { Suspense } from "react";
import ScoringLeaders from "@/app/components/league/ScoringLeaders";
import { useSearchParams } from "next/navigation";
import ResizeObserver from "@/app/components/embed/ResizeObserver";

const EmbedScoringLeaders = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScoringLeadersPageContent />
    </Suspense>
  );
};

const ScoringLeadersPageContent = () => {
  const searchParams = useSearchParams();
  const getParam = (name: string, defaultValue: string): string => {
    try {
      const value = searchParams.get(name);
      if (!value) return defaultValue;
      
      // For color parameters, ensure they're valid hex colors
      if (name.toLowerCase().includes('color')) {
        const decoded = decodeURIComponent(value);
        // Basic validation for hex color - should start with # and be 4 or 7 chars long
        if (decoded.startsWith('#') && (decoded.length === 4 || decoded.length === 7)) {
          return decoded;
        }
        console.warn(`Invalid color format for ${name}:`, decoded);
        return defaultValue;
      }
      
      return decodeURIComponent(value);
    } catch (err) {
      console.error(`Error processing parameter ${name}:`, err);
      return defaultValue;
    }
  };

  const leagueSlug = getParam("leagueSlug", "");
  const season = getParam("season", "");
  const backgroundColor = getParam("backgroundColor", "#052D41");
  const textColor = getParam("textColor", "#000000");
  const tableBackgroundColor = getParam("tableBackgroundColor", "#FFFFFF");
  const headerTextColor = getParam("headerTextColor", "#FFFFFF");
  const nameTextColor = getParam("nameTextColor", "#0D73A6");

  // Log all URL parameters for debugging
  console.log('Full URL:', typeof window !== 'undefined' ? window.location.href : 'server-side');
  console.log('All search params:', Object.fromEntries([...searchParams.entries()]));
  console.log('Processed parameters:', { 
    leagueSlug,
    season,
    nameTextColor, 
    backgroundColor,
    textColor,
    tableBackgroundColor,
    headerTextColor
  });

  if (!leagueSlug || !season) {
    return <div>Missing league slug or season</div>;
  }

  return (
    <ResizeObserver>
      <div style={{ overflow: "auto" }}>
        <ScoringLeaders
          leagueSlug={leagueSlug}
          season={season}
          customColors={{
            backgroundColor,
            textColor,
            tableBackgroundColor,
            headerTextColor,
            nameTextColor
          }}
          hideSeasonSelector={true}
        />
      </div>
    </ResizeObserver>
  );
};

export default EmbedScoringLeaders; 