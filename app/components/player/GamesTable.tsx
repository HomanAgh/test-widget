import React from "react";
import { useTranslation } from "react-i18next";
import { GameLog, PlayerType } from "@/app/types/player";

interface GamesTableProps {
  lastFiveGames: GameLog[];
  regularStats: any; // Define type for regular stats if needed
  playerType: PlayerType;
  gameLimit: number;
  view: "lastGames" | "regularStats";
}

const GamesTable: React.FC<GamesTableProps> = ({ lastFiveGames, regularStats, playerType, view }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8">
      {view === "regularStats" ? (
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-800 font-semibold">
              <th className="py-2 px-4 border">{t("GamesPlayed")}</th>
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
            <tr className="bg-blue-100">
              <td className="py-2 px-4 border">{regularStats?.gamesPlayed || 0}</td>
              {playerType === "GOALTENDER" ? (
                <>
                  <td className="py-2 px-4 border">{regularStats?.shotsAgainst || 0}</td>
                  <td className="py-2 px-4 border">{regularStats?.saves || 0}</td>
                  <td className="py-2 px-4 border">{regularStats?.goalsAgainst || 0}</td>
                  <td className="py-2 px-4 border">
                    {regularStats?.savePercentage?.toFixed(2) || "0.00"}%
                  </td>
                </>
              ) : (
                <>
                  <td className="py-2 px-4 border">{regularStats?.goals || 0}</td>
                  <td className="py-2 px-4 border">{regularStats?.assists || 0}</td>
                  <td className="py-2 px-4 border">{regularStats?.points || 0}</td>
                  <td className="py-2 px-4 border">{regularStats?.plusMinusRating || 0}</td>
                </>
              )}
            </tr>
          </tbody>
        </table>
      ) : (
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
            {lastFiveGames.map((game, index) => (
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
                    <td className="py-2 px-4 border">
                      {game.savePercentage?.toFixed(2) || "0.00"}%
                    </td>
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
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GamesTable;
