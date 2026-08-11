import { TimetableEvent } from "@/types/timetable";

// Timetable configuration
export const TIMETABLE_START_HOUR = 8; // 08:00
export const TIMETABLE_END_HOUR = 18; // 18:00
export const HOUR_HEIGHT = 140; // pixels per hour

// Helper to convert "HH:mm" to minutes since start of day (00:00)
export function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

// Get top offset in pixels based on start time
export function getEventTopOffset(startTime: string): number {
  const startMins = timeStringToMinutes(startTime);
  const offsetMins = startMins - (TIMETABLE_START_HOUR * 60);
  return (offsetMins / 60) * HOUR_HEIGHT;
}

// Get height in pixels based on start and end time
export function getEventHeight(startTime: string, endTime: string): number {
  const startMins = timeStringToMinutes(startTime);
  const endMins = timeStringToMinutes(endTime);
  const durationMins = endMins - startMins;
  return (durationMins / 60) * HOUR_HEIGHT;
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
