'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ThreeDCard, CardBody, CardContent } from '@/components/ui/ThreeDCard';
import { ShieldCheck } from 'lucide-react';

const DUMMY_BUSINESSES = [
  { id: 1, name: 'Apex Logistics', score: 98, tier: 'GOLD', desc: 'Premium freight solutions.' },
  { id: 2, name: 'Stark Industries', score: 100, tier: 'GOLD', desc: 'Future tech today.' },
  { id: 3, name: 'Mom & Pop Corner', score: 45, tier: 'BRONZE', desc: 'Local groceries & goods.' },
  { id: 4, name: 'Cyberdyne Systems', score: 88, tier: 'SILVER', desc: 'AI research lab.' }, 
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Hero Text Animations
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textBlur = useTransform(scrollYProgress, [0, 0.3], [0, 10]);

  // Card Grid Animations
  const gridY = useTransform(scrollYProgress, [0, 0.5], [100, -50]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <div ref={containerRef} className="relative min-h-[150vh] bg-slate-50 overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-slate-100 -z-10" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Sticky Content Wrapper */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center pt-20 px-4">
        
        {/* Animated Hero Text */}
        <motion.div 
          style={{ scale: textScale, opacity: textOpacity, filter: typeof textBlur === 'number' ? `blur(${textBlur}px)` : undefined }} 
          className="text-center max-w-4xl z-10 mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-slate-900 mb-6 drop-shadow-sm">
                Trust is <span className="text-blue-600">Currency</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                The world's first decentralized reputation protocol for verifiable business integrity.
            </p>
          </motion.div>
        </motion.div>

        {/* 3D Card Grid - Enters as you scroll or immediately floating */}
        <motion.div 
          style={{ y: gridY, opacity: gridOpacity }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl perspective-1000"
        >
            {DUMMY_BUSINESSES.map((biz, i) => (
                <motion.div
                    key={biz.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (i * 0.1), duration: 0.8 }}
                >
                    <ThreeDCard className="w-full h-auto min-h-[250px] cursor-pointer" containerClassName="py-2">
                        <CardBody className="bg-white/80 backdrop-blur border-white/40 hover:border-blue-500/50 transition-colors">
                            <CardContent translateZ={40} className="mb-4">
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-lg ${biz.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'}`}>
                                        <ShieldCheck size={24} />
                                    </div>
                                    <span className="text-4xl font-bold text-slate-800 tracking-tighter">{biz.score}</span>
                                </div>
                            </CardContent>
                            
                            <CardContent translateZ={30}>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{biz.name}</h3>
                                <p className="text-sm text-slate-500">{biz.desc}</p>
                            </CardContent>

                            <CardContent translateZ={20} className="mt-6 flex gap-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500 w-[80%]" />
                                </div>
                            </CardContent>
                        </CardBody>
                    </ThreeDCard>
                </motion.div>
            ))}
        </motion.div>
      </div>

      <div className="h-screen"></div> {/* Spacer for scroll feel */}
    </div>
  );
}
