'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  LayoutDashboard,
  LogIn,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { ModeToggle } from '@/components/ui/theme-toggle';

/* ── Dock Icon ── */
function DockIcon({
  mouseX,
  icon: Icon,
  path,
  label,
  isActive,
}: {
  mouseX: any;
  icon: any;
  path: string;
  label: string;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-200, 0, 200], [44, 64, 44]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 200, damping: 15 });

  return (
    <Link href={path} className="relative group">
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        className={cn(
          'rounded-2xl flex items-center justify-center transition-colors duration-200 relative',
          isActive
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
            : 'bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground'
        )}
      >
        <Icon className="w-5 h-5" />

        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="nav-dot"
            className="absolute -bottom-1.5 w-1 h-1 bg-primary rounded-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl scale-90 group-hover:scale-100">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-foreground rotate-45" />
        </div>
      </motion.div>
    </Link>
  );
}

/* ── Main Navbar ── */
export function FloatingNavbar() {
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Explore', path: '/search', icon: Search },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <>
      {/* ── Desktop Dock ── */}
      <motion.header
        initial={{ y: -20, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 z-50 hidden md:block"
      >
        <motion.nav
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex items-center gap-2 p-2.5 rounded-full glass-strong shadow-xl shadow-indigo-500/5 dark:shadow-black/20 ring-1 ring-slate-200 dark:ring-slate-800 px-4"
        >
          {/* Logo */}
          <Link href="/" className="mr-2 flex items-center justify-center gap-2 pr-3 border-r border-border">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm tracking-tight hidden lg:block">Credo</span>
          </Link>

          {/* Icons */}
          {links.map((item) => (
            <DockIcon
              key={item.path}
              mouseX={mouseX}
              {...item}
              label={item.name}
              isActive={pathname === item.path}
            />
          ))}

          {/* Actions */}
          <div className="flex items-center gap-2 pl-3 border-l border-border ml-2">
            <ModeToggle />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
            >
              Sign In
              <Sparkles className="w-3 h-3" />
            </Link>
          </div>
        </motion.nav>
      </motion.header>

      {/* ── Mobile Bar ── */}
      <header className="fixed top-0 inset-x-0 z-50 md:hidden p-3">
        <div className="flex items-center justify-between glass-strong rounded-2xl px-4 py-3 shadow-xl">
          <Link href="/" className="flex items-center gap-2.5 font-bold">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span>Credo</span>
          </Link>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mt-2 glass-strong rounded-2xl shadow-2xl overflow-hidden"
            >
              <nav className="p-2 space-y-1">
                {links.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium',
                      pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-foreground text-background py-3 rounded-xl font-semibold text-sm"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
