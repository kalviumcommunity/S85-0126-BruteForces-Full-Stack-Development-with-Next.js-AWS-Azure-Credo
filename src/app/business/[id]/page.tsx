import Navbar from "@/app/components/Navbar"; // 👈 Fixed import (removed /src)
import ReviewForm from "@/app/components/ReviewForm"; // 👈 Fixed import (removed /src)
import { prisma } from "@/lib/db"; // 👈 Standard import for lib
import { notFound } from "next/navigation";
import { BadgeCheck, MapPin, Shield, Calendar } from "lucide-react";

export default async function BusinessProfile({ params }: { params: { id: string } }) {
  const business = await prisma.business.findUnique({
    where: { id: Number(params.id) },
    include: {
      owner: true,
      reviews: { orderBy: { createdAt: 'desc' } },
      _count: { select: { endorsements: true } }
    }
  });

  if (!business) return notFound();

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      <Navbar />
      
      {/* Header Background */}
      <div className="h-64 bg-gradient-to-r from-indigo-900/20 to-slate-900 border-b border-slate-800 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
        <div className="glass-panel rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-white">{business.name}</h1>
                {business.credoScore > 70 && <BadgeCheck className="w-8 h-8 text-blue-400 fill-blue-400/10" />}
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Chandigarh, IN</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined 2024</span>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-sm">
                  {business.category}
                </span>
              </div>
            </div>

            {/* Credo Score Card */}
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl text-center min-w-[140px]">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Trust Score</div>
              <div className="text-5xl font-mono font-bold text-white mb-2">{business.credoScore}</div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded inline-block ${business.credoScore > 70 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {business.credoScore > 70 ? 'EXCELLENT' : 'BUILDING'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Reviews */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-400" /> Reputation History
            </h2>
            
            <div className="space-y-4">
              {business.reviews.map((review) => (
                <div key={review.id} className="bg-slate-900/30 border border-slate-800 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full ${i < review.rating ? 'bg-indigo-500' : 'bg-slate-800'}`} />
                      ))}
                    </div>
                    <span className="text-slate-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">"{review.comment}"</p>
                </div>
              ))}
              {business.reviews.length === 0 && (
                <div className="text-center p-12 border border-dashed border-slate-800 rounded-xl text-slate-500">
                  No reviews yet. Be the first to verify this business.
                </div>
              )}
            </div>

            {/* The Interactive Form */}
            <ReviewForm businessId={business.id} />
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
             <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-slate-400 text-sm font-bold uppercase mb-4">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-2xl font-bold text-white">{business.reviews.length}</div>
                    <div className="text-xs text-slate-500">Verifications</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                    <div className="text-2xl font-bold text-white">{business._count.endorsements}</div>
                    <div className="text-xs text-slate-500">Endorsements</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}