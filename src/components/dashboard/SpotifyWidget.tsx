"use client";

import { Heart, Play, SkipBack, SkipForward, Repeat, Shuffle, MonitorSpeaker } from "lucide-react";
import { useState } from "react";

export function SpotifyWidget() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative rounded-2xl p-5 overflow-hidden h-[160px] border border-[#8B5CF6]/50 shadow-[0_0_20px_rgba(139,92,246,0.2)] bg-[#0A0A0C] group">
      {/* Neon Glow effect */}
      <div className="absolute inset-0 border-2 border-[#8B5CF6]/40 rounded-2xl opacity-50 shadow-[inset_0_0_20px_rgba(139,92,246,0.3)] pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-3">
        {/* Mock Spotify Icon */}
        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full border border-black/20" />
        </div>
        <span className="text-xs font-bold text-zinc-300">Spotify Player</span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-zinc-800 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-[8px] text-zinc-500 text-center leading-tight">Album<br/>Art</div>
            <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&h=100&fit=crop" alt="Album Art" className="w-full h-full object-cover relative z-10 opacity-80 mix-blend-screen" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">In the End</span>
            <span className="text-xs text-zinc-400">Linkin Park</span>
          </div>
        </div>
        <Heart className="w-4 h-4 text-rose-500 fill-rose-500 cursor-pointer" />
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] text-zinc-500 w-6">1:45</span>
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full bg-white w-1/2 rounded-full" />
        </div>
        <span className="text-[9px] text-zinc-500 w-6">3:36</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <Shuffle className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
        <SkipBack className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <div className="w-3 h-3 flex gap-0.5 justify-center">
              <div className="w-1 h-full bg-black" />
              <div className="w-1 h-full bg-black" />
            </div>
          ) : (
            <Play className="w-4 h-4 text-black fill-black ml-0.5" />
          )}
        </button>
        <SkipForward className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
        <MonitorSpeaker className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors" />
      </div>
    </div>
  );
}
