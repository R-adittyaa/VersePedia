import { Suspense } from "react";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { 
  createVerse, createSeason, addTeamToSeason, createMatch, createPlayer,
  deleteStanding, deleteMatch, deletePlayer, deleteSeason,
  createStaff, deleteStaff 
} from "../../actions/season";

interface DashboardProps {
  searchParams: Promise<{ verseId?: string }>;
}

async function DashboardContent({ searchParams }: DashboardProps) {
  const verses = await prisma.verse.findMany({ orderBy: { createdAt: "desc" } });
  const resolvedParams = await searchParams;
  
  const activeVerseId = resolvedParams.verseId || verses[0]?.id;
  const activeVerse = verses.find((v: any) => v.id === activeVerseId);

  const seasons = activeVerseId 
    ? await prisma.season.findMany({ where: { verseId: activeVerseId }, orderBy: { number: "desc" } })
    : [];
  
  const seasonIds = seasons.map((s: any) => s.id);

  const standings = await prisma.standing.findMany({ 
    where: { seasonId: { in: seasonIds } }, orderBy: { rank: "asc" }, include: { season: true }
  });
  
  const matches = await prisma.match.findMany({ 
    where: { seasonId: { in: seasonIds } }, orderBy: { matchNo: "asc" }, include: { season: true }
  });
  
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });
  const players = await prisma.player.findMany({ orderBy: { name: "asc" }, include: { team: true } });
  const staffs = await prisma.staff.findMany({ include: { team: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <div className="mb-8 border-b border-zinc-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-zinc-400">Pilih Verse untuk mengelola data spesifik semesta tersebut.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {verses.map((v: any) => (
            <Link 
              key={v.id} 
              href={`/dashboard?verseId=${v.id}`}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeVerseId === v.id ? "bg-blue-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              {v.title}
            </Link>
          ))}
        </div>
      </div>

      {!activeVerse ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-xl max-w-md mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Buat Verse Pertama Lu!</h2>
          <form action={createVerse} className="flex flex-col gap-3 px-6">
            <input type="text" name="title" required placeholder="Judul Verse (MPL Universe)" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            <input type="text" name="description" placeholder="Deskripsi (Opsional)" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mt-2">+ Buat Verse</button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">1. Tambah Season (di {activeVerse.title})</h2>
              <form action={createSeason} className="flex flex-col gap-3">
                <input type="hidden" name="verseId" value={activeVerse.id} />
                <div className="flex gap-2">
                  <input type="number" name="seasonNumber" required placeholder="No. Season (1)" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg">+</button>
                </div>
              </form>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">2. Tambah Tim ke Klasemen</h2>
              <form action={addTeamToSeason} className="flex flex-col gap-3">
                <select name="seasonId" required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                  <option value="">-- Pilih Season --</option>
                  {seasons.map((s: any) => <option key={s.id} value={s.id}>Season {s.number}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="text" name="teamName" required placeholder="Nama Tim (EVOS)" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" list="team-list" />
                  <datalist id="team-list">
                    {teams.map((t: any) => <option key={t.id} value={t.name} />)}
                  </datalist>
                  <input type="number" name="rank" required placeholder="Rank" className="w-24 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <p className="text-xs text-zinc-500">*Status Playoff otomatis: Rank 1-6 (Lolos), 7+ (Eliminasi).</p>
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg mt-1">+ Tambah</button>
              </form>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">3. Tambah Match Playoff</h2>
              <form action={createMatch} className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <select name="seasonId" required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                    <option value="">-- Pilih Season --</option>
                    {seasons.map((s: any) => <option key={s.id} value={s.id}>Season {s.number}</option>)}
                  </select>
                  <input type="number" name="matchNo" required placeholder="M1" className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="flex gap-2">
                  <select name="bracket" required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                    <option value="upper">Upper</option>
                    <option value="lower">Lower</option>
                    <option value="grand_final">Grand Final</option>
                  </select>
                  <input type="number" name="round" required placeholder="Ronde" className="w-24 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <div className="flex gap-2 items-center">
                  <input type="text" name="teamA" required placeholder="Tim A" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <input type="number" name="scoreA" required placeholder="0" className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-white text-center" />
                  <span className="text-zinc-500">-</span>
                  <input type="number" name="scoreB" required placeholder="0" className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-white text-center" />
                  <input type="text" name="teamB" required placeholder="Tim B" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                </div>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg mt-2">+ Tambah Match</button>
              </form>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">4. Tambah Roster Pemain</h2>
              <form action={createPlayer} className="flex flex-col gap-3">
                <select name="teamId" required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                  <option value="">-- Pilih Tim --</option>
                  {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="text" name="name" required placeholder="Nama Pemain" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <select name="role" required className="w-32 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                    <option value="EXP">EXP</option>
                    <option value="Gold">Gold</option>
                    <option value="Mid">Mid</option>
                    <option value="Jungler">Jungler</option>
                    <option value="Roam">Roam</option>
                  </select>
                  <select name="tier" required className="w-24 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                    <option value="S">S</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
                  <input type="checkbox" name="isCaptain" className="w-4 h-4 rounded border-zinc-700 text-blue-600 focus:ring-blue-500 bg-zinc-950" />
                  Pemain ini adalah Kapten (Captain)
                </label>
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg mt-2">+ Tambah Pemain</button>
              </form>
            </div>

            {/* FORM STAFF */}
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">5. Tambah Coaching Staff</h2>
              <form action={createStaff} className="flex flex-col gap-3">
                <select name="teamId" required className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                  <option value="">-- Pilih Tim --</option>
                  {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <div className="flex gap-2">
                  <input type="text" name="name" required placeholder="Nama Staff" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
                  <select name="role" required className="w-40 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white">
                    <option value="Head Coach">Head Coach</option>
                    <option value="Asisten Coach">Asisten Coach</option>
                    <option value="Analis">Analis</option>
                  </select>
                </div>
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg mt-2">+ Tambah Staff</button>
              </form>
            </div>

          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Profil Tim (Semua)</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {teams.map((t: any) => (
                  <li key={t.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-white text-sm flex justify-between items-center group">
                    <div>
                      <span className="font-bold block">{t.name}</span>
                      <span className="text-zinc-500 text-xs">{t.region} • MPL: {t.mplTrophies} • MSC: {t.mscTrophies}</span>
                    </div>
                    <Link href={`/edit-team?id=${t.id}`} className="text-blue-500 hover:text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">
                      Edit Profil
                    </Link>
                  </li>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Season Terdaftar</h2>
              <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                {seasons.length === 0 ? <p className="text-zinc-500 text-sm">Belum ada season.</p> : seasons.map((s: any) => (
                  <li key={s.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-white text-sm flex justify-between items-center group">
                    <span className="font-bold">Season {s.number}</span>
                    <form action={deleteSeason}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Hapus</button>
                    </form>
                  </li>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Klasemen Terinput</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {standings.map((st: any) => (
                  <li key={st.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-white text-sm flex justify-between items-center group">
                    <div>
                      <span className="font-bold block">#{st.rank} {st.teamName}</span>
                      <span className="text-zinc-500 text-xs">S{st.season.number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${st.status === 'Playoff' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>{st.status}</span>
                      <form action={deleteStanding}>
                        <input type="hidden" name="id" value={st.id} />
                        <button type="submit" className="text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Hapus</button>
                      </form>
                    </div>
                  </li>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Match Terinput</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {matches.map((m: any) => (
                  <li key={m.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-white text-sm flex justify-between items-center group">
                    <div>
                      <span className="font-bold block">{m.teamA} {m.scoreA} - {m.scoreB} {m.teamB}</span>
                      <span className="text-zinc-500 text-xs">M{m.matchNo} ({m.bracket}) S{m.season.number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/edit-match?id=${m.id}`} className="text-blue-500 hover:text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Edit</Link>
                      <form action={deleteMatch}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Hapus</button>
                      </form>
                    </div>
                  </li>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Roster Terinput</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {players.map((p: any) => (
                  <li key={p.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-white text-sm flex justify-between items-center group">
                    <div>
                      <span className="font-semibold block">{p.name} {p.isCaptain && "(C)"}</span>
                      <span className="text-zinc-500 text-xs">{p.team.name} - {p.role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-amber-400 bg-zinc-900 px-2 py-1 rounded">[{p.tier}]</span>
                      <Link href={`/edit-player?id=${p.id}`} className="text-blue-500 hover:text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Edit</Link>
                      <form action={deletePlayer}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Hapus</button>
                      </form>
                    </div>
                  </li>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-4">Staff Terinput</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {staffs.map((s: any) => (
                  <li key={s.id} className="bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-white text-sm flex justify-between items-center group">
                    <div>
                      <span className="font-semibold block">{s.name}</span>
                      <span className="text-zinc-500 text-xs">{s.team.name} - {s.role}</span>
                    </div>
                    <form action={deleteStaff}>
                      <input type="hidden" name="id" value={s.id} />
                      <button type="submit" className="text-red-500 hover:text-red-400 opacity-50 group-hover:opacity-100 transition-opacity text-xs font-bold">Hapus</button>
                    </form>
                  </li>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage({ searchParams }: DashboardProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Suspense fallback={<div className="text-zinc-500 animate-pulse">Memuat dashboard...</div>}>
        <DashboardContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}