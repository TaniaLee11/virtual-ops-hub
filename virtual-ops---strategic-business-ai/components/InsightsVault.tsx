
import React from 'react';
import { BusinessReport } from '../types';

interface VaultProps {
  reports: BusinessReport[];
}

const InsightsVault: React.FC<VaultProps> = ({ reports }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Operations Archive</h1>
          <p className="text-slate-400">Secure repository for client reports and back-office documentation.</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-500 uppercase">
          {reports.length} Records
        </div>
      </header>

      {reports.length === 0 ? (
        <div className="h-[50vh] flex flex-col items-center justify-center text-slate-600">
           <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-4xl border border-slate-800 mb-4">📁</div>
           <p className="font-bold text-slate-400">No archived records yet</p>
           <p className="text-sm">Research generated in the Hub will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map(report => (
            <div key={report.id} className="glass p-6 rounded-2xl border-slate-800 hover:border-emerald-500/20 transition-all flex flex-col group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/10">
                    {report.type.replace('_', ' ')}
                  </span>
                  {report.isClientFacing && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 px-2 py-0.5 bg-blue-400/10 rounded border border-blue-400/10">
                      Client Facing
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(report.timestamp).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-3 group-hover:text-emerald-400 transition-colors">{report.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-4 mb-6 italic leading-relaxed">
                {report.content.slice(0, 200)}...
              </p>
              <div className="mt-auto pt-4 border-t border-slate-800 flex justify-between items-center">
                 <div className="flex gap-2">
                    {report.sources?.slice(0, 3).map((s, i) => (
                      <div key={i} className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-emerald-500/50" title={s.title}>
                        {i + 1}
                      </div>
                    ))}
                 </div>
                 <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors">
                    Review Record
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsVault;
