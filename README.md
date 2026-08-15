<div align="center">

# ⏱️ NexTime

### The Student Operating System

**Your university, beautifully organized.**

NexTime is a premium academic workspace that brings your timetable, attendance, assignments, study sessions, academic analytics, and student community into one connected Student OS.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-NexTime-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://nextime-omega.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-593D88?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Upstash](https://img.shields.io/badge/Upstash-Redis-00E599?style=for-the-badge&logo=redis&logoColor=white)](https://upstash.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

<br/>

### 🌐 [Open NexTime →](https://nextime-omega.vercel.app/)

</div>

---

# ✦ What is NexTime?

University life is scattered across timetables, attendance portals, WhatsApp groups, assignment reminders, notes, PDFs, spreadsheets, and productivity applications.

**NexTime brings that fragmented academic life into one connected workspace.**

NexTime is designed as a **Student Operating System** — a central academic command center that understands the student's timetable and uses that context to power the rest of the experience.

Instead of asking:

- What class do I have right now?
- Where is it?
- What is my next class?
- How much attendance do I have?
- What assignment is due?
- When do I actually have time to study?
- Who can help me with a doubt?

NexTime is designed to answer these questions from one place.

---

# 🧠 The Core Idea

The most important architectural and product idea behind NexTime is:

> **The timetable is the heart of the Student OS.**

Everything else revolves around it.

```text
                         ┌─────────────────────┐
                         │       NEX TIME      │
                         │     STUDENT OS      │
                         └──────────┬──────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
       │  TIMETABLE  │       │  ACADEMICS  │       │    FOCUS    │
       └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
              │                     │                     │
              ▼                     ▼                     ▼
       Current Class          Attendance              Study Mode
       Next Class             Assignments             Pomodoro
       Free Slots             CGPA                    Music
       Friend View            Analytics               Sessions
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    ▼
                          ┌────────────────────┐
                          │  STUDENT CONTEXT   │
                          │   ONE WORKSPACE    │
                          └────────────────────┘
```

The timetable isn't just a calendar.

It is the source of academic context that connects the rest of NexTime.

---

# ✨ Core Features

## 🗓️ Cinematic Timetable

The timetable is the central experience of NexTime.

### Features

- Weekly timetable
- Today / Week views
- Lecture / Lab / Tutorial filtering
- Live current-time indicator
- Current class detection
- Next class detection
- Free-slot detection
- Course information
- Room information
- Faculty information
- Elective customization
- Class detail interactions
- High-quality timetable snapshot export

### Session Visual Language

| Session Type | Visual Identity |
|---|---|
| 🔵 Lecture | Blue |
| 🧪 Lab | Cyan |
| 🟣 Tutorial | Purple |

The timetable continuously understands the student's academic day rather than simply displaying static events.

---

# 🎯 Live Academic Context

NexTime uses timetable context to determine what matters to the student at any given moment.

```text
09:25
   │
   ▼
NEXT CLASS

Data Structures

Starts in 15 minutes
Room: LT401

   │
   ▼

09:40
   │
   ▼
● NOW

Data Structures

LT401

   │
   ▼

10:30
   │
   ▼
CLASS FINISHED

Did you attend?

   │
   ▼

10:30
   │
   ▼
NEXT

Operating Systems

Starts in 20 minutes
```

This same academic context can drive:

- Current class
- Next class
- Free slots
- Attendance prompts
- Notifications
- Study planning
- Dashboard insights

---

# 📊 Attendance Intelligence

NexTime allows students to track attendance without manually calculating percentages.

### Features

- Overall attendance
- Subject-wise attendance
- Attended lectures
- Missed lectures
- Attendance target
- Warning states
- Visual progress ring
- Post-class attendance confirmation

### Status

```text
Below 75%      🔴 CRITICAL

75% – 80%      🟡 WARNING

Above 80%      🟢 SAFE
```

The goal is not simply to show a number.

The goal is to help students understand when their attendance is becoming a problem.

---

# 📝 Assignment Management

Assignments stay connected to academic context.

