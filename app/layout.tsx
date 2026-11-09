// Tambahkan import Navbar di atas
import Navbar from "./components/Navbar"; 
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MPL Verse - Esports Reference",
  description: "Ensiklopedia dan Referensi Turnamen Esports MPL Verse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Kita set background gelap di body biar konsisten */}
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen flex flex-col`}>
        <Navbar />
        {/* children adalah isi dari page.tsx yang sedang dibuka */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}