"use client";

import { ChevronDown, ArrowRight, Search, RotateCcw } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { cn } from "@/lib/utils";
import { NotificationPanel } from "@/components/navigation/NotificationPanel";
import { FriendsDropdown } from "@/components/dashboard/FriendsDropdown";
import { motion } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";

import Image from "next/image";

export function TopNav() {
  const { selectedBatch, setSelectedBatch, resetBoot, timetables } = useAppStore();
  const { currentUser, updateUser } = useCommunityStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(currentUser.displayName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync edit name when current user changes
  useEffect(() => {
    setEditNameValue(currentUser.displayName);
  }, [currentUser.displayName]);

  // Focus input when editing
  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingName]);

  const handleNameSave = () => {
    if (editNameValue.trim()) {
      updateUser({ displayName: editNameValue.trim() });
    } else {
      setEditNameValue(currentUser.displayName);
    }
    setIsEditingName(false);
  };

  const handleSearchClick = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  // Dynamic Next Class Logic
  const nextClassInfo = useMemo(() => {
    if (!selectedBatch || !timetables[selectedBatch]) return null;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const todayStr = days[now.getDay()];
    
    // Convert current time to minutes
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const todaysClasses = timetables[selectedBatch]
      .filter(e => e.day === todayStr)
      .sort((a, b) => {
        const [ah, am] = a.startTime.split(':').map(Number);
        const [bh, bm] = b.startTime.split(':').map(Number);
        return (ah * 60 + am) - (bh * 60 + bm);
      });

    const nextClass = todaysClasses.find(e => {
      const [h, m] = e.startTime.split(':').map(Number);
      const startMins = h * 60 + m;
      // Also check if class is currently ongoing (startMins <= currentMins && endMins > currentMins)
      const [eh, em] = e.endTime.split(':').map(Number);
      const endMins = eh * 60 + em;
      return startMins > currentMins || (startMins <= currentMins && endMins > currentMins);
    });

    if (!nextClass) return null;

    const [h, m] = nextClass.startTime.split(':').map(Number);
    const startMins = h * 60 + m;
    
    const isOngoing = startMins <= currentMins;
    const minsUntil = startMins - currentMins;

    return {
      event: nextClass,
      isOngoing,
      minsUntil
    };
  }, [selectedBatch, timetables]);

  // Force re-render every minute to keep the "Next Class in X min" accurate
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full flex-shrink-0 flex items-center justify-between py-4 px-8 border-b border-white/5 bg-[#050505] backdrop-blur-md sticky top-0 z-40">
      
      {/* Left: Logo & Batch */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.jpg" 
            alt="NexTime Logo" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-md shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-tight">NexTime</h1>
            <p className="text-[10px] text-zinc-400 font-medium tracking-wide">Smart Student OS</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSelectedBatch(null as any)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <span className="text-xs font-medium">{selectedBatch || "Select Batch"}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>
          <FriendsDropdown />
        </div>
      </div>

      {/* Center: Next Class Pill */}
      <div 
        onClick={() => {
          if (nextClassInfo) window.location.href = '/timetable';
        }}
        className={cn(
          "hidden md:flex items-center gap-4 px-1 py-1 pr-4 rounded-full bg-[#1A1A24] border border-[#2D2D4A] shadow-[0_0_20px_rgba(45,45,74,0.3)] cursor-pointer hover:bg-[#20202C] transition-colors group",
          !nextClassInfo && "opacity-50 cursor-default hover:bg-[#1A1A24]"
        )}
      >
        <div className="bg-[#2D2D4A] p-2 rounded-full">
          {nextClassInfo?.isOngoing ? (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
            />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8BA4F9]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          )}
        </div>
        <div className="flex flex-col">
          {nextClassInfo ? (
            <>
              <span className={cn("text-xs font-semibold", nextClassInfo.isOngoing ? "text-rose-400" : "text-zinc-300")}>
                {nextClassInfo.isOngoing ? "Ongoing Class" : `Next Class in ${nextClassInfo.minsUntil} min`}
              </span>
              <span className="text-[10px] text-zinc-500 truncate max-w-[200px]">
                {nextClassInfo.event.subject} • {nextClassInfo.event.room}
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-semibold text-zinc-400">No more classes</span>
              <span className="text-[10px] text-zinc-600">Rest up!</span>
            </>
          )}
        </div>
        {nextClassInfo && <ArrowRight className="w-4 h-4 text-zinc-600 ml-4 group-hover:text-zinc-300 transition-colors" />}
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-4">
        <div className="relative group cursor-pointer" onClick={handleSearchClick}>
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-zinc-300 transition-colors" />
          <input 
            type="text" 
            readOnly
            placeholder="Search anything..." 
            className="bg-[#121214] border border-white/5 text-sm rounded-full pl-9 pr-12 py-2 focus:outline-none transition-colors w-64 placeholder:text-zinc-600 text-zinc-200 cursor-pointer group-hover:border-white/10 group-hover:bg-[#1A1A1C]"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 flex items-center">
            <span className="text-[9px] font-bold text-zinc-500">⌘K</span>
          </div>
        </div>

        <NotificationPanel />

        <button 
          onClick={() => { resetBoot(); window.location.href = "/dashboard"; }}
          className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          title="Restart NexTime"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {isEditingName ? (
          <input
            ref={inputRef}
            type="text"
            value={editNameValue}
            onChange={(e) => setEditNameValue(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            className="w-24 h-8 bg-[#3B3B70] border border-[#4B4B8A] rounded-md px-2 text-sm font-bold text-white focus:outline-none focus:border-purple-400"
          />
        ) : (
          <button 
            onClick={() => setIsEditingName(true)}
            className="w-8 h-8 rounded-full bg-[#3B3B70] flex items-center justify-center text-sm font-bold text-white border border-[#4B4B8A] hover:bg-[#4B4B8A] transition-colors"
            title={`Edit Profile (${currentUser.displayName})`}
          >
            {currentUser.displayName.charAt(0).toUpperCase()}
          </button>
        )}
      </div>
      
    </header>
  );
}
