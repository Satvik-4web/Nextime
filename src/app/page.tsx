import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center max-w-3xl px-6">
        <h1 className="text-6xl font-bold tracking-tight mb-6">
          NexTime.
          <br />
          <span className="text-zinc-400">Your Student OS.</span>
        </h1>
        <p className="text-lg text-zinc-400 mb-10 max-w-xl">
          A premium academic workspace designed to act as your personal command center.
        </p>
        <Link 
          href="/dashboard"
          className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-zinc-200 transition-colors"
        >
          Enter Workspace
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
