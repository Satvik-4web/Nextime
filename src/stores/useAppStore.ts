import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimetableEvent } from "@/types/timetable";

interface AppState {
  selectedBatch: string | null;
  allBatches: string[];
  timetables: Record<string, TimetableEvent[]>;
  isLoaded: boolean;
  
  pinnedBatches: string[];
  customEvents: Record<string, Partial<TimetableEvent>>;
  
  // Phase 6 & 7 Data
  attendanceData: Record<string, { attended: number; total: number }>;
  cgpaData: Record<string, { credits: number; gradePoint: number }>;
  promptedClasses: Record<string, boolean>;
  
  setSelectedBatch: (batch: string) => void;
  loadTimetables: () => Promise<void>;
  pinBatch: (batch: string) => void;
  unpinBatch: (batch: string) => void;
  updateEvent: (eventId: string, updates: Partial<TimetableEvent>) => void;
  updateAttendance: (subject: string, attended: number, total: number) => void;
  updateSubjectGrade: (subject: string, credits: number, gradePoint: number) => void;
  markClassPrompted: (dateClassId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedBatch: null,
      allBatches: [],
      timetables: {},
      isLoaded: false,
      pinnedBatches: [],
      customEvents: {},
      attendanceData: {},
      cgpaData: {},
      promptedClasses: {},

      setSelectedBatch: (batch) => {
        set({ selectedBatch: batch });
      },

      pinBatch: (batch) => {
        const { pinnedBatches } = get();
        if (!pinnedBatches.includes(batch)) {
          set({ pinnedBatches: [...pinnedBatches, batch] });
        }
      },

      unpinBatch: (batch) => {
        const { pinnedBatches } = get();
        set({ pinnedBatches: pinnedBatches.filter(b => b !== batch) });
      },

      updateEvent: (eventId, updates) => {
        set((state) => ({
          customEvents: {
            ...state.customEvents,
            [eventId]: {
              ...(state.customEvents[eventId] || {}),
              ...updates
            }
          }
        }));
      },

      updateAttendance: (subject, attended, total) => {
        set((state) => ({
          attendanceData: {
            ...state.attendanceData,
            [subject]: { attended, total }
          }
        }));
      },

      updateSubjectGrade: (subject, credits, gradePoint) => {
        set((state) => ({
          cgpaData: {
            ...state.cgpaData,
            [subject]: { credits, gradePoint }
          }
        }));
      },

      markClassPrompted: (dateClassId) => {
        set((state) => ({
          promptedClasses: {
            ...state.promptedClasses,
            [dateClassId]: true
          }
        }));
      },

      loadTimetables: async () => {
        try {
          const response = await fetch("/timetables.json");
          const data = await response.json();
          const batches = Object.keys(data);
          
          set({ 
            timetables: data, 
            allBatches: batches,
            isLoaded: true 
          });
        } catch (error) {
          console.error("Failed to load timetables:", error);
        }
      }
    }),
    {
      name: "nextime-store",
      partialize: (state) => ({ 
        selectedBatch: state.selectedBatch,
        pinnedBatches: state.pinnedBatches,
        customEvents: state.customEvents,
        attendanceData: state.attendanceData,
        cgpaData: state.cgpaData,
        promptedClasses: state.promptedClasses
      }),
    }
  )
);
