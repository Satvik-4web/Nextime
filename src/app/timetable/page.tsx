import { Timetable } from "@/components/timetable/Timetable";

export default function TimetablePage() {
  return (
    <main className="flex-1 h-[100dvh] overflow-hidden flex flex-col p-2 md:p-6 pb-20 md:pb-24">
      <div className="flex-1 w-full h-full flex flex-col min-h-0">
        <Timetable />
      </div>
    </main>
  );
}
