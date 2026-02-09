"use client";

import Link from "next/link";
import { ShieldCheck, UserCircle } from "lucide-react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <nav className="fixed w-full z-50 top-0 border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Credo</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/search" className="text-sm font-medium text-muted-foreground hover:text-primary transition">Search</Link>
          <ModeToggle />
          {user ? (
             <Link href="/dashboard" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2">
                <UserCircle size={18} />
                Profile
             </Link>
          ) : (
             <button className="bg-secondary hover:bg-secondary/80 border border-input text-secondary-foreground px-5 py-2.5 rounded-full text-sm font-medium transition-all">
                Connect Wallet
             </button>
          )}
        </div>
      </div>
    </nav>
  );
}
