"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, Home, Calendar, CheckSquare, Timer, 
  Users, BookOpen, BarChart2, Activity, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROUTES = [
  { id: "home", name: "Home Dashboard", path: "/dashboard", icon: Home, shortcut: "H" },
  { id: "timetable", name: "Timetable & Classes", path: "/timetable", icon: Calendar, shortcut: "T" },
  { id: "tasks", name: "Assignments & Tasks", path: "/assignments", icon: CheckSquare, shortcut: "A" },
  { id: "study", name: "Study Session (Lofi)", path: "/study", icon: Timer, shortcut: "S" },
  { id: "community", name: "Community & Q&A", path: "/dashboard/community", icon: Users, shortcut: "C" },
  { id: "notes", name: "Notes & Notebooks", path: "/notes", icon: BookOpen, shortcut: "N" },
  { id: "analytics", name: "CGPA Calculator", path: "/analytics", icon: BarChart2, shortcut: "G" },
  { id: "attendance", name: "Attendance & Safe Bunk", path: "/attendance", icon: Activity, shortcut: "B" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for custom event from TopNav Search bar
  useEffect(() => {
    const handleOpenCommandPalette = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleOpenCommandPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenCommandPalette);
  }, []);

  const filteredRoutes = ROUTES.filter(route => 
    route.name.toLowerCase().includes(query.toLowerCase()) || 
    route.path.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
    }
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredRoutes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredRoutes.length) % filteredRoutes.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredRoutes[selectedIndex]) {
        handleNavigate(filteredRoutes[selectedIndex].path);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-center items-start pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
            className="w-full max-w-xl bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-white/5 relative">
              <Search className="w-5 h-5 text-zinc-500 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Where do you want to go?"
                className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-zinc-600 font-medium"
              />
              <div className="text-[10px] font-bold text-zinc-600 bg-white/5 px-2 py-1 rounded">
                ESC to close
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2 custom-scrollbar">
              {filteredRoutes.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-medium text-sm">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="px-3 py-2 text-[10px] font-black tracking-widest uppercase text-zinc-500">
                    Navigation
                  </div>
                  {filteredRoutes.map((route, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <button
                        key={route.id}
                        onClick={() => handleNavigate(route.path)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-100 text-left",
                          isSelected ? "bg-white/10 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            isSelected ? "bg-[#3B3B70] text-white" : "bg-black/20 text-zinc-500"
                          )}>
                            <route.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{route.name}</div>
                            <div className="text-[10px] font-mono text-zinc-600 mt-0.5">{route.path}</div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2 text-zinc-500">
                            <span className="text-[10px] font-bold">Return</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 bg-[#050505] border-t border-white/5 flex items-center justify-between text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="bg-white/10 px-1.5 rounded text-[10px] font-sans">↑↓</kbd> to navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-white/10 px-1.5 rounded text-[10px] font-sans">↵</kbd> to open</span>
              </div>
              <div>NexTime OS</div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
