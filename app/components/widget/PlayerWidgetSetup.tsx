"use client";

import React, { useState, useMemo, useEffect } from "react";
import Player from "../player/Player";
import EmbedCodeBlock from "../iframe/IframePreview";
import HexColors from "../common/color-picker/HexColorsAndIframeHeight";
import type { Player as PlayerType } from "@/app/types/player";

const DEFAULT_IFRAME_HEIGHT = 800;
const STATS_TABLE_HEIGHT = 232;
const SEASONS_TABLE_HEIGHT = 396;
const CAREER_TABLE_HEIGHT = 800;
const GAMES_TABLE_HEIGHT = 456;
const GAMES_SUMMARY_HEIGHT = 232;

interface WidgetSetupProps {
  playerId: string;
}

const WidgetSetup: React.FC<WidgetSetupProps> = ({ playerId }) => {
  const [gameLimit, setGameLimit] = useState(5);
  const [viewMode, setViewMode] = useState<"stats" | "seasons" | "career" | "games">("stats");
  const [,setShowPreview] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [customColors, setCustomColors] = useState({
    headerTextColor: "#FFFFFF",
    backgroundColor: "#052D41",
    textColor: "#000000",
    tableBackgroundColor: "#FFFFFF",
    nameTextColor: "#0D73A6",
  });
  const [iframeHeight, setIframeHeight] = useState(DEFAULT_IFRAME_HEIGHT);
  const [playerData, setPlayerData] = useState<PlayerType | null>(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`/api/player/${encodeURIComponent(playerId)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch player data");
        }
        const data = await response.json();
        setPlayerData(data.playerInfo);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchPlayerData();
  }, [playerId]);

  useEffect(() => {
    switch (viewMode) {
      case "stats":
        setIframeHeight(STATS_TABLE_HEIGHT);
        break;
      case "seasons":
        setIframeHeight(SEASONS_TABLE_HEIGHT);
        break;
      case "career":
        setIframeHeight(CAREER_TABLE_HEIGHT);
        break;
      case "games":
        if (showSummary) {
          setIframeHeight(GAMES_SUMMARY_HEIGHT);
        } else {
          // Calculate height based on game limit (5 games = 456px, 10 games = 822px, etc.)
          const multiplier = gameLimit / 5;
          const heightReduction = (multiplier - 1) * 170; // Subtract 90px for each multiplier beyond 1
          setIframeHeight((GAMES_TABLE_HEIGHT * multiplier) - heightReduction);
        }
        break;
      default:
        setIframeHeight(DEFAULT_IFRAME_HEIGHT);
    }
  }, [viewMode, gameLimit, showSummary]);

  const handleGameLimitChange = (limit: number) => {
    setGameLimit(limit);
  };

  const embedUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return (
      `${baseUrl}/embed/player?playerId=${playerId}` +
      `&gameLimit=${gameLimit}&viewMode=${viewMode}` +
      `&showSummary=${showSummary}` +
      `&backgroundColor=${encodeURIComponent(customColors.backgroundColor)}` +
      `&textColor=${encodeURIComponent(customColors.textColor)}` +
      `&tableBackgroundColor=${encodeURIComponent(customColors.tableBackgroundColor)}` +
      `&headerTextColor=${encodeURIComponent(customColors.headerTextColor)}` +
      `&nameTextColor=${encodeURIComponent(customColors.nameTextColor)}`+
      `&_t=${Date.now()}`
    );
  }, [playerId, gameLimit, viewMode, showSummary, customColors]);

  const sourceLinks = useMemo(() => {
    if (!playerId || !playerData) return '';
    
    return `<p> Source: <a href="https://www.eliteprospects.com/player/${playerId}/${playerData.name.toLowerCase().replace(/\s+/g, '-')}" target="_blank" rel="noopener noreferrer">${playerData.name}</a> @ Elite Prospects</p>`;
  }, [playerId, playerData]);

  const iframeCode = `<iframe src="${embedUrl}" width="100%" height="${iframeHeight}px" frameborder="0" class="iframe"></iframe>${sourceLinks ? '\n' + sourceLinks : ''}`;

  return (
    <div>
      <div className="mt-6 mb-6">
        <div className="flex flex-wrap md:flex-nowrap items-center space-x-8 mt-4">
          <HexColors 
            customColors={customColors} 
            setCustomColors={setCustomColors}
            height={iframeHeight}
            onHeightChange={setIframeHeight}
            defaultHeight={DEFAULT_IFRAME_HEIGHT}
          />
        </div>
      </div>

    <div className="border-b border-gray-200 pb-8  ">
    <div className="text-left font-montserrat font-bold my-4 border-buttom " >
        <h3 className="text-lg font-montserrat font-bold mb-2">View Mode</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              setViewMode("stats");
              setShowPreview(false);
            }}
            className={`px-2 py-2 rounded-md ${
              viewMode === "stats" ? "bg-[#052D41] text-white" : "bg-[#052D41] text-white"
            } hover:bg-[#031A28]`}
          >
            Show Current Season Stats
          </button>
          <button
            onClick={() => {
              setViewMode("seasons");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
              viewMode === "seasons" ? "bg-[#052D41] text-white" : "bg-[#052D41] text-white"
            } hover:bg-[#031A28]`}
          >
            Show Player Seasons
          </button>
          <button
            onClick={() => {
              setViewMode("career");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
              viewMode === "career" ? "bg-[#052D41] text-white" : "bg-[#052D41] text-white"
            } hover:bg-[#031A28]`}
          >
            Show Player Career
          </button>
          <button
            onClick={() => {
              setViewMode("games");
              setShowPreview(false);
            }}
            className={`px-6 py-2 rounded-md ${
              viewMode === "games" ? "bg-[#052D41] text-white" : "bg-[#052D41] text-white"
            } hover:bg-[#031A28]`}
          >
            Show Recent Games
          </button>
        </div>
      </div>

      {viewMode === "games" && (
        <div className="mt-4 left-center pb-8">
          <h3 className="text-lg font-medium mb-2 font-montserrat pl-20">Select Number of Games</h3>
          <div className="flex justify-center space-x-4">
            {[5, 10, 15, 20, 25].map((limit) => (
              <button
                key={limit}
                onClick={() => {
                  handleGameLimitChange(limit);
                  setShowPreview(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  gameLimit === limit ? "bg-green-600 text-white" : "bg-[#0B9D52] text-white"
                } hover:bg-green-700`}
              >
                {limit} Games
              </button>
            ))}
            <button
              onClick={() => setShowSummary((prev) => !prev)}
              className={`px-4 py-2 rounded-md ${
                showSummary ? "bg-purple-700 text-white" : "bg-purple-700 text-white"
              } hover:bg-purple-800`}
            >
              {showSummary ? "View Details" : "View Summary"}
            </button>
          </div >
        </div>
      )}
    </div>

      <div className="mt-6">
        <Player
          playerId={playerId}
          gameLimit={gameLimit}
          viewMode={viewMode}
          showSummary={showSummary}
          customColors={customColors}
        />
      </div>

      <EmbedCodeBlock iframeCode={iframeCode}/>
    </div>
  );
};

export default WidgetSetup;