Each assignment can contain:

- Title
- Subject
- Description
- Due date
- Priority
- Status
- Completion state

Possible states:

```text
UPCOMING
DUE SOON
COMPLETED
OVERDUE
```

Example:

```text
┌──────────────────────────────────┐
│ OS LAB REPORT                    │
│ Operating Systems                │
│                                  │
│ Due Tomorrow                     │
│                                  │
│ [ Open Assignment ]              │
└──────────────────────────────────┘
```

Assignment state can feed:

- Dashboard
- Notifications
- Subject context
- Daily planning

---

# 🧘 Deep Work / Study Mode

NexTime includes an immersive focus environment for actual studying.

### Modes

```text
FOCUS        → 45 min

SHORT BREAK  → 10 min

LONG BREAK   → 20 min
```

### Features

- Radial timer
- Start
- Pause
- Resume
- Reset
- Focus sessions
- Study statistics
- Study streaks
- Audio feedback
- Music integration
- Distraction-free interface

The interface becomes calmer during a focus session.

The objective is:

> **Make it easier to start studying than to procrastinate.**

---

# 🎵 Music / Spotify

Study Mode includes a dedicated music experience.

Possible capabilities include:

- Album artwork
- Track information
- Play / Pause
- Previous / Next
- Progress
- Queue
- Visualizer
- Focus-oriented listening

Music should remain independent from the study timer so that a music integration failure does not break the student's focus session.

---

# 🎓 CGPA Forecast

NexTime helps students understand their academic trajectory.

Students can enter:

```text
Semester
Credits
SGPA
```

The system can derive:

- Current CGPA
- Projected CGPA
- Target CGPA
- Required future SGPA
- Semester trends

Example:

```text
CURRENT CGPA

8.32

        ╭────────────╮
        │            ╰╮
        │             ╰──╮
        │                ╰
        └──────────────────

PROJECTED

8.48
```

---

# 👥 Friends & Batch Intelligence

NexTime can provide contextual visibility into friends' timetables without overwriting the current student's own academic workspace.

Example:

```text
● ANON_3C21

Currently in class

Data Structures
LT401
```

Or:

```text
○ ANON_3C21

Currently free
```

Friend viewing is intentionally isolated from personal state.

Viewing another student's timetable should never overwrite:

- your attendance
- your assignments
- your notes
- your personal dashboard state

---

# 💬 Student Community

NexTime includes an academic community where students can openly ask questions, discuss subjects, and help one another.

Students can discuss:

- Programming doubts
- Assignment questions
- Concept explanations
- Exam preparation
- Resources
- Subject discussions

Example:

```text
┌────────────────────────────────────────┐
│ DATA STRUCTURES                        │
│                                        │
│ How does the two-pointer approach      │
│ work for this problem?                 │
│                                        │
│ ↑ 12     6 replies      ✓ Answered     │
└────────────────────────────────────────┘
```

The community is intentionally academic.

It is not designed to become another social-media feed.

---

# ⚡ Realtime Community Architecture

The community system is designed around a backend capable of supporting shared student activity.

```text
                    STUDENT
                       │
                       ▼
               Next.js Application
                       │
                       ▼
                    Supabase
                       │
               ┌───────┴────────┐
               ▼                ▼
          PostgreSQL          Realtime
               │                │
               └───────┬────────┘
                       ▼
                 Other Students
```

The architecture can support realtime community updates.

Rate limiting can be handled using Upstash Redis infrastructure.

---

# 🔔 Intelligent Notifications

NexTime uses event-driven notifications rather than random UI popups.

### Before a class

```text
NEXT CLASS

Data Structures

Starts in 15 minutes
```

### After a class

```text
CLASS FINISHED

Did you attend Data Structures?
```

### Assignment reminder

```text
ASSIGNMENT DUE

OS Lab Report

Due tomorrow
```

### Attendance warning

```text
ATTENDANCE WARNING

Operating Systems

Attendance has dropped below 75%.
```

### Study completion

