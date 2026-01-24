"use client"; // Must be client to manage modal state

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useState } from "react";
import WalletModal from "./WalletModal"; // 👈 Import Modal

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 top-0 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-brand-light/20 dark:bg-indigo-500/10 rounded-lg group-hover:bg-brand-light/30 transition">
              <ShieldCheck className="w-6 h-6 text-brand-DEFAULT dark:text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-slate-100">
              Credo
            </span>
          </Link>

          <div className="flex gap-4 items-center">
            <Link 
              href="/search" 
              className="hidden md:block text-sm font-medium text-gray-600 dark:text-slate-400 hover:text-brand-DEFAULT dark:hover:text-indigo-400 transition"
            >
              Search
            </Link>
            
            <ThemeToggle />

            {/* 👇 Trigger Modal on Click */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-DEFAULT hover:bg-brand-dark dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-brand-light/20 dark:shadow-none"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* 👇 Place Modal Here */}
      <WalletModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}