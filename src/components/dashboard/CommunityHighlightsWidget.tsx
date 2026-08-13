"use client";

import { useCommunityStore } from "@/stores/useCommunityStore";
import { MessageSquare, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function CommunityHighlightsWidget() {
  const { questions } = useCommunityStore();
  
  // Show top 2 unanswered questions, or just recent questions
  const unanswered = questions.filter(q => q.replyCount === 0).slice(0, 2);
  const displayQuestions = unanswered.length > 0 ? unanswered : questions.slice(0, 2);

  return (
    <div className="bg-gradient-to-br from-[#0A0A0C] to-[#130A17] border border-purple-500/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col h-[200px] group hover:border-purple-500/40 transition-colors relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-black tracking-widest uppercase text-purple-400">Community</span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[9px] font-bold text-purple-300 uppercase tracking-wider">
          Unanswered
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 relative z-10 overflow-hidden">
        {displayQuestions.length > 0 ? (
          displayQuestions.map(q => (
            <Link 
              key={q.id}
              href={`/dashboard/community/${q.id}`} 
              className="flex flex-col group/item cursor-pointer"
            >
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-bold text-zinc-200 group-hover/item:text-purple-400 transition-colors line-clamp-1">
                  {q.title}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                {q.subjectName && (
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    {q.subjectName}
                  </span>
                )}
                <span className="text-[9px] text-zinc-600">•</span>
                <span className="text-[9px] font-medium text-zinc-500 flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {q.authorName}
                </span>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <span className="text-xs font-medium">All questions answered!</span>
          </div>
        )}
      </div>

      <Link 
        href="/dashboard/community" 
        className="flex items-center justify-center gap-2 w-full pt-3 mt-auto border-t border-purple-500/20 text-xs text-purple-400 hover:text-purple-300 transition-colors relative z-10 font-medium"
      >
        Go to Community
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
