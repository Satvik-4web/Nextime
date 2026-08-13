"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export function BootTransition({ children }: Props) {
  const { bootPhase, setBootPhase, completeBoot, hasCompletedBoot } = useAppStore();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If user prefers reduced motion or already booted, skip sequence
    if (prefersReducedMotion || hasCompletedBoot) {
      if (!hasCompletedBoot) completeBoot();
      return;
    }

    // Phase 1 is initial state (0ms)
    setBootPhase(1);

    const timeline = [
      { phase: 2, delay: 300 },   // System Wakes (Point of light)
      { phase: 3, delay: 600 },   // Widgets Materialize
      { phase: 4, delay: 1400 },  // Spatial Assembly
      { phase: 5, delay: 2000 },  // System Synchronization (Pulse)
      { phase: 6, delay: 2300 },  // NexTime Title Moment
      { phase: 7, delay: 3000 },  // Title Transition
      { phase: 8, delay: 3500 },  // Complete
    ];

    const timeouts = timeline.map(({ phase, delay }) =>
      setTimeout(() => {
        if (phase === 8) {
          completeBoot();
        } else {
          setBootPhase(phase);
        }
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [prefersReducedMotion, hasCompletedBoot, setBootPhase, completeBoot]);

  if (hasCompletedBoot) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden">
      {/* 
        The Dashboard Children (widgets) are always rendered underneath, 
        but their internal BootWidget wrappers control their opacity/position based on bootPhase 
      */}
      {children}

      <AnimatePresence>
        {/* Phase 1-5: The Void & Point of Light Overlay */}
        {bootPhase >= 1 && bootPhase <= 5 && (
          <motion.div
            key="void-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: bootPhase >= 3 ? 0 : 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-40 bg-[#020202] flex items-center justify-center pointer-events-none"
          >
            {/* Ambient Noise / Particles (CSS based for performance) */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("/noise.png")' }} />

            {/* Phase 2: Cinematic Anamorphic Bloom */}
            {bootPhase >= 2 && (
              <motion.div
                initial={{ scaleX: 0, scaleY: 0, opacity: 0 }}
                animate={{ 
                  scaleX: [0, 40, 0], 
                  scaleY: [0, 1, 0], 
                  opacity: [0, 1, 0] 
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="w-10 h-1 bg-white rounded-full shadow-[0_0_80px_20px_rgba(255,255,255,0.8),0_0_200px_40px_rgba(147,197,253,0.4)]"
              />
            )}
          </motion.div>
        )}

        {/* Phase 5: System Sync Pulse (sweeps horizontally across interface) */}
        {bootPhase === 5 && (
          <motion.div
            key="sync-pulse"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "200%", opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-y-0 w-1/2 z-30 pointer-events-none mix-blend-overlay"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
            }}
          />
        )}

        {/* Phase 6 & 7: NexTime Title Screen Overlay */}
        {bootPhase >= 6 && bootPhase <= 7 && (
          <motion.div
            key="title-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 z-50 bg-[#020202]/70 flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ filter: "blur(20px)", scale: 1.1, opacity: 0 }}
              animate={
                bootPhase === 6 
                  ? { filter: "blur(0px)", scale: 1, opacity: 1 } 
                  : { scale: 0.9, y: -40, opacity: 0, filter: "blur(10px)" } // Phase 7 shrinks/fades
              }
              transition={{ 
                duration: bootPhase === 6 ? 0.8 : 0.5, 
                ease: [0.16, 1, 0.3, 1] // Super smooth custom bezier
              }}
              className="flex flex-col items-center"
            >
              <h1 className="text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                NexTime
              </h1>
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent mt-5 mb-4"
              />
              <motion.p
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                className="text-[10px] tracking-[0.4em] font-bold text-zinc-400 uppercase"
              >
                Smart Student OS
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
