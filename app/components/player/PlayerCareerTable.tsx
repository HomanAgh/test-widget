import React from "react";
import type { CareerStats } from "@/app/types/player";
import Table from "../common/style/Table";
import TableHeader from "../common/style/TableHeader";
import TableTitel from "../common/style/TableTitle";
import TableWrapper from "../common/style/TableWrapper"; 

interface CareerTableProps {
  careers: CareerStats[];
  backgroundColor?: string;
  textColor?: string;
}

const PlayerCareerTable: React.FC<CareerTableProps> = ({
  careers,
  backgroundColor = "#FFFFFF",
  textColor = "#000000",
}) => {
  const isGoalie = careers.some((career) => career.goalsAgainstAverage !== undefined);

  return (
    <div>
      <TableTitel align="left">Career Statistics</TableTitel>
      <TableWrapper backgroundColor={backgroundColor} textColor={textColor}>
        <table className="min-w-full">
          <thead style={{ filter: "brightness(90%)" }}>
            <tr>
              <TableHeader align="left">League</TableHeader>
              <TableHeader align="center">Years</TableHeader>
              <TableHeader align="center">GP</TableHeader>
              {isGoalie ? (
                <>
                  <TableHeader align="center">GAA</TableHeader>
                  <TableHeader align="center">SV%</TableHeader>
                  <TableHeader align="center">SO</TableHeader>
                </>
              ) : (
                <>
                  <TableHeader align="center">G</TableHeader>
                  <TableHeader align="center">A</TableHeader>
                  <TableHeader align="center">TP</TableHeader>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {careers.map((career, index) => (
              <tr key={index} className="border-t">
                <Table align="left">
                  <a
                    href={`https://www.eliteprospects.com/league/${career.league
                      .toLowerCase()
                      .replace(/\s+/g, "-")}/stats/all-time`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: textColor, textDecoration: "underline" }}
                  >
                    {career.league}
                  </a>
                </Table>
                <Table align="center">{career.numberOfSeasons}</Table>
                <Table align="center">{career.gamesPlayed}</Table>
                {isGoalie ? (
                  <>
                    <Table align="center">{career.goalsAgainstAverage ?? "N/A"}</Table>
                    <Table align="center">{career.savePercentage ?? "N/A"}</Table>
                    <Table align="center">{career.shutouts ?? 0}</Table>
                  </>
                ) : (
                  <>
                    <Table align="center">{career.goals ?? 0}</Table>
                    <Table align="center">{career.assists ?? 0}</Table>
                    <Table align="center">{career.points ?? 0}</Table>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  );
};

export default PlayerCareerTable;
