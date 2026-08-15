export type NotificationPriority = "CRITICAL" | "HIGH" | "NORMAL" | "LOW";
export type NotificationCategory = "CLASS" | "ATTENDANCE" | "ASSIGNMENT" | "STUDY" | "TIMETABLE" | "SYSTEM";

export interface NotificationAction {
  label: string;
  type: "VIEW_TIMETABLE" | "VIEW_ATTENDANCE" | "VIEW_ASSIGNMENT" | "MARK_PRESENT" | "MARK_ABSENT" | "DISMISS" | "OPEN_LINK";
  payload?: Record<string, unknown> | string | number | null;
}

export interface AppNotification {
  id: string; // Stable ID, e.g. "class-start-2026-08-13-LT401"
  type: NotificationCategory;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: number;
  read: boolean;
  expiresAt?: number;
  
  // Optional metadata context
  subject?: string;
  courseCode?: string;
  
  primaryAction?: NotificationAction;
  secondaryAction?: NotificationAction;
}
