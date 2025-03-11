/* import React from "react";

// Hardcoded list of tournaments with their corresponding league slugs
const TOURNAMENTS = [
  {
    id: "brick-invitational",
    name: "Brick Invitational",
    description: "Elite youth hockey tournament for players aged 10-11",
  },
  // Add more tournaments as needed
];

interface TournamentSelectionProps {
  selectedTournaments: string[];
  onChange: (tournaments: string[]) => void;
}

const TournamentSelection: React.FC<TournamentSelectionProps> = ({
  selectedTournaments,
  onChange,
}) => {
  const handleTournamentChange = (tournamentId: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...selectedTournaments, tournamentId]);
    } else {
      onChange(selectedTournaments.filter((id) => id !== tournamentId));
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Select Tournaments</h3>
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <div className="space-y-2">
          {TOURNAMENTS.map((tournament) => (
            <div key={tournament.id} className="flex items-start">
              <div className="flex items-center">
                <input
                  id={`tournament-${tournament.id}`}
                  type="checkbox"
                  checked={selectedTournaments.includes(tournament.id)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleTournamentChange(tournament.id, e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`tournament-${tournament.id}`}
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  {tournament.name}
                </label>
              </div>
              <div className="ml-2 text-sm text-gray-500">
                {tournament.description}
              </div>
            </div>
          ))}
        </div>
        {TOURNAMENTS.length === 0 && (
          <div className="text-gray-500 italic">No tournaments available</div>
        )}
      </div>
    </div>
  );
};

export default TournamentSelection;
 */