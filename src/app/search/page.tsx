
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Search, MapPin, ShieldCheck, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ''

  // Fetch businesses matching query
  // Note: For real production, use ts_vector/full text search. This is a simple contains.
  const businesses = query ? await prisma.business.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      receivedVouches: true,
    },
    orderBy: {
        trust_score: 'desc'
    }
  }) : []

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
             <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <ShieldCheck size={20} />
                </div>
                <span className="font-bold text-slate-900">Credo</span>
             </Link>
             <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
                Go to Dashboard
             </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
            <form className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Search size={20} />
                </div>
                <input 
                    name="q"
                    defaultValue={query}
                    autoFocus
                    type="search" 
                    placeholder="Search by name, category, or location..."
                    className="block w-full rounded-xl border-slate-200 py-3 pl-10 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-slate-50"
                />
            </form>
        </div>

        <div className="space-y-4">
            {!query && (
                <div className="text-center py-12">
                    <p className="text-slate-500">Enter a search term to find trusted local businesses.</p>
                </div>
            )}

            {query && businesses.length === 0 && (
                <div className="text-center py-12">
                     <p className="text-slate-500">No businesses found for "{query}".</p>
                </div>
            )}

            {businesses.map((business) => (
                <Link key={business.id} href={`/business/${business.id}`} className="block group">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 bg-white shadow-sm hover:shadow-md transition-all">
                        {/* Avatar Placeholder */}
                        <div className="h-14 w-14 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                            <span className="text-xl font-bold">{business.name.charAt(0)}</span>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                        {business.name}
                                    </h3>
                                    {business.address && (
                                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                            <MapPin size={14} />
                                            <span>{business.address}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="text-right">
                                     {business.is_verified ? (
                                         <div className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Verified
                                         </div>
                                     ) : null}
                                </div>
                            </div>
                            
                            <p className="text-slate-600 text-sm mt-3 line-clamp-2">
                                {business.description || "No description provided."}
                            </p>

                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={14} className="text-blue-600"/>
                                    Trust Score: <span className="text-slate-900">{business.trust_score}</span>
                                </span>
                                <span>•</span>
                                <span>{business.receivedVouches.length} Vouches</span>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
