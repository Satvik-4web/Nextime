"use client";

import { Play, Maximize2, PenLine, Clock, Target, BarChart2 } from "lucide-react";

export function StudyWidget() {
  return (
    <div className="relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden h-[340px] shadow-[0_0_30px_rgba(30,30,80,0.5)] border border-[#2D2D4A]/50 group">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1123] to-[#0A0B14] z-0" />
      <div className="absolute inset-0 bg-[#252554] opacity-20 blur-[60px] rounded-full transform -translate-y-1/2 scale-150 z-0" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center w-full">
        <span className="text-xs font-bold text-zinc-300 tracking-wide">Study Session</span>
        <button className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <Maximize2 className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </div>

      {/* Main Timer Area */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-300">Deep Work</span>
          <PenLine className="w-3.5 h-3.5 text-zinc-500" />
        </div>
        
        <span className="text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tabular-nums">
          45:00
        </span>
        
        <button className="mt-6 flex items-center justify-center gap-2 bg-[#2D1B69] hover:bg-[#3D2B79] border border-[#4D3B89] w-full max-w-[200px] py-3 rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)]">
          <Play className="w-4 h-4 fill-current" />
          Start
        </button>
      </div>

      {/* Presets */}
      <div className="relative z-10 grid grid-cols-3 gap-2 mt-4 text-center border-t border-white/5 pt-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 mb-1">Focus</span>
          <span className="text-xs font-bold">45 <span className="text-[10px] font-normal text-zinc-500">min</span></span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 mb-1">Short Break</span>
          <span className="text-xs font-bold">10 <span className="text-[10px] font-normal text-zinc-500">min</span></span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-400 mb-1">Long Break</span>
          <span className="text-xs font-bold">20 <span className="text-[10px] font-normal text-zinc-500">min</span></span>
        </div>
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
