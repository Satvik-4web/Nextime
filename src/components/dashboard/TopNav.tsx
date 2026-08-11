"use client";

import { Search, Bell, Clock, ChevronDown, ArrowRight } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { selectedBatch, setSelectedBatch } = useAppStore();
  return (
    <header className="w-full flex items-center justify-between py-4 px-8 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-40">
      
      {/* Left: Logo & Batch */}
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-tight">NexTime</h1>
          <p className="text-[10px] text-zinc-400 font-medium tracking-wide">Smart Student OS</p>
        </div>
        
        <button 
          onClick={() => setSelectedBatch(null as any)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
          <span className="text-xs font-medium">{selectedBatch || "Select Batch"}</span>
          <ChevronDown className="w-3 h-3 text-zinc-400" />
        </button>
      </div>

      {/* Center: Next Class Pill */}
      <div className="hidden md:flex items-center gap-4 px-1 py-1 pr-4 rounded-full bg-[#1A1A24] border border-[#2D2D4A] shadow-[0_0_20px_rgba(45,45,74,0.3)] cursor-pointer hover:bg-[#20202C] transition-colors group">
        <div className="bg-[#2D2D4A] p-2 rounded-full">
          <Clock className="w-4 h-4 text-[#8BA4F9]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-zinc-300">Next Class in 18 min</span>
          <span className="text-[10px] text-zinc-500">Computer Science 421 • LT401</span>
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-600 ml-4 group-hover:text-zinc-300 transition-colors" />
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-[#121214] border border-white/5 text-sm rounded-full pl-9 pr-12 py-2 focus:outline-none focus:border-white/20 transition-colors w-64 placeholder:text-zinc-600 text-zinc-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 flex items-center">
            <span className="text-[9px] font-bold text-zinc-500">⌘K</span>
          </div>
        </div>

        <button className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
          <Bell className="w-5 h-5 text-zinc-400" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
        </button>

        <button className="w-8 h-8 rounded-full bg-[#3B3B70] flex items-center justify-center text-sm font-bold text-white border border-[#4B4B8A]">
          S
        </button>
      </div>
      
    </header>
  );
}
