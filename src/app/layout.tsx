import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { FloatingNav } from "@/components/navigation/FloatingNav";
import { AttendancePrompt } from "@/components/dashboard/AttendancePrompt";
import { TimerEngine } from "@/components/dashboard/TimerEngine";
import { NotificationEngine } from "@/components/dashboard/NotificationEngine";
import { ToastContainer } from "@/components/navigation/ToastContainer";
import { CommandPalette } from "@/components/navigation/CommandPalette";
import { CreatorCredit } from "@/components/navigation/CreatorCredit";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexTime - Student OS",
  description: "Your premium Student OS",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NexTime",
  },
};

export const viewport = {
  themeColor: "#050505",
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
          "min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary flex flex-col",
          inter.variable
        )}
      >
        <AttendancePrompt />
        <TimerEngine />
        <NotificationEngine />
        <ToastContainer />
        <CommandPalette />
        {children}
        <FloatingNav />
        <CreatorCredit />
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registration successful');
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
