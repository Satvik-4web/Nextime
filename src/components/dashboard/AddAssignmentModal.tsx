"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAssignmentModal({ isOpen, onClose }: Props) {
  const { addAssignment } = useAppStore();
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseCode || !dueDate) return;

    addAssignment({
      title,
      courseCode,
      dueDate: new Date(dueDate).toISOString(),
      priority,
    });
    
    setTitle("");
    setCourseCode("");
    setDueDate("");
    setPriority("medium");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0A0A0C] border border-white/10 rounded-2xl p-6 z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Add Assignment</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="e.g. Lab Report 3"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Course Code</label>
                  <input 
                    type="text" 
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors uppercase"
                    placeholder="e.g. UCS668P"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Due Date</label>
                  <input 
                    type="date" 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Priority</label>
                <div className="flex gap-2">
                  {(["high", "medium", "low"] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${
                        priority === p 
                          ? (p === "high" ? "bg-red-500/20 border-red-500/50 text-red-400" : 
                             p === "medium" ? "bg-orange-500/20 border-orange-500/50 text-orange-400" : 
                             "bg-zinc-500/20 border-zinc-500/50 text-zinc-400")
                          : "bg-[#121214] border-white/5 text-zinc-500 hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="mt-4 w-full bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Create Assignment
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
