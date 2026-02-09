'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, CheckCircle2, ExternalLink, TrendingUp, Users,
  Activity, ArrowUpRight, Medal, Trophy, Send, X, Clock, Plus,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/* ── Circular Progress ── */
function TrustRing({ value, size = 140 }: { value: number; size?: number }) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (Math.min(value, 100) / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-muted/30" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="url(#gradient)" strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          strokeDasharray={circumference}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(263, 70%, 65%)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {value}
        </motion.span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Score</span>
      </div>
    </div>
  );
}

/* ── Tier Badge ── */
function TierBadge({ tier }: { tier: string }) {
  const config: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    GOLD: { color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', icon: Trophy, label: 'Gold' },
    SILVER: { color: 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/20', icon: Medal, label: 'Silver' },
    BRONZE: { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', icon: Medal, label: 'Bronze' },
    UNVERIFIED: { color: 'bg-muted text-muted-foreground border-border', icon: ShieldCheck, label: 'Unverified' },
  };
  const c = config[tier] || config.UNVERIFIED;
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold ${c.color}`}>
      <c.icon className="w-4 h-4" />
      {c.label} Tier
    </div>
  );
}

/* ── Vouch Request Modal ── */
function VouchRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border rounded-3xl shadow-2xl p-8 mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">Request a Vouch</h3>
                <button onClick={onClose} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Email</label>
                  <input
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-11 w-full rounded-xl border bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>
                <p className="text-xs text-muted-foreground">They&apos;ll receive an email invitation to vouch for your business.</p>
                <Button className="w-full rounded-xl h-11 gap-2" onClick={onClose}>
                  <Send className="w-4 h-4" /> Send Request
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const bgColors = [
  'bg-primary/5 border-primary/10',
  'bg-blue-500/5 border-blue-500/10',
  'bg-emerald-500/5 border-emerald-500/10',
  'bg-amber-500/5 border-amber-500/10'
];

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, change, iconColor, delay, index }: {
  icon: React.ElementType; label: string; value: string | number; change?: string;
  iconColor: string; delay: number; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className={`rounded-3xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border backdrop-blur-sm ${bgColors[index % bgColors.length]}`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6" />
          </div>
          {change && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full ring-1 ring-emerald-500/20">
              <ArrowUpRight className="w-3 h-3" /> {change}
            </span>
          )}
        </div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="text-sm text-muted-foreground font-medium mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

/* ── Main Dashboard Client ── */
export function DashboardClient({ data }: { data: any }) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!data || !data.user) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-4">
        <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Welcome to Credo</h2>
          <p className="text-muted-foreground max-w-md">Please sign in to view your dashboard.</p>
        </div>
        <Link href="/login">
          <Button className="rounded-xl gap-2">Sign In <ArrowUpRight className="w-4 h-4" /></Button>
        </Link>
      </div>
    );
  }

  const { user, business, recentVouches, pendingRequests } = data;

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center px-4">
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center"
        >
          <Plus className="w-10 h-10 text-primary" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Hey, {user.email.split('@')[0]}!</h2>
          <p className="text-muted-foreground max-w-md">You haven&apos;t created a business profile yet. Start building your reputation today.</p>
        </div>
        <Button size="lg" className="rounded-xl gap-2">
          Create Business Profile <ArrowUpRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <VouchRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="flex-1 p-6 pt-24 lg:p-10 lg:pt-10 pb-32 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, <span className="font-medium text-foreground">{business.name}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl gap-2" asChild>
              <Link href={`/business/${business.id}`}>
                <ExternalLink className="w-4 h-4" /> Public Profile
              </Link>
            </Button>
            <Button className="rounded-xl gap-2 shadow-md shadow-primary/10" onClick={() => setModalOpen(true)}>
              <Send className="w-4 h-4" /> Request Vouch
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard icon={ShieldCheck} label="Trust Score" value={business.trust_score || 0} change="+12" iconColor="bg-primary/10 text-primary" delay={0} index={0} />
          <StatCard icon={Users} label="Total Vouches" value={recentVouches?.length || 0} change="+2" iconColor="bg-blue-500/10 text-blue-600 dark:text-blue-400" delay={0.1} index={1} />
          <StatCard icon={Activity} label="Profile Views" value="1.2k" change="+18%" iconColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" delay={0.2} index={2} />
          <StatCard icon={Clock} label="Pending Requests" value={pendingRequests?.length || 0} iconColor="bg-amber-500/10 text-amber-600 dark:text-amber-400" delay={0.3} index={3} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trust Score + Tier Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-card to-card p-8"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <TrustRing value={business.trust_score || 0} />
              <div className="space-y-3">
                <TierBadge tier={business.tier} />
                <p className="text-xs text-muted-foreground">
                  {business.tier === 'GOLD' ? 'Maximum tier reached!' : 'Earn more vouches to rank up'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 rounded-3xl border bg-card overflow-hidden"
          >
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Recent Vouches</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Recent community validations</p>
              </div>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="divide-y">
              {(!recentVouches || recentVouches.length === 0) ? (
                <div className="p-10 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No vouches received yet. Share your profile to get started.</p>
                </div>
              ) : (
                recentVouches.map((vouch: any, i: number) => (
                  <motion.div
                    key={vouch.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {(vouch.voucher?.email?.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{vouch.voucher?.email || 'Anonymous'}</p>
                      <p className="text-xs text-muted-foreground">Vouched for your reliability</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                        +{vouch.weight}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-3xl border bg-gradient-to-r from-primary to-violet-600 dark:from-primary dark:to-violet-700 p-8 text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold">Level Up Your Reputation</h3>
              <p className="text-sm opacity-80 max-w-lg">
                Complete these steps to increase your trust score and unlock the next tier.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Complete verification', done: business.is_verified },
                  { label: 'Get 3 vouches', done: (recentVouches?.length || 0) >= 3 },
                  { label: 'Add description', done: !!business.description },
                ].map((step, i) => (
                  <div key={i} className={`inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full ${step.done ? 'bg-white/20' : 'bg-black/20'}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${step.done ? 'opacity-100' : 'opacity-40'}`} />
                    <span className={step.done ? 'line-through opacity-70' : ''}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <div className="text-5xl font-bold opacity-20">
                {business.tier === 'GOLD' ? '★' : business.tier === 'SILVER' ? '◈' : '◆'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
