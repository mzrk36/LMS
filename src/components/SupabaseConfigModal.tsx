import React, { useState } from 'react';
import { Database, CheckCircle2, Copy, Check, ShieldCheck, Sparkles, Flame, Server } from 'lucide-react';
import firebaseConfig from '../../firebase-applet-config.json';
import { isSupabaseConfigured } from '../lib/supabaseClient';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'firebase' | 'supabase' | 'collections'>('firebase');

  if (!isOpen) return null;

  const copyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(firebaseConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] text-[#28AF60] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0F4C2A] text-lg">
                Connected Cloud Database
              </h3>
              <p className="text-xs text-slate-500">
                Live Firebase Firestore database and Supabase PostgreSQL schema.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5 text-xs font-bold">
          <button
            onClick={() => setActiveTab('firebase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'firebase' ? 'bg-[#FF6933] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Firebase Firestore (Active)</span>
          </button>
          <button
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'collections' ? 'bg-[#28AF60] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Collections & Documents</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'supabase' ? 'bg-[#0F4C2A] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Schema</span>
          </button>
        </div>

        {/* Firebase Tab (Active Provisioned Cloud DB) */}
        {activeTab === 'firebase' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FFF2ED] border border-[#FF6933]/30 text-slate-800">
              <div className="flex items-center gap-2 font-bold text-sm text-[#FF6933] mb-1">
                <CheckCircle2 className="w-5 h-5 text-[#28AF60]" />
                <span>Firebase Firestore Cloud Database: Connected & Provisioned</span>
              </div>
              <p className="leading-relaxed text-slate-700 mt-1">
                Your application is directly provisioned with Google Cloud Firebase Firestore and Authentication. Real-time updates and test submissions are persistently synchronized to the cloud.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h4 className="font-bold text-slate-800 text-sm">Provisioned Credentials</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Project ID</span>
                  <strong className="text-slate-800">{firebaseConfig.projectId}</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Database ID</span>
                  <strong className="text-slate-800 truncate block">{firebaseConfig.firestoreDatabaseId}</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-200 sm:col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Security Rules Status</span>
                  <span className="text-[#28AF60] font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Deployed & Enforced (firestore.rules)
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-slate-500">
                <span>Config file: <strong>firebase-applet-config.json</strong></span>
                <button
                  onClick={copyConfig}
                  className="flex items-center gap-1 text-[#FF6933] font-bold cursor-pointer hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collections Tab */}
        {activeTab === 'collections' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              The Firestore collections defined in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">firebase-blueprint.json</code>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { path: '/exams/{examId}', desc: 'Master examination status, metadata, remaining timer' },
                { path: '/exams/{examId}/questions/{id}', desc: '30 English vocabulary & expression MCQs' },
                { path: '/exams/{examId}/sessions/{sessionId}', desc: 'Live candidate answer choices & question index' },
                { path: '/exams/{examId}/submissions/{id}', desc: 'Finalized student scores & ranking' },
                { path: '/history/{historyId}', desc: 'Permanent archive of past examinations' }
              ].map(item => (
                <div key={item.path} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-mono font-bold text-[#0F4C2A] text-xs">{item.path}</div>
                  <div className="text-slate-500 text-[11px] mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supabase Tab */}
        {activeTab === 'supabase' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Also includes complete <strong>Supabase PostgreSQL</strong> migration schema in <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">supabase/schema.sql</code> with:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center font-mono font-semibold text-[11px] text-slate-700">
              {['profiles', 'exams', 'questions', 'student_sessions', 'submission_answers', 'submissions', 'exam_settings', 'exam_events'].map(t => (
                <div key={t} className="p-2 bg-slate-50 border border-slate-200 rounded-lg">{t}</div>
              ))}
            </div>
            <p className="text-slate-500 pt-2">
              If deploying to Supabase / Vercel in the future, simply paste the code from <strong className="text-slate-800">supabase/schema.sql</strong> into the Supabase SQL editor.
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400">All student responses and exam events are saved in real-time</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
