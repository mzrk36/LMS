# Online English with Muzamil — Live Examination Platform

A real-time, teacher-controlled English examination platform built with React 19, TypeScript, Tailwind CSS, Express, and Firebase Firestore / Server-Sent Events (SSE).

---

## 🌟 Live Public Links
- **Cloud Run Live App**: [Open Live Examination Platform](https://ais-pre-qsb7j7lrvy6xgp5hqeypwm-400066364475.asia-southeast1.run.app)
- **Student Portal**: Opens directly upon navigating to `/`
- **Teacher Portal**: Accessible via the discreet **Teacher** button in the header (Password: `genzomate2026`)

---

## 🚀 Key Features

1. **Clean, Mobile-First Design**:
   - 2-line title: **Online English** on line 1, **with Muzamil** on line 2 (spelled with single 'M').
   - No clutter buttons or unnecessary badges.
   - Mobile question palette toggle allowing instant jumping between questions on phones.
   - Touch-friendly 48px MCQ options with instant visual feedback.

2. **Teacher-Controlled Live Lifecycle**:
   - **Start Exam**: Broadcasts instant start signal to all waiting students with server-synchronized countdown timer.
   - **Pause Exam**: Freezes timer countdown, disables answering inputs, and displays informative paused state.
   - **Resume Exam**: Resumes testing from the exact frozen second.
   - **End Exam**: Immediately halts input, auto-finalizes all ongoing candidate attempts, computes results, and archives history.
   - **Reveal Leaderboard**: Single-click broadcast reveals the live rankings and celebratory podium with confetti to all students simultaneously.

3. **Live Question-by-Question Monitoring**:
   - Real-time candidate tracking (Q1 to Q30, answered count, percentage, online status).
   - Candidate Answer Inspector to privately review student submissions.
   - Instant "Simulate 3 Live Students" button for stress-testing.

4. **Secure Server-Side Scoring**:
   - Server-side answer key protects correct answers from client inspection.
   - Strict 1 mark per question (max 30 marks).
   - Instant grading, percentage calculation, and automated feedback.

---

## 📦 How to Push to GitHub

Run these commands in your project terminal:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "Initial release: Online English with Muzamil"

# 4. Set default branch to main
git branch -M main

# 5. Connect your GitHub repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## ⚡ 1-Click Deploy to Vercel

This repository is pre-configured with `vercel.json` and `/api/index.ts` for zero-configuration Vercel deployment:

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **"Add New..." > "Project"**.
3. Import your GitHub repository.
4. Set the Framework Preset to **Vite** (Build Command: `npm run build`, Output Directory: `dist`).
5. (Optional) Add Environment Variables in Vercel project settings:
   - `TEACHER_ADMIN_KEY`: `genzomate2026`
   - `GEMINI_API_KEY`: *(Your Gemini API key if using AI tools)*
6. Click **Deploy**!

Your app will be live globally on your own `*.vercel.app` domain with serverless backend APIs!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start the full-stack server
npm run dev

# Open http://localhost:3000
```

---

## 🔒 Teacher Credentials
- **Teacher Email**: `muhammedmuzamiljaan@gmail.com`
- **Master Password**: `genzomate2026`
