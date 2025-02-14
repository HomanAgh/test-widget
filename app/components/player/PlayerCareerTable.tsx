import React from "react";
import type { CareerStats } from "@/app/types/player";
import { TableContainer, Table,TableHead,TableBody,TableRow,TableCell,Link, PoweredBy } from "@/app/components/common/style";

interface CareerTableProps {
  careers: CareerStats[];
}

const PlayerCareerTable: React.FC<CareerTableProps> = ({
  careers,
}) => {
  // Determine if this player is a goalie (to show GAA, SV%, SO)
  const isGoalie = careers.some((career) => career.goalsAgainstAverage !== undefined);

  return (
    <div>
      {/* If you have a custom title component, you can still use it here, 
          or just use a simple <h2> / <h3>. */}
      <h2 className="text-xl font-bold mb-2">Career Statistics</h2>

      <TableContainer>
        <Table>
          {/* You can pass className to TableHead if you want the brightness filter */}
          <TableHead className="filter brightness-90">
            <TableRow>
              <TableCell isHeader align="left">League</TableCell>
              <TableCell isHeader align="center">Years</TableCell>
              <TableCell isHeader align="center">GP</TableCell>
              {isGoalie ? (
                <>
                  <TableCell isHeader align="center">GAA</TableCell>
                  <TableCell isHeader align="center">SV%</TableCell>
                  <TableCell isHeader align="center">SO</TableCell>
                </>
              ) : (
                <>
                  <TableCell isHeader align="center">G</TableCell>
                  <TableCell isHeader align="center">A</TableCell>
                  <TableCell isHeader align="center">TP</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {careers.map((career, index) => (
              <TableRow key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <TableCell align="left">
                  <Link
                    href={`https://www.eliteprospects.com/league/${career.league
                      .toLowerCase()
                      .replace(/\s+/g, "-")}/stats/all-time`}
                  >
                    {career.league}
                  </Link>
                </TableCell>

                <TableCell align="center">{career.numberOfSeasons}</TableCell>
                <TableCell align="center">{career.gamesPlayed}</TableCell>

                {isGoalie ? (
                  <>
                    <TableCell align="center">
                      {career.goalsAgainstAverage ?? "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {career.savePercentage ?? "N/A"}
                    </TableCell>
                    <TableCell align="center">
                      {career.shutouts ?? 0}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell align="center">{career.goals ?? 0}</TableCell>
                    <TableCell align="center">{career.assists ?? 0}</TableCell>
                    <TableCell align="center">{career.points ?? 0}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <PoweredBy/>
    </div>
  );
};

export default PlayerCareerTable;
