"use client";

import { TimetableEvent, DayOfWeek } from "@/types/timetable";
import { TIMETABLE_START_HOUR, TIMETABLE_END_HOUR, HOUR_HEIGHT } from "@/lib/timetable-utils";
import { TimetableEventCard } from "./TimetableEventCard";
import { CurrentTimeLine } from "./CurrentTimeLine";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  events: TimetableEvent[];
  viewMode: "today" | "week";
  onEventClick: (event: TimetableEvent) => void;
}

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function TimetableGrid({ events, viewMode, onEventClick }: Props) {
  const currentDayIndex = new Date().getDay() - 1; // 0 = Mon, 4 = Fri
  const activeDayIndex = currentDayIndex >= 0 && currentDayIndex <= 4 ? currentDayIndex : 0;
  
  const displayDays = viewMode === "today" ? [DAYS[activeDayIndex]] : DAYS;
  
  const hours = Array.from(
    { length: TIMETABLE_END_HOUR - TIMETABLE_START_HOUR + 1 },
    (_, i) => TIMETABLE_START_HOUR + i
  );

  return (
    <div className="relative flex flex-col h-full bg-[#050505] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
      
      {/* Background Dot Pattern for premium feel */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      {/* Header */}
      <div className="flex border-b border-white/5 bg-[#0A0A0C]/80 backdrop-blur-md z-30 sticky top-0 shadow-sm">
        <div className="w-16 flex-shrink-0 border-r border-white/5" /> {/* Time column header */}
        {displayDays.map((day) => (
          <div key={day} className="flex-1 py-3 text-center border-r border-white/5 last:border-r-0">
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
      <div className="flex-1 overflow-y-auto relative custom-scrollbar z-10">
        <div className="flex min-w-max md:min-w-0" style={{ height: `${(hours.length - 1) * HOUR_HEIGHT}px` }}>
          
          {/* Time scale */}
          <div className="w-16 flex-shrink-0 border-r border-white/5 relative bg-[#0A0A0C]/50 backdrop-blur-sm z-20">
            <div className="relative" style={{ height: `${(hours.length - 1) * HOUR_HEIGHT}px` }}>
              {hours.map((hour, i) => (
                <div 
                  key={hour} 
                  className="absolute w-full flex justify-center -mt-2"
                  style={{ top: `${i * HOUR_HEIGHT}px` }}
                >
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider bg-[#050505] px-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Days Columns */}
          <div className="flex flex-1 relative">
            <CurrentTimeLine />
            
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 pointer-events-none z-0">
              {hours.slice(0, -1).map((_, i) => (
                <div 
                  key={`line-${i}`} 
                  className="absolute w-full border-t border-dashed border-white/[0.04]"
                  style={{ top: `${i * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                />
              ))}
            </div>

            {/* Vertical Day Columns */}
            {displayDays.map((day, dayIndex) => {
              const dayEvents = events.filter(e => e.day === day);
              
              return (
                <div key={day} className="flex-1 relative border-r border-dashed border-white/[0.04] last:border-r-0 z-10">
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
                        onClick={onEventClick} 
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
