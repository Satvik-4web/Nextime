"use client";

import { useAppStore } from "@/stores/useAppStore";
import { Play, Pause, RotateCcw, ArrowLeft, PenLine } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { LofiPlayer } from "@/components/dashboard/LofiPlayer";

export default function StudyPage() {
  const { timeLeft, timerDuration, isTimerRunning, timerMode, toggleTimer, setTimerMode, resetTimer, setCustomDuration } = useAppStore();
  
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editValue, setEditValue] = useState("");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getModeLabel = () => {
    switch (timerMode) {
      case 'focus': return 'Deep Work';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  const progress = timerDuration > 0 ? ((timerDuration - timeLeft) / timerDuration) * 100 : 0;
  // Circumference for r=180 is 2 * Math.PI * 180 = ~1131
  const CIRCUMFERENCE = 1131;
  const strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  const handleTimeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const mins = parseInt(editValue);
    if (!isNaN(mins) && mins > 0 && mins <= 180) {
      setCustomDuration(mins);
    }
    setIsEditingTime(false);
  };

  const openEditor = () => {
    if (isTimerRunning) return;
    setEditValue(Math.floor(timeLeft / 60).toString());
    setIsEditingTime(true);
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-[#050505] overflow-hidden selection:bg-primary/30">
      
      {/* Dynamic Ambient Background */}
      <div 
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-[3000ms] ease-in-out pointer-events-none",
          isTimerRunning ? "opacity-100" : "opacity-30"
        )}
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[150px] mix-blend-screen animate-blob" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
          <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[80%] rounded-full bg-purple-600/20 blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
        </div>

        {/* Central Breathing glow behind timer */}
        <div 
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] transition-all duration-[4000ms] ease-in-out bg-primary/10",
            isTimerRunning ? "scale-125 opacity-70 animate-pulse" : "scale-100 opacity-20"
          )}
        />
      </div>

      <LofiPlayer />

      {/* Top Nav */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-bold">Back to Dashboard</span>
        </Link>
      </motion.div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 flex flex-col items-center mt-8"
      >
        
        {/* Mode Label */}
        <div className="mb-8">
          <span className="text-sm font-bold tracking-[0.2em] uppercase px-6 py-2 rounded-full border backdrop-blur-md shadow-2xl transition-colors text-primary border-primary/20 bg-primary/10">
            DEEP WORK
          </span>
        </div>

        {/* Circular Timer HUD */}
        <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px] flex items-center justify-center mt-6 mb-8">
          {/* Multi-layered SVG HUD */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90 pointer-events-none drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]" viewBox="0 0 400 400">
            {/* Outer Decorative Track */}
            <circle cx="200" cy="200" r="195" fill="transparent" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="4 8" className="animate-[spin_60s_linear_infinite]" />
            
            {/* Background Main Track */}
            <circle cx="200" cy="200" r="180" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            
            {/* Animated Main Progress */}
            <circle 
              cx="200" cy="200" r="180" 
              fill="transparent" 
              stroke="#8B5CF6"
              strokeWidth="6" 
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 linear drop-shadow-[0_0_20px_rgba(139,92,246,0.6)]"
            />

            {/* Inner Decorative Track */}
            <circle cx="200" cy="200" r="165" fill="transparent" stroke="rgba(139,92,246,0.1)" strokeWidth="2" strokeDasharray="1 15" strokeLinecap="round" className="animate-[spin_40s_linear_infinite_reverse]" />
          </svg>

          {/* Time Text */}
          <div className="flex flex-col items-center justify-center z-10">
            {isEditingTime ? (
              <form onSubmit={handleTimeSubmit} className="flex flex-col items-center">
                <input 
                  type="number" 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleTimeSubmit}
                  autoFocus
                  min="1"
                  max="180"
                  className="bg-transparent text-[90px] md:text-[110px] font-black tracking-tighter text-white tabular-nums leading-none text-center outline-none w-48 drop-shadow-2xl border-b-2 border-primary/50 placeholder:text-white/20"
                  placeholder="45"
                />
              </form>
            ) : (
              <button 
                onClick={openEditor}
                disabled={isTimerRunning}
                className={cn(
                  "group relative text-[90px] md:text-[110px] font-black tracking-tighter text-white tabular-nums leading-none drop-shadow-2xl transition-all",
                  !isTimerRunning && "hover:text-primary cursor-pointer hover:scale-105"
                )}
              >
                {formatTime(timeLeft)}
                {!isTimerRunning && (
                  <PenLine className="absolute -right-12 top-1/2 -translate-y-1/2 w-8 h-8 opacity-0 group-hover:opacity-100 text-primary transition-all duration-300" />
                )}
              </button>
            )}
            <span className="text-zinc-500 font-medium tracking-widest mt-1 uppercase text-xs">
              {isEditingTime ? "Enter Minutes" : "Remaining"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Main Actions */}
          <div className="flex items-center gap-8">
            <button 
              onClick={resetTimer}
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all hover:-rotate-45 shadow-lg backdrop-blur-sm"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={toggleTimer}
              className="w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all group shadow-[0_0_40px_rgba(139,92,246,0.4)] bg-primary/20 hover:bg-primary/30 border-primary text-primary backdrop-blur-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500 rounded-full" />
              {isTimerRunning ? (
                <Pause className="w-10 h-10 fill-current relative z-10" />
              ) : (
                <Play className="w-10 h-10 fill-current relative z-10 translate-x-1" />
              )}
            </motion.button>

            <div className="w-[58px]" /> {/* Spacer for balance */}
          </div>
        </motion.div>

      </motion.div>
    </main>
  );
}
