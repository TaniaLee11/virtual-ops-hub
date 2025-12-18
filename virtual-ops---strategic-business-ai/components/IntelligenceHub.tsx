
import React, { useState } from 'react';
import { generateStrategicReport } from '../services/geminiService';
import { BusinessReport, ClientContext } from '../types';

interface IntelligenceHubProps {
  onReportGenerated: (report: Omit<BusinessReport, 'id' | 'timestamp'>) => void;
  activeClient: ClientContext;
}

const IntelligenceHub: React.FC<IntelligenceHubProps> = ({ onReportGenerated, activeClient }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<BusinessReport['type']>('market_research');
  const [loading, setLoading] = useState(false);
  const [lastReport, setLastReport] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setLastReport(null);
    setSynced(false);
    try {
      const result = await generateStrategicReport(prompt, type, activeClient);
      setLastReport(result.content);
      onReportGenerated({
        type,
        title: `${type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}: ${prompt.slice(0, 30)}...`,
        content: result.content,
        prompt,
        sources: result.sources,
        isClientFacing: true,
        client: activeClient
      });
    } catch (e) {
      alert("Executive report generation failed. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  const syncToWix = () => {
    if (!lastReport) return;
    window.parent.postMessage({
      type: 'WIX_SYNC_REQUEST',
      payload: {
        title: `${type.toUpperCase()} Analysis - ${activeClient}`,
        content: lastReport,
        timestamp: Date.now()
      }
    }, '*');
    setSynced(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Intelligence & Research Hub</h1>
        <p className="text-slate-400">Contextual research for <span className="text-emerald-400 font-bold">{activeClient}</span>.</p>
      </header>

      <div className="glass rounded-2xl p-6 md:p-8 space-y-6 border-slate-800">
        <div className="flex flex-wrap gap-2 p-1 bg-slate-900 rounded-xl w-fit border border-slate-800">
          {(['market_research', 'swot', 'competitive', 'financial', 'investment_strategy', 'hedging_strategy'] as const).map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                type === t ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              activeClient === 'REN Ecosystem' ? "Draft S&P 500 wealth framework for executive summary..." :
              activeClient === 'Fatherhood Connection' ? "Analyze grant opportunities for community outreach programs..." :
              "Define internal operational architecture parameters..."
            }
            className="w-full h-40 bg-slate-900 border border-slate-800 rounded-xl p-5 text-lg focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none placeholder:text-slate-700 font-serif italic"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 px-8 py-3 bg-emerald-600 disabled:bg-slate-700 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-600/20 disabled:shadow-none"
          >
            {loading ? 'Synthesizing...' : `Research for ${activeClient}`}
          </button>
        </div>

        {loading && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
            </div>
            <p className="text-emerald-500 text-sm font-bold animate-pulse uppercase tracking-widest">Bridging {activeClient} Context...</p>
          </div>
        )}

        {lastReport && !loading && (
          <div className="pt-6 animate-in slide-in-from-top-4 duration-500">
             <div className="glass bg-slate-900/60 p-8 rounded-2xl border-emerald-500/20 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-emerald-400">Strategic Result: {activeClient}</h3>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Ready for Deliverable Export</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={syncToWix}
                      className={`text-xs px-4 py-2 rounded-lg border font-bold transition-all ${
                        synced 
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                      }`}
                    >
                      {synced ? '✓ Synced' : 'Sync to Client Portal'}
                    </button>
                  </div>
                </div>
                <div className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {lastReport}
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default IntelligenceHub;
