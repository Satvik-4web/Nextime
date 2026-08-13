"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "@/stores/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const { allBatches, pinBatch, pinnedBatches, selectedBatch } = useAppStore();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const availableBatches = allBatches.filter(b => b !== selectedBatch && !pinnedBatches.includes(b));
  const filteredBatches = availableBatches.filter(b => b.toLowerCase().includes(search.toLowerCase()));

  const handlePin = (batch: string) => {
    pinBatch(batch);
    onClose();
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && createPortal(
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#0A0A0C] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold">Pin a Friend's Timetable</h3>
                <p className="text-sm text-zinc-400">Add another batch to switch instantly.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search batch (e.g. 1B2)" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                autoFocus
              />
            </div>

            <div className="flex-1 max-h-[250px] overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-2">
              {filteredBatches.length > 0 ? (
                filteredBatches.map(batch => (
                  <button
                    key={batch}
                    onClick={() => handlePin(batch)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-left group"
                  >
                    <span className="font-semibold text-sm">{batch}</span>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Pin
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-zinc-500 text-sm">
                  No batches found
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </AnimatePresence>
  );
}
