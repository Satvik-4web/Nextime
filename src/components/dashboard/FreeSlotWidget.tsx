"use client";

import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/stores/useAppStore";
import { useTime } from "@/hooks/useTime";
import { getNextFreeSlot } from "@/lib/timetableUtils";

export function FreeSlotWidget() {
  const { timetables, selectedBatch } = useAppStore();
  const now = useTime(60000); // Only need minute precision for this
  
  const events = selectedBatch && timetables[selectedBatch] ? timetables[selectedBatch] : [];
  const freeSlot = getNextFreeSlot(events, now);

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const mins = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] h-[130px] flex flex-col justify-between group hover:border-white/10 transition-colors relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex justify-between items-start relative z-10">
        <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">Free Slot</span>
        <button className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <Clock className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      <div className="flex justify-between items-end relative z-10">
        <div className="flex flex-col border-l-2 border-blue-500 pl-3">
          {freeSlot ? (
            <>
              <span className="text-lg font-bold leading-tight text-white">{freeSlot.startTime} — {freeSlot.endTime}</span>
              <span className="text-xs text-zinc-400 font-medium">Block: <strong className="text-blue-400">{formatDuration(freeSlot.durationMs)}</strong></span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold leading-tight text-white">No Free Slots</span>
              <span className="text-xs text-zinc-400 font-medium">Fully booked today</span>
            </>
          )}
        </div>
        
        {freeSlot && (
          <Link 
            href="/study" 
            className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full"
          >
            Plan Study <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
}