```text
FOCUS SESSION COMPLETE

45 minutes focused.
```

Notifications are designed around:

- Priority
- Deduplication
- Expiration
- Read / unread state
- Contextual actions

---

# 🔊 Acoustic Interface

NexTime isn't purely visual.

A custom global audio layer can provide subtle feedback for:

- Clicks
- Hovers
- Navigation
- Boot
- Completion
- Study sessions

The objective isn't loud sound effects.

It's **micro-feedback** that makes the system feel alive.

---

# 📱 Progressive Web App

NexTime is designed to behave more like an installed application than a traditional website.

### PWA capabilities

- Installable
- Standalone application experience
- Service worker
- Cached assets
- Faster repeat launches
- Desktop support
- Mobile support

The long-term goal is for NexTime to feel like a native Student OS living on the student's device.

---

# 🎨 Design System

NexTime intentionally avoids the traditional university-portal aesthetic.

### Visual principles

```text
DARK
  +
DEPTH
  +
GLASS
  +
MOTION
  +
SPATIAL UI
  +
PRECISION
```

### Design language

- Dark graphite backgrounds
- Frosted glass
- Soft borders
- Ambient lighting
- Blue / cyan / violet accents
- Deep shadows
- Subtle bloom
- Cinematic transitions
- Responsive micro-interactions
- Premium typography
- Custom scroll behavior

The design philosophy is:

> **Operating System, not University ERP.**

---

# 🧩 Architecture

At a high level, NexTime follows a connected architecture:

```text
                       ┌─────────────────────┐
                       │       NexTime       │
                       │     Next.js App     │
                       └──────────┬──────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
        UI / Pages           Zustand State         Services
             │                    │                    │
             │                    │                    ├── Supabase
             │                    │                    ├── Upstash
             │                    │                    └── Integrations
             │                    │
             └────────────────────┼────────────────────┘
                                  │
                                  ▼
                           Academic Context
                                  │
                 ┌────────────────┼─────────────────┐
                 ▼                ▼                 ▼
             Timetable        Attendance        Assignments
                 │                │                 │
                 └────────────────┼─────────────────┘
                                  ▼
                           NexTime Insights
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 |
| Frontend | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| State Management | Zustand |
| Database | Supabase PostgreSQL |
| Realtime | Supabase Realtime |
| Rate Limiting | Upstash Redis |
| Deployment | Vercel |
| PWA | Service Worker |
| Snapshot Export | html-to-image |

---

# 🗂️ Conceptual Architecture

```text
src/
│
├── app/
│   ├── dashboard/
│   ├── timetable/
│   ├── assignments/
│   ├── attendance/
│   ├── study/
│   ├── community/
│   ├── notes/
│   └── analytics/
│
├── components/
│   ├── timetable/
│   ├── attendance/
│   ├── assignments/
│   ├── study/
│   ├── community/
│   ├── navigation/
│   └── ui/
│
├── stores/
│   ├── timetable
│   ├── attendance/
│   ├── assignments/
│   ├── study/
│   └── notifications/
│
├── services/
│   ├── supabase/
│   ├── notifications/
│   └── integrations/
│
└── lib/
    ├── calculations/
    ├── timetable/
    └── utilities/
```

> The exact repository structure may evolve as the implementation grows.

---

# 🔄 Core NexTime Data Flow

The key architectural idea is that timetable context feeds the rest of the Student OS.

```text
                    TIMETABLE
                        │
          ┌─────────────┼──────────────┐
          │             │              │
          ▼             ▼              ▼
    CURRENT CLASS   NEXT CLASS     FREE SLOT
          │                            │
          ▼                            ▼
     ATTENDANCE                  STUDY SESSION
          │                            │
          ▼                            ▼
      ANALYTICS                    FOCUS DATA
          │
          └──────────────┬─────────────┘
                         ▼
                 STUDENT CONTEXT
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
        Dashboard   Notifications  Insights
```

This is what makes NexTime more than a collection of disconnected features.

---

# 🧪 Product Philosophy

NexTime is built around one question:

> **What does a student actually need to know right now?**

Rather than asking:

> "What features can we put into a dashboard?"

NexTime focuses on:

```text
What class am I in?

