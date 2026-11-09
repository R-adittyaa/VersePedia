import { Suspense } from "react";
import { prisma } from "../../lib/prisma";
import { updateMatch } from "../../actions/season";
import { redirect } from "next/navigation";
import Link from "next/link";

interface EditMatchProps {
  searchParams: Promise<{ id?: string }>;
}

async function EditMatchContent({ searchParams }: EditMatchProps) {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;

  if (!id) return <div className="text-white text-center py-20">ID tidak ditemukan.</div>;

  const match = await prisma.match.findUnique({ where: { id } });

  if (!match) return <div className="text-white text-center py-20">Data tidak ditemukan.</div>;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateMatch(formData);
    redirect("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Match Playoff</h1>
        
        <form action={handleUpdate} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={match.id} />
          
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Tim A</label>
              <input type="text" name="teamA" defaultValue={match.teamA} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="w-20">
              <label className="block text-sm text-zinc-400 mb-1">Skor</label>
              <input type="number" name="scoreA" defaultValue={match.scoreA} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-white text-center" />
            </div>
          </div>

          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Tim B</label>
              <input type="text" name="teamB" defaultValue={match.teamB} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="w-20">
              <label className="block text-sm text-zinc-400 mb-1">Skor</label>
              <input type="number" name="scoreB" defaultValue={match.scoreB} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-white text-center" />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg">Simpan Perubahan</button>
            <Link href="/dashboard" className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditMatchPage({ searchParams }: EditMatchProps) {
  return (
    <Suspense fallback={<div className="text-zinc-500 text-center py-20 animate-pulse">Memuat data match...</div>}>
      <EditMatchContent searchParams={searchParams} />
    </Suspense>
  );
}