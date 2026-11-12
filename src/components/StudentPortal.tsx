import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, BookOpen, Clock, Users, Sparkles, AlertCircle } from 'lucide-react';
import { Exam, StudentSession } from '../types/exam';

interface StudentPortalProps {
  exam: Exam | null;
  studentSession: StudentSession | null;
  participantsCount: number;
  onJoin: (name: string) => Promise<void>;
  onEnterExam: () => void;
  onLeaveSession: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  exam,
  studentSession,
  participantsCount,
  onJoin,
  onEnterExam,
  onLeaveSession
}) => {
  const [nameInput, setNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await onJoin(nameInput.trim());
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to join');
    } finally {
      setIsSubmitting(false);
    }
  };

  // State: Student Joined -> Show Waiting Room OR Enter Exam
  if (studentSession) {
    const isExamActive = exam?.status === 'active';
    const isExamEnded = exam?.status === 'ended';

    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-slate-50">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAF7F0] text-[#28AF60] mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registration Confirmed</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F4C2A] tracking-tight">
            Welcome, {studentSession.studentName}!
          </h2>

          <p className="text-xs text-slate-500 font-mono mt-1 mb-5">
            Session: {studentSession.sessionId}
          </p>

          {/* Dynamic Status Box */}
          {isExamActive ? (
            <div className="bg-[#EAF7F0] border border-[#28AF60]/30 rounded-xl p-4 sm:p-5 mb-5 text-left">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-5 h-5 text-[#28AF60] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[#0F4C2A] text-sm sm:text-base">
                    The Examination Has Started!
                  </h4>
                  <p className="text-xs text-slate-700 mt-1">
                    Sir Muzamil has started the test. Click below to begin answering questions.
                  </p>
                </div>
              </div>

              <button
                onClick={onEnterExam}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-[#28AF60] hover:bg-[#229652] text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm active:scale-[0.99] cursor-pointer text-sm"
              >
                <span>Enter Examination Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : isExamEnded ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 mb-5 text-left">
              <h4 className="font-bold text-slate-800 text-sm">Examination Ended</h4>
              <p className="text-xs text-slate-600 mt-1">
                The test has concluded. You can view your results and rankings.
              </p>
              <button
                onClick={onEnterExam}
                className="mt-3.5 w-full bg-[#0F4C2A] text-white font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
              >
                View Results
              </button>
            </div>
          ) : (
            /* Clean Waiting Room Box */
            <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-4 sm:p-5 mb-5 text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#28AF60] uppercase tracking-wide mb-2">
                <span className="w-2 h-2 rounded-full bg-[#28AF60] animate-ping" />
                <span>Waiting Room</span>
              </div>
              <blockquote className="text-xs sm:text-sm text-slate-700 font-medium italic border-l-3 border-[#28AF60] pl-3 py-1 my-2 bg-white rounded-r">
                "You have successfully joined the examination. Please wait for Sir Muzamil to start the test."
              </blockquote>
              <p className="text-[11px] text-slate-500 mt-2">
                Questions will appear automatically once the test starts. Please keep this screen open.
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 text-slate-700 mb-4 text-xs">
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-base font-extrabold text-slate-900">{exam?.totalQuestions || 30}</div>
              <div className="text-[10px] text-slate-500">MCQs</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-base font-extrabold text-slate-900">{exam?.durationMinutes || 30}m</div>
              <div className="text-[10px] text-slate-500">Time Limit</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-base font-extrabold text-[#28AF60]">{participantsCount || 1}</div>
              <div className="text-[10px] text-slate-500">Students In</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="truncate max-w-[180px]">{studentSession.studentName}</span>
            <button
              onClick={onLeaveSession}
              className="hover:text-red-600 underline cursor-pointer"
            >
              Sign out
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Registration Form Card
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 sm:p-8">
        
        {/* Header - Clean 2 Lines, No Logo */}
        <div className="text-center mb-6">
          <div className="leading-tight mb-2">
            <h2 className="text-base sm:text-lg font-extrabold text-[#0F4C2A] tracking-tight">
              Online English
            </h2>
            <h1 className="text-xl sm:text-2xl font-black text-[#FF6933] tracking-tight">
              with Muzamil
            </h1>
          </div>

          <div className="inline-block mt-1 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
            English Vocabulary & Expressions Test
          </div>
          
          <p className="text-xs text-slate-500 mt-2">
            Enter your full name to join the live test.
          </p>
        </div>

        {/* 3 Quick Pill Metrics */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 mb-5 text-center text-xs">
          <div>
            <span className="block font-bold text-slate-900 text-xs sm:text-sm">30 MCQs</span>
            <span className="text-slate-500 text-[10px]">1 Mark Each</span>
          </div>
          <div className="border-x border-slate-200">
            <span className="block font-bold text-slate-900 text-xs sm:text-sm">{exam?.durationMinutes || 30} Mins</span>
            <span className="text-slate-500 text-[10px]">Duration</span>
          </div>
          <div>
            <span className="block font-bold text-[#28AF60] text-xs sm:text-sm">0 Penalty</span>
            <span className="text-slate-500 text-[10px]">No Negative</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="studentName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Your Full Name
            </label>
            <input
              id="studentName"
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Muhammad Ali"
              className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#28AF60] text-sm text-slate-900 placeholder:text-slate-400 font-medium"
              autoFocus
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !nameInput.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#28AF60] hover:bg-[#229652] disabled:opacity-50 text-white font-bold py-3.5 px-5 rounded-xl transition-all shadow-sm cursor-pointer active:scale-[0.99] text-sm"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Joining...
              </span>
            ) : (
              <>
                <span>JOIN EXAMINATION</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-[#28AF60] inline-block mr-1.5" />
          <span>{participantsCount} student(s) currently connected</span>
        </div>

      </div>
    </div>
  );
};
