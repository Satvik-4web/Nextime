"use client";

import { useAppStore } from "@/stores/useAppStore";
import { TopNav } from "@/components/dashboard/TopNav";
import { BootTransition } from "@/components/dashboard/BootTransition";
import { BootWidget } from "@/components/dashboard/BootWidget";
import { Activity, ShieldCheck, AlertTriangle, Crosshair, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export default function AttendancePage() {
  const { selectedBatch, timetables, attendanceData } = useAppStore();

  const events = (selectedBatch && timetables[selectedBatch]) ? timetables[selectedBatch] : [];
  const uniqueSubjects = Array.from(new Set(events.map(e => e.subject))).sort();

  // Calculate overall attendance
  let totalAttended = 0;
  let totalHeld = 0;

  uniqueSubjects.forEach(sub => {
    const data = attendanceData[sub];
    if (data && data.total > 0) {
      totalAttended += data.attended;
      totalHeld += data.total;
    }
  });

  const overallPct = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 0;
  const isOverallSafe = overallPct >= 75;

  return (
    <BootTransition>
      <div className="flex flex-col min-h-screen w-full bg-[#050505]">
        <BootWidget direction="top" delayOffset={0.2}>
          <TopNav />
        </BootWidget>

        <main className="flex-1 p-6 pb-20 md:pb-24 relative z-10 flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto flex flex-col h-full gap-6">
            
            {/* Header Area */}
            <BootWidget direction="top" delayOffset={0.1}>
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                  <Activity className="w-8 h-8 text-rose-500" />
                  Attendance
                </h1>
                <p className="text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
                  Analytics & Margin Calculator
                </p>
              </div>
            </BootWidget>

            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Attendance */}
              <BootWidget direction="top-left" delayOffset={0.15}>
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-1">Overall Status</div>
                    <div className="flex items-end gap-2">
                      <span className={cn("text-5xl font-black tracking-tighter", isOverallSafe ? "text-white" : "text-rose-500")}>
                        {totalHeld > 0 ? overallPct.toFixed(1) : "0"}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    {totalHeld === 0 ? (
                      <span className="text-xs font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">No Data</span>
                    ) : isOverallSafe ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Safe Zone
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-1 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
                      </span>
                    )}
                  </div>
                </div>
              </BootWidget>

              {/* Total Classes */}
              <BootWidget direction="lower-left" delayOffset={0.2}>
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-1">Total Classes</div>
                    <div className="flex items-end gap-2 text-white">
                      <span className="text-5xl font-black tracking-tighter">{totalHeld}</span>
                      <span className="text-sm font-bold text-zinc-500 mb-1.5 uppercase tracking-wider">Held</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded">
                      {totalAttended} Attended
                    </span>
                  </div>
                </div>
              </BootWidget>

              {/* Target */}
              <BootWidget direction="right" delayOffset={0.25}>
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-black tracking-widest uppercase text-zinc-500 mb-1">University Target</div>
                    <div className="flex items-end gap-2 text-white">
                      <span className="text-5xl font-black tracking-tighter">75</span>
                      <span className="text-3xl font-black tracking-tighter text-zinc-600">%</span>
                    </div>
                  </div>
                  <div className="mt-6 text-xs text-zinc-500 font-medium">
                    Calculations below are based on this hard requirement.
                  </div>
                </div>
              </BootWidget>
            </div>

            {/* Subject Breakdown */}
            <BootWidget direction="top" delayOffset={0.3}>
              <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 shadow-xl mt-2">
                <div className="flex items-center gap-2 mb-6">
                  <Crosshair className="w-5 h-5 text-zinc-400" />
                  <h2 className="text-lg font-black uppercase tracking-wider text-white">Subject Analysis</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueSubjects.map((sub, idx) => {
                    const data = attendanceData[sub] || { attended: 0, total: 0 };
                    const pct = data.total > 0 ? (data.attended / data.total) * 100 : 0;
                    const safe = pct >= 75;
                    
                    // Margin calculations
                    let marginText = "";
                    let marginColor = "";
                    let marginIcon = null;

                    if (data.total === 0) {
                      marginText = "No classes recorded yet";
                      marginColor = "text-zinc-500";
                      marginIcon = <HelpCircle className="w-3.5 h-3.5" />;
                    } else if (safe) {
                      // How many can they bunk? (B)
                      // B <= (Attended - 0.75 * Total) / 0.75
                      const safeBunks = Math.floor((data.attended - 0.75 * data.total) / 0.75);
                      if (safeBunks > 0) {
                        marginText = `Safe to skip ${safeBunks} ${safeBunks === 1 ? 'class' : 'classes'}`;
                        marginColor = "text-emerald-400 bg-emerald-500/10";
                        marginIcon = <CheckCircle2 className="w-3.5 h-3.5" />;
                      } else {
                        marginText = "On the edge! Cannot skip next class.";
                        marginColor = "text-amber-400 bg-amber-500/10";
                        marginIcon = <AlertTriangle className="w-3.5 h-3.5" />;
                      }
                    } else {
                      // How many do they need to attend? (C)
                      // C >= (0.75 * Total - Attended) / 0.25
                      const needed = Math.ceil((0.75 * data.total - data.attended) / 0.25);
                      marginText = `Must attend next ${needed} ${needed === 1 ? 'class' : 'classes'}`;
                      marginColor = "text-rose-400 bg-rose-500/10";
                      marginIcon = <AlertTriangle className="w-3.5 h-3.5" />;
                    }

                    return (
                      <div key={sub} className="bg-black border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-zinc-200 leading-tight line-clamp-2 pr-4">{sub}</h3>
                          <div className={cn("text-xl font-black", safe ? "text-white" : "text-rose-500")}>
                            {data.total > 0 ? pct.toFixed(0) : "0"}%
                          </div>
                        </div>
                        
                        {/* Mini progress bar */}
                        <div className="w-full h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all duration-1000", safe ? "bg-emerald-500" : "bg-rose-500")} 
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            {data.attended} / {data.total} Attended
                          </span>
                        </div>

                        <div className={cn("mt-3 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5", marginColor, !marginColor.includes('bg-') && "bg-white/5")}>
                          {marginIcon}
                          {marginText}
                        </div>
                      </div>
                    );
                  })}

                  {uniqueSubjects.length === 0 && (
                    <div className="col-span-full py-12 text-center text-zinc-500 text-sm">
                      No subjects found in your timetable.
                    </div>
                  )}
                </div>
              </div>
            </BootWidget>

          </div>
        </main>
      </div>
    </BootTransition>
  );
}
