import { TimetableEvent, DayOfWeek } from "@/types/timetable";

export function getDayName(date: Date): DayOfWeek | null {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = days[date.getDay()];
  if (dayName === "Sunday" || dayName === "Saturday") return null;
  return dayName as DayOfWeek;
}

export function parseTime(timeStr: string, baseDate: Date): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

export function getTodayEvents(events: TimetableEvent[], date: Date): TimetableEvent[] {
  const dayName = getDayName(date);
  if (!dayName) return [];
  
  return events
    .filter(e => e.day === dayName)
    .sort((a, b) => {
      const timeA = parseTime(a.startTime, date).getTime();
      const timeB = parseTime(b.startTime, date).getTime();
      return timeA - timeB;
    });
}

export function getCurrentClass(events: TimetableEvent[], now: Date): TimetableEvent | null {
  const todayEvents = getTodayEvents(events, now);
  return todayEvents.find(e => {
    const start = parseTime(e.startTime, now);
    const end = parseTime(e.endTime, now);
    return now >= start && now <= end;
  }) || null;
}

export function getNextClass(events: TimetableEvent[], now: Date): TimetableEvent | null {
  const todayEvents = getTodayEvents(events, now);
  return todayEvents.find(e => {
    const start = parseTime(e.startTime, now);
    return start > now;
  }) || null;
}

export interface FreeSlot {
  startTime: string;
  endTime: string;
  durationMs: number;
}

export function getNextFreeSlot(events: TimetableEvent[], now: Date): FreeSlot | null {
  const todayEvents = getTodayEvents(events, now);
  if (todayEvents.length === 0) return null;

  // Find the current or next gap
  for (let i = 0; i < todayEvents.length - 1; i++) {
    const currentEventEnd = parseTime(todayEvents[i].endTime, now);
    const nextEventStart = parseTime(todayEvents[i + 1].startTime, now);
    
    // Gap must be at least 15 minutes to be considered a study slot
    if (nextEventStart.getTime() - currentEventEnd.getTime() >= 15 * 60 * 1000) {
      if (now <= nextEventStart) {
        return {
          startTime: todayEvents[i].endTime,
          endTime: todayEvents[i + 1].startTime,
          durationMs: nextEventStart.getTime() - currentEventEnd.getTime()
        };
      }
    }
  }

  // If no gap found between classes, and there is a class later today or class just ended, maybe the rest of the day is free.
  const lastEventEnd = parseTime(todayEvents[todayEvents.length - 1].endTime, now);
  if (now > lastEventEnd) {
    // Rest of the day is free
    const eod = new Date(now);
    eod.setHours(23, 59, 0, 0);
    return {
      startTime: todayEvents[todayEvents.length - 1].endTime,
      endTime: "23:59",
      durationMs: eod.getTime() - lastEventEnd.getTime()
    };
  }

  return null;
}
