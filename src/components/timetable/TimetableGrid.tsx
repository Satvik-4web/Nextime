"use client";

import { TimetableEvent, DayOfWeek } from "@/types/timetable";
import { TIMETABLE_START_HOUR, TIMETABLE_END_HOUR, HOUR_HEIGHT, timeStringToMinutes, getEventTopOffset } from "@/lib/timetable-utils";
import { TimetableEventCard } from "./TimetableEventCard";
import { CurrentTimeLine } from "./CurrentTimeLine";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTime } from "@/hooks/useTime";
import { parseTime } from "@/lib/timetableUtils";
import { useAppStore } from "@/stores/useAppStore";

interface Props {
  events: TimetableEvent[];
  viewMode: "today" | "week";
  onEventClick: (event: TimetableEvent) => void;
  isDownloading?: boolean;
  isFullscreen?: boolean;
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function TimetableGrid({ events, viewMode, onEventClick, isDownloading = false, isFullscreen = false }: Props) {
  const now = useTime(60000); // Check every minute
  const { electiveSlots, customEvents } = useAppStore();
  const currentDayIndex = now.getDay() - 1; // 0 = Mon, 4 = Fri
  const activeDayIndex = currentDayIndex >= 0 && currentDayIndex <= 4 ? currentDayIndex : 0;
  
  const displayDays = viewMode === "today" ? [DAYS[activeDayIndex]] : DAYS;
  
  const timeSet = new Set<string>();
  events.forEach(e => {
    timeSet.add(e.startTime);
    timeSet.add(e.endTime);
  });
  const uniqueTimes = Array.from(timeSet).sort((a, b) => timeStringToMinutes(a) - timeStringToMinutes(b));

  const totalHeight = (TIMETABLE_END_HOUR - TIMETABLE_START_HOUR) * HOUR_HEIGHT;

  return (
    <div className={cn(
      "relative flex flex-col bg-[#050505] rounded-xl border border-white/5 shadow-2xl",
      isDownloading ? "h-auto overflow-visible" : ""
    )}>
      
      {/* Background Dot Pattern for premium feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Header */}
      <div className={cn(
        "flex border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-md z-30 shadow-sm flex-shrink-0",
        isDownloading ? "" : (isFullscreen ? "sticky top-0" : "sticky top-[73px]")
      )}>
        <div className="w-16 flex-shrink-0 border-r border-white/5 sticky left-0 z-30 bg-[#0A0A0C]/90 backdrop-blur-md" /> {/* Time column header */}
        {displayDays.map((day) => (
          <div key={day} className="flex-1 min-w-[160px] py-3 text-center border-r border-white/5 last:border-r-0">
            <span className={cn(
              "font-medium",
              viewMode === "week" ? "text-sm text-zinc-400" : "text-lg text-white"
            )}>
              {viewMode === "today" ? day : day.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>

      {/* Grid body */}
      <div className={cn(
        "relative z-10",
        isDownloading ? "overflow-visible h-auto" : "overflow-x-auto custom-scrollbar"
      )}>
        <div className="flex min-w-max" style={{ height: `${totalHeight}px` }}>
          
          {/* Time scale */}
          <div className="w-16 flex-shrink-0 border-r border-white/5 relative bg-[#0A0A0C]/50 backdrop-blur-sm z-20 sticky left-0">
            <div className="relative" style={{ height: `${totalHeight}px` }}>
              {uniqueTimes.map((time) => {
                const top = getEventTopOffset(time);
                return (
                  <div 
                    key={time} 
                    className={cn(
                      "absolute w-full flex justify-center",
                      time === "08:00" ? "mt-2" : "-mt-2"
                    )}
                    style={{ top: `${top}px` }}
                  >
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider bg-[#050505] px-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      {time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Days Columns */}
          <div className="flex flex-1 relative">
            <CurrentTimeLine />
            
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {uniqueTimes.map((time, i) => {
                const top = getEventTopOffset(time);
                return (
                  <div 
                    key={`line-${i}`} 
                    className="absolute w-full border-t border-dashed border-white/[0.04]"
                    style={{ top: `${top}px` }}
                  />
                );
              })}
            </div>

            {/* Vertical Day Columns */}
            {displayDays.map((day, dayIndex) => {
              const dayEvents = events.filter(e => e.day === day);
              
              return (
                <div key={day} className="flex-1 min-w-[160px] relative border-r border-dashed border-white/[0.04] last:border-r-0 z-10">
                  {dayEvents.map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: (dayIndex * 0.05) + (eventIndex * 0.05), 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
                    >
                      <TimetableEventCard 
                        event={event} 
                        isCurrent={
                          day === DAYS[activeDayIndex] && 
                          now >= parseTime(event.startTime, now) && 
                          now <= parseTime(event.endTime, now)
                        }
                        onClick={onEventClick}
                        isElective={!!electiveSlots[event.id]}
                        isUnpickedElective={!!electiveSlots[event.id] && !customEvents[event.id]}
                      />
                    </motion.div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
