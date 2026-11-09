import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white tracking-wider">
              MPL <span className="text-blue-500">Verse</span>
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/dashboard" className="text-zinc-300 hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}