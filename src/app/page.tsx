// 👇 THIS IS THE FIX: Remove "/src" here
import Navbar from "@/app/components/Navbar"; 
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Star, BadgeCheck, Search, ArrowRight } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  const businesses = await prisma.business.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { credoScore: 'desc' },
    include: { _count: { select: { reviews: true } } }
  });

  return (
    <main className="min-h-screen pb-20">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Live Trust Protocol
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Trust is <span className="text-gradient">earned</span>, <br /> not verified by paper.
        </h1>
        
        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The decentralized reputation layer for the informal economy. 
          Build credibility through community validation, anywhere.
        </p>

        {/* Search Bar Functionality */}
        <form className="max-w-md mx-auto relative mb-8">
          <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
          <input 
            name="q"
            placeholder="Find street vendors, freelancers..." 
            className="w-full bg-slate-900/80 border border-slate-700 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition shadow-2xl"
          />
        </form>
      </section>

      {/* Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <Link key={b.id} href={`/business/${b.id}`} className="group">
              <div className="glass-card h-full p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <BadgeCheck className="w-24 h-24 text-slate-800 -mr-8 -mt-8 group-hover:text-indigo-900/50 transition-colors" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded border border-slate-700">
                      {b.category}
                    </span>
                    <div className="flex items-center gap-1 text-green-400 font-mono font-bold">
                      {b.credoScore} <span className="text-slate-600 text-xs">SCORE</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">{b.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6">{b.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 border-t border-slate-800 pt-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-slate-300">{b._count.reviews}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-indigo-400 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                      View Profile <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}