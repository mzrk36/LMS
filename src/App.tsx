import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './components/StudentPortal';
import { ExamInterface } from './components/ExamInterface';
import { StudentResults } from './components/StudentResults';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { api } from './services/api';
import { Exam, StudentSession, Question, LeaderboardEntry, HistoricalExam, QuestionOption } from './types/exam';

export function App() {
  // Navigation Route State: Always opens Student Portal directly by default
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (['/exam', '/results', '/leaderboard'].includes(path)) {
        return path;
      }
    }
    return '/';
  });

  const [adminSubTab, setAdminSubTab] = useState<'monitor' | 'exams' | 'results' | 'history'>('monitor');
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Core Data States
  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [participantsCount, setParticipantsCount] = useState<number>(0);
  const [studentSession, setStudentSession] = useState<StudentSession | null>(null);
  const [serverRemainingSeconds, setServerRemainingSeconds] = useState<number>(1800);

  // Admin Data States
  const [isTeacherAuthenticated, setIsTeacherAuthenticated] = useState<boolean>(() => {
    return typeof window !== 'undefined' && Boolean(localStorage.getItem('genzomate_teacher_token'));
  });
  const [adminSessions, setAdminSessions] = useState<StudentSession[]>([]);
  const [adminQuestions, setAdminQuestions] = useState<Question[]>([]);
  const [adminStats, setAdminStats] = useState({
    totalJoined: 0,
    currentlyAttempting: 0,
    submitted: 0,
    waiting: 0,
    disconnected: 0
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<HistoricalExam[]>([]);

  // Navigate helper
  const navigate = useCallback((route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', route);
    }
  }, []);

  // Sync route with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRoute(path || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch initial exam data & restore student session if available
  const loadExamAndSession = useCallback(async () => {
    try {
      const data = await api.getCurrentExam();
      setExam(data.exam);
      setQuestions(data.questions);
      setParticipantsCount(data.participantsCount);
      setServerRemainingSeconds(data.exam.remainingSeconds);

      // Check for saved student session
      const savedSessionId = localStorage.getItem('genzomate_student_session_id');
      if (savedSessionId) {
        try {
          const sessData = await api.getSession(savedSessionId);
          const isOldInstance = Boolean(data.exam.examInstanceId && sessData.session?.examInstanceId && sessData.session.examInstanceId !== data.exam.examInstanceId);
          
          if (isOldInstance && currentRoute === '/') {
            // Discard previous session only when student returns to root lobby for a new test instance
            localStorage.removeItem('genzomate_student_session_id');
            localStorage.removeItem('genzomate_student_session_data');
            setStudentSession(null);
          } else if (sessData.session) {
            setStudentSession(sessData.session);
            localStorage.setItem('genzomate_student_session_data', JSON.stringify(sessData.session));
            if (sessData.session.submissionStatus === 'submitted' && currentRoute === '/exam') {
              navigate('/results');
            }
          }
        } catch {
          // Never log out a student during active exam due to network glitch
          const cached = localStorage.getItem('genzomate_student_session_data');
          if (cached) {
            try {
              setStudentSession(JSON.parse(cached));
            } catch {}
          }
        }
      } else {
        setStudentSession(null);
      }
    } catch (err) {
      console.error('[App] Failed to load exam data', err);
    }
  }, [currentRoute, navigate]);

  const isFetchingTeacherDataRef = useRef(false);

  // Fetch teacher monitor data with in-flight lock & stable updates (prevents blinking)
  const loadTeacherData = useCallback(async () => {
    if (!isTeacherAuthenticated || isFetchingTeacherDataRef.current) return;
    isFetchingTeacherDataRef.current = true;
    try {
      const monitorData = await api.getMonitorData();

      if (monitorData) {
        if (monitorData.stats) {
          setAdminStats(monitorData.stats);
        }

        if (monitorData.sessions) {
          setAdminSessions((prev) => {
            if (prev.length !== monitorData.sessions.length) {
              return monitorData.sessions;
            }
            const prevMap = new Map(prev.map(p => [p.sessionId, p]));
            let hasChanges = false;
            for (const s of monitorData.sessions) {
              const p = prevMap.get(s.sessionId);
              if (
                !p ||
                p.answeredCount !== s.answeredCount ||
                p.currentQuestionIndex !== s.currentQuestionIndex ||
                p.submissionStatus !== s.submissionStatus ||
                p.connectionStatus !== s.connectionStatus ||
                p.score !== s.score ||
                p.studentName !== s.studentName
              ) {
                hasChanges = true;
                break;
              }
            }
            return hasChanges ? monitorData.sessions : prev;
          });
        }

        if (monitorData.questions && monitorData.questions.length > 0) {
          setAdminQuestions(monitorData.questions);
        }

        if (monitorData.exam) {
          setExam((prev) => (prev ? { ...prev, ...monitorData.exam } : monitorData.exam));
          if (monitorData.exam.remainingSeconds !== undefined) {
            setServerRemainingSeconds(monitorData.exam.remainingSeconds);
          }
        }
      }
    } catch (err) {
      console.warn('[App] Teacher data load notice:', err);
    } finally {
      isFetchingTeacherDataRef.current = false;
    }
  }, [isTeacherAuthenticated]);

  // Smooth 3.5s auto-polling for teacher view (prevents blinking and rapid UI thrashing)
  useEffect(() => {
    if (!isTeacherAuthenticated || !currentRoute.startsWith('/admin')) return;

    loadTeacherData();
    const interval = setInterval(() => {
      loadTeacherData();
    }, 3500);

    return () => clearInterval(interval);
  }, [isTeacherAuthenticated, currentRoute, loadTeacherData]);

  // Initial load
  useEffect(() => {
    loadExamAndSession();
    if (isTeacherAuthenticated) {
      loadTeacherData();
    }
  }, [loadExamAndSession, loadTeacherData, isTeacherAuthenticated]);

  // Fetch public leaderboard
  const loadPublicLeaderboard = useCallback(async () => {
    try {
      const res = await api.getPublicLeaderboard();
      if (res.revealed) {
        setLeaderboard(res.leaderboard);
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
  }, []);

  useEffect(() => {
    if (currentRoute === '/leaderboard') {
      loadPublicLeaderboard();
    }
  }, [currentRoute, loadPublicLeaderboard]);

  // Real-Time SSE Listener
  useEffect(() => {
    const unsubscribe = api.subscribe((event) => {
      // console.log('[RealTime Event]', event.type, event.data);

      switch (event.type) {
        case 'CONNECTED':
          if (event.data.exam) {
            setExam((prev) => ({ ...prev, ...event.data.exam }));
            setServerRemainingSeconds(event.data.exam.remainingSeconds);
          }
          if (event.data.participantsCount !== undefined) {
            setParticipantsCount(event.data.participantsCount);
          }
          break;

        case 'TIMER_TICK':
          if (event.data.remainingSeconds !== undefined) {
            setServerRemainingSeconds(event.data.remainingSeconds);
          }
          break;

        case 'EXAM_STATE_CHANGED':
          if (event.data.exam) {
            setExam(event.data.exam);
            setServerRemainingSeconds(event.data.exam.remainingSeconds);

            // Auto-transition waiting students into exam when started
            if (event.data.exam.status === 'active') {
              if (currentRoute === '/' && studentSession && studentSession.submissionStatus !== 'submitted') {
                navigate('/exam');
              }
            } else if (event.data.exam.status === 'ended') {
              // Auto-transition answering students to results
              if (currentRoute === '/exam') {
                navigate('/results');
              }
            }
          }
          if (event.data.leaderboard) {
            setLeaderboard(event.data.leaderboard);
          }
          loadTeacherData();
          break;

        case 'STUDENT_JOINED':
          if (event.data.participantsCount !== undefined) {
            setParticipantsCount(event.data.participantsCount);
          }
          loadTeacherData();
          break;

        case 'STUDENT_PROGRESS':
          // Update monitor sessions state
          setAdminSessions((prev) => {
            const updated = event.data.session;
            if (!updated) return prev;
            return prev.map((s) => (s.sessionId === updated.sessionId ? { ...s, ...updated } : s));
          });
          // Update current student session if matches
          if (studentSession && studentSession.sessionId === event.data.session?.sessionId) {
            setStudentSession(event.data.session);
          }
          break;

        case 'STUDENT_SUBMITTED':
          if (event.data.leaderboard) {
            setLeaderboard(event.data.leaderboard);
          }
          if (studentSession && studentSession.sessionId === event.data.session?.sessionId) {
            setStudentSession(event.data.session);
            navigate('/results');
          }
          loadTeacherData();
          break;

        case 'LEADERBOARD_REVEALED':
          setExam((prev) => (prev ? { ...prev, leaderboardRevealed: event.data.revealed } : null));
          if (event.data.leaderboard) {
            setLeaderboard(event.data.leaderboard);
          }
          // If revealed is true and student is on /results or finished, automatically present leaderboard!
          if (event.data.revealed) {
            if (currentRoute === '/results' || (studentSession && studentSession.submissionStatus === 'submitted')) {
              navigate('/leaderboard');
            }
          }
          break;

        case 'SOLUTIONS_REVEALED':
          setExam((prev) => (prev ? { ...prev, solutionsRevealed: event.data.revealed } : null));
          loadExamAndSession();
          break;

        case 'EXAM_RESET':
          localStorage.removeItem('genzomate_student_session_id');
          setStudentSession(null);
          setExam(event.data.exam);
          setServerRemainingSeconds(event.data.exam.durationMinutes * 60);
          navigate('/');
          loadTeacherData();
          break;
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentRoute, studentSession, navigate, loadTeacherData, loadExamAndSession]);

  // Student Actions
  const handleJoinExam = async (name: string) => {
    const savedSessionId = localStorage.getItem('genzomate_student_session_id') || undefined;
    const res = await api.joinExam(name, savedSessionId);
    setStudentSession(res.session);
    setExam(res.exam);
    localStorage.setItem('genzomate_student_session_id', res.session.sessionId);

    if (res.exam.status === 'active') {
      navigate('/exam');
    }
  };

  const handleSaveAnswer = async (questionId: number, option: QuestionOption) => {
    if (!studentSession) return;
    await api.saveAnswer(studentSession.sessionId, questionId, option);
  };

  const handleNavigateQuestion = async (questionIndex: number) => {
    if (!studentSession) return;
    await api.updateNavigation(studentSession.sessionId, questionIndex);
  };

  const handleSubmitExam = async () => {
    if (!studentSession) return;
    try {
      const res = await api.submitExam(studentSession.sessionId);
      if (res && res.session) {
        setStudentSession(res.session);
        localStorage.setItem('genzomate_student_session_id', res.session.sessionId);
        localStorage.setItem('genzomate_student_session_data', JSON.stringify(res.session));
        localStorage.setItem(`session_${res.session.sessionId}`, JSON.stringify(res.session));
      }
    } catch (err) {
      console.warn('[App] submitExam notice:', err);
    }
    navigate('/results');
  };

  const handleLeaveSession = () => {
    localStorage.removeItem('genzomate_student_session_id');
    setStudentSession(null);
    navigate('/');
  };

  // Teacher Examination Controls
  const handleStartExam = async () => {
    const res = await api.startExam();
    setExam(res.exam);
  };

  const handlePauseExam = async () => {
    const res = await api.pauseExam();
    setExam(res.exam);
  };

  const handleResumeExam = async () => {
    const res = await api.resumeExam();
    setExam(res.exam);
  };

  const handleEndExam = async () => {
    const res = await api.endExam();
    setExam(res.exam);
    setLeaderboard(res.leaderboard);
  };

  const handleToggleLeaderboard = async () => {
    const res = await api.toggleLeaderboard();
    setExam((prev) => (prev ? { ...prev, leaderboardRevealed: res.revealed } : null));
  };

  const handleToggleSolutions = async () => {
    const res = await api.toggleSolutions();
    setExam((prev) => (prev ? { ...prev, solutionsRevealed: res.revealed } : null));
  };

  const handleResetExam = async () => {
    await api.resetExam();
  };

  const handleSimulateStudents = async () => {
    await api.simulateStudents();
    await loadTeacherData();
  };

  const handleSaveQuestions = async (updatedQuestions: Question[], durationMinutes?: number, title?: string) => {
    await api.updateQuestions({ questions: updatedQuestions, durationMinutes, title });
    await loadTeacherData();
    await loadExamAndSession();
  };

  // Teacher Login / Logout
  const handleTeacherLoginSuccess = (token: string) => {
    localStorage.setItem('genzomate_teacher_token', token);
    setIsTeacherAuthenticated(true);
    navigate('/admin');
    loadTeacherData();
  };

  const handleTeacherLogout = () => {
    localStorage.removeItem('genzomate_teacher_token');
    setIsTeacherAuthenticated(false);
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Universal Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={navigate}
        exam={exam}
        studentName={studentSession?.studentName}
        isTeacherAuthenticated={isTeacherAuthenticated}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        <ErrorBoundary>
        
        {/* Route: / — Student Portal */}
        {currentRoute === '/' && (
          <StudentPortal
            exam={exam}
            studentSession={studentSession}
            participantsCount={participantsCount}
            onJoin={handleJoinExam}
            onEnterExam={() => navigate('/exam')}
            onLeaveSession={handleLeaveSession}
          />
        )}

        {/* Route: /exam — Student Examination Interface */}
        {currentRoute === '/exam' && (
          studentSession ? (
            <ExamInterface
              exam={exam || { id: '0', title: 'English Test', totalQuestions: 30, totalMarks: 30, durationMinutes: 30, status: 'waiting', remainingSeconds: 1800, totalDurationSeconds: 1800, leaderboardRevealed: false, solutionsRevealed: false, createdAt: 0 }}
              questions={questions}
              studentSession={studentSession}
              onSaveAnswer={handleSaveAnswer}
              onNavigateQuestion={handleNavigateQuestion}
              onSubmitExam={handleSubmitExam}
              remainingSeconds={serverRemainingSeconds}
            />
          ) : (
            <StudentPortal
              exam={exam}
              studentSession={null}
              participantsCount={participantsCount}
              onJoin={handleJoinExam}
              onEnterExam={() => navigate('/exam')}
              onLeaveSession={handleLeaveSession}
            />
          )
        )}

        {/* Route: /results — Student Results Card */}
        {currentRoute === '/results' && (() => {
          const effectiveSession = studentSession || (() => {
            try {
              const raw = localStorage.getItem('genzomate_student_session_data');
              return raw ? JSON.parse(raw) : null;
            } catch { return null; }
          })();

          return effectiveSession ? (
            <StudentResults
              session={effectiveSession}
              exam={exam}
              questions={questions}
              onGoToLeaderboard={() => navigate('/leaderboard')}
            />
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-600 mb-4">No examination results found. Please register to take the test.</p>
              <button onClick={() => navigate('/')} className="bg-[#28AF60] text-white px-4 py-2 rounded-xl">
                Go to Portal
              </button>
            </div>
          );
        })()}

        {/* Route: /leaderboard — Public Leaderboard */}
        {currentRoute === '/leaderboard' && (
          <LeaderboardView
            exam={exam}
            leaderboard={leaderboard}
            currentStudentSessionId={studentSession?.sessionId}
            onGoBack={() => navigate('/')}
          />
        )}

        {/* Route: /admin/login — Teacher Login */}
        {currentRoute === '/admin/login' && (
          <AdminLogin
            onLoginSuccess={handleTeacherLoginSuccess}
            onLoginApi={(password, email) => api.adminLogin(password, email)}
            onBackToStudentPortal={() => navigate('/')}
          />
        )}

        {/* Route: /admin, /admin/exams, /admin/monitor, /admin/results — Teacher Dashboard */}
        {currentRoute.startsWith('/admin') && currentRoute !== '/admin/login' && (
          isTeacherAuthenticated ? (
            <AdminDashboard
              currentSubTab={
                currentRoute === '/admin/exams' ? 'exams'
                : currentRoute === '/admin/results' ? 'results'
                : currentRoute === '/admin/history' ? 'history'
                : adminSubTab
              }
              onSubTabChange={(tab) => {
                setAdminSubTab(tab);
                navigate(tab === 'monitor' ? '/admin' : `/admin/${tab}`);
              }}
              exam={exam || { id: '0', title: 'English Test', totalQuestions: 30, totalMarks: 30, durationMinutes: 30, status: 'waiting', remainingSeconds: 1800, totalDurationSeconds: 1800, leaderboardRevealed: false, solutionsRevealed: false, createdAt: 0 }}
              sessions={adminSessions}
              questions={adminQuestions.length ? adminQuestions : questions}
              leaderboard={leaderboard}
              history={history}
              stats={adminStats}
              onStartExam={handleStartExam}
              onPauseExam={handlePauseExam}
              onResumeExam={handleResumeExam}
              onEndExam={handleEndExam}
              onToggleLeaderboard={handleToggleLeaderboard}
              onToggleSolutions={handleToggleSolutions}
              onResetExam={handleResetExam}
              onSimulateStudents={handleSimulateStudents}
              onSaveQuestions={handleSaveQuestions}
              onLogout={handleTeacherLogout}
            />
          ) : (
            <AdminLogin
              onLoginSuccess={handleTeacherLoginSuccess}
              onLoginApi={(password, email) => api.adminLogin(password, email)}
              onBackToStudentPortal={() => navigate('/')}
            />
          )
        )}

        </ErrorBoundary>
      </main>

      {/* Database & Architecture Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
}

export default App;
