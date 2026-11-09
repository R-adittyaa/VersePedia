import React from "react";
import Link from "next/link";

export interface TeamStanding {
  rank: number;
  teamName: string;
  status: "Playoff" | "Eliminated";
}

interface StandingsTableProps {
  data: TeamStanding[];
}

export default function StandingsTable({ data }: StandingsTableProps) {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
      <div className="bg-zinc-950 p-4 border-b border-zinc-800">
        <h2 className="text-xl font-bold text-white tracking-wide">
          Klasemen Reguler Season
        </h2>
      </div>
      <table className="w-full text-left text-sm text-zinc-300">
        <thead className="bg-zinc-900 text-xs uppercase text-zinc-500 border-b border-zinc-800">
          <tr>
            <th scope="col" className="px-6 py-3 w-16 text-center">
              Peringkat
            </th>
            <th scope="col" className="px-6 py-3">
              Tim
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {data.map((team, index) => (
            <tr key={index} className="hover:bg-zinc-800/50 transition-colors">
              {/* Angka Peringkat */}
              <td className="px-6 py-4 text-center font-bold text-zinc-400">
                {team.rank}
              </td>

              {/* Nama Tim (Dibikin Link) */}
              <td className="px-6 py-4 font-semibold text-white">
                <Link
                  href={`/teams/${encodeURIComponent(team.teamName)}`}
                  className="hover:text-blue-400 hover:underline transition-colors block truncate max-w-[200px]"
                >
                  {team.teamName}
                </Link>
              </td>

              {/* Status */}
              <td className="px-6 py-4 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    team.status === "Playoff"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {team.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
