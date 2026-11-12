import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Trophy, 
  Eye, 
  EyeOff, 
  RotateCcw, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  Sparkles,
  Search,
  BookOpen,
  HelpCircle,
  FileText
} from 'lucide-react';
import { Exam, StudentSession, Question } from '../types/exam';

interface AdminMonitorProps {
  exam: Exam;
  sessions: StudentSession[];
  questions: Question[];
  stats: {
    totalJoined: number;
    currentlyAttempting: number;
    submitted: number;
    waiting: number;
    disconnected: number;
  };
  onStartExam: () => Promise<void>;
  onPauseExam: () => Promise<void>;
  onResumeExam: () => Promise<void>;
  onEndExam: () => Promise<void>;
  onToggleLeaderboard: () => Promise<void>;
  onToggleSolutions: () => Promise<void>;
  onResetExam: () => Promise<void>;
  onSimulateStudents: () => Promise<void>;
  onViewResults: () => void;
}

export const AdminMonitor: React.FC<AdminMonitorProps> = ({
  exam,
  sessions,
  questions,
  stats,
  onStartExam,
  onPauseExam,
  onResumeExam,
  onEndExam,
  onToggleLeaderboard,
  onToggleSolutions,
  onResetExam,
  onSimulateStudents,
  onViewResults
}) => {
  const [inspectingSession, setInspectingSession] = useState<StudentSession | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterText, setFilterText] = useState('');

  const handleAction = async (actionName: string, fn: () => Promise<void>) => {
    setActionLoading(actionName);
    try {
      await fn();
    } finally {
      setActionLoading(null);
    }
  };

  const formatRemainingTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredSessions = sessions.filter(s =>
    s.studentName.toLowerCase().includes(filterText.toLowerCase()) ||
    s.sessionId.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Master Control Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#28AF60]">
                Live Examination Controller
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-mono font-medium text-slate-500">
                Server Clock: {formatRemainingTime(exam.remainingSeconds)}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0F4C2A] mt-0.5">
              {exam.title}
            </h2>
          </div>

          {/* Master Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 w-full lg:w-auto">
            
            {/* Start Button */}
            {exam.status === 'waiting' && (
              <button
                onClick={() => handleAction('start', onStartExam)}
                disabled={actionLoading === 'start'}
                className="flex items-center justify-center gap-2 bg-[#28AF60] hover:bg-[#229652] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>START EXAM</span>
              </button>
            )}

            {/* Pause Button */}
            {exam.status === 'active' && (
              <button
                onClick={() => handleAction('pause', onPauseExam)}
                disabled={actionLoading === 'pause'}
                className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-white" />
                <span>PAUSE EXAM</span>
              </button>
            )}

            {/* Resume Button */}
            {exam.status === 'paused' && (
              <button
                onClick={() => handleAction('resume', onResumeExam)}
                disabled={actionLoading === 'resume'}
                className="flex items-center justify-center gap-2 bg-[#28AF60] hover:bg-[#229652] text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>RESUME EXAM</span>
              </button>
            )}

            {/* End Exam Button */}
            {(exam.status === 'active' || exam.status === 'paused') && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to conclude the examination for all students? All attempts will be finalized immediately.')) {
                    handleAction('end', onEndExam);
                  }
                }}
                disabled={actionLoading === 'end'}
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span>END EXAM</span>
              </button>
            )}

            {/* Reveal / Hide Leaderboard Button */}
            <button
              onClick={() => handleAction('leaderboard', onToggleLeaderboard)}
              disabled={actionLoading === 'leaderboard'}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
                exam.leaderboardRevealed
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                  : 'bg-[#FF6933] hover:bg-[#e55724] text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{exam.leaderboardRevealed ? 'Hide Leaderboard' : 'Reveal Leaderboard'}</span>
            </button>

            {/* View Results Button */}
            <button
              onClick={onViewResults}
              className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Results</span>
            </button>

            {/* Simulator Button */}
            <button
              onClick={() => handleAction('simulate', onSimulateStudents)}
              disabled={actionLoading === 'simulate'}
              title="Add 3 active test candidates to simulate live student answering and concurrency"
              className="flex items-center justify-center gap-1.5 bg-[#EAF7F0] hover:bg-[#d8f2e3] text-[#0F4C2A] border border-[#28AF60]/30 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#28AF60]" />
              <span>Simulate 3 Students</span>
            </button>

            {/* Reset Exam */}
            <button
              onClick={() => {
                if (confirm('Reset examination state and clear current student sessions?')) {
                  handleAction('reset', onResetExam);
                }
              }}
              className="flex items-center justify-center p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              title="Reset Exam for New Session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Live Examination Status Indicator */}
        <div className="pt-3 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span>Status: <strong className="uppercase text-slate-900">{exam.status}</strong></span>
            <span>Duration: <strong>{exam.durationMinutes} Minutes</strong></span>
            <span>Total Questions: <strong>{exam.totalQuestions}</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <span className={exam.leaderboardRevealed ? 'text-[#FF6933] font-bold' : 'text-slate-400'}>
              Leaderboard: {exam.leaderboardRevealed ? 'REVEALED TO STUDENTS' : 'PRIVATE'}
            </span>
            <span className={exam.solutionsRevealed ? 'text-[#28AF60] font-bold' : 'text-slate-400'}>
              Explanations: {exam.solutionsRevealed ? 'UNLOCKED' : 'HIDDEN'}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Real-Time Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Total Joined */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Joined</span>
            <Users className="w-4 h-4 text-[#28AF60]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalJoined}</div>
          <span className="text-[11px] text-slate-500 font-medium">Registered in room</span>
        </div>

        {/* Currently Attempting */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Attempting</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#28AF60] animate-ping" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#28AF60]">{stats.currentlyAttempting}</div>
          <span className="text-[11px] text-slate-500 font-medium">Actively answering</span>
        </div>

        {/* Students Submitted */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Submitted</span>
            <CheckCircle className="w-4 h-4 text-[#FF6933]" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#FF6933]">{stats.submitted}</div>
          <span className="text-[11px] text-slate-500 font-medium">Finalized attempts</span>
        </div>

        {/* Students Waiting */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Waiting</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-600">{stats.waiting}</div>
          <span className="text-[11px] text-slate-500 font-medium">In waiting room</span>
        </div>

        {/* Disconnected */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Disconnected</span>
            <WifiOff className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-600">{stats.disconnected}</div>
          <span className="text-[11px] text-slate-500 font-medium">Offline sessions</span>
        </div>

      </div>

      {/* Live Monitoring Table Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Table Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-[#0F4C2A] text-base">
              Candidate Live Tracking Table
            </h3>
            <p className="text-xs text-slate-500">
              Live updates stream question navigation and answer selections without browser refresh.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter by student name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#28AF60]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Live Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Connection</th>
                <th className="py-3 px-4 text-center">Exam Status</th>
                <th className="py-3 px-4 text-center">Current Question</th>
                <th className="py-3 px-4 text-center">Questions Answered</th>
                <th className="py-3 px-4 text-center">Progress %</th>
                <th className="py-3 px-4 text-center">Time Remaining</th>
                <th className="py-3 px-4 text-center">Submission Status</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span>No students in room yet. Click "Simulate 3 Live Students" or share the student link to begin.</span>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const currentQNum = session.currentQuestionIndex + 1;
                  const answered = session.answeredCount;
                  const totalQ = exam.totalQuestions;

                  return (
                    <tr key={session.sessionId} className="hover:bg-slate-50/80 transition-colors">
                      {/* Student Name */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{session.studentName}</div>
                        <span className="text-[10px] text-slate-400 font-mono">{session.sessionId}</span>
                      </td>

                      {/* Connection Status */}
                      <td className="py-3 px-4 text-center">
                        {session.connectionStatus === 'online' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#28AF60] bg-[#EAF7F0] px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#28AF60] animate-pulse" />
                            Online
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            <WifiOff className="w-3 h-3 text-slate-400" />
                            Offline
                          </span>
                        )}
                      </td>

                      {/* Exam Status */}
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs font-semibold text-slate-700 capitalize">
                          {session.submissionStatus === 'answering' ? 'Answering' : session.submissionStatus}
                        </span>
                      </td>

                      {/* Current Question */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-1 bg-slate-100 text-slate-800 rounded-md font-mono font-bold text-xs">
                          {session.submissionStatus === 'submitted' ? 'Complete' : `Q${currentQNum}`}
                        </span>
                      </td>

                      {/* Questions Answered */}
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {answered} / {totalQ}
                      </td>

                      {/* Progress Percentage */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#28AF60] h-full rounded-full transition-all duration-300"
                              style={{ width: `${session.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 w-8 text-right">
                            {session.progressPercentage}%
                          </span>
                        </div>
                      </td>

                      {/* Time Remaining */}
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-600">
                        {session.submissionStatus === 'submitted'
                          ? 'Finished'
                          : formatRemainingTime(exam.remainingSeconds)}
                      </td>

                      {/* Submission Status */}
                      <td className="py-3 px-4 text-center">
                        {session.submissionStatus === 'submitted' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6933] bg-[#FFF2ED] px-2.5 py-1 rounded-full border border-[#FF6933]/20">
                            <CheckCircle className="w-3 h-3" />
                            Submitted ({session.score}/{session.totalMarks})
                          </span>
                        ) : session.submissionStatus === 'answering' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                            In Waiting Room
                          </span>
                        )}
                      </td>

                      {/* Inspect Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setInspectingSession(session)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0F4C2A] hover:bg-[#EAF7F0] rounded-lg transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Individual Student Inspector Modal */}
      {inspectingSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#28AF60]">
                  Live Candidate Inspection
                </span>
                <h3 className="text-xl font-bold text-[#0F4C2A]">
                  {inspectingSession.studentName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Session ID: {inspectingSession.sessionId}
                </p>
              </div>
              <button
                onClick={() => setInspectingSession(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Candidate Summary Stats */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Progress</span>
                <strong className="text-base text-slate-900">{inspectingSession.progressPercentage}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Answered</span>
                <strong className="text-base text-[#28AF60]">{inspectingSession.answeredCount} / 30</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Current Q</span>
                <strong className="text-base text-slate-900">Q{inspectingSession.currentQuestionIndex + 1}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block">Status</span>
                <strong className="text-base text-[#FF6933] capitalize">{inspectingSession.submissionStatus}</strong>
              </div>
            </div>

            {/* Answer Choices Matrix */}
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-3">
              Recorded Question Selections:
            </h4>
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-6">
              {questions.map((q, idx) => {
                const ans = inspectingSession.answers[q.id];
                return (
                  <div
                    key={q.id}
                    className={`p-2 rounded-xl border text-center ${
                      ans
                        ? 'bg-[#EAF7F0] border-[#28AF60]/40 text-[#0F4C2A]'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-bold">Q{idx + 1}</div>
                    <div className="text-sm font-extrabold">{ans || '—'}</div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setInspectingSession(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all cursor-pointer"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
