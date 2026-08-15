"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AttendanceModal({ isOpen, onClose }: Props) {
  const { selectedBatch, timetables, attendanceData, updateAttendance } = useAppStore();

  const events = (selectedBatch && timetables[selectedBatch]) ? timetables[selectedBatch] : [];
  const uniqueSubjects = Array.from(new Set(events.map(e => e.subject)));

  // If there's no data for a subject, default to 0/0 or 10/10? Let's default to 0/0
  const getSubData = (subject: string) => {
    return attendanceData[subject] || { attended: 0, total: 0 };
  };

  const calculatePct = (attended: number, total: number) => {
    if (total === 0) return 100;
    return Number(((attended / total) * 100).toFixed(1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#0A0A0C] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] shadow-[0_0_50px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#050505]">
              <div>
                <h2 className="text-2xl font-bold text-white">Attendance Manager</h2>
                <p className="text-zinc-400 text-sm mt-1">Track your classes for {selectedBatch}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5">
                <X className="w-5 h-5 text-zinc-300" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-[#0A0A0C] to-[#050505]">
              {uniqueSubjects.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">No subjects found for this batch.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {uniqueSubjects.map(subject => {
                    const data = getSubData(subject);
                    const pct = calculatePct(data.attended, data.total);
                    const isDanger = pct < 75 && data.total > 0;

                    return (
                      <div key={subject} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors">
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-sm tracking-wide text-white uppercase leading-tight mb-2">
                            {subject}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className={cn("text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1", isDanger ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400")}>
                              {isDanger ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                              {pct}%
                            </span>
                            <span className="text-xs text-zinc-400 font-medium">
                              {data.attended} / {data.total} Classes Attended
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 bg-[#050505] p-2 rounded-xl border border-white/5">
                          {/* Attended Controls */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Attended</span>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateAttendance(subject, Math.max(0, data.attended - 1), data.total)}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold w-4 text-center">{data.attended}</span>
                              <button 
                                onClick={() => updateAttendance(subject, data.attended + 1, Math.max(data.total, data.attended + 1))}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <div className="w-[1px] h-10 bg-white/10" />

                          {/* Total Controls */}
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider">Total</span>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateAttendance(subject, Math.min(data.attended, data.total - 1), Math.max(0, data.total - 1))}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-bold w-4 text-center">{data.total}</span>
                              <button 
                                onClick={() => updateAttendance(subject, data.attended, data.total + 1)}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
