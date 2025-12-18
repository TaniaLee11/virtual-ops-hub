
import React, { useState } from 'react';
import { SystemHealth, ClientContext } from '../types';

// Define props for SystemsHub component
interface SystemsHubProps {
  activeClient: ClientContext;
}

const INITIAL_SYSTEMS: SystemHealth[] = [
  { id: '1', name: 'QuickBooks Online', category: 'accounting', status: 'active', lastSync: Date.now() - 3600000, icon: '💼' },
  { id: '2', name: 'Uber Driver API', category: 'gig', status: 'active', lastSync: Date.now() - 1800000, icon: '🚗' },
  { id: '3', name: 'Cash App Business', category: 'payment', status: 'syncing', lastSync: Date.now(), icon: '💸' },
  { id: '4', name: 'Zoho Billing', category: 'accounting', status: 'error', lastSync: Date.now() - 86400000, icon: '📊' },
  { id: '5', name: 'Zapier Bridge', category: 'operations', status: 'active', lastSync: Date.now() - 600000, icon: '⚡' },
];

// Added activeClient prop to the component signature
const SystemsHub: React.FC<SystemsHubProps> = ({ activeClient }) => {
  const [systems] = useState<SystemHealth[]>(INITIAL_SYSTEMS);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Systems Infrastructure</h1>
          {/* Use activeClient in the header for contextual feedback */}
          <p className="text-slate-400 font-medium">Monitoring the operational "Heartbeat" for {activeClient}.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
           <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Compliance Pulse: 94% Healthy</span>
        </div>
      </header>

      {/* Integration Directives */}
      <section className="glass p-6 rounded-2xl border-slate-800 bg-emerald-500/5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl">🤖</div>
          <div>
            <h3 className="text-lg font-bold text-emerald-400 mb-1">Director's Recommendation</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              To remain fully compliant while scaling your gig work: 
              <strong className="text-white"> Transition Cash App funds to QBO Daily.</strong> I've detected a mismatch between Uber gross earnings and your tax reserve allocation. I recommend increasing your weekly transfer to the 'REN Holdings' reserve account by 5%.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {systems.map((sys) => (
          <div key={sys.id} className="glass p-6 rounded-2xl border-slate-800 hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {sys.icon}
              </div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                sys.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' :
                sys.status === 'syncing' ? 'bg-blue-500/10 text-blue-500 animate-pulse' :
                sys.status === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-500'
              }`}>
                {sys.status}
              </span>
            </div>
            <h3 className="font-bold text-lg mb-1">{sys.name}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{sys.category} Integration</p>
            
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[10px]">
              <span className="text-slate-600 font-bold uppercase tracking-tighter">Last Sync: {new Date(sys.lastSync).toLocaleTimeString()}</span>
              <button className="text-emerald-500 font-bold hover:underline">Reconfigure →</button>
            </div>
          </div>
        ))}

        {/* Add New System Card */}
        <button className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
           <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xl group-hover:rotate-90 transition-transform">+</div>
           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Connect New App</span>
        </button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border-slate-800">
          <h2 className="text-xl font-bold mb-4">Infrastructure Map</h2>
          <div className="space-y-4 relative">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs">🚗</div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 to-slate-800"></div>
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs">💼</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs">💸</div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500 to-slate-800"></div>
              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs">💼</div>
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center pt-2">
              Automated Data Flow Active via Zapier
            </div>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border-slate-800">
          <h2 className="text-xl font-bold mb-4">Compliance Checklist</h2>
          <div className="space-y-3">
             {[
               "1099 Tax Liability Reserved (30%)",
               "Intercompany Transfers Reconciled",
               "W-9 Collection Workflow Active",
               "NYS Sales Tax Mapping Validated"
             ].map((check, i) => (
               <div key={i} className="flex items-center gap-3 text-sm">
                 <span className="text-emerald-500">✔</span>
                 <span className="text-slate-300">{check}</span>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemsHub;
