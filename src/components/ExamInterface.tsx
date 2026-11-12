import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Send, 
  PauseCircle, 
  Grid,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { Exam, Question, QuestionOption, StudentSession } from '../types/exam';

interface ExamInterfaceProps {
  exam: Exam;
  questions: Question[];
  studentSession: StudentSession;
  onSaveAnswer: (questionId: number, option: QuestionOption) => Promise<void>;
  onNavigateQuestion: (questionIndex: number) => Promise<void>;
  onSubmitExam: () => Promise<void>;
  remainingSeconds: number;
}

export const ExamInterface: React.FC<ExamInterfaceProps> = ({
  exam,
  questions,
  studentSession,
  onSaveAnswer,
  onNavigateQuestion,
  onSubmitExam,
  remainingSeconds
}) => {
  const [currentIndex, setCurrentIndex] = useState(studentSession.currentQuestionIndex || 0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, QuestionOption>>(
    studentSession.answers || {}
  );
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMobileGrid, setShowMobileGrid] = useState(false);

  useEffect(() => {
    if (studentSession.currentQuestionIndex !== undefined) {
      setCurrentIndex(studentSession.currentQuestionIndex);
    }
  }, [studentSession.currentQuestionIndex]);

  useEffect(() => {
    if (studentSession.answers) {
      setSelectedAnswers(studentSession.answers);
    }
  }, [studentSession.answers]);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPct = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(Math.max(0, seconds) / 60);
    const secs = Math.max(0, seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = remainingSeconds <= 300;
  const isCriticalTime = remainingSeconds <= 60;

  const handleGoToQuestion = async (index: number) => {
    if (index < 0 || index >= totalQuestions || index === currentIndex) return;
    setCurrentIndex(index);
    setShowMobileGrid(false); // auto close palette on mobile after picking
    await onNavigateQuestion(index);
  };

  const handleSelectOption = async (option: QuestionOption) => {
    if (exam.status !== 'active') return;
    const qId = currentQ.id;
    const newAnswers = { ...selectedAnswers, [qId]: option };
    setSelectedAnswers(newAnswers);
    setIsSaving(true);
    try {
      await onSaveAnswer(qId, option);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitExam();
    } finally {
      setIsSubmitting(false);
      setShowSubmitConfirm(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-50 pb-16">
      
      {/* Sticky Mobile Sub-Header: Timer, Candidate & Submit */}
      <div className="sticky top-14 sm:top-16 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-2.5">
          <div className="flex items-center justify-between gap-2">
            
            {/* Candidate & Progress */}
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-500 truncate">
                {studentSession.studentName}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-[#0F4C2A]">
                  Q{currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-[11px] text-slate-400">•</span>
                <span className="text-[11px] font-bold text-[#28AF60]">
                  {answeredCount} done
                </span>
              </div>
            </div>

            {/* Timer & Submit Button */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Countdown Timer */}
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-mono text-xs sm:text-sm font-bold ${
                isCriticalTime 
                  ? 'bg-red-50 text-red-600 border border-red-300 animate-pulse'
                  : isLowTime
                  ? 'bg-amber-50 text-amber-700 border border-amber-300'
                  : 'bg-[#EAF7F0] text-[#0F4C2A] border border-[#28AF60]/30'
              }`}>
                <Clock className="w-3.5 h-3.5 text-[#28AF60]" />
                <span>{formatTime(remainingSeconds)}</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="bg-[#FF6933] hover:bg-[#e65724] text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                Submit
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6">
        
        {/* Mobile Toggle for Question Navigation Palette */}
        <div className="lg:hidden mb-3">
          <button
            onClick={() => setShowMobileGrid(!showMobileGrid)}
            className="w-full flex items-center justify-between bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Grid className="w-3.5 h-3.5 text-[#28AF60]" />
              <span>Question Palette ({answeredCount}/{totalQuestions} Answered)</span>
            </span>
            {showMobileGrid ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Collapsible Mobile Palette */}
          {showMobileGrid && (
            <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in">
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = Boolean(selectedAnswers[q.id]);
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleGoToQuestion(idx)}
                      className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'ring-2 ring-[#FF6933] font-black'
                          : ''
                      } ${
                        isAnswered
                          ? 'bg-[#28AF60] text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Main Question Card */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-7 relative">
            
            {/* PAUSED OVERLAY */}
            {exam.status === 'paused' && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl z-20 flex flex-col items-center justify-center p-4 text-center text-white">
                <PauseCircle className="w-12 h-12 text-amber-400 animate-pulse mb-2" />
                <h3 className="text-xl font-bold">Exam Paused by Teacher</h3>
                <p className="text-xs text-slate-200 max-w-sm mt-1">
                  The countdown is frozen. Please wait until Sir Muzamil resumes the test.
                </p>
              </div>
            )}

            {/* Question Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#28AF60] bg-[#EAF7F0] px-2.5 py-0.5 rounded-md">
                  Q{currentIndex + 1}
                </span>
                <span className="font-semibold text-slate-500">
                  {currentQ.category}
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                1 Mark
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-5">
              {currentQ.question}
            </h2>

            {/* 4 Options Grid - Touch Friendly */}
            <div className="space-y-2.5 mb-6">
              {(['A', 'B', 'C', 'D'] as QuestionOption[]).map((optKey) => {
                const optText = currentQ.options[optKey];
                const isSelected = selectedAnswers[currentQ.id] === optKey;

                return (
                  <button
                    key={optKey}
                    type="button"
                    onClick={() => handleSelectOption(optKey)}
                    disabled={exam.status !== 'active'}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer active:scale-[0.99] min-h-[50px] ${
                      isSelected
                        ? 'bg-[#EAF7F0] border-[#28AF60] ring-1 ring-[#28AF60] text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#28AF60] text-white'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {optKey}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                      {optText}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav: Prev / Next */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleGoToQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-bold disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="text-[11px] text-slate-400">
                {isSaving ? 'Saving...' : selectedAnswers[currentQ.id] ? 'Saved' : 'Unanswered'}
              </div>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => handleGoToQuestion(currentIndex + 1)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#28AF60] hover:bg-[#229652] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSubmitConfirm(true)}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#FF6933] hover:bg-[#e65724] text-white text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
                >
                  <span>Finish</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Desktop Palette (Hidden on mobile) */}
          <div className="hidden lg:block lg:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
              <span>Question Palette</span>
              <span>{answeredCount}/{totalQuestions}</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-4">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = Boolean(selectedAnswers[q.id]);
                return (
                  <button
                    key={q.id}
                    onClick={() => handleGoToQuestion(idx)}
                    className={`h-9 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'ring-2 ring-[#FF6933] font-black'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-[#28AF60] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-[#28AF60]" /> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-300" /> Empty
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              Submit Examination?
            </h3>
            <p className="text-xs text-slate-600 text-center mb-5">
              You answered <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
              {answeredCount < totalQuestions && (
                <span className="block mt-1 text-amber-600 font-semibold">
                  You have {totalQuestions - answeredCount} unanswered question(s).
                </span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Review
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#FF6933] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? 'Submitting...' : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
