"use client";

import { TimetableEvent } from "@/types/timetable";
import { getEventTopOffset, getEventHeight } from "@/lib/timetable-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  event: TimetableEvent;
  isCurrent?: boolean;
  onClick: (event: TimetableEvent) => void;
  isElective?: boolean;
  isUnpickedElective?: boolean;
}

export function TimetableEventCard({ event, isCurrent, onClick, isElective, isUnpickedElective }: Props) {
  const top = getEventTopOffset(event.startTime);
  const height = getEventHeight(event.startTime, event.endTime);

  // Cinematic Styling based on type
  const typeStyles = {
    lecture: "bg-[#0A0E17]/80 hover:bg-[#0D1424]/90 border border-blue-500/20 hover:border-blue-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    lab: "bg-[#071317]/80 hover:bg-[#0A1A24]/90 border border-cyan-500/20 hover:border-cyan-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
    tutorial: "bg-[#130A17]/80 hover:bg-[#1A0D24]/90 border border-purple-500/20 hover:border-purple-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]",
  };

  const glowStyles = {
    lecture: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]",
    lab: "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    tutorial: "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]",
  };

  if (isUnpickedElective) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        whileHover={{ scale: 1.03, zIndex: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 25 }}
        className="absolute w-[calc(100%-12px)] mx-[6px] rounded-2xl p-3 cursor-pointer transition-all overflow-hidden group bg-[#0A0A0C]/50 border-2 border-dashed border-purple-500/40 hover:border-purple-400/80 hover:bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.1)] flex flex-col justify-center items-center backdrop-blur-md"
        style={{ top: `${top}px`, height: `${height - 4}px` }}
        onClick={() => onClick(event)}
      >
        <div className="flex items-center gap-2 text-purple-400 font-bold tracking-widest text-xs uppercase mb-1">
          <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          Elective
        </div>
        <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
          Tap to pick
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileHover={{ scale: 1.03, zIndex: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "absolute w-[calc(100%-12px)] mx-[6px] rounded-2xl p-2.5 cursor-pointer transition-all overflow-hidden group backdrop-blur-xl",
        typeStyles[event.type],
        isCurrent && "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse"
      )}
      style={{ top: `${top}px`, height: `${height - 4}px` }}
      onClick={() => onClick(event)}
    >
      {/* Decorative left accent line */}
      <div className={cn(
        "absolute left-0 top-3 bottom-3 w-[4px] rounded-r-full opacity-80 group-hover:opacity-100 group-hover:w-[6px] transition-all duration-300", 
        isCurrent ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]" : glowStyles[event.type]
      )} />
      
      {/* NOW indicator tag */}
      {isCurrent && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse" />
          <span className="text-[9px] font-black tracking-widest uppercase text-emerald-400">Now</span>
        </div>
      )}

      {/* Subtle glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex flex-col h-full relative z-10 pl-3">
        {/* COURSE CODE */}
        <div className="flex items-center justify-between">
          <span className="font-black text-sm tracking-wide text-white uppercase leading-tight drop-shadow-md">
            {event.code}
          </span>
          {isElective && (
            <span className="px-1.5 py-0.5 rounded-sm bg-purple-500/20 border border-purple-500/30 text-[8px] font-bold text-purple-300 uppercase tracking-widest">
              Elective
            </span>
          )}
        </div>
        
        {/* Subject Name */}
        <span className="font-semibold text-[10px] tracking-wider text-zinc-400 uppercase leading-tight mt-0.5 mb-auto line-clamp-2 pr-2">
          {event.subject}
        </span>
        
        <div className="flex flex-col gap-1.5 mt-2">
          {/* Room */}
          <span className="text-[11px] text-zinc-300 font-bold tracking-wider flex items-center gap-1.5 group-hover:text-zinc-200 transition-colors w-full overflow-hidden">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span className="truncate">{event.room}</span>
          </span>
          {/* Time */}
          <span className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {event.startTime} - {event.endTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
