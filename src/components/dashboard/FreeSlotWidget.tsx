"use client";

import { ArrowRight, Leaf } from "lucide-react";

export function FreeSlotWidget() {
  return (
    <div className="bg-[#0A0A0C] border border-[#1A1A24] rounded-2xl p-5 shadow-lg h-[160px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-zinc-300">Free Slot</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400">Today</span>
      </div>
      
      <div className="flex justify-between items-end mt-1">
        <span className="text-lg font-bold">12:10 PM - 02:00 PM</span>
        <span className="text-sm font-medium text-zinc-400">1 hr 50 min</span>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <Leaf className="w-3 h-3 text-emerald-400" />
        <span className="text-[10px] text-emerald-400 font-medium">Best time for Deep Work</span>
      </div>

      <button className="flex items-center justify-center gap-2 w-full py-2 mt-4 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all">
        Plan Session
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
