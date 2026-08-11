"use client";

import { TimetableEvent } from "@/types/timetable";
import { getEventTopOffset, getEventHeight } from "@/lib/timetable-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  event: TimetableEvent;
  onClick: (event: TimetableEvent) => void;
}

export function TimetableEventCard({ event, onClick }: Props) {
  const top = getEventTopOffset(event.startTime);
  const height = getEventHeight(event.startTime, event.endTime);

  // Cinematic Styling based on type
  const typeStyles = {
    lecture: "bg-[#0A0E17]/80 hover:bg-[#0D1424]/90 border border-blue-500/20 hover:border-blue-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    lab: "bg-[#071317]/80 hover:bg-[#0A1A24]/90 border border-cyan-500/20 hover:border-cyan-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
    tutorial: "bg-[#130A17]/80 hover:bg-[#1A0D24]/90 border border-purple-500/20 hover:border-purple-400/50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  };

  const glowStyles = {
    lecture: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]",
    lab: "bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]",
    tutorial: "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]",
  };

  return (
    <motion.div 
      layoutId={`event-${event.id}`}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      whileHover={{ scale: 1.03, zIndex: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "absolute w-[calc(100%-12px)] mx-[6px] rounded-2xl p-3 cursor-pointer transition-colors overflow-hidden group backdrop-blur-xl",
        typeStyles[event.type]
      )}
      style={{ top: `${top}px`, height: `${height - 4}px` }} // slightly gap between events
      onClick={() => onClick(event)}
    >
      {/* Decorative left accent line */}
      <div className={cn("absolute left-0 top-3 bottom-3 w-[4px] rounded-r-full opacity-80 group-hover:opacity-100 group-hover:w-[6px] transition-all duration-300", glowStyles[event.type])} />
      
      {/* Subtle glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex flex-col h-full relative z-10 pl-3">
        <span className="font-extrabold text-[13px] tracking-widest text-white/95 uppercase leading-tight mb-auto group-hover:text-white transition-colors drop-shadow-md">
          {event.subject}
        </span>
        
        <div className="flex flex-col gap-1.5 mt-2">
          <span className="text-[11px] text-zinc-300 font-semibold tracking-wider flex items-center gap-1.5 group-hover:text-zinc-200 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {event.room}
          </span>
          <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5 uppercase tracking-widest">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {event.startTime} - {event.endTime}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
