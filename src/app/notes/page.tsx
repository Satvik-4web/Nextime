"use client";

import { useState, useMemo } from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { BootTransition } from "@/components/dashboard/BootTransition";
import { BootWidget } from "@/components/dashboard/BootWidget";
import { useNotesStore, Note } from "@/stores/useNotesStore";
import { useAppStore } from "@/stores/useAppStore";
import { Search, Plus, Pin, Trash2, Edit2, FileText, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, togglePin } = useNotesStore();
  const { selectedBatch, timetables } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | "ALL">("ALL");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  
  // New Note State
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState<string>("GENERAL");

  // Get subjects for current batch
  const batchSubjects = useMemo(() => {
    if (!selectedBatch || !timetables[selectedBatch]) return [];
    const subjects = new Set(timetables[selectedBatch].map(e => e.subject));
    return Array.from(subjects).sort();
  }, [selectedBatch, timetables]);

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "ALL" || note.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    addNote(newTitle.trim(), newContent.trim(), newSubject === "GENERAL" ? null : newSubject);
    setIsCreating(false);
    setNewTitle("");
    setNewContent("");
    setNewSubject("GENERAL");
  };

  return (
    <BootTransition>
      <div className="flex flex-col min-h-screen w-full bg-[#050505]">
        <BootWidget direction="top" delayOffset={0.2}>
          <TopNav />
        </BootWidget>

        <main className="flex-1 p-6 pb-20 md:pb-24 relative z-10 flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto flex flex-col h-full gap-6">
            
            {/* Header Area */}
            <BootWidget direction="top" delayOffset={0.1}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-400" />
                    Notes
                  </h1>
                  <p className="text-zinc-500 font-medium mt-1 uppercase tracking-widest text-[10px]">
                    Personal Knowledge Base
                  </p>
                </div>
                
                <button
                  onClick={() => setIsCreating(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
                >
                  <Plus className="w-4 h-4" />
                  New Note
                </button>
              </div>
            </BootWidget>

            {/* Filters Area */}
            <BootWidget direction="top" delayOffset={0.15}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search notes..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                  <button
                    onClick={() => setSelectedSubject("ALL")}
                    className={cn(
                      "whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors border",
                      selectedSubject === "ALL" 
                        ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                        : "bg-[#0A0A0C] border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                    )}
                  >
                    All Subjects
                  </button>
                  {batchSubjects.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={cn(
                        "whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-colors border",
                        selectedSubject === subject
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                          : "bg-[#0A0A0C] border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                      )}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </BootWidget>

            {/* Creation Modal / Inline Form */}
            {isCreating && (
              <BootWidget direction="center" delayOffset={0}>
                <div className="bg-gradient-to-br from-[#0A0A0C] to-[#0A0A0C] border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Create New Note</span>
                      <button onClick={() => setIsCreating(false)} className="text-zinc-500 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <input 
                      type="text" 
                      placeholder="Note Title" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-transparent border-b border-white/10 pb-2 text-xl font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
                      autoFocus
                    />
                    
                    <select 
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="bg-[#111] border border-white/10 rounded-lg p-2 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500 transition-colors max-w-xs"
                    >
                      <option value="GENERAL">General (No Subject)</option>
                      {batchSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <textarea
                      placeholder="Start typing..."
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      className="bg-black/30 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 min-h-[150px] focus:outline-none focus:border-emerald-500/50 transition-colors resize-y"
                    />
                    
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleCreate}
                        disabled={!newTitle.trim()}
                        className="bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 text-black font-bold uppercase tracking-widest text-[10px] px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        Save Note
                      </button>
                    </div>
                  </div>
                </div>
              </BootWidget>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
              {filteredNotes.map((note, idx) => (
                <BootWidget key={note.id} direction="top" delayOffset={0.2 + (idx * 0.05)}>
                  <NoteCard 
                    note={note} 
                    isEditing={editingNoteId === note.id}
                    onEdit={() => setEditingNoteId(note.id)}
                    onSave={(updates) => {
                      updateNote(note.id, updates);
                      setEditingNoteId(null);
                    }}
                    onCancel={() => setEditingNoteId(null)}
                    onDelete={() => deleteNote(note.id)}
                    onTogglePin={() => togglePin(note.id)}
                    batchSubjects={batchSubjects}
                  />
                </BootWidget>
              ))}
              
              {filteredNotes.length === 0 && !isCreating && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-500 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <span className="text-sm font-medium">No notes found.</span>
                  <span className="text-[10px] uppercase tracking-widest mt-2">Create one to get started.</span>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </BootTransition>
  );
}

// Sub-component for individual notes
function NoteCard({ 
  note, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete, 
  onTogglePin,
  batchSubjects
}: {
  note: Note;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: Partial<Note>) => void;
  onCancel: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  batchSubjects: string[];
}) {
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editSubject, setEditSubject] = useState(note.subject || "GENERAL");

  if (isEditing) {
    return (
      <div className="bg-[#111] border border-emerald-500/50 rounded-2xl p-5 shadow-[0_0_20px_rgba(16,185,129,0.1)] flex flex-col gap-3">
        <input 
          type="text" 
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          className="bg-transparent border-b border-white/10 pb-1 text-lg font-bold text-white focus:outline-none focus:border-emerald-500"
        />
        <select 
          value={editSubject}
          onChange={(e) => setEditSubject(e.target.value)}
          className="bg-black border border-white/10 rounded p-1.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="GENERAL">General</option>
          {batchSubjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <textarea
          value={editContent}
          onChange={e => setEditContent(e.target.value)}
          className="bg-black/50 border border-white/5 rounded-lg p-3 text-sm text-zinc-300 min-h-[100px] focus:outline-none focus:border-emerald-500/50 resize-y"
        />
        <div className="flex justify-end gap-2 mt-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider">Cancel</button>
          <button 
            onClick={() => onSave({ title: editTitle.trim(), content: editContent.trim(), subject: editSubject === "GENERAL" ? null : editSubject })} 
            className="bg-emerald-500 text-black px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0C] border border-white/5 hover:border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col h-full group transition-colors relative overflow-hidden">
      {note.isPinned && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-xl pointer-events-none" />
      )}
      
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className="flex flex-col gap-1 pr-8">
          <h3 className="text-white font-bold leading-tight group-hover:text-emerald-400 transition-colors">
            {note.title}
          </h3>
          {note.subject && (
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
              {note.subject}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0">
          <button onClick={onTogglePin} className={cn("p-1.5 rounded-md hover:bg-white/5 transition-colors", note.isPinned ? "text-emerald-400" : "text-zinc-500")}>
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-md text-zinc-500 hover:text-blue-400 hover:bg-white/5 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <p className="text-sm text-zinc-400 whitespace-pre-wrap flex-1 mb-4 line-clamp-6 relative z-10">
        {note.content}
      </p>
      
      <div className="text-[9px] text-zinc-600 font-medium uppercase tracking-widest mt-auto border-t border-white/5 pt-3 relative z-10">
        Updated {new Date(note.updatedAt).toLocaleDateString()}
      </div>
    </div>
  );
}
