"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const GRADES = [
  { label: 'A+ (10)', value: 10 },
  { label: 'A (10)', value: 10 },
  { label: 'A- (9)', value: 9 },
  { label: 'B (8)', value: 8 },
  { label: 'B- (7)', value: 7 },
  { label: 'C (6)', value: 6 },
  { label: 'E (2)', value: 2 },
  { label: 'F (0)', value: 0 },
];

export function CgpaModal({ isOpen, onClose }: Props) {
  const { selectedBatch, timetables, cgpaData, updateSubjectGrade } = useAppStore();

  const events = (selectedBatch && timetables[selectedBatch]) ? timetables[selectedBatch] : [];
  const uniqueSubjects = Array.from(new Set(events.map(e => e.subject)));

  const getSubData = (subject: string) => {
    return cgpaData[subject] || { credits: 4, gradePoint: 8 };
  };

  let totalCredits = 0;
  let totalPoints = 0;

  uniqueSubjects.forEach(subject => {
    const data = getSubData(subject);
    totalCredits += data.credits;
    totalPoints += data.credits * data.gradePoint;
  });

  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

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
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-primary" />
                  SGPA Forecaster
                </h2>
                <p className="text-zinc-400 text-sm mt-1">Estimate your grades for {selectedBatch}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors bg-white/5">
                <X className="w-5 h-5 text-zinc-300" />
              </button>
            </div>

            {/* Total Display */}
            <div className="bg-primary/10 border-b border-primary/20 p-6 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-primary uppercase tracking-widest mb-1">Projected SGPA</span>
              <span className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                {sgpa}
              </span>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gradient-to-b from-[#0A0A0C] to-[#050505]">
              {uniqueSubjects.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">No subjects found for this batch.</div>
              ) : (
                <div className="flex flex-col gap-4">
                  {uniqueSubjects.map(subject => {
                    const data = getSubData(subject);

                    return (
                      <div key={subject} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.04] transition-colors">
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-sm tracking-wide text-white uppercase leading-tight">
                            {subject}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 bg-[#050505] p-2 rounded-xl border border-white/5">
                          {/* Credits Controls */}
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider pl-1">Credits</span>
                            <select 
                              value={data.credits}
                              onChange={(e) => updateSubjectGrade(subject, Number(e.target.value), data.gradePoint)}
                              className="bg-[#121214] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-white focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                              {[1,2,3,4,5,6].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>

                          <div className="w-[1px] h-8 bg-white/10" />

                          {/* Grade Controls */}
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 font-bold mb-1 uppercase tracking-wider pl-1">Expected Grade</span>
                            <select 
                              value={data.gradePoint}
                              onChange={(e) => updateSubjectGrade(subject, data.credits, Number(e.target.value))}
                              className="bg-[#121214] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-primary focus:outline-none focus:border-primary appearance-none cursor-pointer"
                            >
                              {GRADES.map(g => (
                                <option key={g.value} value={g.value}>{g.label}</option>
                              ))}
                            </select>
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
