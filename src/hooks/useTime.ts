"use client";

import { useState, useEffect } from "react";

export function useTime(intervalMs = 1000) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, intervalMs);

    return () => clearInterval(timer);
  }, [intervalMs]);

  return time;
}
