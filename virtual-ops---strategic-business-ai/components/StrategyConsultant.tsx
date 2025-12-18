
import React, { useState, useRef, useEffect } from 'react';
import { sendConsultantMessage } from '../services/geminiService';
import { ChatMessage, ClientContext } from '../types';

interface StrategyConsultantProps {
  isPortalView?: boolean;
  activeClient: ClientContext;
}

const StrategyConsultant: React.FC<StrategyConsultantProps> = ({ isPortalView = false, activeClient }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<'internal' | 'client' | 'portal'>(isPortalView ? 'portal' : 'internal');
  const scrollRef = useRef<HTMLDivElement>(null);

  const isManaged = activeClient === 'REN Ecosystem' || activeClient === 'Fatherhood Connection';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      clientContext: activeClient
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await sendConsultantMessage(input, mode, activeClient);
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: result.text || "Operational protocol acknowledged.",
        sources: result.sources,
        timestamp: Date.now(),
        toolCalls: result.functionCalls,
        clientContext: activeClient
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const getSuggestions = () => {
    if (activeClient === 'REN Ecosystem') {
      return ["Analyze Options Put strategy", "Explain S&P 500 Yield Overlays", "Draft REN portfolio brief"];
    }
    if (activeClient === 'Fatherhood Connection') {
      return ["Draft donor transparency report", "Audit grant compliance SOPs", "Strategic impact roadmap"];
    }
    return ["Automate Uber settlement workflows", "Review 30% Tax Holdback logic", "Optimize the Hub backend"];
  };

  return (
    <div className={`flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto space-y-4 ${isPortalView ? 'py-8' : ''}`}>
      {!isPortalView && (
        <header className="flex-none flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-outfit font-black text-white tracking-tighter uppercase">VOPSy Intelligence</h1>
            <div className="flex items-center gap-2">
               <p className="text-[10px] font-black text-vorange uppercase tracking-[0.2em] leading-none">Automate · Educate · Scale</p>
               {isManaged && (
                 <span className="text-[9px] font-bold text-white bg-vorange/20 px-2 py-0.5 rounded border border-vorange/30 uppercase tracking-tighter">Managed by Tania Potter</span>
               )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-1 bg-navy-900 border border-navy-700 rounded-2xl">
            <button 
              onClick={() => setMode('internal')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'internal' ? 'bg-vorange text-white shadow-lg shadow-vorange/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Hub Operations
            </button>
            <button 
              onClick={() => setMode('client')} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'client' ? 'bg-white text-navy-900' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Client Briefing
            </button>
          </div>
        </header>
      )}

      <div className={`flex-1 glass rounded-[2.5rem] flex flex-col overflow-hidden border ${mode === 'internal' ? 'border-vorange/10 shadow-2xl shadow-vorange/5' : 'border-white/10 shadow-2xl shadow-white/5'}`}>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-8">
              <div className="relative">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-6 border-2 transition-all shadow-2xl ${
                  activeClient === 'REN Ecosystem' ? 'bg-vorange/10 border-vorange/20 text-vorange' : 
                  activeClient === 'Fatherhood Connection' ? 'bg-white/10 border-white/20 text-white' : 
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                  {activeClient === 'REN Ecosystem' ? '📈' : activeClient === 'Fatherhood Connection' ? '🤝' : '⚙️'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-navy-900 border border-vorange/30 flex items-center justify-center text-sm animate-bounce">🤖</div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-3xl font-black font-outfit uppercase tracking-tighter text-white">
                   VOPSy {isManaged ? '+ Tania' : ''} Active
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto font-medium leading-relaxed">
                   {isManaged ? 
                     `Tania Potter and I are systemizing ${activeClient} for growth. Ask us anything about the current operational pipeline.` : 
                     `I am your primary operations teammate for ${activeClient}. Let's automate your scaling process.`}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl pt-4">
                {getSuggestions().map((s, i) => (
                  <button key={i} onClick={() => setInput(s)} className="p-5 text-left text-[11px] bg-navy-900 border border-navy-700 rounded-2xl transition-all text-slate-400 hover:text-white uppercase font-black tracking-widest hover:border-vorange hover:bg-navy-800">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[85%] rounded-[2rem] px-8 py-6 ${
                msg.role === 'user' 
                ? 'bg-vorange text-white shadow-xl shadow-vorange/20 font-bold' 
                : 'bg-navy-900 border border-navy-700 text-slate-200'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mb-5 pb-3 border-b border-navy-700">
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-vorange">
                          AI Employee Protocol
                       </span>
                       <span className="text-[8px] text-slate-500 font-bold px-2 py-0.5 bg-navy-900 border border-navy-700 rounded uppercase tracking-tighter">
                         {msg.clientContext}
                       </span>
                     </div>
                  </div>
                )}
                <div className="prose prose-invert prose-sm leading-relaxed whitespace-pre-wrap font-medium">
                   {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-navy-700 flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => (
                      <a key={i} href={src.uri} target="_blank" className="text-[10px] px-3 py-1.5 bg-navy-900 rounded-xl text-vorange hover:text-white transition-colors border border-vorange/20 font-black uppercase tracking-widest">🔗 {src.title}</a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-navy-900 border border-navy-700 rounded-2xl px-6 py-4 shadow-2xl">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full animate-bounce bg-vorange" />
                  <div className="w-2 h-2 rounded-full animate-bounce delay-100 bg-vorange" />
                  <div className="w-2 h-2 rounded-full animate-bounce delay-200 bg-vorange" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-navy-900/80 border-t border-navy-700 backdrop-blur-md">
          <div className="relative flex items-center gap-4 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Direct your AI Employee for ${activeClient}...`}
              className="flex-1 bg-navy-800 border border-navy-700 rounded-[1.5rem] px-8 py-5 outline-none focus:border-vorange transition-all placeholder:text-slate-600 font-bold text-white shadow-inner"
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping} className="p-5 bg-vorange hover:bg-vorange-600 text-white rounded-[1.5rem] shadow-xl shadow-vorange/20 transition-all active:scale-95 disabled:bg-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyConsultant;
