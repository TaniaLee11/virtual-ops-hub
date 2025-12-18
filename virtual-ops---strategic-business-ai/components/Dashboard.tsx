
import React, { useState, useEffect } from 'react';
import { generateSignals, generateDashboardBriefing } from '../services/geminiService';
import { BusinessSignal, TaskItem, ClientContext } from '../types';

interface DashboardProps {
  signals: BusinessSignal[];
  setSignals: (signals: BusinessSignal[]) => void;
  industry: string;
  setIndustry: (industry: string) => void;
  activeClient: ClientContext;
}

const INITIAL_TASKS: TaskItem[] = [
  { id: '1', client: 'REN Ecosystem', frequency: 'daily', category: 'Banking', task: 'Reconcile LARE Banking ledgers', completed: false, assignedTo: 'Tania' },
  { id: '2', client: 'REN Ecosystem', frequency: 'daily', category: 'Risk', task: 'Monitor S&P 500 hedging levels', completed: false, assignedTo: 'VOPSy' },
  { id: '3', client: 'Fatherhood Connection', frequency: 'weekly', category: 'Grant', task: 'Process donor transparency reports', completed: false, assignedTo: 'Tania' },
  { id: '4', client: 'Fatherhood Connection', frequency: 'weekly', category: 'Compliance', task: 'Validate non-profit grant-readiness', completed: false, assignedTo: 'VOPSy' },
  { id: '7', client: 'Virtual Ops Internal', frequency: 'daily', category: 'Automation', task: 'Audit Uber Sync settlement triggers', completed: false, assignedTo: 'VOPSy' },
  { id: '8', client: 'Virtual Ops Internal', frequency: 'weekly', category: 'Tax', task: 'Reconfirm 30% IRS Reserve holdbacks', completed: false, assignedTo: 'Tania' },
  { id: '9', client: 'Direct SaaS Partner', frequency: 'daily', category: 'Operations', task: 'Confirm automated reconciliation batch', completed: false, assignedTo: 'Client' },
];

const Dashboard: React.FC<DashboardProps> = ({ signals, setSignals, industry, setIndustry, activeClient }) => {
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedType, setCopiedType] = useState<'link' | 'wix' | null>(null);

  const isManaged = activeClient === 'REN Ecosystem' || activeClient === 'Fatherhood Connection';

  useEffect(() => {
    const fetchBriefing = async () => {
      setBriefing(null);
      const directive = await generateDashboardBriefing(activeClient);
      setBriefing(directive);
    };
    fetchBriefing();
  }, [activeClient]);

  const generatePortalLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?portal=true&wix=true&client=${encodeURIComponent(activeClient)}`;
  };

  const generateWixSnippet = () => {
    const link = generatePortalLink();
    return `
<!-- Virtual OPS Hub Wix Embed -->
<div id="vopsy-container" style="width:100%; min-height:800px; overflow:hidden;">
  <iframe id="vopsy-frame" src="${link}" style="width:100%; height:100%; border:none; background:transparent;" allow="microphone"></iframe>
</div>
<script>
  window.addEventListener('message', function(e) {
    if (e.data.type === 'WIX_RESIZE') {
      document.getElementById('vopsy-container').style.height = e.data.height + 'px';
    }
  });
