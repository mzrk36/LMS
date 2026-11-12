import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Trophy, 
  Clock, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { StudentSession, Question, Exam } from '../types/exam';

interface StudentResultsProps {
  session: StudentSession;
  exam: Exam | null;
  questions: Question[];
  onGoToLeaderboard: () => void;
}

export const StudentResults: React.FC<StudentResultsProps> = ({
  session,
  exam,
  questions,
  onGoToLeaderboard
}) => {
  const score = session.score ?? 0;
  const totalMarks = session.totalMarks ?? (exam?.totalMarks || 30);
  const percentage = session.percentage ?? Number(((score / totalMarks) * 100).toFixed(1));
  const correctCount = session.correctCount ?? 0;
  const incorrectCount = session.incorrectCount ?? 0;
  const unansweredCount = session.unansweredCount ?? 0;

  const getGradeBadge = (pct: number) => {
    if (pct >= 90) return { label: 'Outstanding (Grade A+)', bg: 'bg-[#EAF7F0]', text: 'text-[#28AF60]', border: 'border-[#28AF60]/30' };
    if (pct >= 80) return { label: 'Excellent (Grade A)', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (pct >= 70) return { label: 'Very Good (Grade B)', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    if (pct >= 60) return { label: 'Satisfactory (Grade C)', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    return { label: 'Needs Improvement', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  };

  const grade = getGradeBadge(percentage);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-6 px-3.5 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Main Result Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-8 text-center relative overflow-hidden">
          
          <div className="inline-block text-[11px] uppercase font-extrabold text-[#28AF60] mb-1">
            Online English with Muzamil
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F4C2A] tracking-tight mb-1">
            Result: {session.studentName}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            English Vocabulary & Expressions Test
          </p>

          {/* Big Score Display */}
          <div className="my-8 p-6 bg-slate-50 border border-slate-200/80 rounded-2xl max-w-sm mx-auto">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Final Marks Obtained
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl sm:text-6xl font-black text-[#28AF60] tracking-tight">
                {score}
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-slate-400">
                / {totalMarks}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-700 mt-2">
              Overall Score: <span className="text-[#FF6933]">{percentage}%</span>
            </div>
          </div>

          {/* 3 Metric Summary Cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-4 rounded-2xl bg-[#EAF7F0] border border-[#28AF60]/20 text-center">
              <CheckCircle2 className="w-6 h-6 text-[#28AF60] mx-auto mb-1" />
              <div className="text-2xl font-black text-[#28AF60]">{correctCount}</div>
              <div className="text-xs font-bold text-slate-700">Correct</div>
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center">
              <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
              <div className="text-2xl font-black text-red-600">{incorrectCount}</div>
              <div className="text-xs font-bold text-slate-700">Incorrect</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center">
              <HelpCircle className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-slate-700">{unansweredCount}</div>
              <div className="text-xs font-bold text-slate-700">Unanswered</div>
            </div>
          </div>

          {/* Leaderboard CTA Button */}
          {exam?.leaderboardRevealed ? (
            <div className="bg-[#FFF2ED] border border-[#FF6933]/30 rounded-2xl p-5 mb-4 text-left">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[#FF6933] text-base flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Public Leaderboard is Live!
                  </h4>
                  <p className="text-xs text-slate-700 mt-1">
                    Your teacher has revealed the official examination rankings. View the full standing.
                  </p>
                </div>
                <button
                  onClick={onGoToLeaderboard}
                  className="shrink-0 bg-[#FF6933] hover:bg-[#e65724] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>View Leaderboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 mb-4">
              <div className="flex items-center justify-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#FF6933]" />
                <span>The leaderboard is currently private. It will appear automatically once revealed by your teacher.</span>
              </div>
            </div>
          )}

        </div>

        {/* Question Solutions Breakdown (Only shown if teacher authorized release) */}
        {exam?.solutionsRevealed ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-[#0F4C2A] text-lg">Detailed Question Review</h3>
                <p className="text-xs text-slate-500">Official answers and explanations unlocked by teacher</p>
              </div>
              <span className="text-xs font-bold bg-[#EAF7F0] text-[#28AF60] px-3 py-1 rounded-full border border-[#28AF60]/20">
                Solutions Released
              </span>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const studentAns = session.answers?.[q.id];
                const isCorrect = studentAns === q.correctAnswer;
                const isUnanswered = !studentAns;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isCorrect
                        ? 'bg-[#EAF7F0]/40 border-[#28AF60]/30'
                        : isUnanswered
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Q{idx + 1} • {q.category}
                      </span>
                      {isCorrect ? (
                        <span className="text-xs font-bold text-[#28AF60] flex items-center gap-1 bg-[#EAF7F0] px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                        </span>
                      ) : isUnanswered ? (
                        <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          Unanswered (0)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 flex items-center gap-1 bg-red-100 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-slate-900 mb-3">
                      {q.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2 rounded bg-white/80 border border-slate-200">
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Your Selection</span>
                        <strong className="text-slate-900">
                          {studentAns ? `${studentAns}: ${q.options[studentAns]}` : 'None'}
                        </strong>
                      </div>
                      <div className="p-2 rounded bg-[#EAF7F0] border border-[#28AF60]/30">
                        <span className="text-[#28AF60] block text-[10px] uppercase font-bold">Correct Answer</span>
                        <strong className="text-[#0F4C2A]">
                          {q.correctAnswer}: {q.correctAnswer ? q.options[q.correctAnswer] : ''}
                        </strong>
                      </div>
                    </div>

                    {q.explanation && (
                      <p className="text-xs text-slate-600 bg-white/60 p-2.5 rounded-lg border border-slate-200/60">
                        <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 text-center text-xs text-slate-500 shadow-xs">
            <ShieldCheck className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <span className="font-semibold text-slate-700 block text-sm">
              Question Keys & Explanations Protected
            </span>
            <p className="max-w-md mx-auto mt-1">
              Answer explanations and correct keys are securely kept private on the server until the teacher authorizes release.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
