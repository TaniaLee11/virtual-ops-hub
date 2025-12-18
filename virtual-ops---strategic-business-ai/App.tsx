import React, { useState, useEffect } from 'react';
import { AppView, BusinessSignal, BusinessReport, LMSCourse, LMSEpisode, GeneratedMedia, ClientContext } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import IntelligenceHub from './components/IntelligenceHub';
import StrategyConsultant from './components/StrategyConsultant';
import InsightsVault from './components/InsightsVault';
import LMSAcademy from './components/LMSAcademy';
import SystemsHub from './components/SystemsHub';
import Studio from './components/Studio';
import Gallery from './components/Gallery';
import ReconciliationHub from './components/ReconciliationHub';
import WixIntegration from './components/WixIntegration';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [activeClient, setActiveClient] = useState<ClientContext>('Virtual Ops Internal');
  const [reports, setReports] = useState<BusinessReport[]>([]);
  const [signals, setSignals] = useState<BusinessSignal[]>([]);
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [mediaItems, setMediaItems] = useState<GeneratedMedia[]>([]);
  const [isApiKeyReady, setIsApiKeyReady] = useState(false);
  const [industry, setIndustry] = useState('Global Technology');
  
  const [isWixEmbed, setIsWixEmbed] = useState(false);
  const [isPublicPortal, setIsPublicPortal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Detect Portal vs Admin Mode from URL
    if (params.get('portal') === 'true' || params.get('mode') === 'portal') {
      setIsPublicPortal(true);
      setCurrentView(AppView.CLIENT_PORTAL);
      
      const clientParam = params.get('client');
      if (clientParam) {
        const decodedClient = decodeURIComponent(clientParam);
        if (decodedClient.toLowerCase().includes('fatherhood')) {
          setActiveClient('Fatherhood Connection');
        } else if (decodedClient.toLowerCase().includes('ren')) {
          setActiveClient('REN Ecosystem');
        } else if (decodedClient.toLowerCase().includes('direct') || decodedClient.toLowerCase().includes('saas')) {
          setActiveClient('Direct SaaS Partner');
        } else {
          setActiveClient('Virtual Ops Internal');
        }
      }
    }

    // Wix Theme Transparency Logic (Ghost Mode)
    if (params.get('wix') === 'true' || params.get('embed') === 'wix') {
      setIsWixEmbed(true);
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
      
      const resizeObserver = new ResizeObserver(() => {
        window.parent.postMessage({ type: 'WIX_RESIZE', height: document.body.scrollHeight }, '*');
      });
      resizeObserver.observe(document.body);
    }

    // Post-load Wix Message Listener
    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== 'object') return;
      const { type, view, client } = event.data;
      
      if (type === 'WIX_NAVIGATE') {
        if (view && Object.values(AppView).includes(view as AppView)) setCurrentView(view as AppView);
        if (client) setActiveClient(client as ClientContext);
      }
    };

    window.addEventListener('message', handleMessage);
    
    const checkApiKey = async () => {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setIsApiKeyReady(hasKey);
      } else {
        setIsApiKeyReady(true);
      }
    };
    checkApiKey();

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOpenApiKeyDialog = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setIsApiKeyReady(true);
    }
  };

  const addReport = (report: Omit<BusinessReport, 'id' | 'timestamp'>) => {
    const newReport: BusinessReport = {
      ...report,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      client: activeClient
    };
    setReports(prev => [newReport, ...prev]);
  };

  const addMedia = (item: Omit<GeneratedMedia, 'id' | 'timestamp' | 'createdAt'>) => {
    const newItem: GeneratedMedia = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'ready',
      client: activeClient
    };
    setMediaItems(prev => [newItem, ...prev]);
  };

  const handleUpdateEpisode = (courseId: string, episodeId: string, updates: Partial<LMSEpisode>) => {
    setCourses(prev => prev.map(course => {
      if (course.id !== courseId) return course;
      return {
        ...course,
        episodes: course.episodes.map(ep => ep.id === episodeId ? { ...ep, ...updates } : ep)
      };
    }));
  };

  if (!isApiKeyReady) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen ${isWixEmbed ? 'bg-transparent' : 'bg-navy-900'} px-4 text-center`}>
        <div className="w-16 h-16 mb-6 rounded-2xl bg-navy-800 border border-vorange/30 flex items-center justify-center shadow-2xl">
          <span className="text-2xl font-outfit font-black text-vorange">V</span>
        </div>
        <h1 className="text-xl font-outfit font-black mb-4 text-white uppercase tracking-tight">System Initialization</h1>
        <button onClick={handleOpenApiKeyDialog} className="px-8 py-3 bg-vorange text-white font-black rounded-xl uppercase tracking-widest text-[10px]">Verify Teammate Key</button>
      </div>
    );
  }

  if (isPublicPortal) {
    return (
      <div className={`min-h-screen ${isWixEmbed ? 'bg-transparent' : 'bg-navy-900'} text-slate-100`}>
        <div className="max-w-5xl mx-auto p-4 md:p-8">
           <StrategyConsultant isPortalView={true} activeClient={activeClient} />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${isWixEmbed ? 'bg-transparent' : 'bg-navy-900'} overflow-hidden text-slate-100`}>
      {!isWixEmbed && <Sidebar currentView={currentView} setView={setCurrentView} activeClient={activeClient} setActiveClient={setActiveClient} />}
      
      <main className="flex-1 relative h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {currentView === AppView.DASHBOARD && (
            <Dashboard 
              signals={signals} 
              setSignals={setSignals} 
              industry={industry} 
              setIndustry={setIndustry} 
              activeClient={activeClient}
            />
          )}
          {currentView === AppView.WIX_DEPLOY && (
            <WixIntegration activeClient={activeClient} />
          )}
          {currentView === AppView.RECONCILIATION && (
            <ReconciliationHub activeClient={activeClient} />
          )}
          {currentView === AppView.SYSTEMS && <SystemsHub activeClient={activeClient} />}
          {currentView === AppView.INTELLIGENCE && (
            <div className="space-y-12">
               <IntelligenceHub onReportGenerated={addReport} activeClient={activeClient} />
               <div className="pt-12 border-t border-navy-700"><Studio onGenerated={addMedia} activeClient={activeClient} /></div>
            </div>
          )}
          {currentView === AppView.CONSULTANT && (
            <div className="space-y-4">
              <StrategyConsultant activeClient={activeClient} />
            </div>
          )}
          {currentView === AppView.ACADEMY && (
            <LMSAcademy 
              courses={courses.filter(c => c.client === activeClient || c.client === 'Virtual Ops Internal')} 
              onCourseCreated={(course) => setCourses(prev => [...prev, { ...course, client: activeClient }])} 
              onUpdateEpisode={handleUpdateEpisode} 
              activeClient={activeClient}
            />
          )}
          {currentView === AppView.VAULT && (
            <div className="space-y-16">
              <InsightsVault reports={reports.filter(r => r.client === activeClient)} />
              <div className="pt-16 border-t border-navy-700">
                <Gallery items={mediaItems.filter(m => m.client === activeClient)} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;