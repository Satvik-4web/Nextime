"use client";

import { useState } from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { BootTransition } from "@/components/dashboard/BootTransition";
import { BootWidget } from "@/components/dashboard/BootWidget";
import { Search, Plus, Filter, MessageSquare, ArrowUp, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunityStore } from "@/stores/useCommunityStore";
import { CommunityQuestion } from "@/types/community";
import Link from "next/link";
import { AskQuestionModal } from "@/components/community/AskQuestionModal";
import { CommunityChatWidget } from "@/components/community/CommunityChatWidget";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"Recent" | "Unanswered">("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  
  const { questions } = useCommunityStore();

  const filteredQuestions = questions.filter(q => {
    if (activeTab === "Unanswered" && q.replyCount > 0) return false;
    if (searchQuery && !q.title.toLowerCase().includes(searchQuery.toLowerCase()) && !q.subjectName?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <BootTransition>
      <div className="flex flex-col min-h-screen w-full bg-[#050505]">
        <BootWidget direction="top" delayOffset={0.2}>
          <TopNav />
        </BootWidget>
        
        <main className="flex-1 p-6 pb-20 md:pb-24 relative z-10 flex flex-col">
          <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-6">
            
            {/* Header section */}
            <BootWidget direction="center" delayOffset={0}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] pointer-events-none rounded-full" />
                
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-400" />
                    COMMUNITY
                  </h1>
                  <p className="text-zinc-400 mt-2 font-medium">Learn together. Ask questions, share resources, and help others.</p>
                </div>

                <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm font-bold">
                  Community feature is currently offline for scheduled maintenance.
                </div>
              </div>
            </BootWidget>

            {/* Controls */}
            <BootWidget direction="center" delayOffset={0.1}>
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
                <div className="flex bg-[#0A0A0C] border border-white/5 rounded-xl p-1 shadow-lg w-full sm:w-auto">
                  {["Recent", "Unanswered"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={cn(
                        "flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === tab 
                          ? "bg-white/10 text-white shadow-sm" 
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search questions, subjects..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0A0C] border border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-lg"
                  />
                </div>
              </div>
            </BootWidget>

            {/* Feed */}
            <BootWidget direction="center" delayOffset={0.2}>
              <div className="flex flex-col gap-4">
                {filteredQuestions.length === 0 ? (
                  <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-lg">
                    <MessageSquare className="w-12 h-12 text-zinc-700 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-300 mb-2">Nothing found here</h3>
                    <p className="text-zinc-500 max-w-sm">
                      {searchQuery 
                        ? "Try adjusting your search terms." 
                        : "Be the first to ask a question in this category!"}
                    </p>
                    <p className="mt-4 text-xs font-bold text-yellow-500/70">
                      Check back soon!
                    </p>
                  </div>
                ) : (
                  filteredQuestions.map((q) => (
                    <QuestionCard key={q.id} question={q} />
                  ))
                )}
              </div>
            </BootWidget>

            <CommunityChatWidget />

          </div>
        </main>
      </div>

      <AskQuestionModal isOpen={isAskModalOpen} onClose={() => setIsAskModalOpen(false)} />
    </BootTransition>
  );
}

function QuestionCard({ question }: { question: CommunityQuestion }) {
  return (
    <Link 
      href={`/dashboard/community/${question.id}`}
      className="bg-[#0A0A0C] border border-white/5 hover:border-white/10 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row gap-5 transition-all group"
    >
      {/* Upvotes Column - hidden on small screens and moved below */}
      <div className="hidden sm:flex flex-col items-center gap-1 min-w-[40px]">
        <button className="p-1 rounded text-zinc-500 group-hover:text-purple-400 transition-colors">
          <ArrowUp className="w-5 h-5" />
        </button>
        <span className="font-black text-white">{question.upvotes}</span>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {question.subjectName && (
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {question.subjectName}
            </span>
          )}
          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/5 text-zinc-400 border border-white/10">
            {question.category}
          </span>
          <span className="text-xs text-zinc-500 ml-auto flex items-center gap-1.5">
            <User className="w-3 h-3" />
            {question.authorName} • {getTimeAgo(question.createdAt)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-purple-300 transition-colors">
          {question.title}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-2 mb-4 leading-relaxed">
          {question.body}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            {question.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold text-zinc-500 bg-white/[0.02] px-1.5 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Mobile upvotes */}
            <div className="flex sm:hidden items-center gap-1 text-zinc-400 font-bold text-sm">
              <ArrowUp className="w-4 h-4" />
              {question.upvotes}
            </div>
            
            <div className={cn(
              "flex items-center gap-1.5 text-sm font-bold",
              question.acceptedAnswerId 
                ? "text-emerald-400" 
                : question.replyCount > 0 
                  ? "text-zinc-300" 
                  : "text-zinc-500"
            )}>
              <MessageSquare className="w-4 h-4" />
              {question.replyCount} {question.replyCount === 1 ? 'reply' : 'replies'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
