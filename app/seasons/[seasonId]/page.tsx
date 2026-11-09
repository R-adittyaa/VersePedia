import { Suspense } from "react";
import Link from "next/link";
import StandingsTable from "../../components/StandingsTable";
import PlayoffBracket from "../../components/PlayoffBracket";
import { prisma } from "../../../lib/prisma";

interface SeasonPageProps {
  params: Promise<{ seasonId: string }>;
}

// 1. Komponen Konten (Narik data dari DB)
async function SeasonContent({ params }: SeasonPageProps) {
  const resolvedParams = await params;
  // Sekarang kita nangkep ID unik, bukan nomor season
  const seasonId = resolvedParams.seasonId;
  
  const season = await prisma.season.findUnique({
    where: { id: seasonId },
    include: { 
      standings: { orderBy: { rank: "asc" } },
      matches: { orderBy: { matchNo: "asc" } },
      verse: true // Ambil data verse-nya juga
    }
  });

  if (!season) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl text-white font-bold mb-4">Season Tidak Ditemukan</h1>
        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Kembali ke Beranda</Link>
      </div>
    );
  }

  const standingsData = season.standings.map((team) => ({
    rank: team.rank,
    teamName: team.teamName,
    status: team.status as "Playoff" | "Eliminated",
  }));

  const matchesData = season.matches.map((m) => ({
    match_no: m.matchNo,
    bracket: m.bracket as "upper" | "lower" | "grand_final",
    round: m.round,
    team_a: m.teamA,
    team_b: m.teamB,
    score_a: m.scoreA,
    score_b: m.scoreB,
  }));

  return (
    <div className="mb-8">
      <div className="border-b border-zinc-800 pb-4 mb-8">
        <p className="text-sm text-blue-400 font-semibold mb-1">{season.verse.title}</p>
        <h1 className="text-3xl font-bold text-white">Season {season.number} Overview</h1>
      </div>

      <div className="flex flex-col gap-16">
        {season.standings.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Klasemen Reguler</h2>
            <div className="flex justify-center">
              <StandingsTable data={standingsData} />
            </div>
          </section>
        )}
        
        {matchesData.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6 border-t border-zinc-800 pt-8">Playoff Bracket</h2>
            <PlayoffBracket matches={matchesData} />
          </section>
        )}

        {season.standings.length === 0 && matchesData.length === 0 && (
          <div className="bg-zinc-900/50 border border-zinc-800 border-dashed p-12 text-center rounded-xl max-w-2xl mx-auto">
            <p className="text-zinc-500 mb-6">Season ini masih kosong.</p>
            <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg">Isi Data di Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. Komponen Utama (Dibungkus Suspense biar Next.js nggak protes)
export default function SeasonPage({ params }: SeasonPageProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="text-zinc-500 animate-pulse">Memuat data season...</div>}>
        <SeasonContent params={params} />
      </Suspense>
    </div>
  );
}