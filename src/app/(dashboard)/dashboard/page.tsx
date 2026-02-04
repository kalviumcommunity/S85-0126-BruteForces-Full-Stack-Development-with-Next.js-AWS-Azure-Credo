import React from 'react';
import { prisma } from '@/lib/db';
import { QRGenerator } from '@/components/qr/QRGenerator';
import { ShieldCheck, Shield, Users, BadgeCheck } from 'lucide-react';

// Helpers for badges (usually in @/components/ui/badge)
const Badge = (({ className, children, variant = 'default' }: any) => {
    const variants: any = {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "text-slate-950 border border-slate-200 hover:bg-slate-100",
        BASIC: "bg-gray-100 text-gray-800 border-gray-200",
        COMMUNITY: "bg-blue-100 text-blue-800 border-blue-200",
        VERIFIED: "bg-green-100 text-green-800 border-green-200",
    };
    return (
        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 ${variants[variant] || variants.default} ${className}`}>
            {children}
        </div>
    );
});

// Card Components (usually in @/components/ui/card)
const Card = ({ className, children }: any) => <div className={`rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ className, children }: any) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>;
const CardTitle = ({ className, children }: any) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>;
const CardContent = ({ className, children }: any) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

import { getAuthenticatedUser, getCurrentBusinessProfile } from '@/lib/server-auth';
import { redirect } from 'next/navigation';

async function getBusinessData(userId: string) {
    // Using the real authenticated user ID
    const profile = await prisma.profile.findFirst({
        where: { id: userId }, 
        include: {
            vouchesReceived: {
                include: {
                    vouch_sender: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5
            }
        }
    });
    
    return profile;
}

export default async function DashboardPage() {
    // 1. Auth Check
    const user = await getAuthenticatedUser();
    
    if (!user) {
        redirect('/login');
    }

    const profile = await getBusinessData(user.id);

    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">No Business Profile Found</h1>
                    <p className="text-slate-500">Please contact support if you believe this is an error.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                   <Badge variant={profile.current_tier}>{profile.current_tier} TIER</Badge>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.trust_score}</div>
                        <p className="text-xs text-slate-500">
                            Based on vouches & activity
                        </p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vouches</CardTitle>
                        <Users className="h-4 w-4 text-slate-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{profile.vouchesReceived.length}</div>
                        <p className="text-xs text-slate-500">
                            Community endorsements
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* QR Code Section */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Your Trust Identity</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <QRGenerator slug={profile.slug} size={250} />
                        <p className="mt-4 text-sm text-center text-slate-500 max-w-xs">
                            Ask customers or other businesses to scan this code to vouch for you.
                        </p>
                    </CardContent>
                </Card>

                {/* Recent Vouches List */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Vouches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {profile.vouchesReceived.length === 0 ? (
                                <p className="text-sm text-slate-500">No vouches yet. Share your QR code!</p>
                            ) : (
                                profile.vouchesReceived.map((vouch) => (
                                    <div key={vouch.id} className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                            {/* Avatar Fallback */}
                                             <span className="text-xs font-medium">{vouch.vouch_sender.business_name?.[0] || 'U'}</span>
                                        </div>
                                        <div className="ml-4 space-y-1">
                                            <p className="text-sm font-medium leading-none">{vouch.vouch_sender.business_name || 'Unknown Business'}</p>
                                            <p className="text-xs text-muted-foreground">{vouch.vouch_sender.email}</p>
                                        </div>
                                        <div className="ml-auto font-medium">
                                            <Badge variant={vouch.vouch_sender.current_tier} className="text-[10px] px-1.5">
                                                {vouch.vouch_sender.current_tier}
                                            </Badge>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
