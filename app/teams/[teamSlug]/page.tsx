import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

interface TeamPageProps {
  params: Promise<{ teamSlug: string }>;
}

async function TeamContent({ params }: TeamPageProps) {
  const resolvedParams = await params;
  const teamNameParam = decodeURIComponent(resolvedParams.teamSlug);
  
  // Cari tim di database berdasarkan nama (case-insensitive)
  const team = await prisma.team.findFirst({
    where: { 
      name: { contains: teamNameParam } 
    },
    include: { 
      players: { orderBy: { role: "asc" } } 
    }
  });

  if (!team) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-white font-bold mb-4">Tim Tidak Ditemukan</h1>
        <p className="text-zinc-400 mb-8">Profil untuk "{teamNameParam}" belum diinput di Dashboard.</p>
        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
          Isi Profil Tim
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER TIM */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2">{team.name}</h1>
          <p className="text-zinc-400">Region: {team.region}</p>
        </div>
        
        {/* TROFI */}
        <div className="flex gap-4">
          <div className="bg-zinc-950 px-6 py-3 rounded-xl border border-zinc-800 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold">MPL Titles</span>
            <span className="text-2xl font-black text-amber-400">{team.mplTrophies}</span>
          </div>
          <div className="bg-zinc-950 px-6 py-3 rounded-xl border border-zinc-800 text-center">
            <span className="block text-xs text-zinc-500 uppercase font-bold">MSC Titles</span>
            <span className="text-2xl font-black text-amber-400">{team.mscTrophies}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* STAFF COACHING (Nanti kita isi dari DB) */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Coaching Staff</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center text-zinc-500 text-sm italic">
            Belum ada data staff untuk tim ini.
          </div>
        </div>

        {/* ROSTER PEMAIN */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Active Roster</h2>
          {team.players.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 border-dashed p-8 text-center rounded-xl text-zinc-500">
              Belum ada data pemain untuk tim ini.
            </div>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 text-xs uppercase text-zinc-500 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Nama Pemain</th>
                    <th className="px-4 py-3 text-right">Skill Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {team.players.map((player) => (
                    <tr key={player.id} className="hover:bg-zinc-800/50">
                      <td className="px-4 py-3 text-zinc-400 font-medium">{player.role}</td>
                      <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                        {player.name}
                        {player.isCaptain && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                            Captain
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-amber-400">
                        [{player.tier}]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="text-zinc-500 animate-pulse">Memuat profil tim...</div>}>
        <TeamContent params={params} />
      </Suspense>
    </div>
  );
}