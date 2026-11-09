import { Suspense } from "react";
import { prisma } from "../../lib/prisma";
import { updatePlayer } from "../../actions/season";
import { redirect } from "next/navigation";
import Link from "next/link";

interface EditPlayerProps {
  searchParams: Promise<{ id?: string }>;
}

async function EditPlayerContent({ searchParams }: EditPlayerProps) {
  const resolvedParams = await searchParams;
  const id = resolvedParams.id;

  if (!id) return <div className="text-white text-center py-20">ID tidak ditemukan.</div>;

  const player = await prisma.player.findUnique({ 
    where: { id },
    include: { team: true }
  });

  if (!player) return <div className="text-white text-center py-20">Pemain tidak ditemukan.</div>;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePlayer(formData);
    redirect("/dashboard");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Edit Pemain</h1>
        <p className="text-sm text-zinc-400 mb-6">Tim: {player.team.name}</p>
        
        <form action={handleUpdate} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={player.id} />
          
          <div>
            <label className="block text-sm text-zinc-400 mb-1">Nama Pemain</label>
            <input type="text" name="name" defaultValue={player.name} required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Role</label>
              <select name="role" defaultValue={player.role} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                <option value="EXP">EXP</option>
                <option value="Gold">Gold</option>
                <option value="Mid">Mid</option>
                <option value="Jungler">Jungler</option>
                <option value="Roam">Roam</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Skill Tier</label>
              <select name="tier" defaultValue={player.tier} className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                <option value="S">S</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer mt-2">
            <input type="checkbox" name="isCaptain" defaultChecked={player.isCaptain} className="w-4 h-4 rounded border-zinc-700 text-blue-600 focus:ring-blue-500 bg-zinc-950" />
            Pemain ini adalah Kapten (Captain)
          </label>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg">Simpan Perubahan</button>
            <Link href="/dashboard" className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-4 rounded-lg">Batal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditPlayerPage({ searchParams }: EditPlayerProps) {
  return (
    <Suspense fallback={<div className="text-zinc-500 text-center py-20 animate-pulse">Memuat data pemain...</div>}>
      <EditPlayerContent searchParams={searchParams} />
    </Suspense>
  );
}