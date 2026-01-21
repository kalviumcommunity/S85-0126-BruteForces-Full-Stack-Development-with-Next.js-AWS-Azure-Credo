import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-100">Credo</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/search" className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition">Search</Link>
          <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
}