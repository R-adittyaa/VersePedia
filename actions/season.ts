"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

// --- VERSE & SEASON ---
export async function createVerse(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  try {
    await prisma.verse.create({ data: { title, description } });
    revalidatePath("/dashboard"); revalidatePath("/");
  } catch (error) { console.error(error); }
}

export async function createSeason(formData: FormData) {
  const verseId = formData.get("verseId") as string;
  const seasonNumber = parseInt(formData.get("seasonNumber") as string);
  try {
    await prisma.season.create({ data: { verseId, number: seasonNumber, status: "ongoing" } });
    revalidatePath("/dashboard"); revalidatePath("/");
  } catch (error) { console.error(error); }
}

// --- MANAGE TEAM (TIM & KLASEMEN) ---
export async function addTeamToSeason(formData: FormData) {
  const seasonId = formData.get("seasonId") as string;
  const teamName = formData.get("teamName") as string;
  const rank = parseInt(formData.get("rank") as string);

  // LOGIKA OTOMATIS: Rank 1-6 Playoff, 7+ Eliminated
  const status = rank <= 6 ? "Playoff" : "Eliminated";

  try {
    let team = await prisma.team.findUnique({ where: { name: teamName } });
    if (!team) {
      team = await prisma.team.create({ data: { name: teamName, region: "Indonesia" } });
    }

    await prisma.standing.create({ data: { seasonId, teamName, rank, status } });
    revalidatePath("/dashboard");
  } catch (error) { console.error(error); }
}

// Tambahan fungsi buat edit profil tim
export async function updateTeam(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const region = formData.get("region") as string;
  const mplTrophies = parseInt(formData.get("mplTrophies") as string) || 0;
  const mscTrophies = parseInt(formData.get("mscTrophies") as string) || 0;

  try {
    await prisma.team.update({
      where: { id },
      data: { name, region, mplTrophies, mscTrophies },
    });
    revalidatePath("/dashboard");
    revalidatePath("/teams"); // Biar halaman publik keupdate
  } catch (error) { console.error(error); }
}

export async function createMatch(formData: FormData) {
  const seasonId = formData.get("seasonId") as string;
  const matchNo = parseInt(formData.get("matchNo") as string);
  const bracket = formData.get("bracket") as string;
  const round = parseInt(formData.get("round") as string);
  const teamA = formData.get("teamA") as string;
  const teamB = formData.get("teamB") as string;
  const scoreA = parseInt(formData.get("scoreA") as string);
  const scoreB = parseInt(formData.get("scoreB") as string);
  try {
    await prisma.match.create({ data: { seasonId, matchNo, bracket, round, teamA, teamB, scoreA, scoreB } });
    revalidatePath("/dashboard");
  } catch (error) { console.error(error); }
}

export async function createPlayer(formData: FormData) {
  const teamId = formData.get("teamId") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const tier = formData.get("tier") as string;
  const isCaptain = formData.get("isCaptain") === "on";
  try {
    await prisma.player.create({ data: { teamId, name, role, tier, isCaptain } });
    revalidatePath("/dashboard");
  } catch (error) { console.error(error); }
}

// --- DELETE ---
export async function deleteVerse(formData: FormData) {
  try { await prisma.verse.delete({ where: { id: formData.get("id") as string } }); revalidatePath("/dashboard"); revalidatePath("/"); } catch (e) { console.error(e); }
}
export async function deleteSeason(formData: FormData) {
  try { await prisma.season.delete({ where: { id: formData.get("id") as string } }); revalidatePath("/dashboard"); revalidatePath("/"); } catch (e) { console.error(e); }
}
export async function deleteStanding(formData: FormData) {
  try { await prisma.standing.delete({ where: { id: formData.get("id") as string } }); revalidatePath("/dashboard"); } catch (e) { console.error(e); }
}
export async function deleteMatch(formData: FormData) {
  try { await prisma.match.delete({ where: { id: formData.get("id") as string } }); revalidatePath("/dashboard"); } catch (e) { console.error(e); }
}
export async function deletePlayer(formData: FormData) {
  try { await prisma.player.delete({ where: { id: formData.get("id") as string } }); revalidatePath("/dashboard"); } catch (e) { console.error(e); }
}

// --- EDIT (Sudah ada sebelumnya) ---
export async function updateStanding(formData: FormData) {
  const id = formData.get("id") as string;
  const teamName = formData.get("teamName") as string;
  const rank = parseInt(formData.get("rank") as string);
  const status = formData.get("status") as string;
  try {
    await prisma.standing.update({ where: { id }, data: { teamName, rank, status } });
    revalidatePath("/dashboard"); revalidatePath("/");
  } catch (error) { console.error(error); }
}
export async function updateMatch(formData: FormData) {
  const id = formData.get("id") as string;
  const teamA = formData.get("teamA") as string;
  const teamB = formData.get("teamB") as string;
  const scoreA = parseInt(formData.get("scoreA") as string);
  const scoreB = parseInt(formData.get("scoreB") as string);
  try {
    await prisma.match.update({ where: { id }, data: { teamA, teamB, scoreA, scoreB } });
    revalidatePath("/dashboard"); revalidatePath("/");
  } catch (error) { console.error(error); }
}

// ... kode sebelumnya

export async function updatePlayer(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const tier = formData.get("tier") as string;
  const isCaptain = formData.get("isCaptain") === "on";

  try {
    await prisma.player.update({
      where: { id },
      data: { name, role, tier, isCaptain },
    });
    revalidatePath("/dashboard");
  } catch (error) { console.error(error); }
}