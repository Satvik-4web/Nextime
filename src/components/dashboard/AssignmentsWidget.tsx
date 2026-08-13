"use client";

import { useState } from "react";
import { ArrowRight, Circle, Plus } from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/stores/useAppStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AddAssignmentModal } from "./AddAssignmentModal";

export function AssignmentsWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { assignments, toggleAssignment } = useAppStore();
  const { addToast } = useNotificationStore();
  
  const handleToggle = (assignment: any) => {
    toggleAssignment(assignment.id);
    if (!assignment.completed) {
      addToast({
        type: "ASSIGNMENT",
        title: "ASSIGNMENT COMPLETED",
        message: `${assignment.title}. Nice. One less thing to worry about.`,
        priority: "LOW"
      });
    }
  };
  
  const pendingAssignments = assignments
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3); // Show top 3 pending

  const dueSoonCount = assignments.filter(a => !a.completed && (new Date(a.dueDate).getTime() - Date.now()) < 86400000 * 3).length;
  return (
    <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col h-[200px] group hover:border-white/10 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-black tracking-widest uppercase text-zinc-500">Assignments</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-zinc-500 mr-2">
            <span className={cn("text-lg", dueSoonCount > 0 ? "text-red-400" : "text-white")}>{pendingAssignments.length}</span> Pending
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-hidden">
        <AnimatePresence>
          {pendingAssignments.length > 0 ? pendingAssignments.map((assignment) => (
            <motion.div 
              key={assignment.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between group/item cursor-pointer"
              onClick={() => handleToggle(assignment)}
            >
              <div className="flex items-center gap-3">
                <button className="text-zinc-600 group-hover/item:text-primary transition-colors">
                  <Circle className="w-4 h-4" />
                </button>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-zinc-200 group-hover/item:text-white transition-colors truncate max-w-[150px]">{assignment.title}</span>
                  <span className="text-[10px] font-medium text-zinc-500">{assignment.courseCode}</span>
                </div>
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                assignment.priority === "high" ? "bg-red-500/10 text-red-400" :
                assignment.priority === "medium" ? "bg-orange-500/10 text-orange-400" :
                "bg-zinc-500/10 text-zinc-400"
              )}>
                {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </motion.div>
          )) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs font-medium text-zinc-600">All caught up!</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      <Link href="/assignments" className="flex items-center justify-center gap-2 w-full pt-3 mt-auto border-t border-white/5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
        View all assignments
        <ArrowRight className="w-3 h-3" />
      </Link>

      <AddAssignmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
