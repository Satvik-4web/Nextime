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
        className="w-full bg-[#0A0A0C] border border-[#1A1A24] hover:border-white/20 hover:bg-white/[0.02] transition-all rounded-2xl p-5 flex flex-col items-center shadow-lg h-[220px] group relative text-left"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
        
        <div className="w-full flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-zinc-300">Attendance</span>
          <Plus className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </div>
      
      <div className="relative flex-1 flex items-center justify-center mt-2">
        {/* SVG Circle Progress */}
        <svg className="w-32 h-32 transform -rotate-90">
          {/* Background circle */}
          <circle 
            cx="64" cy="64" r="54" 
            fill="transparent" 
            stroke="#1A1A24" 
            strokeWidth="12" 
          />
          {/* Progress circle */}
          <circle 
            cx="64" cy="64" r="54" 
            fill="transparent" 
            stroke={overallPct < 75 && totalHeld > 0 ? "#EF4444" : "#8B5CF6"}
            strokeWidth="12" 
            strokeDasharray={strokeDasharray} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={overallPct < 75 && totalHeld > 0 ? "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-bold">{overallPct}%</span>
          <span className="text-[10px] text-zinc-500 font-medium">{totalHeld === 0 ? "No Data" : "Overall"}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3">
        <TrendingUp className="w-3 h-3 text-zinc-500" />
        <span className="text-[10px] font-bold text-zinc-500">Track subject-wise</span>
      </div>
      </button>

      <AttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
