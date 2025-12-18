
import React from 'react';
import { GeneratedMedia } from '../types';

interface GalleryProps {
  items: GeneratedMedia[];
}

const Gallery: React.FC<GalleryProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-4xl border border-slate-800">🗄️</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">The Vault is empty</h2>
          <p className="text-slate-500 max-w-sm">Generations you create in the Studio will appear here for you to download or review.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Your Vault</h1>
          <p className="text-slate-400">Collection of AI generated high-fidelity assets.</p>
        </div>
        <div className="px-4 py-2 glass rounded-xl text-sm font-semibold text-slate-400">
          {items.length} Assets
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="group relative glass rounded-3xl overflow-hidden border-slate-800 hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="aspect-square bg-slate-900 overflow-hidden relative">
              {item.type === 'image' && item.url && (
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              )}
              {item.type === 'video' && item.url && (
                <video src={item.url} className="w-full h-full object-cover" />
              )}
              {item.type === 'audio' && item.url && (
                <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-4xl">🎵</div>
                  <audio src={item.url} className="w-[80%] scale-75" />
                </div>
              )}
              
              {item.url && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = item.url!;
                      link.download = `vopsy-${item.type}-${item.id}`;
                      link.click();
                    }}
                    className="w-full py-3 bg-white text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors"
                  >
                    Download Asset
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-slate-900/40">
              <div className="flex items-center justify-between mb-2">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                   item.type === 'image' ? 'bg-blue-500/10 text-blue-400' :
                   item.type === 'video' ? 'bg-purple-500/10 text-purple-400' :
                   'bg-amber-500/10 text-amber-400'
                 }`}>
                   {item.type}
                 </span>
                 <span className="text-[10px] text-slate-500">
                   {new Date(item.timestamp).toLocaleDateString()}
                 </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 italic">"{item.prompt}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
