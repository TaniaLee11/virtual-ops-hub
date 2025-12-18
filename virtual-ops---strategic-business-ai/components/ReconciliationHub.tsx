
import React, { useState, useEffect } from 'react';
import { analyzeReconciliation } from '../services/geminiService';
import { FinancialTransaction, ClientContext, ReconciliationSummary } from '../types';

interface ReconciliationHubProps {
  activeClient: ClientContext;
}

const MOCK_TRANSACTIONS: FinancialTransaction[] = [
  { id: 'tx1', date: '2025-05-15', amount: 1540.50, description: 'Uber Driver Weekly Payout', source: 'Plaid: Chase Bus.', status: 'pending' },
  { id: 'tx2', date: '2025-05-16', amount: -45.00, description: 'Shell Gas Station #442', source: 'Plaid: Chase Bus.', status: 'pending' },
  { id: 'tx3', date: '2025-05-16', amount: -120.00, description: 'QuickBooks Online Subscription', source: 'Plaid: Chase Bus.', status: 'pending' },
  { id: 'tx4', date: '2025-05-17', amount: 500.00, description: 'Cash App Transfer: Income', source: 'Cash App Bus.', status: 'pending' },
  { id: 'tx5', date: '2025-05-18', amount: -45.00, description: 'Shell Gas Station #442', source: 'Plaid: Chase Bus.', status: 'pending' }, // Duplicate candidate
];

