"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { useTime } from "@/hooks/useTime";
import { parseTime } from "@/lib/timetableUtils";
import { TimetableEvent } from "@/types/timetable";
import { AppNotification } from "@/types/notification";

const WARNING_THRESHOLD = 75;
const CRITICAL_THRESHOLD = 65;

export function NotificationEngine() {
  const { selectedBatch, timetables, customEvents, attendanceData, assignments } = useAppStore();
  const { settings, addNotification, notifications, removeNotification, addToast } = useNotificationStore();
  
  // We use a 1-minute tick for evaluating triggers.
  const now = useTime(60000); 
  
  // Keep track of the current minute to avoid evaluating the same exact minute multiple times
  const lastEvaluatedMinute = useRef<number>(0);

  useEffect(() => {
    // Prevent evaluating multiple times for the exact same minute
    const currentMinute = Math.floor(now.getTime() / 60000);
    if (currentMinute === lastEvaluatedMinute.current) return;
    lastEvaluatedMinute.current = currentMinute;
    
    // --- 1. CLEANUP EXPIRED NOTIFICATIONS ---
    const nowMs = now.getTime();
    notifications.forEach(n => {
      if (n.expiresAt && nowMs > n.expiresAt) {
        removeNotification(n.id);
      }
    });

    if (!selectedBatch) return;

    // --- 2. CLASS REMINDERS ---
    if (settings.classReminders) {
      const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
      const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
      
      const batchEvents = timetables[selectedBatch] || [];
      const mergedEvents = batchEvents.map(event => ({
        ...event,
        ...(customEvents[event.id] || {})
      })) as TimetableEvent[];
      
      const todayEvents = mergedEvents.filter(e => e.day === dayName);
      
      todayEvents.forEach(event => {
        const startTime = parseTime(event.startTime, now);
        const diffMinutes = Math.round((startTime.getTime() - nowMs) / 60000);
        
        // "Next Class" warning
        if (diffMinutes === settings.reminderTimingMinutes) {
          addNotification({
            id: `class-upcoming-${dateStr}-${event.id}`,
            type: "CLASS",
            title: "NEXT CLASS",
            message: `Starts in ${diffMinutes} minutes`,
            priority: "HIGH",
            timestamp: nowMs,
            read: false,
            subject: event.subject,
            courseCode: event.room, // We pass room here as a hack, or in action
            expiresAt: startTime.getTime(), // Expires when class starts
            primaryAction: {
              label: "View Timetable",
              type: "VIEW_TIMETABLE"
            }
          });
        }
        
        // "Very Soon" warning
        if (diffMinutes === 5) {
          addNotification({
            id: `class-soon-${dateStr}-${event.id}`,
            type: "CLASS",
            title: "CLASS STARTING SOON",
            message: `Starts in 5 minutes`,
            priority: "HIGH",
            timestamp: nowMs,
            read: false,
            subject: event.subject,
            courseCode: event.room,
            expiresAt: startTime.getTime(),
            primaryAction: {
              label: "View Timetable",
              type: "VIEW_TIMETABLE"
            }
          });
        }
        
        // Class Finished -> Attendance Prompt
        // The AttendancePrompt component currently handles the popup.
        // We will just add an unread bell notification.
        const endTime = parseTime(event.endTime, now);
        const endDiffMinutes = Math.round((endTime.getTime() - nowMs) / 60000);
        
        if (endDiffMinutes === 0) { // Just finished
          // Check if this class is configured for attendance tracking (assume yes for now if it's not a free slot)
          addNotification({
            id: `class-finished-${dateStr}-${event.id}`,
            type: "ATTENDANCE",
            title: "CLASS FINISHED",
            message: `Did you attend ${event.subject}?`,
            priority: "NORMAL",
            timestamp: nowMs,
            read: false,
            subject: event.subject,
            expiresAt: nowMs + 86400000, // Expires in 24h
            primaryAction: {
              label: "Mark Present",
              type: "MARK_PRESENT",
              payload: { subject: event.subject }
            },
            secondaryAction: {
              label: "Mark Absent",
              type: "MARK_ABSENT",
              payload: { subject: event.subject }
            }
          });
        }
      });
    }

    // --- 3. ASSIGNMENT REMINDERS ---
    if (settings.assignmentReminders) {
      assignments.filter(a => !a.completed).forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const diffHours = (dueDate.getTime() - nowMs) / (1000 * 60 * 60);
        
        // Due tomorrow (24 hours)
        if (diffHours <= 24 && diffHours > 23) {
          addNotification({
            id: `assignment-24h-${assignment.id}`,
            type: "ASSIGNMENT",
            title: "ASSIGNMENT DUE TOMORROW",
            message: `Due tomorrow at ${dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            priority: "NORMAL",
            timestamp: nowMs,
            read: false,
            subject: assignment.title,
            expiresAt: dueDate.getTime(),
            primaryAction: {
              label: "Open Assignment",
              type: "VIEW_ASSIGNMENT"
            }
          });
        }
        
        // Due soon (3 hours)
        if (diffHours <= 3 && diffHours > 2) {
          addNotification({
            id: `assignment-3h-${assignment.id}`,
            type: "ASSIGNMENT",
            title: "DUE SOON",
            message: `3 hours remaining`,
            priority: "HIGH",
            timestamp: nowMs,
            read: false,
            subject: assignment.title,
            expiresAt: dueDate.getTime(),
            primaryAction: {
              label: "Open Assignment",
              type: "VIEW_ASSIGNMENT"
            }
          });
        }
        
        // Overdue (just passed)
        if (diffHours <= 0 && diffHours > -1) {
          addNotification({
            id: `assignment-overdue-${assignment.id}`,
            type: "ASSIGNMENT",
            title: "ASSIGNMENT OVERDUE",
            message: `Was due recently`,
            priority: "CRITICAL",
            timestamp: nowMs,
            read: false,
            subject: assignment.title,
            primaryAction: {
              label: "Open Assignment",
              type: "VIEW_ASSIGNMENT"
            }
          });
        }
      });
    }

    // --- 4. ATTENDANCE WARNINGS ---
    if (settings.attendanceReminders) {
      Object.entries(attendanceData).forEach(([subject, data]) => {
        if (data.total === 0) return;
        const percentage = (data.attended / data.total) * 100;
        
        // Notice we generate a somewhat stable ID based on current percentage range 
        // to avoid spamming every minute, but we want it to trigger when crossing thresholds.
        // Easiest deduplication is tying it to the total classes count.
        
        if (percentage < CRITICAL_THRESHOLD) {
          addNotification({
            id: `attendance-critical-${subject}-${data.total}`,
            type: "ATTENDANCE",
            title: "ATTENDANCE AT RISK",
            message: `Attendance is critically low (${Math.round(percentage)}%)`,
            priority: "CRITICAL",
            timestamp: nowMs,
            read: false,
            subject,
            primaryAction: {
              label: "View Attendance",
              type: "VIEW_ATTENDANCE"
            }
          });
        } else if (percentage < WARNING_THRESHOLD) {
          addNotification({
            id: `attendance-warning-${subject}-${data.total}`,
            type: "ATTENDANCE",
            title: "ATTENDANCE WARNING",
            message: `Attendance is ${Math.round(percentage)}%. Target: ${WARNING_THRESHOLD}%`,
            priority: "HIGH",
            timestamp: nowMs,
            read: false,
            subject,
            primaryAction: {
              label: "View Attendance",
              type: "VIEW_ATTENDANCE"
            }
          });
        }
      });
    }

  }, [now, settings, timetables, selectedBatch, customEvents, assignments, attendanceData, notifications, addNotification, removeNotification, addToast]);

  return null;
}
