"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SetupModal() {
  const { selectedBatch, allBatches, setSelectedBatch, loadTimetables, isLoaded } = useAppStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTimetables();
  }, [loadTimetables]);

  // If a batch is already selected, don't show the setup modal
  if (selectedBatch || !isLoaded) return null;

  const filteredBatches = allBatches.filter(b => b.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0A0A0C] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-[0_0_50px_rgba(37,99,235,0.15)] flex flex-col"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Welcome to NexTime.</h2>
            <p className="text-zinc-400">Please select your batch to sync your university timetable.</p>
          </div>

          <div className="relative mb-6">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search your batch (e.g. 1B1)" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#121214] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex-1 max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
            {filteredBatches.length > 0 ? (
              filteredBatches.map(batch => (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                >
                  <span className="font-semibold text-lg">{batch}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                  </span>
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-500">
                No batches found matching "{search}"
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
