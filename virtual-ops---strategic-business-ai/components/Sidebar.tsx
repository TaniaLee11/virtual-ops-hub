import React from 'react';
import { AppView, ClientContext } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  activeClient: ClientContext;
  setActiveClient: (client: ClientContext) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, activeClient, setActiveClient }) => {
  const navItems = [
    { id: AppView.DASHBOARD, label: 'OPS Overview', icon: '📊' },
    { id: AppView.WIX_DEPLOY, label: 'Wix Integration', icon: '🌐' },
    { id: AppView.SYSTEMS, label: 'Systems Hub', icon: '⚙️' },
    { id: AppView.RECONCILIATION, label: 'Smart Reconcile', icon: '⚖️' },
    { id: AppView.INTELLIGENCE, label: 'Market Intel', icon: '📡' },
    { id: AppView.CONSULTANT, label: 'AI Employee (VOPSy)', icon: '🤖' },
    { id: AppView.ACADEMY, label: 'LMS Academy', icon: '🎓' },
    { id: AppView.VAULT, label: 'Record Archive', icon: '📁' },
  ];

  return (
    <>
      <aside className="hidden md:flex flex-col w-72 bg-navy-800 border-r border-navy-700 p-6">
        <div className="flex flex-col mb-10 px-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-outfit font-black text-white leading-none">virtual</span>
            <span className="text-2xl font-outfit font-black text-vorange leading-none">OPS</span>
          </div>
          <span className="text-[10px] font-bold text-vorange uppercase tracking-[0.2em] opacity-80">Automate · Educate · Scale</span>
        </div>

        <div className="mb-10 px-2">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">Focus Identifier</label>
          <div className="relative group">
            <select 
              value={activeClient}
              onChange={(e) => setActiveClient(e.target.value as ClientContext)}
              className="w-full bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-xs font-bold text-vorange outline-none hover:border-vorange transition-all appearance-none cursor-pointer"
            >
              <option value="Virtual Ops Internal">Virtual Ops Internal</option>
              <option value="Fatherhood Connection">Fatherhood Connection</option>
              <option value="REN Ecosystem">REN Ecosystem</option>
              <option value="Direct SaaS Partner">Direct SaaS Partner</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-vorange text-[10px]">▼</div>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                currentView === item.id 
                ? 'bg-vorange text-white shadow-xl shadow-vorange/20 border border-vorange' 
                : 'text-slate-400 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-navy-700 space-y-4">
          <div className="glass bg-navy-900 p-4 rounded-xl flex items-center gap-3 border-navy-700">
            <div className="w-9 h-9 rounded-full bg-vorange flex items-center justify-center text-xs font-black text-white">
              TP
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate">Tania Potter</p>
              <p className="text-[9px] text-vorange uppercase tracking-widest font-black">Founder & CEO</p>
            </div>
          </div>
          <p className="text-[8px] text-center text-slate-500 font-bold uppercase tracking-widest">© 2025 Virtual OPS Hub</p>
        </div>
      </aside>

      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-navy-700 h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-outfit font-black text-sm text-white uppercase">virtual</span>
          <span className="font-outfit font-black text-sm text-vorange uppercase">ops</span>
        </div>
        <select 
          value={activeClient}
          onChange={(e) => setActiveClient(e.target.value as ClientContext)}
          className="bg-navy-900 border border-navy-700 rounded-lg text-[10px] font-black text-vorange px-2 py-1 outline-none"
        >
          <option value="Virtual Ops Internal">Internal</option>
          <option value="Fatherhood Connection">Fatherhood</option>
          <option value="REN Ecosystem">REN</option>
          <option value="Direct SaaS Partner">Direct SaaS</option>
        </select>
      </header>
    </>
  );
};

export default Sidebar;