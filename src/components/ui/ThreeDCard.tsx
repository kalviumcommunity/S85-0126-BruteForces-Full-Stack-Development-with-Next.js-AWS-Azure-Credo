'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ThreeDCardProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rotationIntensity?: number;
}

export function ThreeDCard({ children, className, containerClassName, rotationIntensity = 15 }: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springConfig = { damping: 20, stiffness: 200, mass: 0.1 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [rotationIntensity, -rotationIntensity]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-rotationIntensity, rotationIntensity]), springConfig);

  return (
    <div className={cn('flex items-center justify-center', containerClassName)} style={{ perspective: '1200px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('relative transition-shadow duration-300 group', className)}
      >
        <div style={{ transform: 'translateZ(40px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function CardContent({ children, className, translateZ = 50 }: { children: React.ReactNode; className?: string; translateZ?: number }) {
  return (
    <div className={cn('w-full', className)} style={{ transform: `translateZ(${translateZ}px)` }}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-card text-card-foreground border h-full w-full p-6 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300', className)}>
      {children}
    </div>
  );
}
