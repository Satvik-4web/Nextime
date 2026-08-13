"use client";

import { TimetableEvent } from "@/types/timetable";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Clock, CheckCircle2, FileText, CalendarDays, Edit2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppStore } from "@/stores/useAppStore";

interface Props {
  event: TimetableEvent | null;
  onClose: () => void;
}

export function TimetableDetailPanel({ event, onClose }: Props) {
  const { updateEvent } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState("");
  const [editRoom, setEditRoom] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (event) {
      setEditSubject(event.subject);
      setEditRoom(event.room);
      setIsEditing(false);
    }
  }, [event]);

  const handleSave = () => {
    if (event) {
      updateEvent(event.id, { subject: editSubject, room: editRoom });
      setIsEditing(false);
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {event && createPortal(
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-white/10 shadow-2xl z-50 p-6 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className={cn(
                  "inline-block px-2.5 py-1 rounded-md text-xs font-bold uppercase mb-3",
                  event.type === "lecture" ? "bg-primary/20 text-primary" :
                  event.type === "lab" ? "bg-cyan/20 text-cyan" :
                  "bg-accent/20 text-accent"
                )}>
                  {event.type}
                </span>
                {isEditing ? (
                  <input 
                    value={editSubject}
                    onChange={e => setEditSubject(e.target.value)}
                    className="text-2xl font-bold block bg-[#121214] border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-primary w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-bold leading-tight">{event.subject}</h2>
                )}
                <p className="text-zinc-400 mt-1 font-mono text-sm">{event.code} • {event.batch}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">{event.day}</p>
                  <p className="font-medium">{event.startTime} — {event.endTime}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-500 font-medium">Room</p>
                  {isEditing ? (
                    <input 
                      value={editRoom}
                      onChange={e => setEditRoom(e.target.value)}
                      className="font-medium bg-[#121214] border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-primary w-full"
                    />
                  ) : (
                    <p className="font-medium">{event.room}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 font-medium">Instructor</p>
                  <p className="font-medium">{event.instructor}</p>
                </div>
              </div>
            </div>

            {/* Attendance & Actions */}
            <div className="mt-8 pt-8 border-t border-white/10 flex-1">
              {event.attendancePct !== undefined && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Attendance</h3>
                  <div className="bg-panel rounded-xl p-4 flex items-center justify-between border border-white/5">
                    <span className="font-medium">Current Status</span>
                    <span className={cn(
                      "text-xl font-bold",
                      event.attendancePct < 75 ? "text-red-400" : "text-emerald-400"
                    )}>
                      {event.attendancePct}%
                    </span>
                  </div>
                </div>
              )}

              <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center gap-2 bg-panel hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">Mark Present</span>
                </button>
                <button className="flex items-center gap-2 bg-panel hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium">Mark Absent</span>
                </button>
                <button className="flex items-center gap-2 bg-panel hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Add Note</span>
                </button>
                <button className="flex items-center gap-2 bg-panel hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-colors">
                  <CalendarDays className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Assignments</span>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              {isEditing ? (
                <div className="flex gap-3">
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-semibold text-sm flex justify-center items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors font-semibold text-sm flex justify-center items-center gap-2">
                    <Check className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-semibold text-sm flex justify-center items-center gap-2">
                  <Edit2 className="w-4 h-4" /> Edit Class Details
                </button>
              )}
            </div>

          </motion.div>
        </>,
        document.body
      )}
    </AnimatePresence>
  );
}
