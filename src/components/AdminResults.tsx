import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lock, 
  Unlock, 
  ArrowLeft,
  Search,
  Eye
} from 'lucide-react';
import { LeaderboardEntry, StudentSession, Exam, Question } from '../types/exam';

interface AdminResultsProps {
  exam: Exam;
  leaderboard: LeaderboardEntry[];
  sessions: StudentSession[];
  questions: Question[];
  onToggleLeaderboard: () => Promise<void>;
  onToggleSolutions: () => Promise<void>;
  onBackToMonitor: () => void;
}

export const AdminResults: React.FC<AdminResultsProps> = ({
  exam,
  leaderboard,
  sessions,
  questions,
  onToggleLeaderboard,
  onToggleSolutions,
  onBackToMonitor
}) => {
  const [filterText, setFilterText] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentSession | null>(null);

  // Filter sessions
  const filtered = sessions.filter(s =>
    s.studentName.toLowerCase().includes(filterText.toLowerCase())
  );

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Rank', 'Session ID', 'Student Name', 'Marks', 'Total', 'Percentage', 'Correct', 'Incorrect', 'Unanswered', 'Submitted At'];
    const rows = leaderboard.map(l => {
      const s = sessions.find(sess => sess.sessionId === l.sessionId);
      return [
        l.rank,
        `"${l.sessionId}"`,
        `"${l.studentName}"`,
        l.score,
        l.totalMarks,
        `${l.percentage}%`,
        s?.correctCount ?? '',
        s?.incorrectCount ?? '',
        s?.unansweredCount ?? '',
        `"${new Date(l.submittedAt).toISOString()}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GenZomate_Exam_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Master Result Actions */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6933]">
                Private Evaluation Dashboard
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {sessions.length} Evaluated Submissions
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#0F4C2A] mt-0.5">
              Comprehensive Examination Results
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Toggle Solutions Release */}
            <button
              onClick={onToggleSolutions}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                exam.solutionsRevealed
                  ? 'bg-[#EAF7F0] border-[#28AF60] text-[#0F4C2A]'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {exam.solutionsRevealed ? <Unlock className="w-3.5 h-3.5 text-[#28AF60]" /> : <Lock className="w-3.5 h-3.5" />}
              <span>{exam.solutionsRevealed ? 'Solutions Released' : 'Release Solutions'}</span>
            </button>

            {/* Toggle Leaderboard */}
            <button
              onClick={onToggleLeaderboard}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                exam.leaderboardRevealed
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#FF6933] hover:bg-[#e55724] text-white shadow-xs'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{exam.leaderboardRevealed ? 'Leaderboard Public' : 'Reveal Leaderboard'}</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {/* Back Button */}
            <button
              onClick={onBackToMonitor}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Monitor</span>
            </button>

          </div>
        </div>

        {/* Search */}
        <div className="pt-4 flex items-center justify-between">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search candidate name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#28AF60]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Ties resolved by earliest submission timestamp.
          </div>
        </div>

      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4 text-center">Marks</th>
                <th className="py-3 px-4 text-center">Percentage</th>
                <th className="py-3 px-4 text-center">Correct</th>
                <th className="py-3 px-4 text-center">Incorrect</th>
                <th className="py-3 px-4 text-center">Unanswered</th>
                <th className="py-3 px-4 text-center">Submission Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    No evaluated student results found.
                  </td>
                </tr>
              ) : (
                filtered.map((session) => {
                  const leaderboardItem = leaderboard.find(l => l.sessionId === session.sessionId);
                  const rank = leaderboardItem?.rank || '—';

                  return (
                    <tr key={session.sessionId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black ${
                          rank === 1 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {rank}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{session.studentName}</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="font-black text-[#28AF60] text-sm sm:text-base">
                          {session.score ?? 0}
                        </span>
                        <span className="text-slate-400 text-xs"> / {session.totalMarks ?? 30}</span>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        {session.percentage ?? 0}%
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-[#28AF60]">
                        {session.correctCount ?? 0}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-red-600">
                        {session.incorrectCount ?? 0}
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-slate-400">
                        {session.unansweredCount ?? 0}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EAF7F0] text-[#0F4C2A]">
                          {session.submissionStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(session)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0F4C2A] hover:bg-[#EAF7F0] rounded-lg transition-colors cursor-pointer"
                        >
                          View Answers
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

      {/* Selected Student Answers Review Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#28AF60]">
                  Private Candidate Inspection
                </span>
                <h3 className="text-xl font-bold text-[#0F4C2A]">
                  {selectedStudent.studentName} — Score: {selectedStudent.score}/{selectedStudent.totalMarks} ({selectedStudent.percentage}%)
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {questions.map((q, idx) => {
                const ans = selectedStudent.answers[q.id];
                const isCorrect = ans === q.correctAnswer;
                const isUnanswered = !ans;

                return (
                  <div
                    key={q.id}
                    className={`p-3 rounded-xl border text-xs ${
                      isCorrect
                        ? 'bg-[#EAF7F0]/50 border-[#28AF60]/30'
                        : isUnanswered
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-red-50/50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-slate-800">Q{idx + 1}: {q.question}</strong>
                      <span className={`font-bold ${isCorrect ? 'text-[#28AF60]' : isUnanswered ? 'text-slate-400' : 'text-red-600'}`}>
                        {isCorrect ? 'Correct (+1)' : isUnanswered ? 'Unanswered (0)' : 'Incorrect (0)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-slate-600">
                      <span>Selected: <strong className="text-slate-900">{ans ? `${ans}: ${q.options[ans]}` : 'None'}</strong></span>
                      <span>Correct: <strong className="text-[#0F4C2A]">{q.correctAnswer}: {q.correctAnswer ? q.options[q.correctAnswer] : ''}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedStudent(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer"
            >
              Close Review
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
