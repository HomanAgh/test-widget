import { useState, useEffect } from "react";

export const useTeamColors = (selectedTeam: string | null) => {
  const [teamColors, setTeamColors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamColors = async () => {
      if (!selectedTeam) return;

      try {
        const response = await fetch(`/api/AlumniSearchTeam?query=${encodeURIComponent(selectedTeam)}`);
        const data = await response.json();

        const team = data.teams?.[0];
        if (team?.id) {
          const colorResponse = await fetch(`/api/team?teamId=${team.id}`);
          const colorData = await colorResponse.json();
          if (colorData.colors) {
            setTeamColors(colorData.colors);
          }
        }
      } catch (err) {
        setError("Failed to fetch team colors.");
        console.error(err);
      }
    };

    fetchTeamColors();
  }, [selectedTeam]);

  return { teamColors, error };
};
