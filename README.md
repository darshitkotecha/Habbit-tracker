# 🏏 Habit Quest: Ascension Journey

A premium, cricket-themed gamified habit tracker designed to turn consistency into a high-stakes sport. Score XP (runs), build your "Playing XI" team, and evolve from a rookie Initiate to a legendary Identity Builder.

## 🌐 Live Demo
**Experience the full app immediately:** [**Launch Habit Quest (AI Studio)**](https://ais-pre-cam633wko3f252aq3wlafd-55985620159.asia-southeast1.run.app)

![Habit Quest Banner](https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200)

## 🚀 Vision
Habit Quest isn't just a logger; it's a strategic coaching platform. By combining high-octane "glassmorphism" aesthetics with psychological triggers (7/21/90/365 rules), we help you bridge the gap between *knowing* what to do and *actually* doing it.

## ✨ Core Features

### 1. The Pitch (Dashboard)
- **Daily Match:** Log habits with a single tap. Each completion is a run scored.
- **Evidence Log:** Upload "Daily Snaps" as concrete proof of your progress.
- **Performance Analytics:** High-fidelity line charts powered by Recharts to track your consistency.

### 2. Evolution Path
- **Psychological Milestones:** Track progress through the 4 stages of human behavioral change:
  - **7 Days:** Habit Initiate
  - **21 Days:** Habit Builder
  - **90 Days:** Lifestyle Builder
  - **365 Days:** Identity Builder

### 3. Strategy & Benefits
- **Habit ROI:** Understand the specific suggestions and vital benefits of your chosen habits.
- **Motivational Core:** Downloadable "Quote of the Day" cards overlaying serene landscape images for social sharing.
- **Risk Analysis:** Automatic detection of "Missing Essentials" (Sleep, Exercise, Finance) with high-visibility red alerts for potential health/life risks.

### 4. The Arena (Multiplayer)
- **Playing XI:** Form team squads with friends via email invites.
- **Live Match Feed:** See real-time activity broadcasters from other users in the arena.
- **Global Leaderboards:** Compete for the top spot in the league based on team XP.

### 5. Trophy Cabinet & Rewards
- **Achievement Unlocks:** Unlock specialized trophies (Zen Master, Iron Will, etc.) based on specific habit streaks.
- **XP Ascension:** Watch your XP progress through Levels.
- **Rewards Store:** Redeem your hard-earned XP for physical products (Journals, Smart Bottles) or Digital Gift Cards.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4.0 (Modern utility-first architecture)
- **Animation:** Motion (framer-motion) for high-performance transitions
- **Backend:** Node.js, Express (compiled via esbuild to CJS)
- **Database/Auth:** Firebase (Firestore & Authentication)
- **Icons:** Lucide React
- **Visualization:** Recharts
- **Image Generation:** html2canvas (for custom quote downloads)

## ⚙️ Installation & Setup

Follow these steps to run Habit Quest locally.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A Firebase Project (for Authentication and Firestore)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/habit-quest.git
cd habit-quest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Development Mode
Start both the Express server and the Vite dev server at once:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 5. Production Build
To create a production-ready bundle:
```bash
npm run build
```
This will generate a `dist/` folder for the frontend assets and a `dist/server.cjs` for the backend.

### 6. Start Production Server
```bash
npm start
```

## 📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with passion for GDG Baroda 2026 by Darshit Kotecha.*
