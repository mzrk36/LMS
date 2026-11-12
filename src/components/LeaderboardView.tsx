import React, { useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Clock, 
  Users, 
  Sparkles, 
  Lock, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeaderboardEntry, Exam } from '../types/exam';

interface LeaderboardViewProps {
  exam: Exam | null;
  leaderboard: LeaderboardEntry[];
  currentStudentSessionId?: string;
  onGoBack: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  exam,
  leaderboard,
  currentStudentSessionId,
  onGoBack
}) => {
  const isRevealed = exam?.leaderboardRevealed ?? false;

  useEffect(() => {
    if (isRevealed && leaderboard.length > 0) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback if canvas not available
      }
    }
  }, [isRevealed, leaderboard.length]);

  if (!isRevealed) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Leaderboard Locked
          </h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            The examination results and rankings are currently under private teacher review. Once your instructor reveals the leaderboard, this screen will instantly unlock with the full rankings!
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#28AF60] bg-[#EAF7F0] py-2.5 px-4 rounded-xl border border-[#28AF60]/20 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-[#28AF60] animate-ping" />
            <span>Listening for live teacher broadcast...</span>
          </div>
          <button
            onClick={onGoBack}
            className="w-full py-3 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>
        </div>
      </div>
    );
  }

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 py-6 px-3.5 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* Leaderboard Header */}
        <div className="text-center">
          <div className="leading-tight mb-2">
            <span className="block text-sm font-extrabold text-[#0F4C2A]">
              Online English
            </span>
            <span className="block text-lg font-black text-[#FF6933]">
              with Muzamil
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F4C2A] tracking-tight">
            Examination Leaderboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ranked by highest score with earliest submission as tiebreaker.
          </p>
        </div>

        {/* Podium for Top 3 (if at least 1 candidate) */}
        {leaderboard.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
            
            {/* 2nd Place */}
            {top2 ? (
              <div className="order-2 md:order-1 bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-md relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 text-slate-600 flex items-center justify-center mx-auto mb-3 font-black text-lg">
                  2nd
                </div>
                <h3 className="font-bold text-slate-900 text-base truncate">{top2.studentName}</h3>
                <div className="text-2xl font-black text-slate-700 my-1">{top2.score} / {top2.totalMarks}</div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {top2.percentage}%
                </span>
              </div>
            ) : <div className="order-2 md:order-1 hidden md:block" />}

            {/* 1st Place (Champion) */}
            {top1 && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50/70 to-white border-2 border-amber-400 rounded-3xl p-6 text-center shadow-xl shadow-amber-500/10 relative -translate-y-2">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> 1st Position
                </div>
                <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Trophy className="w-9 h-9" />
                </div>
                <h3 className="font-extrabold text-[#0F4C2A] text-xl truncate">{top1.studentName}</h3>
                <div className="text-4xl font-black text-[#28AF60] my-1">
                  {top1.score} <span className="text-xl font-bold text-slate-400">/ {top1.totalMarks}</span>
                </div>
                <span className="inline-block text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  {top1.percentage}% Perfect Score
                </span>
              </div>
            )}

            {/* 3rd Place */}
            {top3 ? (
              <div className="order-3 bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-md relative">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-3 font-black text-lg">
                  3rd
                </div>
                <h3 className="font-bold text-slate-900 text-base truncate">{top3.studentName}</h3>
                <div className="text-2xl font-black text-slate-700 my-1">{top3.score} / {top3.totalMarks}</div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {top3.percentage}%
                </span>
              </div>
            ) : <div className="order-3 hidden md:block" />}

          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0F4C2A] text-base flex items-center gap-2">
              <Users className="w-4 h-4 text-[#28AF60]" />
              Complete Student Standings ({leaderboard.length})
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              Live updates enabled
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4 text-center">Marks Obtained</th>
                  <th className="py-3 px-4 text-center">Total Marks</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-right">Time Taken</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {leaderboard.map((entry) => {
                  const isCurrent = entry.sessionId === currentStudentSessionId;
                  const isTop3 = entry.rank <= 3;

                  return (
                    <tr
                      key={entry.sessionId}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-[#EAF7F0]/60 font-bold'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black ${
                          entry.rank === 1
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : entry.rank === 2
                            ? 'bg-slate-200 text-slate-700'
                            : entry.rank === 3
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {entry.rank}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900 font-bold">{entry.studentName}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#28AF60] text-white px-2 py-0.5 rounded-full font-bold">
                              You
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-[#28AF60] text-base">
                          {entry.score}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-center text-slate-500">
                        {entry.totalMarks}
                      </td>

                      {/* Percentage */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          entry.percentage >= 80
                            ? 'bg-[#EAF7F0] text-[#28AF60]'
                            : entry.percentage >= 60
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {entry.percentage}%
                        </span>
                      </td>

                      {/* Time taken */}
                      <td className="py-3.5 px-4 text-right text-xs text-slate-500 font-mono">
                        {entry.timeTakenSeconds 
                          ? `${Math.floor(entry.timeTakenSeconds / 60)}m ${entry.timeTakenSeconds % 60}s` 
                          : 'Recorded'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={onGoBack}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
