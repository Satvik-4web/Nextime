"use client";

import { useEffect, useState } from "react";
import { getCurrentTimeMinutes, TIMETABLE_START_HOUR, HOUR_HEIGHT } from "@/lib/timetable-utils";

export function CurrentTimeLine() {
  const [offset, setOffset] = useState(-1);

  useEffect(() => {
    const updateTime = () => {
      const currentMins = getCurrentTimeMinutes();
      const startMins = TIMETABLE_START_HOUR * 60;
      
      // Only show line if we are within the timetable hours
      if (currentMins >= startMins && currentMins <= 18 * 60) {
        setOffset(((currentMins - startMins) / 60) * HOUR_HEIGHT);
      } else {
        setOffset(-1); // Hide
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  if (offset < 0) return null;

  return (
    <div 
      className="absolute w-full flex items-center z-30 pointer-events-none"
      style={{ top: `${offset}px` }}
    >
      {/* Glowing Dot */}
      <div className="absolute -left-2 w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] border-2 border-black flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
      </div>
      
      {/* Glowing Line */}
      <div className="w-full h-[2px] bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] relative">
        <div className="absolute inset-0 bg-emerald-400 blur-[2px]" />
      </div>
    </div>
  );
}