const ReconciliationHub: React.FC<ReconciliationHubProps> = ({ activeClient }) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_TRANSACTIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [syncingBank, setSyncingBank] = useState(false);

  const summary: ReconciliationSummary = {
    reconciledPercentage: Math.round((transactions.filter(t => t.status === 'reconciled').length / transactions.length) * 100),
    unmatchedCount: transactions.filter(t => t.status === 'pending').length,
    flaggedCount: transactions.filter(t => t.status === 'flagged').length,
    lastSync: Date.now() - 3600000
  };

  const handleSmartSync = () => {
    setSyncingBank(true);
    setTimeout(() => {
      setSyncingBank(false);
      runAiAnalysis();
    }, 2000);
  };

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const results = await analyzeReconciliation(transactions, activeClient);
      setTransactions(prev => prev.map(tx => {
        const aiMatch = results.find((r: any) => r.id === tx.id);
        if (aiMatch) {
          return {
            ...tx,
            category: aiMatch.category,
            confidence: aiMatch.confidence,
            aiInsight: aiMatch.aiInsight,
            status: aiMatch.isAnomaly ? 'flagged' : 'pending'
          };
        }
        return tx;
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reconcileItem = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'reconciled' } : t));
  };

  const reconcileAllHighConfidence = () => {
    setTransactions(prev => prev.map(t => (t.confidence && t.confidence > 90 && t.status !== 'flagged') ? { ...t, status: 'reconciled' } : t));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-outfit font-black text-white tracking-tighter uppercase">Smart Reconciliation</h1>
          <p className="text-[10px] font-black text-vorange uppercase tracking-[0.2em]">Plaid & AI-Integrated Audit Trail</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSmartSync}
            disabled={syncingBank || isAnalyzing}
            className="px-6 py-3 bg-vorange text-white font-black rounded-xl shadow-xl shadow-vorange/20 flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            {syncingBank ? 'Syncing Bank Feeds...' : 'Sync & AI Match'}
          </button>
          <button 
            onClick={reconcileAllHighConfidence}
            className="px-6 py-3 bg-navy-800 border border-vorange/30 hover:border-vorange text-vorange font-black rounded-xl transition-all uppercase tracking-widest text-[10px]"
          >
            One-Click Reconcile (90%+)
          </button>
        </div>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-5 rounded-2xl border-navy-700">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Reconciled</p>
          <div className="flex items-end gap-2">
             <span className="text-3xl font-outfit font-black text-white">{summary.reconciledPercentage}%</span>
             <div className="flex-1 h-1.5 bg-navy-900 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-vorange" style={{ width: `${summary.reconciledPercentage}%` }} />
             </div>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl border-navy-700">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Unmatched</p>
          <span className="text-3xl font-outfit font-black text-vorange">{summary.unmatchedCount}</span>
        </div>
        <div className="glass p-5 rounded-2xl border-navy-700 border-red-500/20">
          <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Anomalies</p>
          <span className="text-3xl font-outfit font-black text-red-400">{summary.flaggedCount}</span>
        </div>
        <div className="glass p-5 rounded-2xl border-navy-700">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Sync</p>
          <span className="text-xs font-bold text-slate-300">Today, {new Date(summary.lastSync).toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Main Reconciliation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inbox / Timeline Review */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Transaction Inbox</h2>
          <div className="glass rounded-3xl border-navy-700 overflow-hidden shadow-2xl">
             <div className="divide-y divide-navy-700">
               {transactions.map(tx => (
                 <div key={tx.id} className={`p-6 transition-all group hover:bg-navy-900/50 ${tx.status === 'reconciled' ? 'opacity-40 grayscale' : ''}`}>
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center text-xl shadow-inner border border-navy-700">
                           {tx.amount > 0 ? '💰' : '💳'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tx.source}</span>
                             <span className="text-slate-700">•</span>
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tx.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className={`text-lg font-outfit font-black ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                         </p>
                         {tx.status === 'flagged' && (
                           <span className="text-[8px] font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 uppercase">Anomaly Detected</span>
                         )}
                      </div>
                   </div>

                   {/* AI Suggestion Layer */}
                   <div className="bg-navy-900/80 border border-vorange/10 rounded-2xl p-4 flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-vorange/10 flex items-center justify-center text-sm border border-vorange/20">🤖</div>
                      <div className="flex-1">
                         <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                               <span className="text-[10px] font-black text-vorange uppercase tracking-widest">AI Suggestion</span>
                               {tx.confidence && (
                                 <span className="text-[9px] font-bold text-slate-500">{tx.confidence}% confidence match</span>
                               )}
                            </div>
                            <span className="text-[10px] font-black text-white bg-navy-900 px-3 py-1 rounded-full uppercase border border-navy-700">
                               {tx.category || 'Categorizing...'}
                            </span>
                         </div>
                         <p className="text-xs text-slate-400 leading-relaxed italic font-medium">"{tx.aiInsight || 'Initializing system audit logic...'}"</p>
                      </div>
                      <div className="flex gap-2">
                         <button 
                           onClick={() => reconcileItem(tx.id)}
                           disabled={tx.status === 'reconciled'}
                           className="px-4 py-2 bg-vorange hover:bg-vorange-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest transition-all disabled:bg-slate-800 shadow-lg shadow-vorange/10"
                         >
                           Confirm
                         </button>
                         <button className="px-4 py-2 bg-navy-800 text-slate-400 hover:text-white text-[10px] font-black rounded-lg uppercase tracking-widest border border-navy-700 transition-all">
                           Adjust
                         </button>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* AI Coaching & Reporting Sidebar */}
        <div className="space-y-8">
           <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">VOPSY Coaching Layer</h2>
              <div className="glass p-6 rounded-3xl border-vorange/10 relative overflow-hidden v-orange-glow">
                 <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-vorange flex items-center justify-center text-xl">🧠</div>
                    <h3 className="text-sm font-bold text-white">Reconciliation Tip</h3>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed italic">
                    "Tania, I've noticed you have two gas station charges on the same day for $45. I've flagged this as a potential duplicate. If they are valid (e.g., two different vehicles), confirm them individually. Otherwise, I suggest merging them for the weekly audit trail."
                 </p>
              </div>
           </section>

           <section className="space-y-4">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Audit-Ready Reports</h2>
              <div className="space-y-3">
                 {[
                   { name: 'Monthly Reconciliation Summary', type: 'PDF' },
                   { name: 'IRS Deduction Report (Draft)', type: 'EXCEL' },
                   { name: 'Internal Audit Trail', type: 'SOP' }
                 ].map((report, i) => (
                   <button key={i} className="w-full glass p-5 rounded-2xl border-navy-700 flex items-center justify-between group hover:border-vorange/40 transition-all">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 flex items-center justify-center text-xs">📄</div>
                         <span className="text-xs font-bold text-slate-300">{report.name}</span>
                      </div>
                      <span className="text-[8px] font-black text-vorange uppercase tracking-widest">{report.type}</span>
                   </button>
                 ))}
              </div>
           </section>

           <div className="glass p-6 rounded-3xl border-navy-700 bg-vorange/5 border-dashed">
              <h4 className="text-[10px] font-black text-vorange uppercase tracking-widest mb-2">GAAP Compliance Check</h4>
              <p className="text-[10px] text-slate-500 font-bold leading-tight">Your current reconciliation frequency meets the requirements for Q2 grant reporting for {activeClient}.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReconciliationHub;
