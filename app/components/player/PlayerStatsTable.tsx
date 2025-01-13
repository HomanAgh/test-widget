import React from "react";
import { PlayerType, Goalie, Skater } from "@/app/types/player";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import TableTitel from "../common/style/TableTitle";
import TableWrapper from "../common/style/TableWrapper"; // Import TableWrapper

interface PlayerStatsTableProps {
  playerType: PlayerType;
  stats: Goalie | Skater;
  backgroundColor?: string; // NEW
  textColor?: string;       // NEW
}

const PlayerStatsTable: React.FC<PlayerStatsTableProps> = ({
  playerType,
  stats,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const isGoaltender = playerType === "GOALTENDER"; 

  return (
   <div>
     <TableTitel align="left">Statistics</TableTitel>
     <TableWrapper backgroundColor={backgroundColor} textColor={textColor}>
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead style={{ filter: "brightness(90%)" }}>
          <tr>
            <TableHeader align="center">GP</TableHeader>
            {isGoaltender ? (
              <>
                <TableHeader align="center">GA</TableHeader>
                <TableHeader align="center">SA</TableHeader>
                <TableHeader align="center">SV</TableHeader>
                <TableHeader align="center">SV%</TableHeader>
              </>
            ) : (
              <>
                <TableHeader align="center">G</TableHeader>
                <TableHeader align="center">A</TableHeader>
                <TableHeader align="center">TP</TableHeader>
                <TableHeader align="center">+/-</TableHeader>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <Table align="center">{(stats as Goalie).gamesPlayed}</Table>
            {isGoaltender ? (
              <>
                <Table align="center">{(stats as Goalie).goalsAgainst}</Table>
                <Table align="center">{(stats as Goalie).shotsAgainst}</Table>
                <Table align="center">{(stats as Goalie).saves}</Table>
                <Table align="center">{((stats as Goalie).savePercentage || 0).toFixed(2)}%</Table>
              </>
            ) : (
              <>
                <Table align="center">{(stats as Skater).goals}</Table>
                <Table align="center">{(stats as Skater).assists}</Table>
                <Table align="center">{(stats as Skater).points}</Table>
                <Table align="center">{(stats as Skater).plusMinusRating}</Table>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </TableWrapper>
   </div>
  );
};

export default PlayerStatsTable;
