import React, { useState } from 'react';
import { ClientContext } from '../types';

interface WixIntegrationProps {
  activeClient: ClientContext;
}

const WixIntegration: React.FC<WixIntegrationProps> = ({ activeClient }) => {
  const [copiedType, setCopiedType] = useState<'link' | 'wix' | null>(null);

  const PROD_DOMAIN = "https://nextjs-boilerplate-six-kappa-85.vercel.app";

  const generatePortalLink = () => {
    return `${PROD_DOMAIN}/?portal=true&wix=true&client=${encodeURIComponent(activeClient)}`;
  };

  const generateWixSnippet = () => {
    const link = generatePortalLink();
    return `<!-- Virtual OPS Hub: ${activeClient} Portal -->
<!-- Optimized for Wix 'Embed HTML' Component -->
<div id="vopsy-embed-container" style="width:100%; min-height:800px; overflow:hidden; border-radius: 28px; background: transparent;">
  <iframe 
    id="vopsy-iframe" 
    src="${link}" 
    style="width:100%; height:100%; border:none; background:transparent;" 
    allow="microphone; camera; clipboard-write; autoplay"
    loading="lazy">
  </iframe>
</div>

<script>
  window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'WIX_RESIZE' && event.data.height) {
      const container = document.getElementById('vopsy-embed-container');
      const iframe = document.getElementById('vopsy-iframe');
      if (container && iframe) {
        container.style.transition = 'height 0.3s ease-out';
        container.style.height = event.data.height + 'px';
        iframe.style.height = event.data.height + 'px';
      }
    }
  }, false);
</script>`.trim();
  };

  const copyToClipboard = (type: 'link' | 'wix') => {
    const text = type === 'link' ? generatePortalLink() : generateWixSnippet();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-vorange rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-vorange/20">W</div>
             <div>
                <h1 className="text-4xl font-outfit font-black tracking-tight text-white uppercase">Wix Integration Hub</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">SaaS Deployment Engine</p>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 bg-navy-800 border border-navy-700 rounded-xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Production Domain</span>
              <span className="text-[11px] font-bold text-vorange">vops-kappa-85.vercel.app</span>
           </div>
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ghost Protocol Active</span>
        </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-12 rounded-[3.5rem] border-navy-700 space-y-10 shadow-2xl relative overflow-hidden group">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-vorange/5 rounded-full blur-[100px] group-hover:bg-vorange/10 transition-all duration-1000"></div>
           
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-vorange/10 text-vorange border border-vorange/20 rounded-full text-[9px] font-black uppercase tracking-widest">Wix Embed HTML Mode</span>
                <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter text-white">Direct Deployment Snippet</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium max-w-xl">
                This snippet is configured specifically for the <strong>{activeClient}</strong> access point. Use the 
                <span className="text-white font-bold mx-1">Embed Code > Embed HTML</span> 
                tool in your Wix Site Editor.
              </p>
           </div>
           
           <div className="space-y-4 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-vorange/20 to-amber-500/20 rounded-3xl blur opacity-30"></div>
              <div className="relative">
                <textarea 
                  readOnly 
                  value={generateWixSnippet()} 
                  className="w-full h-72 bg-navy-900 border border-navy-700 rounded-3xl px-8 py-6 text-[11px] text-slate-300 font-mono outline-none resize-none shadow-inner"
                />
                <button 
                  onClick={() => copyToClipboard('wix')}
                  className={`absolute bottom-6 right-6 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl flex items-center gap-2 ${
                    copiedType === 'wix' ? 'bg-emerald-600 text-white' : 'bg-vorange text-navy-900 hover:bg-vorange-600 active:scale-95'
                  }`}
                >
                  {copiedType === 'wix' ? '✨ Snippet Copied!' : '📋 Copy Wix Code'}
                </button>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-navy-900/50 border border-navy-700 rounded-2xl">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Native API Access</p>
                 <div className="flex flex-wrap gap-2">
                    {['Mic', 'Camera', 'Clipboard', 'Autoplay'].map(p => (
                      <span key={p} className="text-[8px] font-bold px-2 py-0.5 bg-navy-800 rounded border border-navy-700 text-slate-400 uppercase tracking-tighter">✔ {p}</span>
                    ))}
                 </div>
              </div>
              <div className="p-5 bg-navy-900/50 border border-navy-700 rounded-2xl flex flex-col justify-center">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Interface Integrity</p>
                 <span className="text-[8px] font-bold px-2 py-0.5 bg-vorange/10 border border-vorange/20 text-vorange rounded uppercase tracking-tighter w-fit">Ghost Mode Transparency Enabled</span>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-navy-700 space-y-5 shadow-xl">
              <h2 className="text-xl font-black font-outfit uppercase tracking-tighter text-white">Direct URL</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                Use this for text links or nav menu redirects.
              </p>
              <div className="space-y-3">
                 <input 
                   readOnly 
                   value={generatePortalLink()} 
                   className="w-full bg-navy-900 border border-navy-700 rounded-xl px-4 py-3 text-[10px] text-vorange font-bold outline-none shadow-inner"
                 />
                 <button 
                   onClick={() => copyToClipboard('link')}
                   className={`w-full py-4 rounded-xl font-black uppercase text-[10px] transition-all border ${
                     copiedType === 'link' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-navy-800 border-navy-700 text-slate-300 hover:border-vorange hover:text-white shadow-lg'
                   }`}
                 >
                   {copiedType === 'link' ? 'URL Copied!' : 'Copy Direct Link'}
                 </button>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border-vorange/20 bg-vorange/5 space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-vorange/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
              <div className="flex items-center gap-3 relative z-10">
                 <div className="w-8 h-8 rounded-full bg-vorange flex items-center justify-center text-sm shadow-lg shadow-vorange/20 text-white">💡</div>
                 <h3 className="text-xs font-black uppercase text-vorange tracking-widest">Tania's Setup Tip</h3>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed font-medium relative z-10">
                "When adding the HTML box in Wix, remember to click the <span className="text-white font-bold underline decoration-vorange">Stretch</span> icon and set it to 100%. My script will automatically manage the vertical space."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WixIntegration;