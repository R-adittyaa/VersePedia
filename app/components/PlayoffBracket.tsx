interface MatchData {
  match_no: number;
  bracket: "upper" | "lower" | "grand_final";
  round: number;
  team_a: string;
  team_b: string;
  score_a: number;
  score_b: number;
}

interface PlayoffBracketProps {
  matches: MatchData[];
}

export default function PlayoffBracket({ matches }: PlayoffBracketProps) {
  // Fungsi helper buat nampilin kotak match
  const MatchBox = ({ match }: { match: MatchData }) => {
    const isTeamAWinner = match.score_a > match.score_b;
    return (
      <div className="w-48 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden text-sm shadow-md shrink-0">
        <div className="flex justify-between p-2 border-b border-zinc-800">
          <span className={isTeamAWinner ? "font-bold text-white" : "text-zinc-400"}>
            {match.team_a}
          </span>
          <span className={`font-mono ${isTeamAWinner ? "text-blue-400" : "text-zinc-500"}`}>
            {match.score_a}
          </span>
        </div>
        <div className="flex justify-between p-2">
          <span className={!isTeamAWinner ? "font-bold text-white" : "text-zinc-400"}>
            {match.team_b}
          </span>
          <span className={`font-mono ${!isTeamAWinner ? "text-blue-400" : "text-zinc-500"}`}>
            {match.score_b}
          </span>
        </div>
      </div>
    );
  };

  const upperMatches = matches.filter(m => m.bracket === "upper");
  const lowerMatches = matches.filter(m => m.bracket === "lower");
  const grandFinal = matches.find(m => m.bracket === "grand_final");

  // Mengelompokkan match berdasarkan ronde
  const getRounds = (bracketMatches: MatchData[]) => {
    return bracketMatches.reduce((acc, match) => {
      if (!acc[match.round]) acc[match.round] = [];
      acc[match.round].push(match);
      return acc;
    }, {} as Record<number, MatchData[]>);
  };

  const upperRounds = getRounds(upperMatches);
  const lowerRounds = getRounds(lowerMatches);

  return (
    <div className="w-full overflow-x-auto pb-8">
      <div className="min-w-[800px] p-4 flex flex-col gap-12">
        
        {/* UPPER BRACKET */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-blue-500">Upper Bracket</h3>
          <div className="flex gap-12">
            {Object.entries(upperRounds).map(([round, roundMatches]) => (
              <div key={round} className="flex flex-col justify-around gap-8">
                {roundMatches.map(m => <MatchBox key={m.match_no} match={m} />)}
              </div>
            ))}
          </div>
        </div>

        {/* LOWER BRACKET */}
        <div>
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-amber-500">Lower Bracket</h3>
          <div className="flex gap-12">
            {Object.entries(lowerRounds).map(([round, roundMatches]) => (
              <div key={round} className="flex flex-col justify-around gap-8">
                {roundMatches.map(m => <MatchBox key={m.match_no} match={m} />)}
              </div>
            ))}
          </div>
        </div>

        {/* GRAND FINAL */}
        {grandFinal && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-emerald-400 mb-6 uppercase tracking-wider">Grand Final</h3>
            <div className="border-2 border-emerald-500/30 p-1 rounded-xl inline-block bg-emerald-500/5">
              <MatchBox match={grandFinal} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}