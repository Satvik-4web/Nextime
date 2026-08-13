"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Users, Sparkles, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  isSelf?: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "1", author: "Alex", text: "Anyone working on the OS assignment tonight?", timestamp: Date.now() - 1000 * 60 * 15 },
  { id: "2", author: "Sarah", text: "Yeah, stuck on question 3.", timestamp: Date.now() - 1000 * 60 * 10 },
  { id: "3", author: "Mike", text: "Make sure you check the lecture slides from Tuesday!", timestamp: Date.now() - 1000 * 60 * 5 },
];

export function CommunityChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "You",
        text: inputValue.trim(),
        timestamp: Date.now(),
        isSelf: true
      }
    ]);
    setInputValue("");
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 right-6 z-[200] flex flex-col items-end">
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#0A0A0C] border border-white/10 rounded-2xl flex flex-col h-[500px] w-[350px] shadow-2xl overflow-hidden mb-4 relative"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#121214] relative z-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Study Lounge</h3>
                  <p className="text-[10px] text-zinc-500 font-medium">12 online now</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-4 relative z-10">
              {messages.map((msg, i) => {
                const isConsecutive = i > 0 && messages[i - 1].author === msg.author;
                
                return (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.isSelf ? "self-end items-end" : "self-start",
                      isConsecutive ? "mt-[-8px]" : ""
                    )}
                  >
                    {!isConsecutive && !msg.isSelf && (
                      <span className="text-[10px] font-bold text-zinc-500 mb-1 ml-1">{msg.author}</span>
                    )}
                    <div 
                      className={cn(
                        "px-3 py-2 rounded-2xl text-xs",
                        msg.isSelf 
                          ? "bg-purple-600 text-white rounded-br-sm" 
                          : "bg-white/5 border border-white/5 text-zinc-300 rounded-bl-sm"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 bg-[#121214] relative z-10 flex-shrink-0">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Say something..."
                  className="w-full bg-[#050505] border border-white/5 rounded-xl pl-3 pr-10 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-400 disabled:opacity-50 disabled:bg-white/10 disabled:text-zinc-500 transition-colors"
                >
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all z-[201]",
          isOpen ? "bg-[#121214] border border-white/10 text-white" : "bg-purple-500 text-white hover:bg-purple-400"
        )}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
