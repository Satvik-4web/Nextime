# 🚀 NexTime – The Premium Student OS

<div align="center">
  <img src="file:///C:/Users/satvi/.gemini/antigravity/brain/54819213-3789-4a1c-a20f-d488b9fb9572/nextime_hero_1786830533717.jpg" alt="NexTime Hero" width="800"/>
</div>

---

## ✨ What is NexTime?
**NexTime** is a hyper‑optimized, glass‑morphic operating system designed exclusively for students. It fuses timetables, deep‑work timers, analytics, and a global friends network into a **single, immersive fullscreen experience** – no more tab‑hopping, no more distraction.

---

## 🌟 Core Features
- **🗓️ Cinematic Timetable Grid** – Color‑coded, glow‑enhanced blocks (blue = lectures, cyan = labs, purple = tutorials) with smooth scrolling and hover animations.
- **🤝 Global Friends System** – Pin classmates, instantly view their schedule, and see live class status with a sleek banner.
- **⏱️ Deep‑Work Pomodoro Timer** – Real‑time syncing, acoustic feedback, and elegant radial progress.
- **💬 Live Community Feed** – Powered by Supabase Realtime, chat across batches instantly.
- **📊 CGPA & Attendance Dashboard** – Interactive charts, predictive analytics, and exportable reports.
- **📱 PWA Ready** – Install on any device; works offline with cached assets.
- **🔒 Secure & Scalable** – Supabase for auth & DB, Upstash Redis for rate‑limiting.

---

## 🛠️ Tech Stack
| Layer | Technology |
|-------|------------|
| **Framework** | **Next.js 14** (App Router, Turbopack) |
| **Styling** | **Tailwind CSS** + custom glass‑morphic CSS |
| **State** | **Zustand** (persisted) |
| **Animations** | **Framer Motion** |
| **Database & Realtime** | **Supabase** |
| **Rate‑Limiting / Cache** | **Upstash Redis** |
| **Icons** | **Lucide React** |

---

## 🚀 Getting Started (Local Development)
```bash
# 1️⃣ Clone the repo
git clone https://github.com/Satvik-4web/Nextime.git && cd Nextime

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment variables
cat <<EOF > .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
EOF

# 4️⃣ Run the dev server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. The OS will launch in fullscreen mode automatically.

---

## 🎨 Design Philosophy
1. **No generic UI** – Every component uses layered `backdrop-blur`, semi‑transparent borders, and subtle gradients.
2. **Micro‑interactions** – Hover/press states scale elements, shift shadows, and trigger low‑pass‑filtered audio clicks.
3. **Fixed Viewport** – The body scrollbar is hidden; the OS scales to fill the screen, eliminating “website fatigue”.
4. **Premium Visuals** – Glass‑morphism, neon accents, and smooth motion create a state‑of‑the‑art experience.

---

## 🤝 Contributing
We welcome contributions! Fork the repo, make your improvements, and submit a PR. Please follow the existing aesthetic guidelines and keep the UI premium.

---

## 📜 License
Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Satvik-4web">Satvik</a></p>
</div>
