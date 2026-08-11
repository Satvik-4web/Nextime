import { Timetable } from "@/components/timetable/Timetable";

export default function TimetablePage() {
  return (
    <main className="flex-1 h-screen overflow-hidden flex flex-col p-2 pb-32 md:p-6 md:pb-32">
      <div className="flex-1 w-full h-full flex flex-col min-h-0">
        <Timetable />
      </div>
    </main>
  );
}
