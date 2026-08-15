"use client";

export const playFuturisticSound = (type: 'boot' | 'click' | 'hover' | 'warp') => {
  if (typeof window === 'undefined') return;
  
  try {
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    // Create or reuse a global audio context to prevent clipping/latency
    if (!(window as any)._audioCtx) {
      (window as any)._audioCtx = new AudioContext();
    }
    const ctx = (window as any)._audioCtx as AudioContext;
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') ctx.resume();
    
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    if (type === 'boot') {
      // Premium OS Boot Sound: Deep bass swelling into a bright chord
      const freqs = [150, 225, 300, 450]; // Beautiful extended chord
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.3, now + 1.0);
      masterGain.gain.exponentialRampToValueAtTime(0.01, now + 4.0);

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * 0.5, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 1.0);
        
        oscGain.gain.value = 1 / freqs.length;
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 4.0);
      });
      
    } else if (type === 'click') {
      // Glassy, crisp UI tap
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      
      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      // High-pitched glassy pop
      osc1.frequency.setValueAtTime(800, now);
      osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
      
      // Sub-transient for weight
      osc2.frequency.setValueAtTime(200, now);
      osc2.frequency.exponentialRampToValueAtTime(100, now + 0.05);

      filter.type = 'lowpass';
      filter.frequency.value = 3000;

      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.15, now + 0.01);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(masterGain);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.1);
      osc2.stop(now + 0.1);

    } else if (type === 'hover') {
      // Very soft, barely audible UI tick
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.03, now + 0.01);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(masterGain);
      osc.start(now);
      osc.stop(now + 0.05);

    } else if (type === 'warp') {
      // "Swoosh" futuristic transition (e.g. opening modal)
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.3);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(3000, now + 0.3);

      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(filter);
      filter.connect(masterGain);
      
      osc.start(now);
      osc.stop(now + 0.4);
    }
  } catch (e) {
    console.warn("AudioContext not supported or blocked");
  }
};
