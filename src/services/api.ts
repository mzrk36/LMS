import { Exam, Question, StudentSession, LeaderboardEntry, HistoricalExam, QuestionOption } from '../types/exam';

export interface SSEListener {
  (event: { type: string; data: any; timestamp: number }): void;
}

class ExaminationApiService {
  private eventSource: EventSource | null = null;
  private listeners: Set<SSEListener> = new Set();
  private reconnectTimeout: any = null;

  constructor() {
    this.connectRealtime();
  }

  public connectRealtime() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      this.eventSource = new EventSource('/api/realtime/stream');

      this.eventSource.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data);
          this.listeners.forEach((listener) => listener(parsed));
        } catch (err) {
          console.error('[SSE] Failed to parse message', err);
        }
      };

      this.eventSource.onerror = () => {
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        // Attempt reconnection after 3 seconds
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => this.connectRealtime(), 3000);
      };
    } catch (e) {
      console.warn('[SSE] EventSource init failed', e);
    }
  }

  public subscribe(listener: SSEListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  // --- Student APIs ---

  async getCurrentExam(): Promise<{ exam: Exam; questions: Question[]; participantsCount: number }> {
    const res = await fetch('/api/exam/current');
    if (!res.ok) throw new Error('Failed to fetch exam data');
    return res.json();
  }

  async joinExam(studentName: string, existingSessionId?: string): Promise<{ session: StudentSession; exam: Exam }> {
    const res = await fetch('/api/student/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, existingSessionId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to join examination');
    }
    return res.json();
  }

  async getSession(sessionId: string): Promise<{ session: StudentSession; exam: Exam }> {
    const res = await fetch(`/api/student/session/${sessionId}`);
    if (!res.ok) throw new Error('Session not found');
    return res.json();
  }

  async saveAnswer(sessionId: string, questionId: number, option: QuestionOption): Promise<any> {
    const res = await fetch('/api/student/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionId, option })
    });
    if (!res.ok) throw new Error('Failed to save answer');
    return res.json();
  }

  async updateNavigation(sessionId: string, questionIndex: number): Promise<any> {
    const res = await fetch('/api/student/navigate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, questionIndex })
    });
    return res.json();
  }

  async submitExam(sessionId: string): Promise<{ session: StudentSession }> {
    const res = await fetch('/api/student/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    if (!res.ok) throw new Error('Failed to submit exam');
    return res.json();
  }

  async getPublicLeaderboard(): Promise<{ revealed: boolean; leaderboard: LeaderboardEntry[] }> {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) throw new Error('Failed to fetch leaderboard');
    return res.json();
  }

  // --- Admin APIs ---

  async adminLogin(password: string, email?: string): Promise<{ success: boolean; token: string; teacher: any }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, email })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Invalid credentials');
    }
    return res.json();
  }

  async getMonitorData(): Promise<{
    stats: { totalJoined: number; currentlyAttempting: number; submitted: number; waiting: number; disconnected: number };
    exam: Exam;
    sessions: StudentSession[];
    questions: Question[];
  }> {
    const res = await fetch('/api/admin/monitor');
    if (!res.ok) throw new Error('Failed to fetch monitor data');
    return res.json();
  }

  async startExam(): Promise<{ exam: Exam }> {
    const res = await fetch('/api/admin/exam/start', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to start exam');
    return res.json();
  }

  async pauseExam(): Promise<{ exam: Exam }> {
    const res = await fetch('/api/admin/exam/pause', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to pause exam');
    return res.json();
  }

  async resumeExam(): Promise<{ exam: Exam }> {
    const res = await fetch('/api/admin/exam/resume', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to resume exam');
    return res.json();
  }

  async endExam(): Promise<{ exam: Exam; leaderboard: LeaderboardEntry[] }> {
    const res = await fetch('/api/admin/exam/end', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to end exam');
    return res.json();
  }

  async toggleLeaderboard(revealed?: boolean): Promise<{ revealed: boolean }> {
    const res = await fetch('/api/admin/leaderboard/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revealed })
    });
    return res.json();
  }

  async toggleSolutions(revealed?: boolean): Promise<{ revealed: boolean }> {
    const res = await fetch('/api/admin/solutions/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ revealed })
    });
    return res.json();
  }

  async resetExam(): Promise<{ success: boolean; exam: Exam }> {
    const res = await fetch('/api/admin/exam/reset', { method: 'POST' });
    return res.json();
  }

  async simulateStudents(): Promise<{ success: boolean; simulated: StudentSession[] }> {
    const res = await fetch('/api/admin/simulate', { method: 'POST' });
    return res.json();
  }

  async getAdminQuestions(): Promise<{ questions: Question[] }> {
    const res = await fetch('/api/admin/questions');
    return res.json();
  }

  async updateQuestions(payload: { questions: Question[]; durationMinutes?: number; title?: string }): Promise<any> {
    const res = await fetch('/api/admin/questions/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  }

  async getAdminResults(): Promise<{ leaderboard: LeaderboardEntry[]; sessions: StudentSession[]; exam: Exam }> {
    const res = await fetch('/api/admin/results');
    return res.json();
  }

  async getHistory(): Promise<{ history: HistoricalExam[] }> {
    const res = await fetch('/api/admin/history');
    return res.json();
  }
}

export const api = new ExaminationApiService();
