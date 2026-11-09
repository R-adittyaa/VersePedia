import { Suspense } from "react";
import { prisma } from "../../lib/prisma";
import { updateTeam } from "../../actions/season";
import { redirect } from "next/navigation";
import Link from "next/link";

interface EditTeamProps {
  searchParams: Promise<{ id?: string }>;
}

// 1. Komponen Konten yang ngebaca searchParams
async function EditTeamContent({ searchParams }: EditTeamProps) {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;

  if (!id) return <div className="text-white text-center py-20">ID tidak ditemukan.</div>;

  const team = await prisma.team.findUnique({ where: { id } });

  if (!team) return <div className="text-white text-center py-20">Tim tidak ditemukan.</div>;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateTeam(formData);
    redirect("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Edit Profil Tim</h1>
        
        <form action={handleUpdate} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={team.id} />
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nama Tim</label>
            <input type="text" name="name" defaultValue={team.name} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Region</label>
            <input type="text" name="region" defaultValue={team.region} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Trofi MPL</label>
              <input type="number" name="mplTrophies" defaultValue={team.mplTrophies} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Trofi MSC</label>
              <input type="number" name="mscTrophies" defaultValue={team.mscTrophies} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
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

// 2. Komponen Utama dibungkus Suspense
export default function EditTeamPage({ searchParams }: EditTeamProps) {
  return (
    <Suspense fallback={<div className="text-zinc-500 text-center py-20 animate-pulse">Memuat data tim...</div>}>
      <EditTeamContent searchParams={searchParams} />
    </Suspense>
  );
}