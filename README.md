# ReviseIt v2.0 — Smart LeetCode Revision Tracker

A full-stack MERN app to track, schedule, and revise coding problems using **Spaced Repetition**, with alarm notifications, progress analytics, streak tracking, and dark mode.

## ✨ New Features (v2.0)

| Feature | Description |
|---|---|
| 🧠 Spaced Repetition Auto-Scheduler | SM-2 algorithm auto-picks optimal review dates based on your confidence |
| 📊 Progress Analytics | Weekly activity chart, difficulty/platform breakdown, completion rate |
| 🔥 Streak Tracker | Daily revision streak with longest-streak record |
| 🌙 Dark Mode | Toggle dark/light mode on Today's Revisions page (persists in localStorage) |
| ⏰ Alarm Notification | In-app alarm sound (Web Audio API) + pulsing banner when revision is due |
| 🔔 Push Notifications | Browser push notifications via Web Push + Service Worker |
| 📅 Next Review Badge | Each problem card shows when next review is due |
| 🗑️ Delete Revisions | Remove individual revisions from the detail page |

---

## 🚀 How to Run

### Prerequisites
- Node.js v18+ and npm
- MongoDB Atlas account (free tier works perfectly)

---

### Step 1 — Clone / Extract the project
```bash
unzip reviseit_v2.zip
cd reviseit_v2
```

---

### Step 2 — Generate VAPID Keys (for push notifications)
```bash
cd backend
npx web-push generate-vapid-keys
```
Copy the output — you'll need `Public Key` and `Private Key`.

---

### Step 3 — Configure Backend
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster.mongodb.net/reviseit
JWT_SECRET=any_long_random_string_here
PORT=5000
VAPID_EMAIL=your@email.com
VAPID_PUBLIC_KEY=paste_public_key_here
VAPID_PRIVATE_KEY=paste_private_key_here
```

---

### Step 4 — Install & Start Backend
```bash
cd backend
npm install
npm run dev
# Server starts on http://localhost:5000
```

---

### Step 5 — Configure Frontend
```bash
cd frontend
cp .env.example .env
# No changes needed for local development
# The proxy in package.json forwards /api → localhost:5000
```

---

### Step 6 — Install & Start Frontend
```bash
cd frontend
npm install
npm start
# App opens at http://localhost:3000
```

---

### Step 7 — Enable Push Notifications
1. Open the app in your browser
2. Click **"Enable notifications"** banner on the Dashboard
3. Allow browser permission when prompted
4. You'll now receive push notifications when revisions are due!

---

## 🧠 How Spaced Repetition Works

When you mark a revision as done and provide a confidence rating:
- **Confidence 1–2** (Low): Resets interval → review again tomorrow
- **Confidence 3** (Okay): Short interval (1–6 days)
- **Confidence 4–5** (Good/Perfect): Interval multiplies by ease factor (grows over time)

The algorithm is based on [SM-2](https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method), the same method used by Anki.

---

## 📱 Mobile

The app is fully responsive — works on all screen sizes. The navbar collapses to a hamburger menu on mobile.

---

## 🛠️ Tech Stack

**Frontend:** React 18, React Router v6, Axios, react-hot-toast, Web Audio API, Service Workers  
**Backend:** Node.js, Express, MongoDB + Mongoose, JWT Auth, node-cron, web-design
---

## 📁 Project Structure

```
reviseit_v2/
├── backend/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/          (User, Problem, Revision)
│   ├── routes/          (auth, problems, revisions, notifications)
│   ├── jobs/reminderJob.js   (cron every minute)
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── sw.js              (Service Worker)
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/        (Navbar, ProblemCard, RevisionModal)
        ├── pages/             (Dashboard, TodayRevisions, Analytics, AddProblem, ProblemDetail, Login, Register)
        └── utils/notifications.js  (push + alarm sound)
```
