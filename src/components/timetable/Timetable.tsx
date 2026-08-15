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
  const { selectedBatch, viewingFriendBatch, setViewingFriendBatch, timetables, isLoaded, customEvents } = useAppStore();
  const [viewMode, setViewMode] = useState<"today" | "week">("week");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const timetableRef = useRef<HTMLDivElement>(null);
  const now = useTime(1000);

  const { loadTimetables } = useAppStore();

  useEffect(() => {
    if (!isLoaded) {
      loadTimetables();
    }
  }, [isLoaded, loadTimetables]);

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

  const effectiveBatch = viewingFriendBatch || selectedBatch;
  const currentBatchEvents = (effectiveBatch && timetables[effectiveBatch]) ? timetables[effectiveBatch] : [];
  
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
      link.download = `Timetable-${selectedBatch || 'MyBatch'}.png`;
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
          ? "fixed inset-0 z-[1000] bg-[#050505] p-4 md:p-8 overflow-y-auto custom-scrollbar" 
          : "",
        isDownloading ? "fixed top-0 left-0 z-[9999] w-[1200px] h-auto p-8 bg-[#050505] rounded-none border-none shadow-none" : ""
      )}
    >
      {/* Top Header */}
      {viewingFriendBatch && !isDownloading && (
        <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-sm font-bold text-blue-400">
              👀 Viewing {viewingFriendBatch}'s Timetable
            </span>
          </div>
          <button 
            onClick={() => setViewingFriendBatch(null)}
            className="text-xs font-bold bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 px-3 py-1.5 rounded-lg transition-colors"
          >
            Return to My Timetable
          </button>
        </div>
      )}
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-primary" />
              Timetable
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold tracking-wider uppercase text-zinc-400">
              {selectedBatch}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
            <span className="text-blue-400 text-xs font-semibold tracking-wide uppercase">{currentTime}</span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-zinc-500 text-xs">{now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {currentClass && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] w-full sm:w-auto">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse shrink-0" />
                <span className="font-bold text-emerald-400 tracking-wider text-[10px] uppercase shrink-0">Now</span>
                <span className="font-extrabold text-white truncate max-w-[120px] sm:max-w-[150px]">{currentClass.subject}</span>
                <span className="text-emerald-200/60 font-medium shrink-0 ml-auto">{formatTimeRemaining(parseTime(currentClass.endTime, now))} left</span>
              </div>
            )}

            {nextClass && !currentClass && (
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 w-full sm:w-auto">
                <span className="font-bold text-primary tracking-wider text-[10px] uppercase shrink-0">Next</span>
                <span className="font-semibold text-zinc-300 truncate max-w-[120px] sm:max-w-[150px]">{nextClass.subject}</span>
                <span className="text-zinc-500 font-medium shrink-0 ml-auto">{nextClass.startTime} - {nextClass.room}</span>
              </div>
            )}
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
        isOpen={!!pickingElectiveEvent} 
        onClose={() => setPickingElectiveEvent(null)} 
        event={pickingElectiveEvent} 
      />
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
