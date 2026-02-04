import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Metadata } from 'next';
import { ShieldCheck, Calendar, MapPin, Star } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/server-auth';
import { VouchButton } from '@/components/business/VouchButton';

// Fetch Profile
async function getProfile(slug: string) {
    return await prisma.profile.findUnique({
        where: { slug },
        include: {
            vouchesReceived: {
                include: {
                    vouch_sender: true,
                },
                take: 10, // Limit recently shown
            },
        },
    });
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const profile = await getProfile(params.slug);
    if (!profile) return { title: 'Business Not Found' };
    return {
        title: `${profile.business_name} | Credo Trust Profile`,
        description: `View the trust score and vouches for ${profile.business_name}. Verified Credo Business.`,
    };
}

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
    const profile = await getProfile(params.slug);

    if (!profile) {
        notFound();
    }

    // Check if current visitor is logged in (to show Vouch Button)
    const user = await getAuthenticatedUser();
    const isLoggedIn = !!user;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6">
                
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-slate-900 to-slate-800"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg">
                                {/* Avatar */}
                                <div className="h-full w-full bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-bold text-slate-400">
                                    {profile.business_name[0]}
                                </div>
                            </div>
                            
                            {/* Validation Badge */}
                            <div className="mb-2">
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                    profile.current_tier === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                                    profile.current_tier === 'COMMUNITY' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                                }`}>
                                    <ShieldCheck className="w-3 h-3" />
                                    {profile.current_tier} TIER
                                </span>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">{profile.business_name}</h1>
                            <p className="text-slate-500 mt-1 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Member since {profile.createdAt.toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left: Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                            <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Trust Score</div>
                            <div className="text-4xl font-extrabold text-slate-900 mt-2">{profile.trust_score}</div>
                            <div className="mt-4 text-xs text-slate-400">
                                Updated daily
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl shadow-sm text-white text-center">
                            <h3 className="font-semibold">Vouch for this Business</h3>
                            <p className="text-sm text-slate-400 mt-2 mb-4">
                                Use your Credo identity to back this business.
                            </p>
                            {isLoggedIn ? (
                                <VouchButton receiverId={profile.id} />
                            ) : (
                                <a href="/login" className="block w-full bg-slate-800 text-white py-2 rounded-lg font-semibold text-sm hover:bg-slate-700 border border-slate-700">
                                    Log in to Vouch
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Details & Endorsements */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Bio */}
                        {profile.bio && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-2">About</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {profile.bio}
                                </p>
                            </div>
                        )}

                        {/* Vouches List */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
                                <span>Endorsements</span>
                                <span className="text-sm text-slate-500 font-normal">{profile.vouchesReceived.length} total</span>
                            </h3>
                            
                            <div className="space-y-4">
                                {profile.vouchesReceived.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No endorsements yet.</p>
                                ) : (
                                    profile.vouchesReceived.map((vouch) => (
                                        <div key={vouch.id} className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="h-10 w-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs">
                                                {vouch.vouch_sender.business_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{vouch.vouch_sender.business_name}</div>
                                                <div className="text-xs text-slate-500">
                                                    Verified {vouch.vouch_sender.current_tier} Member
                                                </div>
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
    );
}
