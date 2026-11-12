import React, { useState } from 'react';
import { 
  Activity, 
  BookOpen, 
  FileText, 
  Archive, 
  LogOut, 
  ShieldCheck, 
  Radio, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Exam, StudentSession, Question, LeaderboardEntry, HistoricalExam } from '../types/exam';
import { AdminMonitor } from './AdminMonitor';
import { AdminExamManager } from './AdminExamManager';
import { AdminResults } from './AdminResults';
import { AdminHistory } from './AdminHistory';

interface AdminDashboardProps {
  currentSubTab: 'monitor' | 'exams' | 'results' | 'history';
  onSubTabChange: (tab: 'monitor' | 'exams' | 'results' | 'history') => void;
  exam: Exam;
  sessions: StudentSession[];
  questions: Question[];
  leaderboard: LeaderboardEntry[];
  history: HistoricalExam[];
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
  onSaveQuestions: (updatedQuestions: Question[], durationMinutes?: number, title?: string) => Promise<void>;
  onLogout: () => void;
  onOpenStudentPortalInNewTab?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentSubTab,
  onSubTabChange,
  exam,
  sessions,
  questions,
  leaderboard,
  history,
  stats,
  onStartExam,
  onPauseExam,
  onResumeExam,
  onEndExam,
  onToggleLeaderboard,
  onToggleSolutions,
  onResetExam,
  onSimulateStudents,
  onSaveQuestions,
  onLogout
}) => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 pb-16">
      
      {/* Teacher Header Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F4C2A] text-white flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6 text-[#28AF60]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-[#0F4C2A]">
                    Teacher Portal — Online English with Muzamil
                  </h1>
                  <span className="text-[10px] font-bold bg-[#EAF7F0] text-[#28AF60] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#28AF60] animate-ping" />
                    Live Cloud Sync
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Teacher: <strong>Sir Muzamil</strong> (muhammedmuzamiljaan@gmail.com) • Test ID: {exam.id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 text-slate-600 hover:text-red-600 hover:border-red-300 text-xs font-semibold transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 mt-4 pt-2 border-t border-slate-100 overflow-x-auto text-xs sm:text-sm font-bold">
            
            <button
              onClick={() => onSubTabChange('monitor')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                currentSubTab === 'monitor'
                  ? 'bg-[#28AF60] text-white shadow-xs shadow-[#28AF60]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Live Monitor</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                currentSubTab === 'monitor' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {sessions.length}
              </span>
            </button>

            <button
              onClick={() => onSubTabChange('exams')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                currentSubTab === 'exams'
                  ? 'bg-[#0F4C2A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Exam & Question Management</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                currentSubTab === 'exams' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {questions.length}
              </span>
            </button>

            <button
              onClick={() => onSubTabChange('results')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                currentSubTab === 'results'
                  ? 'bg-[#FF6933] text-white shadow-xs shadow-[#FF6933]/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Private Results</span>
            </button>

            <button
              onClick={() => onSubTabChange('history')}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                currentSubTab === 'history'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Historical Archive</span>
              <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                currentSubTab === 'history' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {history.length}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentSubTab === 'monitor' && (
          <AdminMonitor
            exam={exam}
            sessions={sessions}
            questions={questions}
            stats={stats}
            onStartExam={onStartExam}
            onPauseExam={onPauseExam}
            onResumeExam={onResumeExam}
            onEndExam={onEndExam}
            onToggleLeaderboard={onToggleLeaderboard}
            onToggleSolutions={onToggleSolutions}
            onResetExam={onResetExam}
            onSimulateStudents={onSimulateStudents}
            onViewResults={() => onSubTabChange('results')}
          />
        )}

        {currentSubTab === 'exams' && (
          <AdminExamManager
            exam={exam}
            questions={questions}
            onSaveQuestions={onSaveQuestions}
          />
        )}

        {currentSubTab === 'results' && (
          <AdminResults
            exam={exam}
            leaderboard={leaderboard}
            sessions={sessions}
            questions={questions}
            onToggleLeaderboard={onToggleLeaderboard}
            onToggleSolutions={onToggleSolutions}
            onBackToMonitor={() => onSubTabChange('monitor')}
          />
        )}

        {currentSubTab === 'history' && (
          <AdminHistory history={history} />
        )}
      </div>

    </div>
  );
};
