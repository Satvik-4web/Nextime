"use client";

import { useState, useEffect } from "react";
import { TimetableGrid } from "./TimetableGrid";
import { TimetableDetailPanel } from "./TimetableDetailPanel";
import { useAppStore } from "@/stores/useAppStore";
import { ClassType, TimetableEvent } from "@/types/timetable";
import { cn } from "@/lib/utils";
import { Filter, Calendar, LayoutGrid, Plus, X } from "lucide-react";
import { AddFriendModal } from "@/components/dashboard/AddFriendModal";

export function Timetable() {
  const { selectedBatch, timetables, isLoaded, pinnedBatches, unpinBatch, customEvents } = useAppStore();
  const [viewMode, setViewMode] = useState<"today" | "week">("week");
  const [activeBatch, setActiveBatch] = useState<string | null>(selectedBatch);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

  useEffect(() => {
    setActiveBatch(selectedBatch);
  }, [selectedBatch]);

  const [filters, setFilters] = useState<Record<ClassType, boolean>>({
    lecture: true,
    lab: true,
    tutorial: true,
  });
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  const toggleFilter = (type: ClassType) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const currentBatchEvents = (activeBatch && timetables[activeBatch]) ? timetables[activeBatch] : [];
  
  // Merge custom events
  const mergedEvents = currentBatchEvents.map(event => {
    if (customEvents[event.id]) {
      return { ...event, ...customEvents[event.id] };
    }
    return event;
  });

  const filteredEvents = mergedEvents.filter(event => filters[event.type]);

  const handleEventClick = (event: TimetableEvent) => {
    setSelectedEvent(event);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Timetable</h2>
          
          {/* Stushark Tabs */}
          <div className="flex items-center gap-1 bg-[#121214] p-1 rounded-full border border-white/5">
            <button 
              onClick={() => setActiveBatch(selectedBatch)}
              className={cn("px-3 py-1 rounded-full text-xs font-bold transition-all", activeBatch === selectedBatch ? "bg-primary text-white" : "text-zinc-500 hover:text-zinc-300")}
            >
              My Batch
            </button>
            {pinnedBatches.map(batch => (
              <div key={batch} className={cn("flex items-center gap-1 pl-3 pr-1 py-1 rounded-full text-xs font-bold transition-all group", activeBatch === batch ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300")}>
                <button onClick={() => setActiveBatch(batch)}>{batch}</button>
                <button onClick={() => { unpinBatch(batch); if(activeBatch===batch) setActiveBatch(selectedBatch); }} className="p-0.5 rounded-full hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => setIsAddFriendOpen(true)} className="w-6 h-6 rounded-full flex items-center justify-center border border-dashed border-zinc-600 text-zinc-500 hover:text-white hover:border-white transition-all ml-1">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex items-center gap-2 bg-[#121214] p-1 rounded-full border border-white/5">
          <FilterButton active={filters.lecture && filters.lab && filters.tutorial} onClick={() => setFilters({lecture: true, lab: true, tutorial: true})} label="All" />
          <FilterButton active={filters.lecture} onClick={() => toggleFilter("lecture")} label="Lectures" />
          <FilterButton active={filters.lab} onClick={() => toggleFilter("lab")} label="Labs" />
          <FilterButton active={filters.tutorial} onClick={() => toggleFilter("tutorial")} label="Tutorials" />
        </div>
        
        {/* Action Icons */}
        <div className="flex items-center gap-4 text-zinc-500">
          <button className="hover:text-white transition-colors"><LayoutGrid className="w-4 h-4" /></button>
          <button className="hover:text-white transition-colors"><Filter className="w-4 h-4" /></button>
          <button className="flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors"><Calendar className="w-4 h-4" /> Overview</button>
        </div>
      </div>

      {/* Sub Header */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-zinc-300">Jul 27 — Aug 01</span>
            <span className="text-zinc-500">Week 5</span>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-900/20 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="font-bold text-blue-400 tracking-wider text-[10px] uppercase">Now</span>
            <span className="font-extrabold text-white">IMAGE PROCESSING</span>
            <span className="text-blue-200/60 font-medium">33 min remaining</span>
          </div>

          <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="font-bold text-purple-400 tracking-wider text-[10px] uppercase">Next</span>
            <span className="font-semibold text-zinc-300">UCS668P/UCS50P...</span>
            <span className="text-zinc-500 font-medium">15:30 - L004/L102/LT102</span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-[#121214] p-1 rounded-full border border-white/5">
          <button
            onClick={() => setViewMode("today")}
            className={cn(
              "px-4 py-1 rounded-full text-xs font-medium transition-colors",
              viewMode === "today" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Today
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={cn(
              "px-4 py-1 rounded-full text-xs font-medium transition-colors",
              viewMode === "week" ? "bg-white/10 text-white" : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            Week
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 min-h-0">
        <TimetableGrid 
          events={filteredEvents} 
          viewMode={viewMode} 
          onEventClick={handleEventClick} 
        />
      </div>

      {selectedEvent && (
        <TimetableDetailPanel 
          event={selectedEvent} 
          isOpen={!!selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      <AddFriendModal isOpen={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} />
    </div>
  );
}

function FilterButton({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1 rounded-full text-xs font-medium transition-all",
        active ? "bg-white/10 text-white" : "text-zinc-500 hover:bg-white/5"
      )}
    >
      {label}
    </button>
  );
}
