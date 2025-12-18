
import React, { useState } from 'react';
import { generateImage, generateVideo, generateSpeech } from '../services/geminiService';
import { GeneratedMedia, ClientContext } from '../types';

interface StudioProps {
  // Fix: Omit 'createdAt' as it is handled by the parent component (App.tsx)
  onGenerated: (item: Omit<GeneratedMedia, 'id' | 'timestamp' | 'createdAt'>) => void;
  // Added activeClient to props to match App.tsx usage
  activeClient: ClientContext;
}

// Updated component to receive activeClient prop
const Studio: React.FC<StudioProps> = ({ onGenerated, activeClient }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState<'image' | 'video' | 'audio'>('image');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      if (type === 'image') {
        setLoadingMessage('Diffusing pixels...');
        // Fix: generateImage only takes one argument (prompt)
        const url = await generateImage(prompt);
        setResult(url);
        onGenerated({ type: 'image', url, prompt });
      } else if (type === 'video') {
        setLoadingMessage('Simulating motion vectors (this may take a minute)...');
        const url = await generateVideo(prompt);
        setResult(url);
        onGenerated({ type: 'video', url, prompt });
      } else if (type === 'audio') {
        setLoadingMessage('Synthesizing vocal patterns...');
        const url = await generateSpeech(prompt);
        setResult(url);
        onGenerated({ type: 'audio', url, prompt });
      }
    } catch (err) {
      console.error(err);
      alert('Generation failed. Ensure your API key is correct and has billing enabled.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const clearResult = () => {
    setResult(null);
    setPrompt('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="space-y-2">
        <h1 className="text-4xl font-outfit font-extrabold tracking-tight">Vopsy Studio</h1>
        {/* Added activeClient display in the UI for context-awareness */}
        <p className="text-slate-400">Generate high-fidelity assets for <span className="text-indigo-400 font-bold">{activeClient}</span> in seconds.</p>
      </header>

      <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex flex-wrap gap-2 p-1 bg-slate-800/50 rounded-2xl w-fit">
          <button
            onClick={() => setType('image')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${type === 'image' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Image
          </button>
          <button
            onClick={() => setType('video')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${type === 'video' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Video
          </button>
          <button
            onClick={() => setType('audio')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${type === 'audio' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Audio (TTS)
          </button>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              type === 'image' ? "A hyper-realistic portrait of a cyberpunk wanderer, neon lighting..." :
              type === 'video' ? "A drone shot of a misty futuristic city at dusk..." :
              "Type the text you want Vopsy to speak naturally..."
            }
            className="w-full h-32 md:h-40 bg-slate-900 border border-slate-700 rounded-2xl p-5 text-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none placeholder:text-slate-600"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="absolute bottom-4 right-4 px-8 py-3 bg-indigo-600 disabled:bg-slate-700 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-indigo-600/20 disabled:shadow-none flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Working...
              </>
            ) : (
              <>✨ Generate {type.charAt(0).toUpperCase() + type.slice(1)}</>
            )}
          </button>
        </div>

        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-purple-500/20 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>
            <p className="text-indigo-400 font-medium animate-pulse">{loadingMessage}</p>
          </div>
        )}

        {result && !loading && (
          <div className="pt-6 animate-in zoom-in duration-500">
            <div className="glass bg-slate-950/50 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group">
              {type === 'image' && <img src={result} alt="Generated" className="w-full h-auto" />}
              {type === 'video' && <video src={result} controls className="w-full h-auto" />}
              {type === 'audio' && (
                <div className="p-12 flex flex-col items-center justify-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-4xl border border-slate-800 shadow-inner">🎵</div>
                  <audio src={result} controls className="w-full max-w-sm" />
                </div>
              )}
              
              <button 
                onClick={clearResult}
                className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-red-500/20 text-white rounded-full transition-colors border border-slate-700 hover:border-red-500/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Studio;
