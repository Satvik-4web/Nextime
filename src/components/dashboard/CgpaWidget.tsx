"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { CgpaModal } from "./CgpaModal";

export function CgpaWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedBatch, timetables, cgpaData } = useAppStore();

  const events = (selectedBatch && timetables[selectedBatch]) ? timetables[selectedBatch] : [];
  const uniqueSubjects = Array.from(new Set(events.map(e => e.subject)));

  let totalCredits = 0;
  let totalPoints = 0;

  uniqueSubjects.forEach(subject => {
    const data = cgpaData[subject] || { credits: 4, gradePoint: 8 };
    totalCredits += data.credits;
    totalPoints += data.credits * data.gradePoint;
  });

  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-[#0A0A0C] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-colors rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] h-[160px] flex flex-col justify-between group relative text-left overflow-hidden"
      >
        <div className="flex justify-between items-center mb-2 relative z-10 w-full">
          <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">CGPA Forecast</span>
          <Plus className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
        </div>
      
      <div className="flex justify-between items-end mt-2 relative z-10">
        <div className="flex flex-col">
          <span className="text-4xl font-bold tracking-tight text-white">{sgpa}</span>
          <span className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-wider">Projected SGPA</span>
        </div>
        
        {/* Mock Line Chart */}
        <div className="w-24 h-12 relative overflow-hidden">
          <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path 
              d="M0,35 Q10,30 20,40 T40,25 T60,30 T80,10 T100,5 L100,50 L0,50 Z" 
              fill="url(#chartGradient)" 
            />
            <path 
              d="M0,35 Q10,30 20,40 T40,25 T60,30 T80,10 T100,5" 
              fill="transparent" 
              stroke="#8B5CF6" 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-[0_0_4px_rgba(139,92,246,0.8)]"
            />
            <circle cx="100" cy="5" r="3" fill="#8B5CF6" className="drop-shadow-[0_0_4px_rgba(139,92,246,1)]" />
          </svg>
        </div>
      </div>
      </button>

      <CgpaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
