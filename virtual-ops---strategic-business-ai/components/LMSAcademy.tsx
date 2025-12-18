
import React, { useState } from 'react';
// Corrected import: renamed generateEpisodeVideo to generateVideo to align with geminiService.ts
import { generateCourseCurriculum, generateVideo } from '../services/geminiService';
import { LMSCourse, LMSEpisode, ClientContext } from '../types';

interface LMSAcademyProps {
  courses: LMSCourse[];
  onCourseCreated: (course: LMSCourse) => void;
  onUpdateEpisode: (courseId: string, episodeId: string, updates: Partial<LMSEpisode>) => void;
  activeClient: ClientContext;
}

const LMSAcademy: React.FC<LMSAcademyProps> = ({ courses, onCourseCreated, onUpdateEpisode, activeClient }) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCourse, setActiveCourse] = useState<LMSCourse | null>(null);
  const [activeEpisode, setActiveEpisode] = useState<LMSEpisode | null>(null);

  const handleCreateCourse = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const curriculum = await generateCourseCurriculum(topic, activeClient);
      const newCourse: LMSCourse = {
        id: Math.random().toString(36).substr(2, 9),
        title: curriculum.title,
        description: curriculum.description,
        timestamp: Date.now(),
        client: activeClient,
        episodes: curriculum.episodes.map((ep: any) => ({
          ...ep,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending'
        }))
      };
      onCourseCreated(newCourse);
      setActiveCourse(newCourse);
      setTopic('');
    } catch (e) {
      alert("Curriculum generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const generateVideoForEpisode = async (courseId: string, episode: LMSEpisode) => {
    onUpdateEpisode(courseId, episode.id, { status: 'generating' });
    try {
      // Corrected call: use generateVideo which is exported from geminiService.ts
      const videoUrl = await generateVideo(episode.script);
      onUpdateEpisode(courseId, episode.id, { videoUrl, status: 'ready' });
      if (activeCourse?.id === courseId) {
        setActiveCourse(prev => {
          if (!prev) return null;
          return {
            ...prev,
            episodes: prev.episodes.map(ep => ep.id === episode.id ? { ...ep, videoUrl, status: 'ready' } : ep)
          };
        });
      }
    } catch (e) {
      onUpdateEpisode(courseId, episode.id, { status: 'error' });
    }
  };

  if (activeCourse) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
        <button 
          onClick={() => setActiveCourse(null)}
          className="text-sm text-slate-500 hover:text-emerald-500 flex items-center gap-2 font-bold uppercase tracking-widest"
        >
          ← Academy Overview
        </button>
        
        <header className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 block">{activeCourse.client} Series</span>
            <h1 className="text-3xl font-outfit font-extrabold">{activeCourse.title}</h1>
            <p className="text-slate-400 max-w-2xl mt-2">{activeCourse.description}</p>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl">
             <span className="text-emerald-500 font-bold uppercase tracking-tighter">{activeCourse.episodes.length} Episodes</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {activeEpisode ? (
              <div className="glass rounded-3xl overflow-hidden border-slate-800 shadow-2xl">
                <div className="aspect-video bg-slate-900 flex items-center justify-center relative">
                  {activeEpisode.status === 'ready' && activeEpisode.videoUrl ? (
                    <video src={activeEpisode.videoUrl} controls autoPlay className="w-full h-full object-cover" />
                  ) : activeEpisode.status === 'generating' ? (
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                      <p className="text-emerald-500 text-[10px] font-black animate-pulse tracking-widest uppercase">SYNTESIZING VEO STREAM...</p>
                    </div>
                  ) : (
                    <div className="text-center p-12">
                      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 opacity-30">📽️</div>
                      <p className="text-slate-500 mb-6 font-medium">Video assets pending for this module.</p>
                      <button 
                        onClick={() => generateVideoForEpisode(activeCourse.id, activeEpisode)}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-xl shadow-emerald-600/20"
                      >
                        Generate Module Video
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-8 space-y-4 bg-slate-900/40">
                  <h2 className="text-2xl font-bold">{activeEpisode.title}</h2>
                  <div className="prose prose-invert prose-emerald max-w-none">
                    <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-3">Module Context & Script</h4>
                    <p className="text-slate-300 italic font-medium leading-relaxed">"{activeEpisode.script}"</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[400px] glass rounded-3xl flex flex-col items-center justify-center border-dashed border-slate-800">
                 <div className="text-6xl mb-6 grayscale opacity-30">🎓</div>
                 <p className="text-slate-500 font-bold uppercase tracking-widest">Select a module to begin training</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Series Curriculum</h3>
            <div className="space-y-3">
              {activeCourse.episodes.map((ep, i) => (
                <button
                  key={ep.id}
                  onClick={() => setActiveEpisode(ep)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${
                    activeEpisode?.id === ep.id 
                    ? 'bg-emerald-600/10 border-emerald-500/50 text-white shadow-xl shadow-emerald-600/5' 
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-emerald-500">MODULE {i+1}</span>
                    <span className={`text-[8px] uppercase font-black px-2 py-0.5 rounded shadow-sm ${
                      ep.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                      ep.status === 'generating' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-800 text-slate-600'
                    }`}>
                      {ep.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{ep.title}</h4>
                  <p className="text-xs line-clamp-1 opacity-60">{ep.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-extrabold tracking-tight uppercase tracking-tighter">Academy Studio</h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Branded for: <span className="text-emerald-500">{activeClient}</span></p>
        </div>
      </header>

      <div className="glass p-8 rounded-3xl border-slate-800 space-y-6 shadow-2xl">
        <h2 className="text-xl font-bold font-outfit uppercase tracking-tight">Design New Series</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-1 focus:ring-emerald-500 outline-none text-lg placeholder:text-slate-700"
            placeholder={`E.g. Training for ${activeClient} partners on...`}
          />
          <button 
            onClick={handleCreateCourse}
            disabled={loading || !topic.trim()}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? 'Synthesizing...' : 'Create Masterclass'}
          </button>
        </div>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
           Academy series will automatically adopt {activeClient}'s operational logic.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold font-outfit uppercase tracking-tight">Focus Curriculum</h2>
        {courses.length === 0 ? (
          <div className="glass p-20 rounded-3xl text-center border-dashed border-slate-800 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-4xl opacity-30 grayscale">🎓</div>
            <p className="text-slate-500 italic max-w-sm text-sm font-medium leading-relaxed">
              Generate a unique {activeClient} training series to begin building your operational library.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map(course => (
              <div 
                key={course.id} 
                className="glass rounded-3xl overflow-hidden border-slate-800 hover:border-emerald-500/30 transition-all flex flex-col cursor-pointer group shadow-xl"
                onClick={() => setActiveCourse(course)}
              >
                <div className="aspect-[16/10] bg-slate-900 p-6 flex flex-col justify-between group-hover:bg-slate-800 transition-colors relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${
                    activeClient === 'REN Ecosystem' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex justify-between items-start relative z-10">
                    <span className="text-[9px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">MASTERCLASS</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{course.episodes.length} MODULES</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner relative z-10">🎓</div>
                </div>
                <div className="p-6 space-y-3 bg-slate-900/40 border-t border-slate-800">
                  <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors leading-tight">{course.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  <div className="pt-4 flex items-center justify-between text-[10px] text-slate-600 uppercase font-black tracking-[0.1em]">
                    <span>{new Date(course.timestamp).toLocaleDateString()}</span>
                    <span className="text-emerald-500 group-hover:translate-x-1 transition-transform">Begin Training →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSAcademy;
