"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { timeStringToMinutes, getCurrentTimeMinutes } from "@/lib/timetable-utils";
import { getNow } from "@/lib/time";
import { TimetableEvent, DayOfWeek } from "@/types/timetable";
import { Check, X, AlertCircle } from "lucide-react";

const DAYS: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function AttendancePrompt() {
  const { selectedBatch, timetables, attendanceData, updateAttendance, promptedClasses, markClassPrompted } = useAppStore();
  const { addToast } = useNotificationStore();
  const [activePrompt, setActivePrompt] = useState<{ event: TimetableEvent; dateClassId: string } | null>(null);

  useEffect(() => {
    // Check every minute
    const interval = setInterval(() => {
      checkClasses();
    }, 60000);

    // Also check immediately on mount
    checkClasses();

    return () => clearInterval(interval);
  }, [selectedBatch, timetables, promptedClasses]);

  const checkClasses = () => {
    if (!selectedBatch || !timetables[selectedBatch] || activePrompt) return;

    const now = getNow();
    const currentDayStr = DAYS[now.getDay()];
    const todayDateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const currentMins = getCurrentTimeMinutes();

    const todayEvents = timetables[selectedBatch].filter(e => e.day === currentDayStr);

    for (const event of todayEvents) {
      const endMins = timeStringToMinutes(event.endTime);
      
      // If class has ended (current time is past the end time)
      if (currentMins >= endMins) {
        const dateClassId = `${todayDateStr}-${event.id}`;
        
        // If we haven't prompted for this class today, trigger it!
        if (!promptedClasses[dateClassId]) {
          setActivePrompt({ event, dateClassId });
          break; // Only show one prompt at a time
        }
      }
    }
  };

  const handleResponse = (attendedClass: boolean) => {
    if (!activePrompt) return;
    
    const { event, dateClassId } = activePrompt;
    const currentData = attendanceData[event.subject] || { attended: 0, total: 0 };
    
    if (attendedClass) {
      updateAttendance(event.subject, currentData.attended + 1, currentData.total + 1);
    } else {
      updateAttendance(event.subject, currentData.attended, currentData.total + 1);
    }
    
    markClassPrompted(dateClassId);
    setActivePrompt(null);
    
    addToast({
      type: "ATTENDANCE",
      title: "Attendance Updated",
      message: `${event.subject} marked as ${attendedClass ? 'Present' : 'Absent'}`,
      priority: "LOW"
    });
    
    // Check again in 1 second in case there are multiple queued prompts
    setTimeout(checkClasses, 1000);
  };

  const handleDismiss = () => {
    if (!activePrompt) return;
    markClassPrompted(activePrompt.dateClassId);
    setActivePrompt(null);
    setTimeout(checkClasses, 1000);
  };

  return (
    <AnimatePresence>
      {activePrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-[200] w-[350px] bg-[#0A0A0C] border border-primary/30 rounded-2xl p-5 shadow-[0_10px_40px_rgba(139,92,246,0.2)] flex flex-col gap-4 overflow-hidden"
        >
          {/* Glowing accent border top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Class Finished</h3>
                <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">{activePrompt.event.startTime} - {activePrompt.event.endTime}</p>
              </div>
            </div>
            <button onClick={handleDismiss} className="text-zinc-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="text-sm text-zinc-300 font-medium leading-relaxed">
              Did you attend <span className="font-bold text-white">{activePrompt.event.subject}</span> in <span className="text-primary">{activePrompt.event.room}</span>?
            </p>
          </div>

          <div className="flex gap-3 mt-1">
            <button 
              onClick={() => handleResponse(true)}
              className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl py-2 flex items-center justify-center gap-2 font-bold text-sm transition-colors group"
            >
              <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Yes
            </button>
            <button 
              onClick={() => handleResponse(false)}
              className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2 flex items-center justify-center gap-2 font-bold text-sm transition-colors group"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
              No
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
