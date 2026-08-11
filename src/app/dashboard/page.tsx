import { TopNav } from "@/components/dashboard/TopNav";
import { AttendanceWidget } from "@/components/dashboard/AttendanceWidget";
import { CgpaWidget } from "@/components/dashboard/CgpaWidget";
import { StudyWidget } from "@/components/dashboard/StudyWidget";
import { AssignmentsWidget } from "@/components/dashboard/AssignmentsWidget";
import { NextClassWidget } from "@/components/dashboard/NextClassWidget";
import { FreeSlotWidget } from "@/components/dashboard/FreeSlotWidget";
import { SpotifyWidget } from "@/components/dashboard/SpotifyWidget";
import { Timetable } from "@/components/timetable/Timetable";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      <TopNav />
      
      <main className="flex-1 p-6 pb-32 overflow-hidden">
        <div className="max-w-[1600px] mx-auto h-[850px] grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel: Analytics & Study */}
          <div className="lg:col-span-2 flex flex-col gap-5 h-full">
            <AttendanceWidget />
            <CgpaWidget />
            <StudyWidget />
          </div>
          
          {/* Center Panel: Timetable */}
          <div className="lg:col-span-7 bg-[#0A0A0C] border border-[#1A1A24] rounded-2xl p-5 flex flex-col h-[750px] shadow-lg relative z-10">
            <Timetable />
          </div>
          
          {/* Right Panel: Tasks & Now */}
          <div className="lg:col-span-3 flex flex-col gap-5 h-full">
            <AssignmentsWidget />
            <NextClassWidget />
            <FreeSlotWidget />
            <SpotifyWidget />
          </div>
          
        </div>
      </main>
    </div>
  );
}
