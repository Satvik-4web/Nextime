"use client";

import { ArrowRight } from "lucide-react";

export function AssignmentsWidget() {
  return (
    <div className="bg-[#0A0A0C] border border-[#1A1A24] rounded-2xl p-5 shadow-lg flex flex-col h-[200px]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-zinc-300">Assignments</span>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span className="text-xl font-bold text-white">2</span> Due Soon
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">OS Lab Report</span>
          </div>
          <span className="text-xs text-zinc-500">Tomorrow</span>
        </div>
        
        <div className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">DBMS Mini Project</span>
          </div>
          <span className="text-xs text-zinc-500">2 Aug</span>
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 w-full pt-3 mt-auto border-t border-white/5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
        View all assignments
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}