Where am I going next?

What do I need to submit?

Am I safe on attendance?

When can I study?

How am I performing?

Who can help me?
```

Everything is designed around these questions.

---

# 🚀 Getting Started

## Prerequisites

You should have:

- Node.js
- npm or pnpm
- Git
- Supabase project
- Upstash configuration where required

## Clone

```bash
git clone https://github.com/YOUR_USERNAME/nextime.git
cd nextime
```

## Install dependencies

```bash
npm install
```

## Environment variables

Create:

```text
.env.local
```

Configure the required environment variables for your environment.

Never commit:

- `.env.local`
- API keys
- passwords
- private tokens
- database credentials

## Start development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# 🌐 Live Deployment

NexTime is deployed on Vercel.

### 🚀 Live Demo

**https://nextime-omega.vercel.app/**

---

# 📈 Roadmap

## ✅ Implemented / Core

- [x] Premium Student OS interface
- [x] Cinematic timetable
- [x] Today / Week views
- [x] Lecture / Lab / Tutorial filtering
- [x] Live current-time indicator
- [x] Current class detection
- [x] Next class detection
- [x] Free slot detection
- [x] Attendance tracking
- [x] Assignment management
- [x] Study Mode
- [x] CGPA Forecast
- [x] Academic Analytics
- [x] Community architecture
- [x] Realtime infrastructure
- [x] PWA support
- [x] Vercel deployment
- [x] Custom audio feedback
- [x] Timetable export
- [x] Notifications
- [x] Friend / batch context

## 🚧 Future Direction

- [ ] University timetable import
- [ ] Excel timetable parsing
- [ ] PDF timetable parsing
- [ ] Stronger authentication
- [ ] Advanced community moderation
- [ ] Richer academic insights
- [ ] Improved mobile experience
- [ ] Calendar integrations
- [ ] Full Spotify integration
- [ ] AI academic assistant
- [ ] Cross-university timetable support
- [ ] Smart timetable synchronization

---

# 🧭 Long-Term Vision

NexTime should never become "just another timetable application."

The long-term vision is:

```text
                    UNIVERSITY
                         │
                         ▼
                   ┌──────────┐
                   │ NEX TIME │
                   └────┬─────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
     ACADEMICS        FOCUS        COMMUNITY
         │              │              │
         ▼              ▼              ▼
     Timetable        Study        Questions
     Attendance       Pomodoro     Resources
     Assignments      Music        Discussions
     Exams            Insights     Students
         │              │              │
         └──────────────┼──────────────┘
                        ▼
                   STUDENT OS
```

The vision is simple:

> **Everything a student needs to navigate university life should exist in one intelligent workspace.**

---

# 🌌 Why NexTime?

Because university shouldn't require:

- five different apps
- three spreadsheets
- endless WhatsApp groups
- random PDFs
- manual attendance calculations
- separate productivity tools
- remembering everything yourself

NexTime turns that scattered academic life into one connected experience.

### Your schedule.

### Your academics.

### Your focus.

### Your community.

### Your semester.

# One OS.

---

# 🏗️ Built Around a Simple Idea

The timetable tells NexTime:

> **Where the student is in their academic day.**

That context powers the rest.

```text
TIMETABLE
    ↓
CURRENT CLASS
    ↓
ATTENDANCE
    ↓
ASSIGNMENTS
    ↓
FREE TIME
    ↓
STUDY
    ↓
ANALYTICS
    ↓
COMMUNITY
    ↓
STUDENT OS
```

---

# ⭐ Product Principle

> **The timetable is the clock of NexTime. Everything else runs around it.**

---

<div align="center">

# 🚀 NexTime

### Your Student OS.

**Your university, beautifully organized.**

<br/>

### 🌐 [Launch NexTime](https://nextime-omega.vercel.app/)

<br/>

Built with curiosity, caffeine, and way too many UI iterations. ☕

</div>
