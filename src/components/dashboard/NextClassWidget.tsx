"use client";

import { Video } from "lucide-react";

export function NextClassWidget() {
  return (
    <div className="bg-[#0A0A0C] border border-[#1A1A24] rounded-2xl p-5 shadow-lg h-[160px] flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-xs font-bold text-zinc-300">Next Class</span>
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
          <Video className="w-4 h-4 text-primary" />
        </button>
      </div>
      
      <div className="flex justify-between items-end mt-2">
        <div className="flex flex-col border-l-2 border-primary pl-3">
          <span className="text-lg font-bold leading-tight">Computer Science 421</span>
          <span className="text-sm text-zinc-400">LT401</span>
        </div>
        
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] text-zinc-500 font-medium">Starts in</span>
          <span className="text-xl font-bold text-primary">18:24</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center">
        <span className="text-xs text-zinc-400 font-medium">09:40 AM - 10:30 AM</span>
      </div>
    </div>
  );
}
