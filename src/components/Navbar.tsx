import React from 'react';
import { Lock, LogOut } from 'lucide-react';
import { Exam } from '../types/exam';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  exam: Exam | null;
  studentName?: string;
  isTeacherAuthenticated: boolean;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  isTeacherAuthenticated
}) => {
  const isTeacherView = currentRoute.startsWith('/admin') && currentRoute !== '/admin/login';

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Two-Line Brand Title (No Logo, One M in Muzamil) */}
          <div 
            className="cursor-pointer select-none py-1" 
            onClick={() => onNavigate('/')}
            title="Online English with Muzamil"
          >
            <div className="leading-tight">
              <span className="block text-sm sm:text-base font-extrabold tracking-tight text-[#0F4C2A]">
                Online English
              </span>
              <span className="block text-xs sm:text-sm font-black tracking-tight text-[#FF6933]">
                with Muzamil
              </span>
            </div>
          </div>

          {/* Minimal, Clean Right Action */}
          <div className="flex items-center gap-2">
            {isTeacherView ? (
              <button
                onClick={() => onNavigate('/')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <span>Student View</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate(isTeacherAuthenticated ? '/admin' : '/admin/login')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                title="Teacher Portal Access"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Teacher</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
