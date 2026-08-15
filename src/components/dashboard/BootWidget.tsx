"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/stores/useAppStore";
import { useReducedMotion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  direction: "top-left" | "lower-left" | "center" | "top-right" | "lower-right" | "right" | "top";
  delayOffset?: number; // small stagger if needed
}

export function BootWidget({ children, direction, delayOffset = 0 }: Props) {
  const { bootPhase, hasCompletedBoot } = useAppStore();
  const prefersReducedMotion = useReducedMotion();

  // If already booted, just render children without motion wrappers for performance
  if (hasCompletedBoot || prefersReducedMotion) {
    return <>{children}</>;
  }

  // Calculate initial offset based on direction with more dramatic distance
  const getInitialOffset = () => {
    switch (direction) {
      case "top-left": return { x: -80, y: -60 };
      case "lower-left": return { x: -80, y: 60 };
      case "center": return { x: 0, y: 40, scale: 0.92 }; // Deep center emergence
      case "top-right": return { x: 80, y: -60 };
      case "lower-right": return { x: 80, y: 60 };
      case "right": return { x: 100, y: 0 };
      case "top": return { x: 0, y: -60 };
      default: return { x: 0, y: 0 };
    }
  };

  const initialTransform = getInitialOffset();

  // Determine animation state based on global phase
  // Phase 1-5: Hidden (handled by parent opacity, but we keep them translated here)
  // Phase 6+: Locked (Assembly into final dashboard)
  let animationState = "hidden";
  if (bootPhase >= 6) animationState = "locked";

  const variants = {
    hidden: {
      opacity: 0,
      x: initialTransform.x || 0,
      y: initialTransform.y || 0,
      scale: initialTransform.scale || 0.95,
      filter: "blur(12px)",
    },
    floating: {
      opacity: 0.5,
      x: (initialTransform.x || 0) * 0.3, // Move 70% towards center
      y: (initialTransform.y || 0) * 0.3,
      scale: 0.98,
      filter: "blur(4px)",
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const, // Cinematic custom bezier
        delay: delayOffset,
      }
    },
    locked: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 350,
        damping: 35, // High damping removes wobble, keeps it extremely snappy
        mass: 1,
      }
    }
  };

  return (
    <motion.div
      className="w-full h-full"
      variants={variants}
      initial="hidden"
      animate={animationState}
    >
      {children}
    </motion.div>
  );
}
