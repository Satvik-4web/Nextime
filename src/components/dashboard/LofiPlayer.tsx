"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Music, SkipForward, SkipBack } from "lucide-react";
import { cn } from "@/lib/utils";

const PLAYLIST = [
  { name: "Lofi Focus Beats", src: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { name: "Deep Study Ambient", src: "https://stream.zeno.fm/0r0xa792kwzuv" },
  { name: "Midnight Vibes", src: "https://stream.zeno.fm/81z30e61kwzuv" }
];

export function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[trackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-play when track changes if it was already playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [trackIndex, isPlaying]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-4 bg-[#0A0A0C]/80 backdrop-blur-xl border border-white/10 p-3 pr-6 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        loop 
        preload="none"
      />

      {/* Spinning Record */}
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-[#121214] border-2 border-white/5 overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-tr from-zinc-800 to-zinc-900",
          isPlaying ? "animate-spin" : ""
        )} style={{ animationDuration: '3s' }} />
        <div className="absolute inset-2 rounded-full border border-black/50" />
        <div className="absolute inset-3 rounded-full border border-black/40" />
        <div className="absolute inset-4 rounded-full border border-black/30" />
        <div className="absolute w-4 h-4 rounded-full bg-primary/80 z-10 shadow-lg flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-white/80" />
        </div>
      </div>

      {/* Info & Controls */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <Music className="w-3 h-3 text-primary" />
          <span className="text-xs font-bold text-white tracking-wide">{currentTrack.name}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={prevTrack} className="text-zinc-500 hover:text-white transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-zinc-300 hover:text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          
          <button onClick={nextTrack} className="text-zinc-500 hover:text-white transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>

          <button 
            onClick={toggleMute}
            className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Equalizer Visualizer */}
          <div className="flex items-end gap-0.5 h-4 ml-1">
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                className="w-1 bg-primary rounded-t-sm"
                animate={{ 
                  height: isPlaying && !isMuted ? ["20%", "100%", "40%", "80%", "20%"] : "20%" 
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1 + (i * 0.2),
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
