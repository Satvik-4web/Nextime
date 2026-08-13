"use client";

import { useNotificationStore } from "@/stores/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { activeToasts, removeToast } = useNotificationStore();

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <AnimatePresence>
        {activeToasts.map((toast) => {
          
          let Icon = Info;
          let iconColor = "text-zinc-400";
          
          if (toast.priority === "CRITICAL") {
            Icon = XCircle;
            iconColor = "text-red-400";
          } else if (toast.type === "STUDY" || toast.title.includes("COMPLETED") || toast.title.includes("FINISHED")) {
            Icon = CheckCircle2;
            iconColor = "text-emerald-400";
          } else if (toast.priority === "HIGH") {
            Icon = AlertCircle;
            iconColor = "text-amber-400";
          } else if (toast.type === "CLASS" || toast.type === "TIMETABLE") {
            Icon = Clock;
            iconColor = "text-blue-400";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-[#0A0A0C]/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden group"
            >
              <div className={cn("mt-0.5", iconColor)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-sm text-white">{toast.title}</span>
                <span className="text-xs text-zinc-400 mt-0.5">{toast.message}</span>
              </div>
              
              {/* Subtle progress bar at bottom showing it will disappear */}
              <motion.div 
                className="absolute bottom-0 left-0 h-[2px] bg-white/20"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
