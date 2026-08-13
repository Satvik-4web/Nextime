import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TimetableEvent } from "@/types/timetable";

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  dueDate: string; // ISO format
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface AppState {
  selectedBatch: string | null;
  allBatches: string[];
  timetables: Record<string, TimetableEvent[]>;
  isLoaded: boolean;
  
  pinnedBatches: string[];
  customEvents: Record<string, Partial<TimetableEvent>>;
  
  // Phase 13 Electives
  electiveSlots: Record<string, boolean>;
  
  // Phase 6 & 7 Data
  attendanceData: Record<string, { attended: number; total: number }>;
  cgpaData: Record<string, { credits: number; gradePoint: number }>;
  promptedClasses: Record<string, boolean>;
  assignments: Assignment[];

  // Phase 9 Timer Data
  timerMode: 'focus' | 'shortBreak' | 'longBreak';
  timeLeft: number;
  timerDuration: number;
  isTimerRunning: boolean;
  
  // Phase 12 Boot Transition
  hasCompletedBoot: boolean;
  bootPhase: number;
  setBootPhase: (phase: number) => void;
  completeBoot: () => void;
  
  setSelectedBatch: (batch: string) => void;
  loadTimetables: () => Promise<void>;
  pinBatch: (batch: string) => void;
  unpinBatch: (batch: string) => void;
  updateEvent: (eventId: string, updates: Partial<TimetableEvent>) => void;
  updateAttendance: (subject: string, attended: number, total: number) => void;
  updateSubjectGrade: (subject: string, credits: number, gradePoint: number) => void;
  markClassPrompted: (dateClassId: string) => void;

  toggleElectiveSlot: (eventId: string) => void;

  addAssignment: (assignment: Omit<Assignment, "id" | "completed">) => void;
  toggleAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;

  setTimerMode: (mode: 'focus' | 'shortBreak' | 'longBreak') => void;
  setCustomDuration: (minutes: number) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
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
      electiveSlots: {},
      attendanceData: {},
      cgpaData: {},
      promptedClasses: {},
      assignments: [
        { id: "1", title: "Submit Lab Report 3", courseCode: "UCS668P", dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), priority: "high", completed: false },
        { id: "2", title: "Read Chapter 4", courseCode: "UCS50P", dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), priority: "medium", completed: false }
      ],

      timerMode: 'focus',
      timeLeft: 45 * 60,
      timerDuration: 45 * 60,
      isTimerRunning: false,

      hasCompletedBoot: false,
      bootPhase: 0,

      setBootPhase: (phase) => set({ bootPhase: phase }),
      completeBoot: () => set({ hasCompletedBoot: true, bootPhase: 8 }),

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

      toggleElectiveSlot: (eventId) => {
        set((state) => {
          const newSlots = { ...state.electiveSlots };
          if (newSlots[eventId]) {
            delete newSlots[eventId];
            
            // Also delete any custom overrides (picked subjects) if we untoggle an elective
            const newCustom = { ...state.customEvents };
            if (newCustom[eventId]) {
              delete newCustom[eventId];
            }
            return { electiveSlots: newSlots, customEvents: newCustom };
          } else {
            newSlots[eventId] = true;
            return { electiveSlots: newSlots };
          }
        });
      },

      addAssignment: (assignment) => {
        set((state) => ({
          assignments: [
            ...state.assignments,
            { ...assignment, id: Math.random().toString(36).substring(7), completed: false }
          ]
        }));
      },

      toggleAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.map(a => 
            a.id === id ? { ...a, completed: !a.completed } : a
          )
        }));
      },

      deleteAssignment: (id) => {
        set((state) => ({
          assignments: state.assignments.filter(a => a.id !== id)
        }));
      },

      setTimerMode: (mode) => {
        const durations = {
          focus: 45 * 60,
          shortBreak: 10 * 60,
          longBreak: 20 * 60
        };
        set({ 
          timerMode: mode, 
          timeLeft: durations[mode],
          timerDuration: durations[mode],
          isTimerRunning: false 
        });
      },

      setCustomDuration: (minutes) => {
        const seconds = minutes * 60;
        set({
          timeLeft: seconds,
          timerDuration: seconds,
          isTimerRunning: false
        });
      },

      toggleTimer: () => {
        set((state) => ({ isTimerRunning: !state.isTimerRunning }));
      },

      resetTimer: () => {
        set((state) => ({ 
          timeLeft: state.timerDuration,
          isTimerRunning: false 
        }));
      },

      tickTimer: () => {
        set((state) => {
          if (!state.isTimerRunning || state.timeLeft <= 0) return state;
          if (state.timeLeft === 1) {
            // Timer finished
            return { timeLeft: 0, isTimerRunning: false };
          }
          return { timeLeft: state.timeLeft - 1 };
        });
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
        electiveSlots: state.electiveSlots,
        attendanceData: state.attendanceData,
        cgpaData: state.cgpaData,
        promptedClasses: state.promptedClasses,
        assignments: state.assignments
        // Intentionally not persisting timer state so it resets on hard reload
      }),
    }
  )
);
