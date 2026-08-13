"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { TimetableEvent } from "@/types/timetable";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  event: TimetableEvent | null;
}

export function ElectivePickerModal({ isOpen, onClose, event }: Props) {
  const { timetables, updateEvent } = useAppStore();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract unique subjects across all batches in memory
  const uniqueSubjects = useMemo(() => {
    if (!isOpen) return [];
    
    const subjectMap = new Map<string, { subject: string, code: string, type: string }>();
    
    Object.values(timetables).forEach(batchEvents => {
      batchEvents.forEach(e => {
        // Skip adding if we already have this exact subject name
        if (!subjectMap.has(e.subject)) {
          subjectMap.set(e.subject, {
            subject: e.subject,
            code: e.code,
            type: e.type
          });
        }
      });
    });

    return Array.from(subjectMap.values());
  }, [timetables, isOpen]);

  const filteredSubjects = uniqueSubjects.filter(s => 
    s.subject.toLowerCase().includes(search.toLowerCase()) || 
    s.code.toLowerCase().includes(search.toLowerCase())
  );

  const handlePick = (subjectInfo: { subject: string, code: string, type: string }) => {
    if (!event) return;
    
    // Override the event in customEvents
    updateEvent(event.id, {
      subject: subjectInfo.subject,
      code: subjectInfo.code,
      type: subjectInfo.type as any,
    });
    
    onClose();
  };

  if (!isOpen || !event || !mounted) return null;

  return (
    <AnimatePresence>
      {createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#050505]/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="relative w-full max-w-lg bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/[0.02]">
            <div>
              <h2 className="text-lg font-bold text-white">Pick Elective</h2>
              <p className="text-xs text-zinc-500 font-medium mt-1 uppercase tracking-wider">
                {event.day} • {event.startTime} - {event.endTime}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/5 bg-[#050505]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search subjects or codes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 focus:bg-[#1A1A24] transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            {filteredSubjects.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-zinc-500 text-sm">
                No subjects found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-1">
                {filteredSubjects.map(subjectInfo => (
                  <button
                    key={subjectInfo.subject}
                    onClick={() => handlePick(subjectInfo)}
                    className="flex flex-col text-left p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-zinc-200 group-hover:text-white">
                        {subjectInfo.subject}
                      </span>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide",
                        subjectInfo.type === "lecture" && "bg-blue-500/10 text-blue-400",
                        subjectInfo.type === "lab" && "bg-emerald-500/10 text-emerald-400",
                        subjectInfo.type === "tutorial" && "bg-orange-500/10 text-orange-400",
                      )}>
                        {subjectInfo.type}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-500 mt-1 font-medium tracking-wide">
                      {subjectInfo.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>,
      document.body
      )}
    </AnimatePresence>
  );
}
