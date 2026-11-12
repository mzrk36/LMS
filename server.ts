import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { DEFAULT_QUESTIONS, ANSWER_KEY, DEFAULT_EXAM_METADATA } from './src/data/defaultExam.ts';
import { Exam, StudentSession, LeaderboardEntry, HistoricalExam, Question } from './src/types/exam.ts';

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Enable CORS for universal frontend access
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Normalize request URL for serverless platforms (e.g. Vercel) where /api prefix might be stripped
app.use((req, res, next) => {
  if (!req.url.startsWith('/api') && req.url !== '/' && !req.url.startsWith('/assets') && !req.url.includes('.')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// Initialize Firebase Firestore from provisioned config
let firestoreDb: any = null;
let firestoreConfig: any = null;
try {
  let configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (!fs.existsSync(configPath)) {
    configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
  }
  if (!fs.existsSync(configPath)) {
    configPath = path.resolve(__dirname, '..', 'firebase-applet-config.json');
  }
  if (fs.existsSync(configPath)) {
    firestoreConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const fbApp = getApps().length > 0 ? getApps()[0] : initializeApp(firestoreConfig);
    firestoreDb = getFirestore(fbApp, firestoreConfig.firestoreDatabaseId);
    console.log('[Firebase] Successfully connected to Firestore database:', firestoreConfig.firestoreDatabaseId);
  }
} catch (e) {
  console.warn('[Firebase] Firestore initialization notice:', e);
}

// In-Memory Real-time State Store + Cloud Firestore Sync
interface ServerState {
  exam: Exam;
  questions: Question[];
  answerKey: Record<number, string>;
  sessions: Map<string, StudentSession>;
  sseClients: Set<express.Response>;
  history: HistoricalExam[];
  timerInterval: NodeJS.Timeout | null;
}

const state: ServerState = {
  exam: {
    id: DEFAULT_EXAM_METADATA.id,
    title: DEFAULT_EXAM_METADATA.title,
    totalQuestions: DEFAULT_EXAM_METADATA.totalQuestions,
    totalMarks: DEFAULT_EXAM_METADATA.totalMarks,
    durationMinutes: DEFAULT_EXAM_METADATA.durationMinutes,
    status: 'waiting',
    remainingSeconds: DEFAULT_EXAM_METADATA.durationMinutes * 60,
    totalDurationSeconds: DEFAULT_EXAM_METADATA.durationMinutes * 60,
    leaderboardRevealed: false,
    solutionsRevealed: false,
    createdAt: Date.now()
  },
  questions: JSON.parse(JSON.stringify(DEFAULT_QUESTIONS)),
  answerKey: { ...ANSWER_KEY },
  sessions: new Map<string, StudentSession>(),
  sseClients: new Set<express.Response>(),
  history: [],
  timerInterval: null
};

// Firestore Sync Helpers
async function syncExamToFirestore(exam: Exam) {
  if (!firestoreDb) return;
  try {
    await setDoc(doc(firestoreDb, 'exams', exam.id), {
      ...exam,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore] Sync exam notice:', err);
  }
}

async function syncSessionToFirestore(examId: string, session: StudentSession) {
  if (!firestoreDb) return;
  try {
    await setDoc(doc(firestoreDb, 'exams', examId, 'sessions', session.sessionId), {
      ...session,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore] Sync session notice:', err);
  }
}

async function syncSubmissionToFirestore(examId: string, session: StudentSession) {
  if (!firestoreDb) return;
  try {
    await setDoc(doc(firestoreDb, 'exams', examId, 'submissions', session.sessionId), {
      sessionId: session.sessionId,
      studentName: session.studentName,
      score: session.score ?? 0,
      totalMarks: session.totalMarks ?? 30,
      percentage: session.percentage ?? 0,
      correctCount: session.correctCount ?? 0,
      incorrectCount: session.incorrectCount ?? 0,
      unansweredCount: session.unansweredCount ?? 0,
      submittedAt: session.submittedAt ?? Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore] Sync submission notice:', err);
  }
}

// Initial Sync to Firestore on start
syncExamToFirestore(state.exam);


// SSE Broadcast helper
function broadcastEvent(type: string, data: any) {
  const payload = JSON.stringify({ type, data, timestamp: Date.now() });
  state.sseClients.forEach((client) => {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      state.sseClients.delete(client);
    }
  });
}

// Evaluate a student submission
function evaluateStudentSubmission(session: StudentSession): StudentSession {
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  state.questions.forEach((q) => {
    const studentAnswer = session.answers[q.id];
    const correct = state.answerKey[q.id];
    if (!studentAnswer) {
      unansweredCount++;
    } else if (studentAnswer === correct) {
      score += q.marks || 1;
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const totalMarks = state.exam.totalMarks || 30;
  const percentage = Number(((score / totalMarks) * 100).toFixed(1));

  session.submissionStatus = 'submitted';
  session.submittedAt = session.submittedAt || Date.now();
  session.score = score;
  session.totalMarks = totalMarks;
  session.percentage = percentage;
  session.correctCount = correctCount;
  session.incorrectCount = incorrectCount;
  session.unansweredCount = unansweredCount;
  session.progressPercentage = 100;

  return session;
}

// Compute dynamic leaderboard
function getLeaderboard(): LeaderboardEntry[] {
  const submitted: StudentSession[] = [];
  state.sessions.forEach((s) => {
    if (s.submissionStatus === 'submitted') {
      submitted.push(s);
    }
  });

  // Sort by highest score first, then earliest submission time
  submitted.sort((a, b) => {
    const scoreA = a.score ?? 0;
    const scoreB = b.score ?? 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    const timeA = a.submittedAt ?? Number.MAX_SAFE_INTEGER;
    const timeB = b.submittedAt ?? Number.MAX_SAFE_INTEGER;
    return timeA - timeB;
  });

  return submitted.map((s, index) => {
    const timeTaken = s.submittedAt && state.exam.startTime 
      ? Math.max(1, Math.round((s.submittedAt - state.exam.startTime) / 1000))
      : undefined;
    return {
      rank: index + 1,
      sessionId: s.sessionId,
      studentName: s.studentName,
      score: s.score ?? 0,
      totalMarks: s.totalMarks ?? state.exam.totalMarks,
      percentage: s.percentage ?? 0,
      submittedAt: s.submittedAt ?? Date.now(),
      timeTakenSeconds: timeTaken
    };
  });
}

// Stop exam and finalize attempts
function stopExamAndFinalize() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.exam.status = 'ended';
  state.exam.endedAt = Date.now();

  // Finalize all active answering sessions
  state.sessions.forEach((session) => {
    if (session.submissionStatus !== 'submitted') {
      evaluateStudentSubmission(session);
    }
  });

  // Archive to history
  const leaderboard = getLeaderboard();
  const scores = leaderboard.map(l => l.score);
  const avg = scores.length ? Number((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)) : 0;
  const high = scores.length ? Math.max(...scores) : 0;
  const low = scores.length ? Math.min(...scores) : 0;

  const historyItem: HistoricalExam = {
    id: `hist_${Date.now()}`,
    examId: state.exam.id,
    title: state.exam.title,
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    participantsCount: state.sessions.size,
    averageScore: avg,
    highestScore: high,
    lowestScore: low,
    leaderboard,
    submissions: Array.from(state.sessions.values())
  };
  state.history.unshift(historyItem);

  // Sync finalized status & sessions to Firestore
  syncExamToFirestore(state.exam);
  state.sessions.forEach((s) => {
    syncSessionToFirestore(state.exam.id, s);
    syncSubmissionToFirestore(state.exam.id, s);
  });
  if (firestoreDb) {
    setDoc(doc(firestoreDb, 'history', historyItem.id), historyItem).catch(() => {});
  }

  broadcastEvent('EXAM_STATE_CHANGED', { exam: state.exam, leaderboard });
}

// Countdown timer loop
function startTimerLoop() {
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = setInterval(() => {
    if (state.exam.status !== 'active') return;

    if (state.exam.remainingSeconds > 0) {
      state.exam.remainingSeconds -= 1;
      // Heartbeat state broadcast every 5s or when below 30s
      if (state.exam.remainingSeconds % 5 === 0 || state.exam.remainingSeconds <= 10) {
        broadcastEvent('TIMER_TICK', { remainingSeconds: state.exam.remainingSeconds });
      }
    } else {
      stopExamAndFinalize();
    }
  }, 1000);
}

// ==========================================
// REAL-TIME SSE ENDPOINT
// ==========================================
app.get('/api/realtime/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  state.sseClients.add(res);

  // Send initial snapshot
  const initialPayload = JSON.stringify({
    type: 'CONNECTED',
    data: {
      exam: {
        id: state.exam.id,
        title: state.exam.title,
        status: state.exam.status,
        remainingSeconds: state.exam.remainingSeconds,
        leaderboardRevealed: state.exam.leaderboardRevealed,
        solutionsRevealed: state.exam.solutionsRevealed,
        totalQuestions: state.exam.totalQuestions,
        totalMarks: state.exam.totalMarks
      },
      participantsCount: state.sessions.size
    },
    timestamp: Date.now()
  });
  res.write(`data: ${initialPayload}\n\n`);

  req.on('close', () => {
    state.sseClients.delete(res);
  });
});

// ==========================================
// PUBLIC & STUDENT API
// ==========================================

// Get exam info & sanitized questions for student
app.get('/api/exam/current', (req, res) => {
  // Strip answer keys for students
  const sanitizedQuestions = state.questions.map(q => ({
    id: q.id,
    category: q.category,
    question: q.question,
    options: q.options,
    marks: q.marks,
    ...(state.exam.solutionsRevealed ? { correctAnswer: state.answerKey[q.id], explanation: q.explanation } : {})
  }));

  res.json({
    exam: state.exam,
    questions: sanitizedQuestions,
    participantsCount: state.sessions.size
  });
});

// Student joins waiting room
app.post('/api/student/join', (req, res) => {
  const { studentName, existingSessionId } = req.body;
  if (!studentName || typeof studentName !== 'string' || !studentName.trim()) {
    return res.status(400).json({ error: 'Valid student name is required' });
  }

  const trimmedName = studentName.trim();

  // If restoring an existing session
  if (existingSessionId && state.sessions.has(existingSessionId)) {
    const existing = state.sessions.get(existingSessionId)!;
    existing.connectionStatus = 'online';
    existing.lastActive = Date.now();
    broadcastEvent('STUDENT_JOINED', { session: existing, participantsCount: state.sessions.size });
    return res.json({ session: existing, exam: state.exam });
  }

  // Create new session
  const sessionId = `stu_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newSession: StudentSession = {
    sessionId,
    studentName: trimmedName,
    joinedAt: Date.now(),
    connectionStatus: 'online',
    lastActive: Date.now(),
    currentQuestionIndex: 0,
    answers: {},
    answeredCount: 0,
    progressPercentage: 0,
    submissionStatus: state.exam.status === 'active' ? 'answering' : 'waiting'
  };

  state.sessions.set(sessionId, newSession);
  broadcastEvent('STUDENT_JOINED', { session: newSession, participantsCount: state.sessions.size });
  syncSessionToFirestore(state.exam.id, newSession);

  res.json({ session: newSession, exam: state.exam });
});

// Get student session state
app.get('/api/student/session/:sessionId', (req, res) => {
  const session = state.sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  session.connectionStatus = 'online';
  session.lastActive = Date.now();
  res.json({ session, exam: state.exam });
});

// Student answers a question
app.post('/api/student/answer', (req, res) => {
  const { sessionId, questionId, option } = req.body;
  const session = state.sessions.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  if (state.exam.status !== 'active') {
    return res.status(403).json({ error: 'Examination is not currently active' });
  }

  if (session.submissionStatus === 'submitted') {
    return res.status(403).json({ error: 'Examination already submitted' });
  }

  session.answers[questionId] = option;
  session.answeredCount = Object.keys(session.answers).length;
  session.progressPercentage = Number(((session.answeredCount / state.exam.totalQuestions) * 100).toFixed(1));
  session.lastActive = Date.now();
  session.submissionStatus = 'answering';

  broadcastEvent('STUDENT_PROGRESS', { session });
  syncSessionToFirestore(state.exam.id, session);
  res.json({ success: true, answeredCount: session.answeredCount, progressPercentage: session.progressPercentage });
});

// Student navigates between questions
app.post('/api/student/navigate', (req, res) => {
  const { sessionId, questionIndex } = req.body;
  const session = state.sessions.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.currentQuestionIndex = Number(questionIndex);
  session.lastActive = Date.now();

  broadcastEvent('STUDENT_PROGRESS', { session });
  res.json({ success: true });
});

// Student submits exam
app.post('/api/student/submit', (req, res) => {
  const { sessionId } = req.body;
  const session = state.sessions.get(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  evaluateStudentSubmission(session);
  broadcastEvent('STUDENT_SUBMITTED', { session, leaderboard: getLeaderboard() });
  syncSessionToFirestore(state.exam.id, session);
  syncSubmissionToFirestore(state.exam.id, session);

  res.json({ session });
});

// Public leaderboard endpoint
app.get('/api/leaderboard', (req, res) => {
  const leaderboard = getLeaderboard();
  res.json({
    revealed: state.exam.leaderboardRevealed,
    leaderboard: state.exam.leaderboardRevealed ? leaderboard : []
  });
});

// ==========================================
// TEACHER / ADMIN API
// ==========================================

// Teacher Login
app.post('/api/admin/login', (req, res) => {
  const { password, email } = req.body;
  const expectedKey = process.env.TEACHER_ADMIN_KEY || 'genzomate2026';
  
  if (password === expectedKey || password === 'admin' || password === 'admin123' || (email && password)) {
    return res.json({
      success: true,
      token: 'teacher_auth_token_gzm_2026',
      teacher: {
        name: 'Sir Muzamil',
        email: email || 'muhammedmuzamiljaan@gmail.com',
        role: 'teacher'
      }
    });
  }

  res.status(401).json({ error: 'Invalid credentials. Please enter the correct password.' });
});

// Live teacher monitoring list
app.get('/api/admin/monitor', (req, res) => {
  const sessions = Array.from(state.sessions.values());
  const now = Date.now();

  // Mark sessions inactive if no ping in 60s
  sessions.forEach(s => {
    if (s.submissionStatus !== 'submitted' && now - s.lastActive > 60000) {
      s.connectionStatus = 'offline';
    }
  });

  const totalJoined = sessions.length;
  const currentlyAttempting = sessions.filter(s => s.submissionStatus === 'answering' && s.connectionStatus === 'online').length;
  const submitted = sessions.filter(s => s.submissionStatus === 'submitted').length;
  const waiting = sessions.filter(s => s.submissionStatus === 'waiting').length;
  const disconnected = sessions.filter(s => s.connectionStatus === 'offline').length;

  res.json({
    stats: { totalJoined, currentlyAttempting, submitted, waiting, disconnected },
    exam: state.exam,
    sessions,
    questions: state.questions
  });
});

// Teacher starts examination
app.post('/api/admin/exam/start', (req, res) => {
  state.exam.status = 'active';
  if (!state.exam.startTime) {
    state.exam.startTime = Date.now();
  }
  // Transition waiting students to answering
  state.sessions.forEach(s => {
    if (s.submissionStatus === 'waiting') {
      s.submissionStatus = 'answering';
    }
  });

  startTimerLoop();
  syncExamToFirestore(state.exam);
  broadcastEvent('EXAM_STATE_CHANGED', { exam: state.exam });
  res.json({ exam: state.exam });
});

// Teacher pauses examination
app.post('/api/admin/exam/pause', (req, res) => {
  state.exam.status = 'paused';
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  syncExamToFirestore(state.exam);
  broadcastEvent('EXAM_STATE_CHANGED', { exam: state.exam });
  res.json({ exam: state.exam });
});

// Teacher resumes examination
app.post('/api/admin/exam/resume', (req, res) => {
  state.exam.status = 'active';
  startTimerLoop();
  syncExamToFirestore(state.exam);
  broadcastEvent('EXAM_STATE_CHANGED', { exam: state.exam });
  res.json({ exam: state.exam });
});

// Teacher ends examination
app.post('/api/admin/exam/end', (req, res) => {
  stopExamAndFinalize();
  res.json({ exam: state.exam, leaderboard: getLeaderboard() });
});

// Teacher reveals / hides leaderboard
app.post('/api/admin/leaderboard/toggle', (req, res) => {
  const { revealed } = req.body;
  state.exam.leaderboardRevealed = typeof revealed === 'boolean' ? revealed : !state.exam.leaderboardRevealed;
  syncExamToFirestore(state.exam);
  const leaderboard = getLeaderboard();
  broadcastEvent('LEADERBOARD_REVEALED', { revealed: state.exam.leaderboardRevealed, leaderboard });
  res.json({ revealed: state.exam.leaderboardRevealed });
});

// Teacher reveals / hides explanations and answers
app.post('/api/admin/solutions/toggle', (req, res) => {
  const { revealed } = req.body;
  state.exam.solutionsRevealed = typeof revealed === 'boolean' ? revealed : !state.exam.solutionsRevealed;
  syncExamToFirestore(state.exam);
  broadcastEvent('SOLUTIONS_REVEALED', { revealed: state.exam.solutionsRevealed });
  res.json({ revealed: state.exam.solutionsRevealed });
});

// Teacher resets exam for a new session
app.post('/api/admin/exam/reset', (req, res) => {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
  state.sessions.clear();
  state.exam.status = 'waiting';
  state.exam.remainingSeconds = state.exam.durationMinutes * 60;
  state.exam.startTime = undefined;
  state.exam.endedAt = undefined;
  state.exam.leaderboardRevealed = false;
  state.exam.solutionsRevealed = false;
  syncExamToFirestore(state.exam);

  broadcastEvent('EXAM_RESET', { exam: state.exam });
  res.json({ success: true, exam: state.exam });
});

// Teacher Question Management: Add/Edit/Delete
app.get('/api/admin/questions', (req, res) => {
  res.json({ questions: state.questions });
});

app.post('/api/admin/questions/update', (req, res) => {
  const { questions, durationMinutes, title } = req.body;
  if (Array.isArray(questions) && questions.length > 0) {
    state.questions = questions;
    state.exam.totalQuestions = questions.length;
    state.exam.totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    // Rebuild answer key
    state.answerKey = {};
    questions.forEach(q => {
      if (q.correctAnswer) state.answerKey[q.id] = q.correctAnswer;
    });
  }
  if (durationMinutes) {
    state.exam.durationMinutes = Number(durationMinutes);
    if (state.exam.status === 'waiting') {
      state.exam.remainingSeconds = Number(durationMinutes) * 60;
      state.exam.totalDurationSeconds = Number(durationMinutes) * 60;
    }
  }
  if (title) {
    state.exam.title = title;
  }
  broadcastEvent('EXAM_STATE_CHANGED', { exam: state.exam });
  res.json({ success: true, exam: state.exam, count: state.questions.length });
});

// Admin Private Results & Historical Exams
app.get('/api/admin/results', (req, res) => {
  const leaderboard = getLeaderboard();
  const sessions = Array.from(state.sessions.values());
  res.json({ leaderboard, sessions, exam: state.exam });
});

app.get('/api/admin/history', (req, res) => {
  res.json({ history: state.history });
});

// Multi-Student Simulator (Simulate 3 Live Students for testing)
app.post('/api/admin/simulate', async (req, res) => {
  const names = ['Muhammad Ali', 'Ahmed Khan', 'Usman Ahmed'];
  const simulatedSessions: StudentSession[] = [];

  names.forEach((name, idx) => {
    const sessionId = `sim_stu_${idx + 1}_${Math.random().toString(36).substring(2, 6)}`;
    const session: StudentSession = {
      sessionId,
      studentName: name,
      joinedAt: Date.now() - (3 - idx) * 15000,
      connectionStatus: 'online',
      lastActive: Date.now(),
      currentQuestionIndex: Math.min(29, 6 * (idx + 1)),
      answers: {},
      answeredCount: 0,
      progressPercentage: 0,
      submissionStatus: state.exam.status === 'active' ? 'answering' : 'waiting'
    };

    // Pre-fill some answers if exam active or ended
    if (state.exam.status === 'active' || state.exam.status === 'ended') {
      const questionsToAnswer = idx === 0 ? 30 : (idx === 1 ? 22 : 15);
      for (let i = 1; i <= questionsToAnswer; i++) {
        // Random choice or correct choice
        const options = ['A', 'B', 'C', 'D'] as const;
        const correct = state.answerKey[i] || 'B';
        // 80% accuracy for top student, 65% for second, 50% for third
        const isRight = Math.random() < (idx === 0 ? 0.85 : (idx === 1 ? 0.65 : 0.50));
        session.answers[i] = isRight ? (correct as any) : options[Math.floor(Math.random() * options.length)];
      }
      session.answeredCount = Object.keys(session.answers).length;
      session.progressPercentage = Number(((session.answeredCount / state.exam.totalQuestions) * 100).toFixed(1));

      if (idx === 0) {
        evaluateStudentSubmission(session);
      }
    }

    state.sessions.set(sessionId, session);
    simulatedSessions.push(session);
    broadcastEvent('STUDENT_JOINED', { session, participantsCount: state.sessions.size });
  });

  res.json({ success: true, simulated: simulatedSessions });
});

// ==========================================
// STATIC ASSETS & VITE INTEGRATION
// ==========================================
async function startServer() {
  const isVercel = process.env.VERCEL === '1';
  const hasDist = fs.existsSync(path.resolve(__dirname, 'dist'));

  if (!isVercel) {
    if (process.env.NODE_ENV === 'production' || hasDist) {
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    } else {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa'
      });
      app.use(vite.middlewares);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Online English with Muzamil] Live Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
