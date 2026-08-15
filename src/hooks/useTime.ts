"use client";

import { useState, useEffect } from "react";
import { getNow } from "@/lib/time";

export function useTime(intervalMs = 1000) {
  const [time, setTime] = useState(() => getNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getNow());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return time;
}
