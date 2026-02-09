
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, MapPin, Calendar, CheckCircle, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { VouchButton } from '@/components/business/VouchButton'

export const dynamic = 'force-dynamic'

async function getSession() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    return { user }
}

async function isUserVerified(userId: string) {
    // In real app, check if user is verified entity or trusted leader.
    // For demo, allowing anyone logged in to vouch if they have created a business profile?
    // Or just all users. Let's say all authenticated users can vouch for now for simplicity,
    // or restrict to 'COMMUNITY_LEADER' role.
    
    const user = await prisma.user.findUnique({
        where: { id: userId },
    })
    
    // Simplification: Allow all users to vouch for demo purposes
    return true; 
}

export default async function BusinessProfile({ params }: { params: { id: string } }) {
  const business = await prisma.business.findUnique({
    where: { id: params.id },
    include: {
        owner: true,
        receivedVouches: true
    }
  })

  if (!business) notFound()

  const session = await getSession()
  const canVouch = session && await isUserVerified(session.user.id)
  const hasVouched = session ? business.receivedVouches.some(v => v.voucher_id === session.user.id) : false

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
        {/* Nav */}
        <div className="bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        <ShieldCheck size={20} />
                    </div>
                    <span className="font-bold text-slate-900">Credo</span>
                </Link>
            </div>
        </div>

        {/* Cover Image Placeholder */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                        {/* Logo/Avatar */}
                        <div className="h-24 w-24 rounded-lg bg-slate-100 ring-4 ring-white shadow-sm flex items-center justify-center text-slate-400 text-3xl font-bold shrink-0">
                            {business.name.charAt(0)}
                        </div>
                        
                        <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h1 className="text-3xl font-bold text-slate-900">{business.name}</h1>
                                {business.is_verified && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20 self-start">
                                        <ShieldCheck size={14} className="fill-green-700 text-green-50" />
                                        Verified Business
                                    </span>
                                )}
                            </div>
                            
                            <div className="flex flex-wrap gap-4 mt-3 text-slate-500 text-sm">
                                {business.address && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} />
                                        <span>{business.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(business.createdAt).getFullYear()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Trust Score Badge */}
                         <div className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-100 min-w-[100px]">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Credo Score</span>
                            <span className="text-3xl font-bold text-blue-600">{business.trust_score}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                         {canVouch && !hasVouched && business.ownerId !== session?.user.id && (
                             <VouchButton businessId={business.id} />
                         )}
                         {hasVouched && (
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium">
                                <CheckCircle size={18} />
                                Vouched
                            </div>
                         )}
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                             <h2 className="text-lg font-semibold text-slate-900 mb-3">About</h2>
                             <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                 {business.description || "This business has not added a description yet."}
                             </p>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Stats */}
                           <div className="p-5 rounded-xl border bg-slate-50 border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                                    <ShieldCheck size={18} className="text-blue-600"/>
                                    Community Trust
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Total Vouches</span>
                                        <span className="font-semibold text-slate-900">{business.receivedVouches.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-600">Verification Status</span>
                                        <span className={business.is_verified ? "font-semibold text-green-600" : "font-semibold text-amber-600"}>
                                            {business.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                    {!business.is_verified && (
                                        <div className="text-xs text-slate-500 mt-2">
                                            Needs 3 vouches to get verified.
                                        </div>
                                    )}
                                </div>
                           </div>
                           
                           {/* Vouches List */}
                           <div>
                               <h3 className="font-semibold text-slate-900 mb-3 text-sm">
                                   Trusted by {business.receivedVouches.length} people
                               </h3>
                               <div className="flex -space-x-2 overflow-hidden">
                                    {business.receivedVouches.slice(0, 5).map((vouch, i) => (
                                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200" title="Voucher"></div>
                                    ))}
                                    {business.receivedVouches.length > 5 && (
                                        <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
                                            +{business.receivedVouches.length - 5}
                                        </div>
                                    )}
                               </div>
                           </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
