export type QuestionOption = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: number;
  category: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer?: QuestionOption; // Hidden from student until authorized
  explanation?: string;
  marks: number;
}

export type ExamStatus = 'waiting' | 'active' | 'paused' | 'ended';

export interface Exam {
  id: string;
  title: string;
  totalQuestions: number;
  totalMarks: number;
  durationMinutes: number;
  status: ExamStatus;
  startTime?: number; // timestamp ms
  remainingSeconds: number;
  totalDurationSeconds: number;
  leaderboardRevealed: boolean;
  solutionsRevealed: boolean;
  createdAt: number;
  endedAt?: number;
}

export interface StudentSession {
  sessionId: string;
  studentName: string;
  joinedAt: number;
  connectionStatus: 'online' | 'offline';
  lastActive: number;
  currentQuestionIndex: number; // 0-based
  answers: Record<number, QuestionOption>; // questionId -> option
  answeredCount: number;
  progressPercentage: number;
  submissionStatus: 'waiting' | 'answering' | 'submitted';
  submittedAt?: number;
  score?: number;
  totalMarks?: number;
  percentage?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
}

export interface LeaderboardEntry {
  rank: number;
  sessionId: string;
  studentName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  submittedAt: number;
  timeTakenSeconds?: number;
}

export interface HistoricalExam {
  id: string;
  examId: string;
  title: string;
  date: string;
  participantsCount: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  leaderboard: LeaderboardEntry[];
  submissions: StudentSession[];
}

export interface ServerSyncEvent {
  type: 
    | 'EXAM_STATE_CHANGED'
    | 'STUDENT_JOINED'
    | 'STUDENT_PROGRESS'
    | 'STUDENT_SUBMITTED'
    | 'LEADERBOARD_REVEALED'
    | 'SOLUTIONS_REVEALED'
    | 'EXAM_RESET';
  data: any;
  timestamp: number;
}
