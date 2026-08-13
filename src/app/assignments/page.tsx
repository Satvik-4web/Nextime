"use client";

import { useAppStore } from "@/stores/useAppStore";
import { TopNav } from "@/components/dashboard/TopNav";
import { CheckCircle2, Circle, Plus, Trash2, Clock, Calendar } from "lucide-react";
import { useState } from "react";
import { AddAssignmentModal } from "@/components/dashboard/AddAssignmentModal";
import { cn } from "@/lib/utils";

export default function AssignmentsPage() {
  const { assignments, toggleAssignment, deleteAssignment } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pending = assignments.filter(a => !a.completed).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const completed = assignments.filter(a => a.completed).sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <TopNav />
      
      <main className="flex-1 p-6 pb-32">
        <div className="max-w-5xl mx-auto mt-8">
          <div className="flex justify-between items-end mb-8">
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-white tracking-tight">Assignments</h1>
              <span className="text-zinc-500 font-medium tracking-wide mt-1">Manage your coursework and deadlines</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pending Column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <Clock className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Pending ({pending.length})</h2>
              </div>
              
              <div className="flex flex-col gap-3">
                {pending.map(assignment => (
                  <div key={assignment.id} className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 flex items-start gap-4 group hover:border-white/10 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <button onClick={() => toggleAssignment(assignment.id)} className="mt-1 text-zinc-600 hover:text-primary transition-colors">
                      <Circle className="w-5 h-5" />
                    </button>
                    <div className="flex-1 flex flex-col">
                      <span className="font-bold text-white text-lg">{assignment.title}</span>
                      <span className="text-xs font-medium text-zinc-400 mt-1">{assignment.courseCode}</span>
                      <div className="flex items-center gap-3 mt-4">
                        <span className={cn(
                          "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                          assignment.priority === "high" ? "bg-red-500/10 text-red-400" :
                          assignment.priority === "medium" ? "bg-orange-500/10 text-orange-400" :
                          "bg-zinc-500/10 text-zinc-400"
                        )}>
                          {assignment.priority} Priority
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-zinc-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => deleteAssignment(assignment.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {pending.length === 0 && (
                  <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl">
                    <span className="text-sm font-bold text-zinc-600">You are all caught up!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Column */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Completed ({completed.length})</h2>
              </div>
              
              <div className="flex flex-col gap-3 opacity-60">
                {completed.map(assignment => (
                  <div key={assignment.id} className="bg-[#0A0A0C] border border-emerald-500/10 rounded-2xl p-4 flex items-start gap-4 group">
                    <button onClick={() => toggleAssignment(assignment.id)} className="mt-0.5 text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div className="flex-1 flex flex-col">
                      <span className="font-bold text-zinc-300 line-through decoration-zinc-600">{assignment.title}</span>
                      <span className="text-[10px] font-medium text-zinc-500 mt-1">{assignment.courseCode}</span>
                    </div>
                    <button onClick={() => deleteAssignment(assignment.id)} className="text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <AddAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
