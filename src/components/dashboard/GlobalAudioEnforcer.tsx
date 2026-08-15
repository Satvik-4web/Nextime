"use client";

import { useEffect } from "react";
import { playFuturisticSound } from "@/lib/audio";

export function GlobalAudioEnforcer() {
  useEffect(() => {
    // We use pointerdown for immediate, tactile feedback (feels faster than 'click')
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      
      // Ignore text inputs to avoid annoying typing clicks, but allow buttons/links
      if (target.tagName === "INPUT" && !["button", "submit", "radio", "checkbox"].includes((target as HTMLInputElement).type)) {
        return;
      }
      if (target.tagName === "TEXTAREA") {
        return;
      }

      // Check if it's a clickable element or inside one
      const clickable = target.closest('button, a, [role="button"], [role="tab"], .cursor-pointer, summary');
      
      if (clickable) {
        playFuturisticSound('click');
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { capture: true, passive: true });
    
    return () => window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, []);

  return null;
}
