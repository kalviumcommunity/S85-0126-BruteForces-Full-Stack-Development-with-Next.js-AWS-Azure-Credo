'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-8 relative z-10 max-w-md"
      >
        <div className="mx-auto w-20 h-20 rounded-3xl bg-destructive/10 text-destructive flex items-center justify-center">
          <ShieldX className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <p className="text-xl text-muted-foreground">
            This page doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Link href="/">
          <Button size="lg" className="gap-2 rounded-xl h-12 px-8">
            <ArrowLeft className="w-4 h-4" /> Return Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
