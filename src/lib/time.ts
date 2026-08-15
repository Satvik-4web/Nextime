// Development-controllable time utility

declare global {
  interface Window {
    __DEV_CLOCK__?: string | null; // e.g. "2026-08-14T08:25:00"
  }
}

export function getNow(): Date {
  if (typeof window !== "undefined" && window.__DEV_CLOCK__) {
    return new Date(window.__DEV_CLOCK__);
  }
  return new Date();
}

export function getNowMs(): number {
  return getNow().getTime();
}
