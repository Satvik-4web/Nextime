"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, AlertCircle, HelpCircle } from "lucide-react";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { CommunityCategory } from "@/types/community";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const CATEGORIES: CommunityCategory[] = [
  "Question", "Assignment Help", "Concept", "Programming", "Exam Prep", "Resources", "Discussion"
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export function AskQuestionModal({ isOpen, onClose, defaultSubject }: Props) {
  const router = useRouter();
  const { addQuestion, currentUser } = useCommunityStore();
  
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<CommunityCategory>("Question");
  const [subjectName, setSubjectName] = useState(defaultSubject || "");
  const [anonymous, setAnonymous] = useState(false);
  const [tags, setTags] = useState("");
  
  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and description are required.");
      return;
    }

    setIsSubmitting(true);
    const tagArray = tags.split(",").map(t => t.trim()).filter(t => t.length > 0);

    try {
      const questionId = await addQuestion({
        authorId: currentUser.id,
        authorName: anonymous ? "Anonymous Student" : currentUser.displayName,
        authorAvatar: anonymous ? undefined : currentUser.avatar,
        title: title.trim(),
        body: body.trim(),
        category,
        subjectName: subjectName.trim() || undefined,
        tags: tagArray,
        anonymous
      });

      // Reset form
      setTitle("");
      setBody("");
      setCategory("Question");
      setSubjectName(defaultSubject || "");
      setTags("");
      setAnonymous(false);
      
      onClose();
      
      // Navigate to the new question
      router.push(`/dashboard/community/${questionId}`);
    } catch (err) {
      setError("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-2xl z-[201] overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#121214]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Ask a Question</h2>
                  <p className="text-xs text-zinc-400 font-medium">Get help from the student community</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <form id="ask-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-red-400 text-sm font-medium">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., How does the two-pointer approach work?"
                    className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Provide details. You can use markdown and code blocks..."
                    rows={6}
                    className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors custom-scrollbar resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500/50 transition-colors appearance-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Subject (Optional)</label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="E.g., Operating Systems"
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="E.g., Algorithms, C++, Midsem"
                    className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-fit mt-2">
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border transition-colors",
                    anonymous ? "bg-purple-500 border-purple-500" : "bg-[#121214] border-white/10 group-hover:border-white/20"
                  )}>
                    {anonymous && <X className="w-3 h-3 text-white rotate-45" style={{ display: 'none' }} />} 
                    {/* Checkmark icon for custom checkbox */}
                    {anonymous && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    )}
                  </div>
                  <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">Post Anonymously</span>
                </label>
              </form>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#121214] flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ask-form"
                disabled={isSubmitting}
                className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Post Question
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
