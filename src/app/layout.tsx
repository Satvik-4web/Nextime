import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FloatingNav } from "@/components/navigation/FloatingNav";
import { SetupModal } from "@/components/dashboard/SetupModal";
import { AttendancePrompt } from "@/components/dashboard/AttendancePrompt";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexTime - Student OS",
  description: "Your premium Student OS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          inter.variable
        )}
      >
        <SetupModal />
        <AttendancePrompt />
        {children}
        <FloatingNav />
      </body>
    </html>
  );
}
