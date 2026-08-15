"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppStore } from "@/stores/useAppStore";
import { ChevronRight, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { playFuturisticSound } from "@/lib/audio";
import { Footer } from "@/components/navigation/Footer";

export default function LandingPage() {
  const router = useRouter();
  // 0: intro graphics, 1: text reveal, 2: year select, 3: batch select, 4: launching
  const [phase, setPhase] = useState(0); 
  
  const { allBatches, loadTimetables, setSelectedBatch, selectedBatch } = useAppStore();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<"Vision" | "Features" | "Install OS" | null>(null);

  // Load timetables data on mount so batches are available
  useEffect(() => {
    loadTimetables();
  }, [loadTimetables]);

  // Skip setup if already has batch? Actually, if they visit landing page, let them restart or go straight to dashboard.
  // If they click "Explore OS", we'll check if they already have a batch. 
  // If yes, jump to phase 4 (launch). If no, go to phase 2 (setup).

  useEffect(() => {
    // Initial boot sound
    playFuturisticSound('boot');
    
    // Check if coming from dashboard change batch
    if (window.location.search.includes('setup=true')) {
      setPhase(2);
      return;
    }

    const t1 = setTimeout(() => {
      setPhase(1);
    }, 2500); 
    return () => clearTimeout(t1);
  }, []);

  const handleExploreClick = () => {
    if (selectedBatch) {
      setPhase(4);
      playFuturisticSound('warp');
      setTimeout(() => router.push("/dashboard"), 800);
    } else {
      setPhase(2);
    }
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setPhase(3);
  };

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
    setPhase(4);
    playFuturisticSound('warp');
    setTimeout(() => router.push("/dashboard"), 1200);
  };

  // Derive unique years from batch names (assuming first char is the year, e.g. "1A1", "2C82")
  const availableYears = useMemo(() => {
    const years = new Set(allBatches.map(b => b.charAt(0)));
    return Array.from(years).filter(y => !isNaN(parseInt(y))).sort();
  }, [allBatches]);

  // Filter batches by selected year
  const filteredBatches = useMemo(() => {
    if (!selectedYear) return [];
    return allBatches.filter(b => b.charAt(0) === selectedYear).sort();
  }, [allBatches, selectedYear]);

  return (
    <div className="relative min-h-[100dvh] bg-[#020202] overflow-x-hidden font-sans text-white selection:bg-blue-500/30 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-screen w-full">
        
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000" style={{ opacity: phase >= 2 ? 0.3 : 1 }}>
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        </div>

      {/* Navbar (Appears in Phase 1) */}
      <AnimatePresence>
        {(phase === 1 || phase === 2 || phase === 3) && (
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-0 w-full px-8 py-6 flex justify-between items-center z-50"
          >
            <div className="font-bold text-xl tracking-tight text-white flex items-center gap-3">
              <Image 
                src="/logo.jpg" 
                alt="NexTime Logo" 
                width={28} 
                height={28} 
                className="w-7 h-7 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
              />
              NexTime
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold text-zinc-300">
              <button 
                onClick={() => setActiveModal("Vision")}
                className="hover:text-white transition-colors"
              >
                Vision
              </button>
              <button 
                onClick={() => setActiveModal("Features")}
                className="hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => setActiveModal("Install OS")}
                className="hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10"
              >
                Install OS
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Abstract Intro Graphics ("JS Graphics") - Only show in phase 0/1 */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden"
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1 }}
          >
            {/* Background Radial Tech Grid */}
            <motion.div 
              className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"
              style={{ maskImage: "radial-gradient(circle at center, black 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(circle at center, black 20%, transparent 70%)" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase === 0 ? 1 : 0.3, scale: phase === 0 ? 1 : 1.1 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />

            {/* Abstract Timetable Grid Wireframe */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)", x: 200, y: 20 }}
              animate={phase === 0 ? { opacity: 1, scale: 1, filter: "blur(0px)", x: 300, y: 40 } : { opacity: 0, scale: 1.1, filter: "blur(20px)", x: 400, y: -50 }}
              transition={{ duration: phase === 0 ? 1.5 : 0.4, ease: "easeOut" }}
            >
              <div className="relative w-[500px] h-[300px] border border-white/10 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent p-6 shadow-[0_0_50px_rgba(37,99,235,0.1)] overflow-hidden">
                <motion.div 
                  className="absolute top-4 left-4 text-[9px] font-mono tracking-widest text-blue-400 uppercase flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded backdrop-blur-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  [SYS.TIMETABLE_MATRIX]
                </motion.div>
                
                <motion.div 
                  className="absolute left-0 right-0 h-[1px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                  initial={{ top: "-10%" }}
                  animate={{ top: "110%" }}
                  transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                />
                
                <div className="flex gap-4 h-full mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-3 relative border-r border-white/5 last:border-r-0 pr-4">
                      {i === 1 && (
                        <motion.div 
                          className="absolute top-[20%] w-full h-[40%] bg-gradient-to-b from-blue-500/20 to-blue-600/5 border border-blue-500/30 rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.15)] backdrop-blur-md"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "40%", opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        />
                      )}
                      {i === 3 && (
                        <motion.div 
                          className="absolute top-[50%] w-full h-[30%] bg-gradient-to-b from-purple-500/20 to-purple-600/5 border border-purple-500/30 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "30%", opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Abstract Attendance Rings */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)", x: -200, y: -40 }}
              animate={phase === 0 ? { opacity: 1, scale: 1, filter: "blur(0px)", x: -350, y: -60 } : { opacity: 0, scale: 0.8, filter: "blur(20px)", x: -450, y: -150 }}
              transition={{ duration: phase === 0 ? 1.5 : 0.4, ease: "easeOut" }}
            >
              <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                <motion.div 
                  className="absolute top-0 left-0 text-[9px] font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded backdrop-blur-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  [ATTENDANCE.CORE]
                </motion.div>

                <motion.svg width="200" height="200" className="absolute" animate={{ rotate: -360 }} transition={{ duration: 20, ease: "linear", repeat: Infinity }}>
                  <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" strokeDasharray="10 10" />
                </motion.svg>
                
                <svg width="240" height="240" className="absolute -rotate-90 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <circle cx="120" cy="120" r="110" stroke="rgba(255,255,255,0.02)" strokeWidth="12" fill="none" />
                  <motion.circle
                    cx="120"
                    cy="120"
                    r="110"
                    stroke="url(#greenGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="691.15"
                    initial={{ strokeDashoffset: 691.15 }}
                    animate={{ strokeDashoffset: 691.15 * 0.25 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4ade80" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <motion.div 
                  className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] flex items-center justify-center backdrop-blur-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, type: "spring" }}
                >
                  <div className="w-8 h-8 rounded-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-pulse" />
                </motion.div>
              </div>
            </motion.div>

            {/* Abstract Assignments Checklist */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)", x: -150, y: 150 }}
              animate={phase === 0 ? { opacity: 1, scale: 1, filter: "blur(0px)", x: -250, y: 180 } : { opacity: 0, scale: 0.9, filter: "blur(20px)", x: -350, y: 250 }}
              transition={{ duration: phase === 0 ? 1.5 : 0.4, ease: "easeOut" }}
            >
              <div className="relative w-[240px] border border-orange-500/20 bg-orange-500/5 rounded-xl p-4 backdrop-blur-sm shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                <div className="text-[9px] font-mono tracking-widest text-orange-400 uppercase flex items-center gap-2 mb-4 border-b border-orange-500/20 pb-2">
                  <span className="w-1.5 h-1.5 rounded-sm bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                  [ASSIGNMENTS.SYS]
                </div>
                <div className="flex flex-col gap-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <motion.div 
                        className="w-3 h-3 border border-orange-500/50 rounded-sm"
                        initial={{ backgroundColor: "rgba(249,115,22,0)" }}
                        animate={{ backgroundColor: i === 0 ? "rgba(249,115,22,0.5)" : "rgba(249,115,22,0)" }}
                        transition={{ duration: 1, delay: 1 + i * 0.5, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <div className="h-1 bg-orange-500/20 rounded-full flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Abstract Deepwork Focus */}
            <motion.div
              className="absolute"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)", x: 100, y: -150 }}
              animate={phase === 0 ? { opacity: 1, scale: 1, filter: "blur(0px)", x: 150, y: -250 } : { opacity: 0, scale: 0.9, filter: "blur(20px)", x: 250, y: -350 }}
              transition={{ duration: phase === 0 ? 1.5 : 0.4, ease: "easeOut" }}
            >
              <div className="relative w-[200px] h-[200px] flex items-center justify-center">
                <div className="absolute top-0 text-[9px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded backdrop-blur-md z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-ping" />
                  [DEEPWORK.FOCUS]
                </div>
                <motion.div 
                  className="w-[120px] h-[120px] rounded-full border border-cyan-500/30 flex items-center justify-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                >
                  <motion.div 
                    className="w-[100px] h-[100px] rounded-full border-t-2 border-r-2 border-cyan-400/50"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  />
                  <div className="absolute font-mono text-cyan-400 text-xl font-bold blur-[0.5px]">
                    25:00
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cinematic Text & CTA (Appears in Phase 1) */}
      <AnimatePresence>
        {phase === 1 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)", y: -50 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 flex flex-col items-center text-center mt-12 w-full px-6"
          >
            <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-500 drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">
              NexTime
            </h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xs md:text-sm tracking-[0.5em] font-bold text-blue-400 mb-16 uppercase drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]"
            >
              Your Smart Student OS
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button 
                onClick={handleExploreClick}
                onMouseEnter={() => playFuturisticSound('hover')}
                className="px-8 py-3.5 rounded-full bg-[#111111] border border-white/10 text-xs font-bold tracking-widest uppercase text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Explore OS
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 2: Year Selection */}
      <AnimatePresence>
        {phase === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 flex flex-col items-center max-w-4xl w-full px-6"
          >
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)] flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Select your Academic Year</h2>
            <p className="text-zinc-400 text-sm mb-12">Initialize your OS profile by selecting your current year.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {availableYears.map((year, idx) => (
                <motion.button
                  key={year}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, type: "spring", stiffness: 80 }}
                  onClick={() => handleYearSelect(year)}
                  onMouseEnter={() => playFuturisticSound('hover')}
                  className="group relative bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/5 hover:border-blue-500/50 rounded-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-blue-900/10 shadow-lg hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:-translate-y-2 overflow-hidden"
                >
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Glowing orbital ring */}
                  <div className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(59,130,246,0.3)_360deg)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_4s_linear_infinite]" />
                  <div className="absolute inset-[1px] bg-[#0A0A0C]/90 rounded-3xl z-0" />

                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 group-hover:from-white group-hover:to-blue-400 transition-all duration-300 drop-shadow-sm mb-3">
                      {year}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-blue-300 transition-colors duration-300">
                      Year {year}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 3: Batch Selection */}
      <AnimatePresence>
        {phase === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-30 flex flex-col items-center max-w-5xl w-full px-6"
          >
            <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)] flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Select your Batch</h2>
            <p className="text-zinc-400 text-sm mb-12">Year {selectedYear} • Syncing Timetable Data...</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full max-h-[50vh] overflow-y-auto custom-scrollbar p-4 -m-4">
              {filteredBatches.map((batch, idx) => (
                <motion.button
                  key={batch}
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: (idx % 10) * 0.04, duration: 0.4, type: "spring", stiffness: 100 }}
                  onClick={() => handleBatchSelect(batch)}
                  onMouseEnter={() => playFuturisticSound('hover')}
                  className="group relative bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/5 hover:border-purple-500/50 rounded-2xl p-4 flex items-center justify-between transition-all duration-300 hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-purple-900/10 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-purple-400 group-hover:animate-pulse transition-colors shadow-[0_0_0_rgba(168,85,247,0)] group-hover:shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <span className="font-bold text-lg tracking-wide text-zinc-400 group-hover:text-white transition-colors">{batch}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300 relative z-10" />
                </motion.button>
              ))}
            </div>
            
            <button 
              onClick={() => setPhase(2)}
              className="mt-12 text-sm text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
            >
              ← Back to Year Selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 4: Warp Launch Animation */}
      <AnimatePresence>
        {phase === 4 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [0.5, 1, 100], opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-[0_0_100px_rgba(59,130,246,1)] flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-400 blur-md" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modals */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0A0A0C] border border-white/10 rounded-3xl shadow-2xl z-[101] overflow-hidden p-8"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] pointer-events-none rounded-full" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <h2 className="text-3xl font-black tracking-tight">{activeModal}</h2>
                <button 
                  onClick={() => setActiveModal(null)}
                  className="text-zinc-500 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              <div className="relative z-10">
                {activeModal === "Vision" && (
                  <div className="flex flex-col gap-6 text-zinc-300">
                    <p className="text-lg leading-relaxed font-medium text-white">
                      Built by a student, for students. NexTime strips away administrative bloat and focuses purely on what matters: your time, your grades, and your focus.
                    </p>
                    <div className="h-px w-full bg-white/10" />
                    <p className="text-sm leading-relaxed">
                      Legacy university portals are clunky, slow, and designed for administrators. We believe student software should feel like a premium operating system—fast, intuitive, and beautiful. 
                    </p>
                    <p className="text-sm leading-relaxed">
                      Our mission is to give you absolute control over your academic life through real-time data, predictive analytics, and a seamlessly connected community. Welcome to the future of student productivity.
                    </p>
                  </div>
                )}

                {activeModal === "Features" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { icon: "📅", title: "Smart Timetable", desc: "Real-time class tracking and dynamic scheduling." },
                      { icon: "📊", title: "Attendance Analytics", desc: "Safe Bunk predictive math to protect your margins." },
                      { icon: "🎯", title: "Deep Work OS", desc: "Integrated focus timers for uninterrupted study sessions." },
                      { icon: "🌐", title: "Global Community", desc: "Multiplayer forum to ask, answer, and upvote." }
                    ].map((feat, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col gap-2 hover:bg-white/10 transition-colors">
                        <div className="text-2xl mb-2">{feat.icon}</div>
                        <h3 className="font-bold text-white">{feat.title}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeModal === "Install OS" && (
                  <div className="flex flex-col items-center text-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 p-[1px] rounded-2xl">
                      <div className="w-full h-full bg-[#0A0A0C] rounded-2xl flex items-center justify-center">
                        <Image src="/logo.jpg" alt="Logo" width={48} height={48} className="rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">NexTime is a Progressive Web App</h3>
                      <p className="text-sm text-zinc-400 max-w-md mx-auto">
                        You don't need an App Store. You can install NexTime directly to your device for a native, fullscreen experience.
                      </p>
                    </div>
                    
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-left mt-2">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">iOS</div>
                          <p className="text-sm text-zinc-300">Tap <span className="text-blue-400">Share</span> at the bottom, then <span className="text-white font-bold">Add to Home Screen</span>.</p>
                        </div>
                        <div className="h-px w-full bg-white/5" />
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">And</div>
                          <p className="text-sm text-zinc-300">Tap the <span className="text-white font-bold">3 dots</span> menu, then <span className="text-white font-bold">Install App</span>.</p>
                        </div>
                        <div className="h-px w-full bg-white/5" />
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">PC</div>
                          <p className="text-sm text-zinc-300">Click the <span className="text-white font-bold">Install Icon</span> in the right side of your browser URL bar.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      </div>
      
      <Footer />
    </div>
  );
}
