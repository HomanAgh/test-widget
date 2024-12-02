import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GameLog, PlayerType, GoaltenderSummary, SkaterSummary } from "@/app/types/player";

interface GamesTableProps {
  lastFiveGames: GameLog[];
  playerType: PlayerType;
  gameLimit: number; // Pass the number of games being displayed
}

const GamesTable: React.FC<GamesTableProps> = ({ lastFiveGames, playerType, gameLimit }) => {
  const { t } = useTranslation();
  const [showSummary, setShowSummary] = useState(false);

  let summary: GoaltenderSummary | SkaterSummary;

  if (playerType === "GOALTENDER") {
    summary = lastFiveGames.reduce<GoaltenderSummary>(
      (acc, game) => {
        acc.shotsAgainst += game.shotsAgainst || 0;
        acc.saves += game.saves || 0;
        acc.goalsAgainst += game.goalsAgainst || 0;
        acc.savePercentage += game.savePercentage || 0;
        return acc;
      },
      { shotsAgainst: 0, saves: 0, goalsAgainst: 0, savePercentage: 0 }
    );

    if (lastFiveGames.length > 0) {
      summary.savePercentage /= lastFiveGames.length;
    }
  } else {
    summary = lastFiveGames.reduce<SkaterSummary>(
      (acc, game) => {
        acc.goals += game.goals || 0;
        acc.assists += game.assists || 0;
        acc.points += game.points || 0;
        acc.plusMinusRating += game.plusMinusRating || 0;
        return acc;
      },
      { goals: 0, assists: 0, points: 0, plusMinusRating: 0 }
    );
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          {showSummary
            ? t("SummaryLastNGames", { count: gameLimit }) // Use the dynamic game count
            : t("LastNGames", { count: gameLimit })}
        </h3>
        <button
          onClick={() => setShowSummary((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {showSummary ? t("ViewDetails") : t("ViewSummary")}
        </button>
      </div>
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-gray-800 font-semibold">
            <th className="py-2 px-4 border">{t("Date")}</th>
            {playerType === "GOALTENDER" ? (
              <>
                <th className="py-2 px-4 border">{t("ShotsAgainst")}</th>
                <th className="py-2 px-4 border">{t("Saves")}</th>
                <th className="py-2 px-4 border">{t("GoalsAgainst")}</th>
                <th className="py-2 px-4 border">{t("SavePercentage")}</th>
              </>
            ) : (
              <>
                <th className="py-2 px-4 border">{t("Goals")}</th>
                <th className="py-2 px-4 border">{t("Assists")}</th>
                <th className="py-2 px-4 border">{t("Points")}</th>
                <th className="py-2 px-4 border">{t("PlusMinusRating")}</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {showSummary ? (
            <tr className="bg-blue-100">
              <td className="py-2 px-4 border">{t("Summary")}</td>
              {playerType === "GOALTENDER" ? (
                <>
                  <td className="py-2 px-4 border">{(summary as GoaltenderSummary).shotsAgainst}</td>
                  <td className="py-2 px-4 border">{(summary as GoaltenderSummary).saves}</td>
                  <td className="py-2 px-4 border">{(summary as GoaltenderSummary).goalsAgainst}</td>
                  <td className="py-2 px-4 border">
                    {(summary as GoaltenderSummary).savePercentage.toFixed(2)}%
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).goals}</td>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).assists}</td>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).points}</td>
                  <td className="py-2 px-4 border">{(summary as SkaterSummary).plusMinusRating}</td>
                </>
              )}
            </tr>
          ) : (
            lastFiveGames.map((game, index) => (
              <tr
                key={index}
                className={`${index % 2 === 0 ? "bg-blue-100" : "bg-white"}`}
              >
                <td className="py-2 px-4 border">{game.date}</td>
                {playerType === "GOALTENDER" ? (
                  <>
                    <td className="py-2 px-4 border">{game.shotsAgainst || 0}</td>
                    <td className="py-2 px-4 border">{game.saves || 0}</td>
                    <td className="py-2 px-4 border">{game.goalsAgainst || 0}</td>
                    <td className="py-2 px-4 border">{game.savePercentage?.toFixed(2) || "0.00"}%</td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 border">{game.goals || 0}</td>
                    <td className="py-2 px-4 border">{game.assists || 0}</td>
                    <td className="py-2 px-4 border">{game.points || 0}</td>
                    <td className="py-2 px-4 border">{game.plusMinusRating || 0}</td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GamesTable;
