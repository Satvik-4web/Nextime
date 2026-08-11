export type ClassType = "lecture" | "lab" | "tutorial";

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export interface TimetableEvent {
  id: string;
  subject: string;
  code: string;
  instructor: string;
  room: string;
  day: DayOfWeek;
  startTime: string; // HH:mm format (24h)
  endTime: string;
  type: ClassType;
  batch: string;
  attendancePct?: number;
}
