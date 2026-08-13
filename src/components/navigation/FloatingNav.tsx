"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  Timer,
  BookOpen, 
  BarChart2, 
  MoreHorizontal,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Timetable", href: "/timetable", icon: Calendar },
  { name: "Tasks", href: "/assignments", icon: CheckSquare },
  { name: "Study", href: "/study", icon: Timer },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Notes", href: "/notes", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
];

export function FloatingNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      // If mouse is within the bottom 150px of the screen, show the nav
      if (window.innerHeight - e.clientY < 150) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Hide initially after 2 seconds to show it exists, then auto-hide
    timeoutId = setTimeout(() => setIsVisible(false), 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  if (pathname === "/") return null; // Hide on landing page

  return (
    <motion.div 
      initial={{ y: 0, opacity: 1 }}
      animate={{ 
        y: isVisible ? 0 : 100, 
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
    >
      <div className="flex items-center gap-1 p-2 rounded-2xl glass shadow-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative px-4 py-3 rounded-xl flex flex-col items-center justify-center transition-colors hover:text-white group text-zinc-400"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(37,99,235,0.2) 0%, transparent 70%)',
                    boxShadow: 'inset 0 0 10px rgba(37,99,235,0.1)'
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon 
                className={cn(
                  "w-5 h-5 relative z-10 transition-colors duration-200",
                  isActive ? "text-primary drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" : "text-zinc-500 group-hover:text-zinc-300"
                )} 
              />
              <span className={cn(
                "text-[9px] font-bold mt-1 relative z-10 transition-colors duration-200",
                isActive ? "text-primary drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" : "text-zinc-500 group-hover:text-zinc-300"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
        
        <button className="relative px-4 py-3 rounded-xl flex flex-col items-center justify-center transition-colors hover:text-white text-zinc-400 group">
          <MoreHorizontal className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors duration-200" />
        </button>
      </div>
    </motion.div>
  );
}
