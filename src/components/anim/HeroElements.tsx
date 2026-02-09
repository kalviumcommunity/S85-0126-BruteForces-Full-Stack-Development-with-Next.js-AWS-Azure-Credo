"use client";

import { motion } from "framer-motion";

export const ParallaxText = ({ children, baseVelocity: _baseVelocity = 100 }: { children: string; baseVelocity?: number }) => {
  // Simple implementation for demo - usually requires complex resize handling
  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="font-bold text-6xl uppercase flex whitespace-nowrap flex-nowrap" style={{ x: 0 }}>
        <span className="block mr-8 opacity-10">{children} </span>
        <span className="block mr-8 opacity-10">{children} </span>
        <span className="block mr-8 opacity-10">{children} </span>
        <span className="block mr-8 opacity-10">{children} </span>
      </motion.div>
    </div>
  );
}

export const Hero3DElement = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="absolute right-0 top-0 -z-10 aspect-square w-[500px] rounded-full bg-gradient-to-tr from-primary/30 to-purple-500/30 blur-3xl filter"
            style={{
                perspective: 1000
            }}
        >
             <motion.div
                animate={{ 
                    rotateY: [0, 360],
                    rotateX: [0, 10, 0, -10, 0]
                }}
                transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
                className="w-full h-full rounded-full border border-white/10"
             />
        </motion.div>
    )
}
