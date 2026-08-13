"use client";

import { useAppStore } from "@/stores/useAppStore";
import { CheckCircle2, AlertCircle, Calculator, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function AnalyticsPage() {
  const { selectedBatch, timetables, attendanceData, cgpaData } = useAppStore();

  const events = (selectedBatch && timetables[selectedBatch]) ? timetables[selectedBatch] : [];
  const uniqueSubjects = Array.from(new Set(events.map(e => e.subject)));

  // --- Attendance Calculations ---
  let totalAttended = 0;
  let totalHeld = 0;

  uniqueSubjects.forEach(sub => {
    const data = attendanceData[sub];
    if (data && data.total > 0) {
      totalAttended += data.attended;
      totalHeld += data.total;
    }
  });

  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 100) : 100;
  
  // --- CGPA Calculations ---
  let totalCredits = 0;
  let totalPoints = 0;

  uniqueSubjects.forEach(subject => {
    const data = cgpaData[subject] || { credits: 4, gradePoint: 8 };
    totalCredits += data.credits;
    totalPoints += data.credits * data.gradePoint;
  });

  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  if (!selectedBatch) {
    return (
      <main className="flex-1 p-8 flex items-center justify-center">
        <p className="text-zinc-500">Please select a batch from the dashboard first.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-8 pb-32">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-md">Academic Analytics</h1>
            <p className="text-zinc-400 mt-2 font-medium tracking-wide">Detailed breakdown for {selectedBatch}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: ATTENDANCE */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-primary" />
              Attendance Breakdown
            </h2>

            {/* Overall Card */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative w-40 h-40 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1A1A24" strokeWidth="12" />
                  <circle 
                    cx="80" cy="80" r="70" 
                    fill="transparent" 
                    stroke={overallPct < 75 && totalHeld > 0 ? "#EF4444" : "#8B5CF6"}
                    strokeWidth="12" 
                    strokeDasharray={439.8} 
                    strokeDashoffset={439.8 - (439.8 * (overallPct / 100))} 
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      overallPct < 75 && totalHeld > 0 ? "drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" : "drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]"
                    )}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black">{overallPct}%</span>
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">Total Attendance</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  You have attended <span className="text-white font-bold">{totalAttended}</span> out of <span className="text-white font-bold">{totalHeld}</span> total classes so far. 
                  {overallPct < 75 && totalHeld > 0 && <span className="text-red-400 font-bold block mt-2">Warning: You are below the 75% threshold!</span>}
                </p>
              </div>
            </div>

            {/* Subject Bars */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col gap-5">
              {uniqueSubjects.length === 0 ? (
                <div className="text-center text-zinc-500 py-10">No subjects found.</div>
              ) : (
                uniqueSubjects.map(subject => {
                  const data = attendanceData[subject] || { attended: 0, total: 0 };
                  const pct = data.total > 0 ? Math.round((data.attended / data.total) * 100) : 100;
                  const isDanger = pct < 75 && data.total > 0;

                  return (
                    <div key={subject} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-xs uppercase tracking-wider text-white line-clamp-1 flex-1 pr-4">{subject}</span>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-[10px] text-zinc-500 font-medium">{data.attended} / {data.total}</span>
                          <span className={cn(
                            "text-xs font-black w-12 text-right",
                            isDanger ? "text-red-400" : "text-emerald-400"
                          )}>{pct}%</span>
                        </div>
                      </div>
                      
                      <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            isDanger ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* RIGHT: CGPA */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <Calculator className="w-5 h-5 text-primary" />
              CGPA Forecast
            </h2>

            {/* Hero SGPA */}
            <div className="bg-gradient-to-br from-[#1A1A24] to-[#0A0A0C] border border-primary/20 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_20px_60px_rgba(139,92,246,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 pattern-dots" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-sm font-bold text-primary uppercase tracking-widest mb-2">Projected SGPA</span>
                <span className="text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                  {sgpa}
                </span>
                <span className="text-xs font-medium text-zinc-400 mt-4 tracking-wide bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                  Total Credits: {totalCredits}
                </span>
              </div>
            </div>

            {/* Credit Breakdown Table */}
            <div className="bg-[#0A0A0C] border border-white/5 rounded-3xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-widest text-zinc-500">
                      <th className="p-4 font-bold">Subject</th>
                      <th className="p-4 font-bold text-center">Cr.</th>
                      <th className="p-4 font-bold text-center">Grade</th>
                      <th className="p-4 font-bold text-right">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueSubjects.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-zinc-500">No subjects found.</td>
                      </tr>
                    ) : (
                      uniqueSubjects.map(subject => {
                        const data = cgpaData[subject] || { credits: 4, gradePoint: 8 };
                        const gradeLabel = GRADES.find(g => g.value === data.gradePoint)?.label.split(' ')[0] || 'A';
                        
                        return (
                          <tr key={subject} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                            <td className="p-4">
                              <span className="font-bold text-xs text-white uppercase line-clamp-1">{subject}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="text-xs font-medium text-zinc-400">{data.credits}</span>
                            </td>
                            <td className="p-4 text-center">
                              <span className="text-xs font-black text-primary px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
                                {gradeLabel}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <span className="text-xs font-bold text-white">{data.credits * data.gradePoint}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </section>

        </div>
      </div>
    </main>
  );
}
