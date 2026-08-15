<div align="center">
  
  # 🚀 NexTime: Smart Student OS
  
  **The ultimate operating system for students.**  
  *Timetables, Deep Work, Analytics, and Community — all in one hyper-optimized, glassmorphic workspace.*

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animation-FF0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

</div>

---

## ✨ Features

NexTime is not just a dashboard—it is a full-screen, fixed-viewport "Operating System" designed to lock you into a state of flow.

- 🗓️ **Cinematic Timetable Grid**: View your schedule with beautiful color-coded glow effects (Blue for Lectures, Cyan for Labs, Purple for Tutorials).
- 🤝 **Global Friends System**: Pin your friends' batches and instantly switch your entire OS to their view with a single click.
- ⏱️ **Deep Work Timer**: Built-in Pomodoro/Focus timer with real-time sync and satisfying acoustic feedback.
- 💬 **Live Community Feed**: A global chat synced in real-time via Supabase, allowing students across batches to communicate instantly.
- 📊 **CGPA & Attendance Analytics**: Track your projected grades and attendance metrics with stunning data visualizations.
- 📲 **PWA Ready**: Install NexTime natively on your iPhone, Android, or Desktop as a standalone application.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router, Turbopack)
- **Styling**: Tailwind CSS + Custom CSS (Glassmorphism, Custom Scrollbars)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Database & Realtime**: Supabase
- **Rate Limiting & Redis**: Upstash
- **Icons**: Lucide React

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Satvik-4web/Nextime.git
cd Nextime
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your API keys:

```env
# Supabase (Database & Realtime)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Design Philosophy

NexTime was built with a strict aesthetic guideline:
1. **No generic UI**: Every button, modal, and panel utilizes layered `backdrop-blur` and semi-transparent borders to create depth.
2. **Micro-Interactions**: Hover states scale elements, shift shadows, and trigger subtle lowpass-filtered WebAudio clicks.
3. **Fixed Viewport**: The global body scrollbar is hidden. The OS scales to fit your screen exactly, preventing "website fatigue".

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Satvik-4web">Satvik</a></p>
</div>
