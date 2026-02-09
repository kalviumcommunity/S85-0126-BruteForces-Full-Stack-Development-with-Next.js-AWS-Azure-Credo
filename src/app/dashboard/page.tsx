
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, CheckCircle2, UserPlus, BarChart, ExternalLink, MapPin, Users } from 'lucide-react'
import { prisma } from '@/lib/db'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

async function getSession() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return { user }
}

export default async function Dashboard() {
  const session = await getSession()
  if (!session || !session.user || !session.user.email) redirect('/login')

  const userEmail = session.user.email

  // Data fetching logic
  let user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      businesses: { include: { receivedVouches: true } },
      givenVouches: { include: { receiver_business: true } }
    }
  })

  // Sync Supabase user to Prisma DB if not exists
  if (!user) {
    user = await prisma.user.create({
      data: { 
        email: userEmail, 
        role: 'USER'
      },
      include: {
        businesses: { include: { receivedVouches: true } },
        givenVouches: { include: { receiver_business: true } }
      }
    })
  }

  const myBusiness = user?.businesses[0]
  const isVerified = myBusiness?.is_verified
  const vouchesReceived = myBusiness?.receivedVouches.length || 0
  const vouchesNeeded = 3
  const progress = Math.min((vouchesReceived / vouchesNeeded) * 100, 100)

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <ShieldCheck size={20} />
              </div>
              <span className="font-bold text-slate-900">Dashboard</span>
            </div>
            <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm">
                    {session.user.email.charAt(0).toUpperCase()}
                </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Welcome Section */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {session.user.email.split('@')[0]}
            </h1>
            <p className="text-slate-500 mt-1">Manage your business reputation and community trust.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Identity Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">Identity Status</h2>
                            <p className="text-sm text-slate-500">Your verification progress in the LocalTrust network.</p>
                        </div>
                        {isVerified ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                <CheckCircle2 size={16} /> Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                Pending
                            </span>
                        )}
                    </div>

                    {!myBusiness ? (
                        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <h3 className="text-slate-900 font-medium mb-2">No Business Profile Found</h3>
                            <p className="text-slate-500 text-sm mb-4">You need to register your local business to start collecting vouches.</p>
                            <Link href="/business/new" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                                <UserPlus size={16} className="mr-2" />
                                Create Business Profile
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {/* Visual Progress Bar */}
                            <div className="mb-2 flex justify-between text-sm font-medium">
                                <span className={isVerified ? "text-green-600" : "text-slate-900"}>
                                    {isVerified ? "Verification Complete" : `${vouchesReceived} of ${vouchesNeeded} vouches collected`}
                                </span>
                                <span className="text-slate-500">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 ${isVerified ? 'bg-green-500' : 'bg-blue-600'}`} 
                                    style={{ width: `${progress}%` }} 
                                />
                            </div>

                            {/* Action List */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-slate-900">Profile Created</h4>
                                        <p className="text-xs text-slate-500">Your business details are public.</p>
                                    </div>
                                    <Link href={`/business/${myBusiness.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                        View
                                    </Link>
                                </div>

                                <div className={`flex items-center gap-4 p-4 rounded-xl border ${vouchesReceived >= 3 ? 'border-slate-100 bg-slate-50/50' : 'border-blue-100 bg-blue-50'}`}>
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${vouchesReceived >= 3 ? 'bg-green-100 text-green-600' : 'bg-white text-blue-600 shadow-sm'}`}>
                                        {vouchesReceived >= 3 ? <CheckCircle2 size={20} /> : <span className="font-bold">2</span>}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-slate-900">Get 3 Community Vouches</h4>
                                        <p className="text-xs text-slate-500">
                                            {vouchesReceived >= 3 
                                                ? "You have successfully earned community trust." 
                                                : "Share your profile link with verified members."}
                                        </p>
                                    </div>
                                    {vouchesReceived < 3 && (
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                            Copy Link
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Analytics (Snippet) */}
            {isVerified && (
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 text-slate-500 mb-2">
                            <BarChart size={20} />
                            <span className="text-sm font-medium">Profile Views</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">128</p>
                        <p className="text-xs text-green-600 mt-1">↑ 12% vs last week</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                         <div className="flex items-center gap-3 text-slate-500 mb-2">
                            <ShieldCheck size={20} />
                            <span className="text-sm font-medium">Trust Score</span>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">{myBusiness?.trust_score}</p>
                        <p className="text-xs text-slate-500 mt-1">Based on 5 vouches</p>
                    </div>
                </div>
            )}
          </div>

          {/* Sidebar Area (Right 1/3) */}
          <div className="space-y-6">
             {/* Community Actions */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="font-semibold text-slate-900 mb-4">Community Tasks</h3>
                 
                 {isVerified ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600">You are a verified member. Help the community by validating other businesses you trust.</p>
                        <Link href="/search" className="flex items-center justify-between w-full p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                            <span className="text-sm font-medium text-slate-700">Find businesses to vouch</span>
                            <ArrowRight size={16} className="text-slate-400" />
                        </Link>
                    </div>
                 ) : (
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                        <p className="text-sm text-slate-500 mb-2">Verification required</p>
                        <p className="text-xs text-slate-400">Complete your verification to unlock vouching capabilities.</p>
                    </div>
                 )}
             </div>

             {/* Recent Vouch History */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                 <h3 className="font-semibold text-slate-900 mb-4">Your Vouch History</h3>
                 <div className="space-y-4">
                    {(!user?.givenVouches || user.givenVouches.length === 0) ? (
                        <div className="text-center py-6">
                            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-2">
                                <Users size={20} />
                            </div>
                            <p className="text-sm text-slate-500">No vouches given yet.</p>
                        </div>
                    ) : (
                        user.givenVouches.map(vouch => (
                            <div key={vouch.id} className="flex items-center gap-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                    {vouch.receiver_business.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{vouch.receiver_business.name}</p>
                                    <p className="text-xs text-slate-500">Vouched on {new Date(vouch.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  )
}
