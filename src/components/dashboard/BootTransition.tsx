"use client";

import { useEffect } from "react";
import { useAppStore } from "@/stores/useAppStore";

interface Props {
  children: React.ReactNode;
}

export function BootTransition({ children }: Props) {
  const { completeBoot, hasCompletedBoot } = useAppStore();

  useEffect(() => {
    if (!hasCompletedBoot) {
      completeBoot();
    }
  }, [hasCompletedBoot, completeBoot]);

  return <>{children}</>;
}
