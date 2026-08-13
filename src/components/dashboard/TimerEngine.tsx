"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/stores/useAppStore";
import { useNotificationStore } from "@/stores/useNotificationStore";

export function TimerEngine() {
  const { isTimerRunning, tickTimer, timeLeft, timerMode } = useAppStore();
  const { addToast } = useNotificationStore();
  const prevTimeLeft = useRef(timeLeft);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, tickTimer]);

  useEffect(() => {
    if (prevTimeLeft.current > 0 && timeLeft === 0) {
      // Timer just finished!
      const isFocus = timerMode === 'focus';
      addToast({
        type: "STUDY",
        title: isFocus ? "FOCUS SESSION COMPLETE" : "BREAK COMPLETE",
        message: isFocus ? "Great job! Ready for a break?" : "Ready for another focus session?",
        priority: "LOW"
      });
    }
    prevTimeLeft.current = timeLeft;
  }, [timeLeft, timerMode, addToast]);

  return null;
}
