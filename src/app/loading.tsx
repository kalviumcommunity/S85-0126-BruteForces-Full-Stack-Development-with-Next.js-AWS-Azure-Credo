'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20"
        >
          <ShieldCheck className="w-7 h-7" />
        </motion.div>
        <div className="space-y-2 text-center">
          <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Loading</p>
        </div>
      </motion.div>
    </div>
  );
}
