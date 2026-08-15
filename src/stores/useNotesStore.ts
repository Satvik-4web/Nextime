import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getNowMs } from "@/lib/time";

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  subject: string | null;
  createdAt: number;
  updatedAt: number;
}

interface NotesState {
  notes: Note[];
  addNote: (title: string, content: string, subject?: string | null) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePin: (id: string) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: [],
      addNote: (title, content, subject = null) => set((state) => ({
        notes: [
          {
            id: `note-${getNowMs()}-${Math.random().toString(36).substring(2, 9)}`,
            title,
            content,
            isPinned: false,
            subject,
            createdAt: getNowMs(),
            updatedAt: getNowMs(),
          },
          ...state.notes,
        ]
      })),
      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map(note => 
          note.id === id 
            ? { ...note, ...updates, updatedAt: getNowMs() } 
            : note
        )
      })),
      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter(note => note.id !== id)
      })),
      togglePin: (id) => set((state) => ({
        notes: state.notes.map(note => 
          note.id === id 
            ? { ...note, isPinned: !note.isPinned, updatedAt: getNowMs() } 
            : note
        )
      }))
    }),
    {
      name: "nextime-notes-storage"
    }
  )
);
