"use client";

import { TrendingUp, Plus } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { AttendanceModal } from "./AttendanceModal";

export function AttendanceWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedBatch, timetables, attendanceData } = useAppStore();

  const events = (selectedBatch && timetables[selectedBatch]) ? timetables[selectedBatch] : [];
  const uniqueSubjects = Array.from(new Set(events.map(e => e.subject)));

  let totalAttended = 0;
  let totalHeld = 0;

  uniqueSubjects.forEach(sub => {
    const data = attendanceData[sub];
    if (data && data.total > 0) {
      totalAttended += data.attended;
      totalHeld += data.total;
    }
  });

  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100;
  
  // Calculate SVG stroke offset for the circle
  // Circle circumference is ~339.29 (2 * pi * r where r=54)
  const strokeDasharray = 339.29;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * (overallPct / 100));

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-[#0A0A0C] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-colors rounded-2xl p-5 flex flex-col items-center shadow-[0_0_30px_rgba(0,0,0,0.5)] h-[220px] group relative text-left overflow-hidden"
      >
        <div className="w-full flex justify-between items-center mb-2 relative z-10">
          <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">Attendance</span>
          <Plus className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </div>
      
      <div className="relative flex-1 flex items-center justify-center mt-2 z-10">
        {/* SVG Circle Progress */}
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle 
            cx="64" cy="64" r="54" 
            fill="transparent" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="10" 
          />
          {/* Progress circle */}
          <circle 
            cx="64" cy="64" r="54" 
            fill="transparent" 
            stroke={overallPct < 75 && totalHeld > 0 ? "#EF4444" : "#8B5CF6"}
            strokeWidth="10" 
            strokeDasharray={strokeDasharray} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={overallPct < 75 && totalHeld > 0 ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]"}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold tracking-tight">{overallPct}%</span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{totalHeld === 0 ? "No Data" : "Overall"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 relative z-10">
        <TrendingUp className="w-3.5 h-3.5 text-zinc-500" />
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">Track subject-wise</span>
      </div>
      </button>

      <AttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
