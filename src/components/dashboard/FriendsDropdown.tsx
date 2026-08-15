"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Plus, X, Search, ChevronDown, Check } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTime } from "@/hooks/useTime";
import { getCurrentClass } from "@/lib/timetableUtils";

function FriendStatusRow({ batch, timetables, isSelected, onClick, onRemove }: { batch: string, timetables: any, isSelected: boolean, onClick: () => void, onRemove: () => void }) {
  const now = useTime(60000); // update every minute
  const events = timetables[batch] || [];
  const currentClass = getCurrentClass(events, now);

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer group",
        isSelected ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"
      )}
    >
      <div className="flex flex-col flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", isSelected ? "bg-blue-500" : "bg-zinc-600")} />
          <span className={cn("font-bold truncate", isSelected ? "text-blue-400" : "text-zinc-200")}>{batch}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 ml-3.5">
          {currentClass ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-medium text-emerald-400 truncate">
                {currentClass.subject} ({currentClass.room})
              </span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
              <span className="text-[10px] font-medium text-zinc-500">
                Free slot
              </span>
            </>
          )}
        </div>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-white/10 text-zinc-500 hover:text-red-400 transition-all shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function FriendsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { allBatches, pinnedBatches, selectedBatch, setSelectedBatch, setViewingFriendBatch, pinBatch, unpinBatch, timetables } = useAppStore();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAdding(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableBatches = allBatches.filter(b => b !== selectedBatch && !pinnedBatches.includes(b));
  const filteredBatches = availableBatches.filter(b => b.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all",
          isOpen ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10 hover:bg-white/10"
        )}
      >
        <Users className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-xs font-medium text-zinc-200">Friends</span>
        <ChevronDown className={cn("w-3 h-3 text-zinc-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 bg-[#0A0A0C]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {!isAdding ? (
              // Friends List View
              <div className="flex flex-col p-2">
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex justify-between items-center">
                  <span>Pinned Friends</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
                    className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex flex-col gap-1 mt-1 max-h-[200px] overflow-y-auto custom-scrollbar">
                  {pinnedBatches.length === 0 ? (
                    <div className="text-center py-4 text-xs text-zinc-500">
                      No friends added yet.
                    </div>
                  ) : (
                    pinnedBatches.map(batch => (
                      <FriendStatusRow 
                        key={batch}
                        batch={batch}
                        timetables={timetables}
                        isSelected={selectedBatch === batch}
                        onClick={() => {
                          setViewingFriendBatch(batch);
                          setIsOpen(false);
                          router.push('/timetable');
                        }}
                        onRemove={() => unpinBatch(batch)}
                      />
                    ))
                  )}
                </div>
              </div>
            ) : (
              // Add Friend View
              <div className="flex flex-col p-2 h-[260px]">
                <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/5 mb-2">
                  <Search className="w-3.5 h-3.5 text-zinc-500" />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Search batch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none text-sm text-white focus:outline-none w-full placeholder:text-zinc-600"
                  />
                  <button onClick={() => setIsAdding(false)} className="p-1 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                  {filteredBatches.length === 0 ? (
                    <div className="text-center py-4 text-xs text-zinc-500">
                      No batches found.
                    </div>
                  ) : (
                    filteredBatches.map(batch => (
                      <button
                        key={batch}
                        onClick={() => {
                          pinBatch(batch);
                          setSelectedBatch(batch);
                          setIsAdding(false);
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-between w-full text-left px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                      >
                        <span className="font-medium">{batch}</span>
                        <Plus className="w-3.5 h-3.5 opacity-50" />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Temporary icon for internal use in this component
function ArrowLeft(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  );
}
