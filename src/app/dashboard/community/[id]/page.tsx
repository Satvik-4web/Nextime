"use client";

import { useState, use } from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { BootTransition } from "@/components/dashboard/BootTransition";
import { BootWidget } from "@/components/dashboard/BootWidget";
import { ArrowLeft, User, MessageSquare, ArrowUp, CheckCircle2, Send, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCommunityStore } from "@/stores/useCommunityStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CommunityReply } from "@/types/community";

export default function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { questions, replies, currentUser, addReply, upvoteQuestion, upvoteReply, acceptReply } = useCommunityStore();
  
  const question = questions.find(q => q.id === id);
  const questionReplies = replies[id] || [];

  const [replyBody, setReplyBody] = useState("");

  if (!question) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-[#050505] text-white p-10">
        <h1>Question not found.</h1>
        <Link href="/dashboard/community" className="text-purple-400 mt-4 underline">Back to Community</Link>
      </div>
    );
  }

  const handleReplySubmit = () => {
    if (!replyBody.trim()) return;
    
    addReply(id, {
      authorId: currentUser.id,
      authorName: currentUser.displayName,
      authorAvatar: currentUser.avatar,
      body: replyBody.trim(),
    });
    
    setReplyBody("");
  };

  // Sort replies: accepted first, then by votes, then by date
  const sortedReplies = [...questionReplies].sort((a, b) => {
    if (a.accepted && !b.accepted) return -1;
    if (!a.accepted && b.accepted) return 1;
    if (b.votes !== a.votes) return b.votes - a.votes;
    return b.createdAt - a.createdAt;
  });

  return (
    <BootTransition>
      <div className="flex flex-col min-h-screen w-full bg-[#050505]">
        <TopNav />
        
        <main className="flex-1 p-6 pb-20 md:pb-24 relative z-10 flex flex-col">
          <div className="max-w-[900px] w-full mx-auto flex flex-col gap-6">
            
            <BootWidget direction="top" delayOffset={0}>
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-300 w-fit transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </BootWidget>

            {/* Question Details */}
            <BootWidget direction="center" delayOffset={0.1}>
              <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Upvotes */}
                  <div className="hidden md:flex flex-col items-center gap-2 min-w-[50px]">
                    <button 
                      onClick={() => upvoteQuestion(id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-zinc-400 hover:text-purple-400 transition-colors"
                    >
                      <ArrowUp className="w-6 h-6" />
                    </button>
                    <span className="font-black text-xl text-white">{question.upvotes}</span>
                  </div>

                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      {question.subjectName && (
                        <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {question.subjectName}
                        </span>
                      )}
                      <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-white/5 text-zinc-400 border border-white/10">
                        {question.category}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
                      {question.title}
                    </h1>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-200">
                          {question.authorName}
                        </span>
                        <span className="text-xs font-medium text-zinc-500">
                          {new Date(question.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-8">
                      {question.body}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {question.tags.map(tag => (
                          <span key={tag} className="text-xs font-bold text-zinc-500 bg-white/[0.03] px-2 py-1 rounded-md flex items-center gap-1.5">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Mobile upvotes */}
                      <div className="flex md:hidden items-center gap-3">
                        <button 
                          onClick={() => upvoteQuestion(id)}
                          className="flex items-center gap-1 text-zinc-400 font-bold hover:text-purple-400"
                        >
                          <ArrowUp className="w-5 h-5" />
                          {question.upvotes}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </BootWidget>

            {/* Answers Section */}
            <BootWidget direction="center" delayOffset={0.2}>
              <div className="flex flex-col gap-6 mt-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-zinc-500" />
                  {sortedReplies.length} {sortedReplies.length === 1 ? 'Answer' : 'Answers'}
                </h3>

                {sortedReplies.map((reply) => (
                  <ReplyCard 
                    key={reply.id} 
                    reply={reply} 
                    isQuestionAuthor={currentUser.id === question.authorId}
                    onUpvote={() => upvoteReply(id, reply.id)}
                    onAccept={() => acceptReply(id, reply.id)}
                  />
                ))}

                {/* Composer */}
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-6 shadow-xl mt-4">
                  <h4 className="text-sm font-bold text-zinc-300 mb-4">Your Answer</h4>
                  <div className="flex flex-col gap-4">
                    <textarea
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      placeholder="Write a helpful response... (Markdown and code blocks supported)"
                      rows={5}
                      className="w-full bg-[#121214] border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors custom-scrollbar resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleReplySubmit}
                        disabled={!replyBody.trim()}
                        className="px-6 py-2.5 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:hover:bg-purple-500 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-purple-500/20"
                      >
                        <Send className="w-4 h-4" />
                        Post Answer
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </BootWidget>

          </div>
        </main>
      </div>
    </BootTransition>
  );
}

function ReplyCard({ 
  reply, 
  isQuestionAuthor, 
  onUpvote, 
  onAccept 
}: { 
  reply: CommunityReply; 
  isQuestionAuthor: boolean;
  onUpvote: () => void;
  onAccept: () => void;
}) {
  return (
    <div className={cn(
      "bg-[#0A0A0C] border rounded-2xl p-6 flex flex-col md:flex-row gap-6 transition-all relative overflow-hidden",
      reply.accepted ? "border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "border-white/5"
    )}>
      {reply.accepted && (
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
      )}
      
      {/* Upvotes */}
      <div className="hidden md:flex flex-col items-center gap-2 min-w-[50px]">
        <button 
          onClick={onUpvote}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <span className="font-bold text-lg text-zinc-300">{reply.votes}</span>
        
        {reply.accepted && (
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mt-2" />
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-400">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                {reply.authorName}
                {reply.accepted && (
                  <span className="md:hidden flex items-center gap-1 text-[10px] text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    Accepted
                  </span>
                )}
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {new Date(reply.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="prose prose-invert max-w-none text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap mb-6">
          {reply.body}
        </div>

        <div className="flex items-center justify-between mt-auto">
          {/* Mobile upvotes */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={onUpvote}
              className="flex items-center gap-1 text-zinc-400 font-bold hover:text-white"
            >
              <ArrowUp className="w-4 h-4" />
              {reply.votes}
            </button>
          </div>

          {isQuestionAuthor && !reply.accepted && (
            <button 
              onClick={onAccept}
              className="ml-auto text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-emerald-400 flex items-center gap-1 transition-colors bg-white/5 hover:bg-emerald-500/10 px-3 py-1.5 rounded-lg"
            >
              <CheckCircle2 className="w-3 h-3" />
              Accept Answer
            </button>
          )}
          {reply.accepted && (
            <span className="hidden md:flex ml-auto text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              Accepted Answer
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
