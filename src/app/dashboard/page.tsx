import { TopNav } from "@/components/dashboard/TopNav";
import { AttendanceWidget } from "@/components/dashboard/AttendanceWidget";
import { CgpaWidget } from "@/components/dashboard/CgpaWidget";
import { StudyWidget } from "@/components/dashboard/StudyWidget";
import { AssignmentsWidget } from "@/components/dashboard/AssignmentsWidget";
import { NextClassWidget } from "@/components/dashboard/NextClassWidget";
import { FreeSlotWidget } from "@/components/dashboard/FreeSlotWidget";
import { CommunityHighlightsWidget } from "@/components/dashboard/CommunityHighlightsWidget";
import { Timetable } from "@/components/timetable/Timetable";
import { BootTransition } from "@/components/dashboard/BootTransition";
import { BootWidget } from "@/components/dashboard/BootWidget";

export default function DashboardPage() {
  return (
    <BootTransition>
      <div className="flex flex-col min-h-screen w-full bg-[#050505]">
        <BootWidget direction="top" delayOffset={0.2}>
          <TopNav />
        </BootWidget>
        
        <main className="flex-1 p-6 pb-20 md:pb-24 relative z-10 flex flex-col">
          <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Panel: Analytics & Study */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <BootWidget direction="top-left" delayOffset={0}>
                <AttendanceWidget />
              </BootWidget>
              <BootWidget direction="lower-left" delayOffset={0.1}>
                <CgpaWidget />
              </BootWidget>
              <BootWidget direction="lower-left" delayOffset={0.15}>
                <StudyWidget />
              </BootWidget>
            </div>
            
            {/* Center Panel: Timetable */}
            <div className="lg:col-span-7 relative z-10 flex flex-col">
              <BootWidget direction="center" delayOffset={0.3}>
                <div className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-5 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.6)] group hover:border-white/10 transition-colors">
                  <Timetable />
                </div>
              </BootWidget>
            </div>
            
            {/* Right Panel: Tasks & Now */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              <BootWidget direction="top-right" delayOffset={0.05}>
                <AssignmentsWidget />
              </BootWidget>
              <BootWidget direction="right" delayOffset={0.1}>
                <NextClassWidget />
              </BootWidget>
              <BootWidget direction="lower-right" delayOffset={0.2}>
                <FreeSlotWidget />
              </BootWidget>
              <BootWidget direction="lower-right" delayOffset={0.25}>
                <CommunityHighlightsWidget />
              </BootWidget>
            </div>
            
          </div>
        </main>
      </div>
    </BootTransition>
  );
}
