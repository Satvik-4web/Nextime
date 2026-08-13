"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import { TimetableGrid } from "./TimetableGrid";
import { TimetableDetailPanel } from "./TimetableDetailPanel";
import { useAppStore } from "@/stores/useAppStore";
import { ClassType, TimetableEvent } from "@/types/timetable";
import { cn } from "@/lib/utils";
import { Filter, Calendar, LayoutGrid, Plus, X, Maximize2, Minimize2, Download, ArrowLeft } from "lucide-react";
import { AddFriendModal } from "@/components/dashboard/AddFriendModal";
import { ElectivePickerModal } from "@/components/dashboard/ElectivePickerModal";
import { useTime } from "@/hooks/useTime";
import { getCurrentClass, getNextClass, parseTime } from "@/lib/timetableUtils";

export function Timetable() {
  const { selectedBatch, timetables, isLoaded, pinnedBatches, unpinBatch, customEvents } = useAppStore();
  const [viewMode, setViewMode] = useState<"today" | "week">("week");
  const [activeBatch, setActiveBatch] = useState<string | null>(selectedBatch);
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const timetableRef = useRef<HTMLDivElement>(null);
  const now = useTime(1000);

  useEffect(() => {
    setActiveBatch(selectedBatch);
  }, [selectedBatch]);

  const [filters, setFilters] = useState<Record<ClassType, boolean>>({
    lecture: true,
    lab: true,
    tutorial: true,
  });
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);
  const [pickingElectiveEvent, setPickingElectiveEvent] = useState<TimetableEvent | null>(null);

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

  const { toggleElectiveSlot, electiveSlots } = useAppStore();

  const filteredEvents = mergedEvents.filter(event => filters[event.type]);

  const handleEventClick = (event: TimetableEvent) => {
    if (isCustomizeMode) {
      toggleElectiveSlot(event.id);
      return;
    }

    if (electiveSlots[event.id]) {
      // If it's an elective slot, open picker
      setPickingElectiveEvent(event);
    } else {
      setSelectedEvent(event);
    }
  };

  const currentClass = getCurrentClass(currentBatchEvents, now);
  const nextClass = getNextClass(currentBatchEvents, now);

  const formatTimeRemaining = (targetTime: Date) => {
    const diff = targetTime.getTime() - now.getTime();
    if (diff <= 0) return "0 min";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} min`;
  };

  const handleDownload = async () => {
    if (!timetableRef.current) return;
    try {
      setIsDownloading(true);
      // Wait for React to apply the expanded styles to the DOM and any animations to settle
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture the fully expanded node
      const dataUrl = await toPng(timetableRef.current, { 
        cacheBust: true, 
        backgroundColor: '#050505',
        pixelRatio: 2 // High-res download
      });
      
      setIsDownloading(false);

      const link = document.createElement('a');
      link.download = `Timetable-${activeBatch || 'MyBatch'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
      setIsDownloading(false);
    }
  };

  const timetableContent = (
    <div 
      ref={timetableRef}
      className={cn(
        "flex flex-col gap-4 transition-all duration-500",
        isFullscreen && !isDownloading
          ? "fixed inset-0 z-[1000] bg-[#050505] p-4 md:p-8 overflow-y-auto" 
          : "",
        isDownloading ? "fixed top-0 left-0 z-[9999] w-[1200px] h-auto p-8 bg-[#050505] rounded-none border-none shadow-none" : ""
      )}
    >
      {/* Top Header */}
      <div className="flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-4">
          {isFullscreen && !isDownloading && (
            <button 
              onClick={() => setIsFullscreen(false)}
              className="flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
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
          <button 
            onClick={() => setIsCustomizeMode(!isCustomizeMode)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold transition-all border",
              isCustomizeMode 
                ? "bg-purple-500/20 text-purple-400 border-purple-500/30" 
                : "border-white/5 text-zinc-400 hover:text-white hover:bg-white/5"
            )}
          >
            {isCustomizeMode ? "Done" : "Customize"}
          </button>
          
          <button onClick={handleDownload} className="hover:text-white transition-colors" title="Download Timetable">
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="hover:text-white transition-colors"
            title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button className="hover:text-white transition-colors"><LayoutGrid className="w-4 h-4" /></button>
          <button className="flex items-center gap-1.5 text-xs font-medium hover:text-white transition-colors"><Calendar className="w-4 h-4" /> Overview</button>
        </div>
      </div>

      {/* Sub Header */}
      <div className="flex justify-between items-center text-xs flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-bold text-zinc-300 tracking-wide uppercase text-[10px]">Today</span>
            <span className="text-zinc-500 text-xs">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          
          {currentClass && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
              <span className="font-bold text-emerald-400 tracking-wider text-[10px] uppercase">Now</span>
              <span className="font-extrabold text-white max-w-[150px] truncate">{currentClass.subject}</span>
              <span className="text-emerald-200/60 font-medium">{formatTimeRemaining(parseTime(currentClass.endTime, now))} left</span>
            </div>
          )}

          {nextClass && !currentClass && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <span className="font-bold text-primary tracking-wider text-[10px] uppercase">Next</span>
              <span className="font-semibold text-zinc-300 max-w-[150px] truncate">{nextClass.subject}</span>
              <span className="text-zinc-500 font-medium">{nextClass.startTime} - {nextClass.room}</span>
            </div>
          )}
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
      <div className={cn("flex flex-col", isDownloading ? "h-auto" : "")}>
        <TimetableGrid 
          events={filteredEvents} 
          viewMode={viewMode} 
          onEventClick={handleEventClick}
          isDownloading={isDownloading} 
          isFullscreen={isFullscreen}
        />
      </div>

      {selectedEvent && (
        <TimetableDetailPanel 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}

      <ElectivePickerModal
        event={pickingElectiveEvent}
        isOpen={!!pickingElectiveEvent}
        onClose={() => setPickingElectiveEvent(null)}
      />

      <AddFriendModal isOpen={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} />
    </div>
  );

  if (isFullscreen || isDownloading) {
    if (typeof window !== "undefined") {
      return createPortal(timetableContent, document.body);
    }
  }

  return timetableContent;
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
