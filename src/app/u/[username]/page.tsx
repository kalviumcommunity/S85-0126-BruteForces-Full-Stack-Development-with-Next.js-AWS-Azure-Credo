import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ShieldCheck, Users, Calendar, FileText } from 'lucide-react';

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export default async function PublicProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const business = await prisma.business.findFirst({
    where: {
      OR: [{ slug: params.username }, { id: params.username }],
    },
    include: {
      owner: true,
      receivedVouches: {
        include: { voucher: true },
        orderBy: { timestamp: 'desc' },
        take: 50,
      },
    },
  });

  if (!business) notFound();

  const tierColors: Record<string, string> = {
    GOLD: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    SILVER: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20',
    BRONZE: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    UNVERIFIED: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="h-56 md:h-72 bg-gradient-to-br from-primary via-violet-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container max-w-4xl px-4 md:px-6 relative">
        {/* Profile Header */}
        <div className="-mt-20 mb-10 flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="h-36 w-36 rounded-3xl border-4 border-background bg-card shadow-2xl flex items-center justify-center overflow-hidden z-20">
            {business.profileImage ? (
              <img src={business.profileImage} alt={business.name} className="w-full h-full object-cover" />
            ) : (
                <div className="text-4xl font-bold text-primary flex items-center justify-center w-full h-full bg-primary/5">
                {business.name.substring(0, 2).toUpperCase()}
                </div>
            )}
          </div>

          <div className="flex-1 space-y-3 pb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold">{business.name}</h1>
              {business.is_verified && (
                <div className="flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
              )}
            </div>
            <p className="text-muted-foreground">
              {business.description || 'No description provided.'}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Trust Score:</span>
                <span className="font-bold text-gradient text-lg">
                  {business.trust_score}
                </span>
              </div>
              <Badge className={tierColors[business.tier] || tierColors.UNVERIFIED}>
                {business.tier}
              </Badge>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Joined{' '}
                {new Date(business.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Vouches Section */}
        <section className="pb-20">

          {business.documents && business.documents.length > 0 && (
            <div className="mb-8">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                Public Documents
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {business.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc}
                    target="_blank"
                    className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate">Document {i + 1}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Community Vouches ({business.receivedVouches.length})
            </h2>
          </div>

          {business.receivedVouches.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border bg-card">
              <div className="h-14 w-14 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-3">
                <Users className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                No vouches yet. Be the first to vouch!
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {business.receivedVouches.map((vouch) => (
                <div
                  key={vouch.id}
                  className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {(vouch.voucher.email?.charAt(0) || '?').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {vouch.voucher.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground">Community Voucher</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      +{vouch.weight} Impact
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(vouch.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
