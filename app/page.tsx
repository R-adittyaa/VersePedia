import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "../lib/prisma";

interface VerseWithSeasons {
  id: string;
  title: string;
  description: string | null;
  seasons: { id: string; number: number; status: string }[];
}

async function VerseList() {
  const verses = await prisma.verse.findMany({
    orderBy: { createdAt: "desc" },
    include: { seasons: { orderBy: { number: "asc" } } },
  }) as VerseWithSeasons[];

  if (verses.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl">
        <p className="text-zinc-500">Belum ada Verse yang dibuat.</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {verses.map((verse: VerseWithSeasons) => (
        <div key={verse.id} className="border-t border-zinc-800 pt-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{verse.title}</h2>
            <p className="text-zinc-400">{verse.description || "Tidak ada deskripsi."}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verse.seasons.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">Belum ada season di verse ini.</p>
            ) : (
              verse.seasons.map((season: { id: string; number: number; status: string }) => (
                <Link key={season.id} href={`/seasons/${season.id}`} className="group">
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-xl hover:border-blue-500/50 transition-all">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Season {season.number}</h3>
                    <p className="text-sm text-zinc-500 mt-1 capitalize">Status: {season.status}</p>
                    <div className="mt-4 text-sm font-medium text-blue-500">Lihat Detail →</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white mb-6">
          MPL <span className="text-blue-500">Verse</span> Engine
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          Platform manajemen turnamen esports. Buat semesta alternatif lu sendiri, atur klasemen, dan simulasikan playoff.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg shadow-blue-500/20">
            + Buat Verse Baru
          </Link>
        </div>
      </div>
      <Suspense fallback={<div className="text-center text-zinc-500 animate-pulse py-12">Memuat daftar Verse...</div>}>
        <VerseList />
      </Suspense>
    </div>
  );
}