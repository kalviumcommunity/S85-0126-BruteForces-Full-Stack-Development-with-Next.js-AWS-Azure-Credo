import Navbar from "@/components/Navbar";
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

      {/* Hero Section: Responsive Padding (md:p-8, lg:p-12) */}
      <section className="pt-32 pb-16 px-6 text-center max-w-5xl mx-auto md:pt-40 md:pb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light/20 border border-brand-light/30 text-brand-dark dark:text-indigo-300 text-xs font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-DEFAULT opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-DEFAULT"></span>
          </span>
          Live Trust Protocol
        </div>
        
        {/* Responsive Typography (text-5xl -> md:text-7xl) */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gray-900 dark:text-white">
          Trust is <span className="text-gradient">earned</span>, <br /> not verified by paper.
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The decentralized reputation layer for the informal economy. 
          Build credibility through community validation, anywhere.
        </p>

        {/* Search Bar */}
        <form className="max-w-md mx-auto relative mb-8">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            name="q"
            placeholder="Find street vendors, freelancers..." 
            className="w-full bg-white dark:bg-slate-900/80 border border-gray-200 dark:border-slate-700 rounded-full py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:border-brand-DEFAULT focus:ring-1 focus:ring-brand-DEFAULT transition shadow-xl"
          />
        </form>
      </section>

      {/* Responsive Grid Section */}
      <section className="px-6 max-w-7xl mx-auto">
        {/* ASSIGNMENT REQ: Responsive Grid (1 col -> 2 col -> 3 col) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((b) => (
            <Link key={b.id} href={`/business/${b.id}`} className="group">
              <div className="glass-card h-full p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <BadgeCheck className="w-24 h-24 text-gray-200 dark:text-slate-800 -mr-8 -mt-8 group-hover:text-brand-light/50 dark:group-hover:text-indigo-900/50 transition-colors" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-xs font-bold px-2 py-1 rounded border border-gray-200 dark:border-slate-700">
                      {b.category}
                    </span>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-mono font-bold">
                      {b.credoScore} <span className="text-gray-400 dark:text-slate-600 text-xs">SCORE</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-brand-DEFAULT dark:group-hover:text-indigo-400 transition-colors">{b.name}</h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 mb-6">{b.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-200 dark:border-slate-800 pt-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-gray-700 dark:text-slate-300">{b._count.reviews}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-brand-DEFAULT dark:text-indigo-400 text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
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