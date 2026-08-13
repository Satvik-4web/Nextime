"use client";

import { Video, Clock } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useTime } from "@/hooks/useTime";
import { getNextClass, getCurrentClass, parseTime } from "@/lib/timetableUtils";

export function NextClassWidget() {
  const { timetables, selectedBatch } = useAppStore();
  const now = useTime(1000);
  
  const events = selectedBatch && timetables[selectedBatch] ? timetables[selectedBatch] : [];
  
  const currentClass = getCurrentClass(events, now);
  const nextClass = getNextClass(events, now);

  const formatTimeRemaining = (targetTime: Date) => {
    const diff = targetTime.getTime() - now.getTime();
    if (diff <= 0) return "00:00";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const renderContent = () => {
    if (currentClass) {
      const endTime = parseTime(currentClass.endTime, now);
      return (
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col border-l-2 border-emerald-500 pl-3">
            <span className="text-lg font-bold leading-tight text-white">{currentClass.code}</span>
            <span className="text-xs text-zinc-400 font-medium truncate max-w-[120px]">{currentClass.subject}</span>
          </div>
          
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Ends in</span>
            <span className="text-xl font-black text-emerald-400">{formatTimeRemaining(endTime)}</span>
          </div>
        </div>
      );
    }

    if (nextClass) {
      const startTime = parseTime(nextClass.startTime, now);
      return (
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col border-l-2 border-primary pl-3">
            <span className="text-lg font-bold leading-tight text-white">{nextClass.code}</span>
            <span className="text-xs text-zinc-400 font-medium truncate max-w-[120px]">{nextClass.subject}</span>
          </div>
          
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Starts in</span>
            <span className="text-xl font-black text-primary">{formatTimeRemaining(startTime)}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full mt-4">
        <span className="text-sm font-bold text-zinc-600">No more classes today</span>
      </div>
    );
  };

  const getStatusText = () => {
    if (currentClass) return "CURRENTLY IN CLASS";
    if (nextClass) return "NEXT CLASS";
    return "DONE FOR TODAY";
  };
  return (
    <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] h-[160px] flex flex-col justify-between group hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {getStatusText()}
        </span>
        <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 hover:bg-primary/20 transition-colors">
          {currentClass ? <Video className="w-4 h-4 text-emerald-400" /> : <Clock className="w-4 h-4 text-primary" />}
        </button>
      </div>
      
      {renderContent()}

      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs text-zinc-500 font-medium">
          {currentClass ? `${currentClass.startTime} - ${currentClass.endTime}` : 
           nextClass ? `${nextClass.startTime} - ${nextClass.endTime}` : 
           "Rest up!"}
        </span>
        <span className="text-xs text-zinc-400 font-bold">
          {currentClass ? currentClass.room : nextClass ? nextClass.room : ""}
        </span>
      </div>
    </div>
  );
}
