"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = {
  product: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Timetable", href: "/timetable" },
    { label: "Assignments", href: "/assignments" },
    { label: "Study Mode", href: "/study" },
    { label: "Attendance", href: "/attendance" },
  ],
  academic: [
    { label: "Community", href: "/dashboard/community" },
    { label: "Notes", href: "/notes" },
    { label: "Analytics", href: "/analytics" },
    { label: "CGPA", href: "/dashboard" }, // Part of dashboard
  ],
  resources: [
    { label: "Help Center", href: "#" },
    { label: "Documentation", href: "#" },
    { label: "Shortcuts", href: "#" },
    { label: "Feedback", href: "#" },
  ],
  company: [
    { label: "About NexTime", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ]
};

export function Footer() {
  return (
    <footer className="w-full bg-[#0A0A0C] border-t border-white/5 pt-16 pb-8 px-6 md:px-12 lg:px-24 mt-auto relative z-10 overflow-hidden font-sans">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-16 relative z-10">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24">
          
          {/* Brand Area */}
          <div className="flex flex-col gap-6 max-w-sm">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.jpg" 
                alt="NexTime Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.1)] grayscale opacity-80" 
              />
              <span className="font-bold text-2xl tracking-tight text-white">NexTime</span>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-zinc-300 font-medium tracking-tight">Smart Student OS</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Your university, beautifully organized. Built to strip away administrative bloat and protect your focus.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 bg-white/5 border border-white/5 w-fit px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">System Operational</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-10 flex-1">
            
            {/* Product */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Product</h4>
              {FOOTER_LINKS.product.map((link) => (
                <Link key={link.label} href={link.href} className="group flex items-center w-fit">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200">{link.label}</span>
                  <ArrowRight className="w-3 h-3 ml-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:text-blue-400 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Academic */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Academic</h4>
              {FOOTER_LINKS.academic.map((link) => (
                <Link key={link.label} href={link.href} className="group flex items-center w-fit">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200">{link.label}</span>
                  <ArrowRight className="w-3 h-3 ml-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:text-blue-400 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Resources</h4>
              {FOOTER_LINKS.resources.map((link) => (
                <Link key={link.label} href={link.href} className="group flex items-center w-fit">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200">{link.label}</span>
                  <ArrowRight className="w-3 h-3 ml-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:text-blue-400 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Company</h4>
              {FOOTER_LINKS.company.map((link) => (
                <Link key={link.label} href={link.href} className="group flex items-center w-fit">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-100 transition-colors duration-200">{link.label}</span>
                  <ArrowRight className="w-3 h-3 ml-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1.5 group-hover:text-blue-400 transition-all duration-300" />
                </Link>
              ))}
            </div>
            
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Quick CTA */}
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">Ready for your next session?</span>
            <Link href="/dashboard" className="text-zinc-300 hover:text-white transition-colors border-b border-zinc-700 hover:border-white pb-0.5">
              Open OS →
            </Link>
          </div>

          {/* Socials & Legal */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <Link href="https://github.com/Satvik-4web" target="_blank" className="text-zinc-600 hover:text-zinc-300 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </Link>
              <Link href="https://twitter.com" target="_blank" className="text-zinc-600 hover:text-blue-400 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
              <Link href="https://www.linkedin.com/in/satvik-ganda-3b082a358/" target="_blank" className="text-zinc-600 hover:text-blue-500 hover:-translate-y-0.5 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 text-[11px] text-zinc-600 font-medium">
              <span>© 2026 NexTime</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <Link href="#" className="hover:text-zinc-300 transition-colors">Privacy</Link>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <Link href="#" className="hover:text-zinc-300 transition-colors">Terms</Link>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <Link href="#" className="hover:text-zinc-300 transition-colors">Security</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
