"use client";

import { Play, Pause, Maximize2, PenLine, Clock, Target, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

export function StudyWidget() {
  const { timeLeft, isTimerRunning, timerMode, toggleTimer, setTimerMode } = useAppStore();

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
  return (
    <div className="relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden h-[340px] shadow-[0_0_30px_rgba(30,30,80,0.5)] border border-[#2D2D4A]/50 group">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1123] to-[#0A0B14] z-0" />
      <div className="absolute inset-0 bg-[#252554] opacity-20 blur-[60px] rounded-full transform -translate-y-1/2 scale-150 z-0" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center w-full mb-2">
        <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">Study Session</span>
        <Link href="/study" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
        </Link>
      </div>

      {/* Main Timer Area */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-300">{getModeLabel()}</span>
          <PenLine className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        
        <span className="text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tabular-nums">
          {formatTime(timeLeft)}
        </span>
        
        <button 
          onClick={toggleTimer}
          className="mt-6 flex items-center justify-center gap-2 bg-[#2D1B69] hover:bg-[#3D2B79] border border-[#4D3B89] w-full max-w-[200px] py-3 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isTimerRunning ? "Pause" : "Start"}
        </button>
      </div>

      {/* Presets */}
      <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 text-center border-t border-white/5 pt-4">
        <button 
          onClick={() => setTimerMode('focus')}
          className={cn("flex flex-col items-center transition-colors", timerMode === 'focus' ? "text-primary" : "text-zinc-400 hover:text-white")}
        >
          <span className="text-[10px] mb-1">Focus</span>
          <span className="text-xs font-bold text-white">45 <span className="text-[10px] font-normal text-zinc-500">min</span></span>
        </button>
        <button 
          onClick={() => setTimerMode('shortBreak')}
          className={cn("flex flex-col items-center transition-colors", timerMode === 'shortBreak' ? "text-primary" : "text-zinc-400 hover:text-white")}
        >
          <span className="text-[10px] mb-1">Short Break</span>
          <span className="text-xs font-bold text-white">10 <span className="text-[10px] font-normal text-zinc-500">min</span></span>
        </button>
        <button 
          onClick={() => setTimerMode('longBreak')}
          className={cn("flex flex-col items-center transition-colors", timerMode === 'longBreak' ? "text-primary" : "text-zinc-400 hover:text-white")}
        >
          <span className="text-[10px] mb-1">Long Break</span>
          <span className="text-xs font-bold text-white">20 <span className="text-[10px] font-normal text-zinc-500">min</span></span>
        </button>
      </div>

      {/* Footer Icons */}
      <div className="relative z-10 flex justify-between items-center mt-4 px-6 opacity-60">
        <Clock className="w-4 h-4 text-[#8B5CF6]" />
        <Target className="w-4 h-4" />
        <BarChart2 className="w-4 h-4" />
      </div>
    </div>
  );
}
