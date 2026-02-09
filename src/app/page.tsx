'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Shield,
  Users,
  CheckCircle2,
  Zap,
  Globe,
  Lock,
  Star,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

/* ── Fade-in wrapper ── */
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Floating 3D orb ── */
function FloatingOrb({ className }: { className: string }) {
  return (
    <div className={`absolute rounded-full pointer-events-none ${className}`} />
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    {
      icon: Shield,
      title: 'Verified Trust Scores',
      description: 'Every vouch is cryptographically weighted. No fake reviews, no bots — only real community validation.',
      gradient: 'from-violet-500/20 to-purple-500/20',
      iconColor: 'text-violet-600 dark:text-violet-400',
      size: 'md:col-span-2',
    },
    {
      icon: Users,
      title: 'Community Powered',
      description: 'Your reputation is built by real neighbors who know your work firsthand.',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      size: '',
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Get verified in minutes. Share your trust badge across any platform.',
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-600 dark:text-amber-400',
      size: '',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'You control what\'s public. Granular privacy settings for every data point.',
      gradient: 'from-emerald-500/20 to-green-500/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      size: '',
    },
    {
      icon: Globe,
      title: 'Transparent Trust Graph',
      description: 'See the full chain of trust. Who vouched for whom, and how strong each connection is.',
      gradient: 'from-rose-500/20 to-pink-500/20',
      iconColor: 'text-rose-600 dark:text-rose-400',
      size: 'md:col-span-2',
    },
  ];

  const stats = [
    { value: '2,400+', label: 'Verified Businesses' },
    { value: '12,000+', label: 'Community Vouches' },
    { value: '98%', label: 'Trust Accuracy' },
    { value: '4.9', label: 'User Satisfaction' },
  ];

  const marqueeItems = [
    'Alpine Coffee Roasters', 'Metro Web Studio', 'Sunrise Bakery', 'Patel & Associates',
    'Green Valley Farm', 'Luna Design Co.', 'River City Hardware', 'Bright Smile Dental',
    'Oak Street Books', 'Pearl Auto Care', 'Summit Fitness', 'Cedar Lane Flowers',
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/* ══════════════════ HERO ══════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-20">
        {/* Background effects */}
        <FloatingOrb className="w-[600px] h-[600px] bg-primary/15 blur-[150px] top-1/4 -left-48 animate-glow" />
        <FloatingOrb className="w-[400px] h-[400px] bg-violet-400/10 blur-[120px] bottom-1/4 -right-32 animate-glow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] animate-grid-fade" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Chip */}
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium shadow-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Now in public beta
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.1}>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-8">
              <span className="text-gradient">Build Trust.</span>
              <br />
              <span className="text-foreground">Not Paperwork.</span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.2}>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10">
              The community-powered reputation platform that lets local businesses prove their
              excellence through real neighbor vouches — not anonymous reviews.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-13 px-8 rounded-xl text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/search">
                <Button size="lg" variant="outline" className="h-13 px-8 rounded-xl text-base gap-2">
                  Explore Businesses <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          {/* Hero Visual - 3D Card Preview */}
          <FadeIn delay={0.5} className="mt-16 md:mt-20">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
              <div className="relative bg-card border rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden p-1">
                <div className="bg-muted/30 rounded-2xl p-8 space-y-6">
                  {/* Mock Dashboard header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="h-3 w-32 bg-foreground/10 rounded-full" />
                        <div className="h-2 w-20 bg-foreground/5 rounded-full mt-2" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-20 bg-primary/10 rounded-lg" />
                      <div className="h-8 w-8 bg-muted rounded-lg" />
                    </div>
                  </div>
                  {/* Mock stat cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {['92', '128', 'Gold'].map((val, i) => (
                      <div key={i} className="bg-background rounded-xl p-4 border shadow-sm">
                        <div className="text-2xl font-bold text-gradient">{val}</div>
                        <div className="h-2 w-16 bg-foreground/5 rounded-full mt-2" />
                      </div>
                    ))}
                  </div>
                  {/* Mock activity rows */}
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 bg-background rounded-xl p-3 border">
                        <div className="h-8 w-8 rounded-full bg-primary/10" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-2.5 w-28 bg-foreground/10 rounded-full" />
                          <div className="h-2 w-40 bg-foreground/5 rounded-full" />
                        </div>
                        <div className="h-6 w-12 bg-emerald-500/10 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </motion.div>
      </section>

      {/* ══════════════════ STATS BAR ══════════════════ */}
      <section className="relative py-16 border-y bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ BENTO FEATURES ══════════════════ */}
      <section className="py-24 md:py-32 relative">
        <FloatingOrb className="w-[500px] h-[500px] bg-primary/10 blur-[150px] top-0 right-0" />

        <div className="container px-4 md:px-6 relative z-10">
          <FadeIn className="text-center mb-16 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-6">
              <Star className="w-3 h-3" /> Features
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to <span className="text-gradient">build trust</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              A complete toolkit for establishing verifiable community reputation.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.08} className={feature.size}>
                <div className="group relative h-full overflow-hidden rounded-3xl border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Gradient bg on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 flex flex-col h-full gap-4">
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-background border shadow-sm ${feature.iconColor}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-1">{feature.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ MARQUEE SOCIAL PROOF ══════════════════ */}
      <section className="py-20 border-y bg-muted/10 overflow-hidden">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
            <CheckCircle2 className="w-3 h-3" /> Verified Network
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Trusted by <span className="text-gradient">thousands</span> of local businesses
          </h2>
        </FadeIn>

        {/* Row 1 - left scroll */}
        <div className="flex gap-4 mb-4">
          <div className="animate-marquee flex gap-4 shrink-0">
            {marqueeItems.map((name, i) => (
              <div key={i} className="inline-flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm hover:shadow-md transition-shadow whitespace-nowrap">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                  {name.charAt(0)}
                </div>
                <span className="font-semibold text-sm">{name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            ))}
          </div>
          <div className="animate-marquee flex gap-4 shrink-0" aria-hidden>
            {marqueeItems.map((name, i) => (
              <div key={i} className="inline-flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm whitespace-nowrap">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary">
                  {name.charAt(0)}
                </div>
                <span className="font-semibold text-sm">{name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - right scroll */}
        <div className="flex gap-4">
          <div className="animate-marquee-reverse flex gap-4 shrink-0">
            {[...marqueeItems].reverse().map((name, i) => (
              <div key={i} className="inline-flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm whitespace-nowrap">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">
                  {name.charAt(0)}
                </div>
                <span className="font-semibold text-sm">{name}</span>
              </div>
            ))}
          </div>
          <div className="animate-marquee-reverse flex gap-4 shrink-0" aria-hidden>
            {[...marqueeItems].reverse().map((name, i) => (
              <div key={i} className="inline-flex items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-sm whitespace-nowrap">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400">
                  {name.charAt(0)}
                </div>
                <span className="font-semibold text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA SECTION ══════════════════ */}
      <section className="py-24 md:py-32 relative">
        <FloatingOrb className="w-[600px] h-[600px] bg-primary/15 blur-[150px] bottom-0 left-1/2 -translate-x-1/2" />

        <FadeIn className="relative z-10">
          <div className="container max-w-3xl px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to build your <span className="text-gradient">reputation</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of local businesses already using Credo to prove their
              trustworthiness — for free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="h-13 px-10 rounded-xl text-base gap-2 shadow-lg shadow-primary/20">
                  Start Building Trust <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="border-t bg-muted/20 py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold">Credo</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Rebuilding trust in the digital age through transparent, community-powered verification.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">Product</h4>
              <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold">Company</h4>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Credo. All rights reserved.</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
