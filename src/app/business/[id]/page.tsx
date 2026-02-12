import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, MapPin, Calendar, CheckCircle, Users, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { VouchButton } from '@/components/business/VouchButton';
import { TrustBadge, TrustTier } from '@/components/business/TrustBadge';
import { QRCodeCard } from '@/components/business/QRCodeCard';

export const dynamic = 'force-dynamic';

async function getSession() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { user };
}

export default async function BusinessProfile({ params }: { params: { id: string } }) {
  const business = await prisma.business.findUnique({
    where: { id: params.id },
    include: {
      owner: true,
      receivedVouches: {
        include: { voucher: true },
        orderBy: { timestamp: 'desc' },
      },
    },
  });

  if (!business) notFound();

  const session = await getSession();
  const hasVouched = session
    ? business.receivedVouches.some((v) => v.voucher_id === session.user.id)
    : false;
  const canVouch = session && !hasVouched && business.ownerId !== session.user.id;
  
  // Ensure consistent URL generation
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const profileUrl = `${baseUrl}/business/${business.slug || business.id}`;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Banner */}
      <div className="h-52 md:h-64 bg-gradient-to-br from-primary via-violet-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <div className="container max-w-4xl px-4 pt-24 md:pt-28 relative z-10">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
        </div>
      </div>

      <div className="container max-w-4xl px-4 md:px-6 relative">
        {/* Profile Card */}
        <div className="-mt-16 mb-8 rounded-3xl border bg-card shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary shrink-0 shadow-md ring-4 ring-background overflow-hidden relative">
                {business.profileImage ? (
                  <img src={business.profileImage} alt={business.name} className="w-full h-full object-cover" />
                ) : (
                  business.name.charAt(0)
                )}
              </div>

              <div className="flex-1 w-full space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold">{business.name}</h1>
                    <TrustBadge tier={business.tier as TrustTier} />
                  </div>

                  {/* Trust Score */}
                  <div className="text-center px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="text-2xl font-bold text-gradient">{business.trust_score}</div>
                    <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      Credo Score
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  {business.address && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {business.address}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined{' '}
                    {new Date(business.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {business.receivedVouches.length} vouches
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 flex-wrap">
              {canVouch && <VouchButton businessId={business.id} />}
              {hasVouched && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" /> Vouched
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About + Vouchers */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {business.description || 'This business has not added a description yet.'}
              </p>
            </div>

            <div className="rounded-3xl border bg-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Trusted by {business.receivedVouches.length} people
              </h2>
              {business.receivedVouches.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No vouches received yet.</p>
              ) : (
                <div className="space-y-2">
                  {business.receivedVouches.map((vouch) => (
                    <div
                      key={vouch.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {(vouch.voucher?.email?.charAt(0) || '?').toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {vouch.voucher?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(vouch.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                        +{vouch.weight}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Documents Section */}
          {business.documents && business.documents.length > 0 && (
            <div className="rounded-3xl border bg-card p-6 mt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-primary" /> Documents
              </h3>
              <div className="space-y-2">
                {business.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm p-3 hover:bg-muted rounded-xl transition-colors truncate border border-transparent hover:border-border"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="truncate flex-1">Document {index + 1}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            <QRCodeCard url={profileUrl} title={business.name} />

            <div className="rounded-3xl border bg-card p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4 text-primary" /> Community Trust
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Vouches</span>
                  <span className="font-semibold">{business.receivedVouches.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Tier</span>
                  <span className="font-semibold">{business.tier}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold">
                    {business.is_verified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
              {business.tier !== 'GOLD' && (
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t">
                  Earn more vouches from trusted members to upgrade tier.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
