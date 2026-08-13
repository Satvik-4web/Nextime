import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppNotification } from "@/types/notification";

export interface NotificationSettings {
  classReminders: boolean;
  attendanceReminders: boolean;
  assignmentReminders: boolean;
  studyReminders: boolean;
  timetableChanges: boolean;
  reminderTimingMinutes: number; // e.g. 15, 10, 5
}

interface NotificationState {
  notifications: AppNotification[];
  settings: NotificationSettings;
  
  // Actions
  addNotification: (notification: AppNotification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  updateSettings: (updates: Partial<NotificationSettings>) => void;
  
  // Temporary toasts (these are active toasts to show in the UI, not persistent)
  activeToasts: AppNotification[];
  addToast: (toast: Omit<AppNotification, "id" | "read" | "timestamp">) => void;
  removeToast: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      activeToasts: [],
      settings: {
        classReminders: true,
        attendanceReminders: true,
        assignmentReminders: true,
        studyReminders: true,
        timetableChanges: true,
        reminderTimingMinutes: 15,
      },

      addNotification: (notification) => {
        set((state) => {
          // Deduplication: If notification with this ID already exists, do not duplicate.
          // Optional: we could update it, but deduplication prevents spam.
          const exists = state.notifications.find(n => n.id === notification.id);
          if (exists) return state;

          return {
            notifications: [notification, ...state.notifications]
          };
        });
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },

      clearAll: () => {
        set({ notifications: [] });
      },

      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates }
        }));
      },
      
      addToast: (toastData) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const fullToast: AppNotification = {
          ...toastData,
          id,
          read: true,
          timestamp: Date.now()
        };
        
        set((state) => ({
          activeToasts: [...state.activeToasts, fullToast]
        }));
        
        // Auto-remove toast after 4 seconds
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      
      removeToast: (id) => {
        set((state) => ({
          activeToasts: state.activeToasts.filter(t => t.id !== id)
        }));
      }
    }),
    {
      name: "nextime-notifications",
      partialize: (state) => ({
        notifications: state.notifications,
        settings: state.settings
      }),
    }
  )
);
