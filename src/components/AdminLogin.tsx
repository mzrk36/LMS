import React, { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, AlertCircle, ArrowRight, UserCheck, ArrowLeft, GraduationCap } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, teacher: any) => void;
  onLoginApi: (password: string, email?: string) => Promise<{ success: boolean; token: string; teacher: any }>;
  onBackToStudentPortal: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onLoginApi, onBackToStudentPortal }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg('Please enter your teacher access password.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await onLoginApi(password, email);
      onLoginSuccess(res.token, res.teacher);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid teacher credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 relative overflow-hidden">
        
        {/* Top Dark Green Stripe */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#0F4C2A]" />

        {/* Back to Student Portal button */}
        <button
          onClick={onBackToStudentPortal}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#28AF60] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Portal</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#0F4C2A] text-white flex items-center justify-center mx-auto mb-3 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-[#28AF60]" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#28AF60]">
            Online English with Muzamil
          </span>
          <h2 className="text-2xl font-extrabold text-[#0F4C2A] tracking-tight mt-1">
            Teacher Portal Login
          </h2>
          <p className="text-xs text-slate-500 mt-1.5">
            Teacher access to control live tests, view candidate activity, and broadcast rankings.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Teacher Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. muhammedmuzamiljaan@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#28AF60] text-sm text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Teacher Access Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#28AF60] text-sm text-slate-900 font-medium pr-10"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#0F4C2A] hover:bg-[#0b381f] text-white font-bold py-3 px-5 rounded-xl transition-all shadow-md cursor-pointer mt-4"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Teacher Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onBackToStudentPortal}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            Are you a student? <strong className="text-[#28AF60] underline">Click here to join the exam</strong>
          </button>
        </div>

      </div>
    </div>
  );
};
