import React, { useState } from 'react';
import { 
  Archive, 
  Calendar, 
  Users, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  FileText,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { HistoricalExam } from '../types/exam';

interface AdminHistoryProps {
  history: HistoricalExam[];
}

export const AdminHistory: React.FC<AdminHistoryProps> = ({ history }) => {
  const [selectedHistorical, setSelectedHistorical] = useState<HistoricalExam | null>(null);

  if (selectedHistorical) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <button
                onClick={() => setSelectedHistorical(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to History Archive
              </button>
              <h2 className="text-xl font-extrabold text-[#0F4C2A]">
                {selectedHistorical.title}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Concluded on {selectedHistorical.date}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#EAF7F0] text-[#28AF60] rounded-xl text-xs font-bold">
                {selectedHistorical.participantsCount} Candidates
              </span>
            </div>
          </div>

          {/* Historical Stats Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold uppercase text-slate-500">Average Score</span>
              <div className="text-2xl font-black text-slate-800 mt-1">{selectedHistorical.averageScore} / 30</div>
            </div>
            <div className="p-4 bg-[#EAF7F0] border border-[#28AF60]/30 rounded-xl text-center">
              <span className="text-xs font-bold uppercase text-[#28AF60]">Highest Score</span>
              <div className="text-2xl font-black text-[#28AF60] mt-1">{selectedHistorical.highestScore} / 30</div>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-xs font-bold uppercase text-amber-700">Lowest Score</span>
              <div className="text-2xl font-black text-amber-800 mt-1">{selectedHistorical.lowestScore} / 30</div>
            </div>
          </div>

          {/* Historical Leaderboard */}
          <h3 className="font-bold text-[#0F4C2A] text-sm mb-3">Historical Leaderboard</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-600">
                  <th className="py-2.5 px-4">Rank</th>
                  <th className="py-2.5 px-4">Student Name</th>
                  <th className="py-2.5 px-4 text-center">Score</th>
                  <th className="py-2.5 px-4 text-center">Percentage</th>
                  <th className="py-2.5 px-4 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {selectedHistorical.leaderboard.map((entry) => (
                  <tr key={entry.sessionId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-bold">{entry.rank}</td>
                    <td className="py-2.5 px-4 text-slate-900">{entry.studentName}</td>
                    <td className="py-2.5 px-4 text-center font-black text-[#28AF60]">{entry.score}</td>
                    <td className="py-2.5 px-4 text-center">{entry.percentage}%</td>
                    <td className="py-2.5 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(entry.submittedAt).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6">
        <div className="pb-4 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-[#28AF60]">
            Permanent Records
          </span>
          <h2 className="text-xl font-extrabold text-[#0F4C2A]">
            Examination History Archive
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Completed examinations are permanently archived with student performances, average scores, and rankings.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Archive className="w-12 h-12 mx-auto mb-3 opacity-40 text-slate-400" />
            <h4 className="font-bold text-slate-700 text-sm">No Completed Examinations Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              When an active examination session is concluded using "END EXAMINATION", its complete results and metrics will be archived here permanently.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedHistorical(item)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-[#28AF60] hover:shadow-md transition-all cursor-pointer bg-white group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#28AF60] transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#28AF60] group-hover:translate-x-1 transition-all" />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidates</span>
                    <strong className="text-slate-800 text-sm">{item.participantsCount}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Average</span>
                    <strong className="text-slate-800 text-sm">{item.averageScore}/30</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Top Score</span>
                    <strong className="text-[#28AF60] text-sm">{item.highestScore}/30</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
