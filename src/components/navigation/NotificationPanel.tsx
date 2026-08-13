"use client";

import { useNotificationStore } from "@/stores/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, Info, Clock, Bell, Trash2, CheckCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { AppNotification } from "@/types/notification";

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotificationStore();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-full transition-colors relative",
          isOpen ? "bg-white/10" : "hover:bg-white/10"
        )}
      >
        <Bell className="w-5 h-5 text-zinc-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#121214]"></span>
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 flex flex-col max-h-[70vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-[#121214]/50 flex justify-between items-center">
              <h3 className="font-bold text-white flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-zinc-300">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAll}
                    className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-red-400"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0A0A0C] to-[#050505] p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                  <Bell className="w-8 h-8 mb-3 opacity-20" />
                  <p className="text-sm font-medium">All caught up!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {notifications.map((notif) => (
                    <NotificationRow key={notif.id} notification={notif} onRead={() => markAsRead(notif.id)} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationRow({ notification: n, onRead }: { notification: AppNotification, onRead: () => void }) {
  let Icon = Info;
  let iconColor = "text-zinc-500 bg-white/5";
  
  if (n.priority === "CRITICAL") {
    Icon = XCircle;
    iconColor = "text-red-400 bg-red-400/10";
  } else if (n.type === "STUDY" || n.type === "ATTENDANCE") {
    Icon = CheckCircle2;
    iconColor = "text-emerald-400 bg-emerald-400/10";
  } else if (n.priority === "HIGH") {
    Icon = AlertCircle;
    iconColor = "text-amber-400 bg-amber-400/10";
  } else if (n.type === "CLASS" || n.type === "TIMETABLE") {
    Icon = Clock;
    iconColor = "text-blue-400 bg-blue-400/10";
  }

  const handleAction = () => {
    onRead();
    // In a real implementation, we'd trigger the respective global modal or route
    // based on n.primaryAction?.type here.
  };

  return (
    <div 
      onClick={() => {
        if (!n.read) onRead();
      }}
      className={cn(
        "p-3 rounded-xl flex items-start gap-3 transition-colors cursor-pointer border border-transparent",
        !n.read ? "bg-white/[0.04] hover:bg-white/[0.06] border-white/5" : "hover:bg-white/[0.02] opacity-70 hover:opacity-100"
      )}
    >
      <div className={cn("p-2 rounded-lg flex-shrink-0 mt-0.5", iconColor)}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <span className={cn("font-bold text-sm truncate", !n.read ? "text-white" : "text-zinc-300")}>
            {n.title}
          </span>
          {!n.read && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          )}
        </div>
        
        {n.subject && (
          <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase mt-0.5 truncate">
            {n.subject} {n.courseCode ? `· ${n.courseCode}` : ""}
          </span>
        )}
        
        <span className="text-xs text-zinc-500 mt-1 line-clamp-2">
          {n.message}
        </span>
        
        {n.primaryAction && (
          <div className="mt-3 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); handleAction(); }}
              className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex-1"
            >
              {n.primaryAction.label}
            </button>
            {n.secondaryAction && (
              <button 
                onClick={(e) => { e.stopPropagation(); onRead(); }}
                className="px-3 py-1.5 rounded-md bg-transparent border border-white/10 hover:bg-white/5 text-xs font-semibold text-zinc-300 transition-colors flex-1"
              >
                {n.secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
