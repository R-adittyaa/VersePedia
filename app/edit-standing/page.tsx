import { Suspense } from "react";
import { prisma } from "../../lib/prisma";
import { updateStanding } from "../../actions/season";
import { redirect } from "next/navigation";
import Link from "next/link";

interface EditStandingProps {
  searchParams: Promise<{ id?: string }>;
}

async function EditStandingContent({ searchParams }: EditStandingProps) {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;

  if (!id) return <div className="text-white text-center py-20">ID tidak ditemukan.</div>;

  const standing = await prisma.standing.findUnique({ where: { id } });

  if (!standing) return <div className="text-white text-center py-20">Data tidak ditemukan.</div>;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateStanding(formData);
    redirect("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Tim Klasemen</h1>
        
        <form action={handleUpdate} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={standing.id} />
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nama Tim</label>
            <input type="text" name="teamName" defaultValue={standing.teamName} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Peringkat (Rank)</label>
            <input type="number" name="rank" defaultValue={standing.rank} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Status</label>
            <select name="status" defaultValue={standing.status} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
              <option value="Playoff">Playoff</option>
              <option value="Eliminated">Eliminated</option>
            </select>
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

export default function EditStandingPage({ searchParams }: EditStandingProps) {
  return (
    <Suspense fallback={<div className="text-zinc-500 text-center py-20 animate-pulse">Memuat data klasemen...</div>}>
      <EditStandingContent searchParams={searchParams} />
    </Suspense>
  );
}