</script>
    `.trim();
  };

  const copyToClipboard = (type: 'link' | 'wix') => {
    const text = type === 'link' ? generatePortalLink() : generateWixSnippet();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const fetchSignals = async () => {
    setLoading(true);
    try {
      const newSignals = await generateSignals(activeClient === 'REN Ecosystem' ? 'Finance' : activeClient === 'Fatherhood Connection' ? 'Non-Profit' : industry);
      setSignals(newSignals);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const clientTasks = tasks.filter(t => t.client === activeClient);

  const getIdentifierLabel = () => {
    if (activeClient === 'REN Ecosystem') return 'Portfolio Strategy Hub';
    if (activeClient === 'Fatherhood Connection') return 'Community Impact Hub';
    if (activeClient === 'Direct SaaS Partner') return 'SaaS Accelerator Hub';
    return 'Systems Architecture Hub';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-outfit font-black text-white tracking-tighter uppercase">{getIdentifierLabel()}</h1>
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              isManaged ? 'bg-vorange/10 border-vorange/30 text-vorange' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {isManaged ? 'Managed Service' : 'Direct Access'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-vorange/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="font-bold uppercase tracking-[0.2em] text-[10px]">VOPSy Intelligence Active</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowShareModal(true)}
            className="px-6 py-3 bg-navy-800 border border-vorange/30 hover:border-vorange text-vorange font-black rounded-xl transition-all shadow-xl flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            🚀 Launch Wix Hub
          </button>
          <button 
            onClick={fetchSignals}
            disabled={loading}
            className="px-6 py-3 bg-vorange text-white font-black rounded-xl transition-all shadow-xl shadow-vorange/20 flex items-center gap-2 uppercase tracking-widest text-[10px]"
          >
            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Refetch Signals'}
          </button>
        </div>
      </header>

      {/* Wix Integration Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/90 backdrop-blur-xl">
          <div className="glass w-full max-w-2xl p-10 rounded-[2.5rem] border-navy-700 shadow-2xl animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
             <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-navy-900 text-xl shadow-lg">W</div>
                   <div>
                      <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-white">Wix Deploy Center</h2>
                      <p className="text-xs text-slate-500 font-bold mt-1">Context: {activeClient}</p>
                   </div>
                </div>
                <button onClick={() => setShowShareModal(false)} className="text-slate-500 hover:text-white transition-colors text-3xl">×</button>
             </div>
             
             <div className="space-y-8">
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-vorange text-[10px] flex items-center justify-center font-black text-white">1</span>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wix Standard Link</p>
                   </div>
                   <div className="flex gap-2">
                      <input 
                        readOnly 
                        value={generatePortalLink()} 
                        className="flex-1 bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-[10px] text-vorange font-bold outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard('link')}
                        className={`px-6 rounded-xl font-black uppercase text-[10px] transition-all ${copiedType === 'link' ? 'bg-emerald-600 text-white' : 'bg-white text-navy-900 hover:bg-slate-200'}`}
                      >
                        {copiedType === 'link' ? 'Copied!' : 'Copy'}
                      </button>
                   </div>
                   <p className="text-[9px] text-slate-600 italic">Best for "Client Login" buttons in Wix.</p>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-vorange text-[10px] flex items-center justify-center font-black text-white">2</span>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wix HTML Embed Snippet</p>
                   </div>
                   <div className="space-y-3">
                      <textarea 
                        readOnly 
                        value={generateWixSnippet()} 
                        className="w-full h-32 bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-[9px] text-slate-500 font-mono outline-none resize-none"
                      />
                      <button 
                        onClick={() => copyToClipboard('wix')}
                        className={`w-full py-4 rounded-xl font-black uppercase text-[10px] transition-all ${copiedType === 'wix' ? 'bg-emerald-600 text-white' : 'bg-vorange text-white shadow-lg shadow-vorange/20'}`}
                      >
                        {copiedType === 'wix' ? 'Snippet Ready for Wix!' : 'Copy Wix HTML Snippet'}
                      </button>
                   </div>
                   <p className="text-[9px] text-slate-600 italic">Add this to a Wix "Embed HTML" element for a full-page experience.</p>
                </div>

                <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex items-start gap-4">
                   <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm">💡</div>
                   <p className="text-[10px] text-slate-400 font-bold leading-relaxed italic">
                      "Tania, these codes will automatically skin the portal to be 'Ghost Themed' (transparent background). This allows the VOPSy interface to float perfectly over your Wix site's actual background."
                   </p>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Identifier Status & Team Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="glass p-6 rounded-3xl border-navy-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-navy-900 bg-vorange flex items-center justify-center text-white text-xs font-black shadow-lg">TP</div>
                  <div className="w-12 h-12 rounded-full border-2 border-navy-900 bg-navy-800 flex items-center justify-center text-xl shadow-lg">🤖</div>
               </div>
               <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-widest">
                     {isManaged ? 'Team: Tania + VOPSy' : 'Teammate: VOPSy'}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Operational Status: Peak Sync</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[9px] font-black text-vorange uppercase tracking-widest">Identifier Focus</p>
               <p className="text-xs font-bold text-white">{activeClient}</p>
            </div>
         </div>
         <div className="glass p-6 rounded-3xl border-navy-700 flex items-center gap-4 bg-emerald-500/5 border-emerald-500/10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-xl">✅</div>
            <div>
               <h3 className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">Audit Integrity</h3>
               <p className="text-xs font-bold text-white">Systems are reconciling with 100% GAAP compliance.</p>
            </div>
         </div>
      </div>

      {/* VOPSY Strategic Guidance */}
      <section className="glass p-8 rounded-[2.5rem] border-vorange/10 relative overflow-hidden v-orange-glow">
        <div className="absolute top-0 right-0 w-64 h-64 bg-vorange/5 blur-[100px] -mr-32 -mt-32"></div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="flex-none">
             <div className="w-20 h-20 bg-navy-900 border border-vorange/20 rounded-[2rem] flex items-center justify-center text-4xl shadow-inner">
               🤖
             </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-vorange">VOPSy Strategic Directive</h3>
               <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-slate-500 bg-navy-900 px-3 py-1 rounded-full uppercase">Ops Architect Active</span>
                  {isManaged && (
                    <span className="text-[9px] font-bold text-vorange bg-vorange/10 px-3 py-1 rounded-full uppercase">Human + AI Managed</span>
                  )}
               </div>
            </div>
            {briefing ? (
              <p className="text-2xl font-outfit font-bold text-white leading-tight italic">
                "{briefing}"
              </p>
            ) : (
              <div className="space-y-3">
                <div className="h-6 w-full bg-navy-900 rounded animate-pulse" />
                <div className="h-6 w-2/3 bg-navy-900 rounded animate-pulse" />
              </div>
            )}
            <div className="pt-4 flex flex-wrap gap-4">
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-vorange transition-all">
                  <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-lg">⚙️</span>
                  Integration Procedures
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-vorange transition-all">
                  <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-lg">🎓</span>
                  Learn this system
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Rhythms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Integrated SaaS Hub</h2>
          <div className="space-y-3">
             {[
               { name: 'Banking (Integrated)', status: 'Connected', icon: '🏦', id: 'bank' },
               { name: 'Finance (QuickBooks)', status: 'Syncing', icon: '📊', id: 'qbo' },
               { name: 'CRM (Integrated)', status: 'Active', icon: '🤝', id: 'crm' }
             ].map(sys => (
               <div key={sys.id} className="glass p-5 rounded-2xl border-navy-700 flex items-center justify-between group hover:border-vorange/30 transition-all">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-xl">{sys.icon}</div>
                   <span className="text-xs font-bold text-white">{sys.name}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${sys.status === 'Syncing' ? 'bg-vorange animate-pulse' : 'bg-emerald-500'}`}></span>
                    <span className="text-[8px] font-black uppercase text-slate-500">{sys.status}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Operational Rhythms</h2>
          <div className="glass rounded-[2rem] border-navy-700 p-6 min-h-[400px]">
            {clientTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientTasks.map(t => (
                  <div 
                    key={t.id} 
                    onClick={() => toggleTask(t.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      t.completed ? 'bg-vorange/5 border-vorange/10 opacity-40' : 'bg-navy-900 border-navy-700 hover:border-vorange/40 shadow-xl'
                    }`}
                  >
                    <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      t.completed ? 'bg-vorange border-vorange' : 'border-slate-700'
                    }`}>
                      {t.completed && <span className="text-[10px] text-white font-black">✓</span>}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[8px] font-black text-vorange uppercase tracking-widest block">{t.category}</span>
                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                           t.assignedTo === 'Tania' ? 'border-amber-500/50 text-amber-500 bg-amber-500/5' :
                           t.assignedTo === 'VOPSy' ? 'border-vorange/50 text-vorange bg-vorange/5' :
                           'border-blue-500/50 text-blue-500 bg-blue-500/5'
                         }`}>
                           {t.assignedTo}
                         </span>
                      </div>
                      <p className={`text-sm font-bold ${t.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>{t.task}</p>
                      <p className="text-[9px] text-slate-600 mt-2 font-bold uppercase">{t.frequency} Rhythm</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
                <div className="text-5xl opacity-20">🧘</div>
                <p className="text-slate-500 italic max-w-xs font-medium">All systems synced. Performing at optimal scale.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center py-6 border-t border-navy-700">
         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Virtual OPS Hub · Teammate Infrastructure · Rochester NY</p>
      </footer>
    </div>
  );
};

export default Dashboard;
