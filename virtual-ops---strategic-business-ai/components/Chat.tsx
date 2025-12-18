
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await sendMessage(input);
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: result.text || "I'm sorry, I couldn't process that.",
        sources: result.sources,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex-none space-y-2">
        <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Vopsy Intelligence</h1>
        <p className="text-slate-400">Context-aware assistant with Google Search grounding.</p>
      </header>

      <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden border-slate-800">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-3xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-slate-200">Start a conversation</h3>
              <p className="text-slate-500 max-w-xs mt-2">Ask about recent trends, technical details, or creative brainstorms.</p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                msg.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                : 'bg-slate-800 text-slate-200 border border-slate-700'
              }`}>
                <div className="prose prose-invert prose-sm max-w-none">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Search Results</p>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <a 
                          key={i} 
                          href={src.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 bg-slate-900 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors truncate max-w-[200px]"
                        >
                          🔗 {src.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-800 rounded-2xl px-5 py-4 border border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900/50 border-t border-slate-800">
          <div className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Vopsy..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:bg-slate-700 disabled:shadow-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
