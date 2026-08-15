"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function CreatorCredit() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="fixed bottom-4 right-4 z-[90]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 bg-[#0A0A0C]/80 backdrop-blur-md border border-white/5 rounded-full p-1 pr-3 shadow-2xl transition-all duration-300 hover:bg-[#111114]/90 hover:border-white/10 group">
        
        {/* Avatar */}
        <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
          <Image 
            src="/satvik.jpg" 
            alt="Satvik" 
            fill
            sizes="28px" 
            className="object-cover"
          />
        </div>

        {/* Text & Links */}
        <div className="flex items-center overflow-hidden">
          <span className="text-[10px] font-medium text-zinc-400 whitespace-nowrap pl-1 pr-2">
            Made by <span className="text-zinc-200 font-bold group-hover:text-white transition-colors">Satvik</span>
          </span>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="w-px h-3 bg-white/10 shrink-0" />
                
                <Link 
                  href="https://github.com/Satvik-4web" 
                  target="_blank" 
                  className="text-zinc-500 hover:text-white transition-colors shrink-0 p-1"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </Link>
                
                <Link 
                  href="https://www.linkedin.com/in/satvik-ganda-3b082a358/" 
                  target="_blank" 
                  className="text-zinc-500 hover:text-blue-400 transition-colors shrink-0 p-1 mr-1"
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
