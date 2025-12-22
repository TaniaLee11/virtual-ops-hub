'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UserDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (profile?.role === 'platform_owner') {
      router.push('/admin/dashboard');
      return;
    }

    setUser(profile);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <h1 className="text-lg font-black text-white uppercase">Virtual OPS Hub</h1>
          </div>
          <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm">
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-white uppercase mb-2">
          Welcome, {user?.full_name || 'User'}
        </h2>
        <p className="text-slate-400 mb-8">Your Hub Dashboard</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/vopsy" className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all block">
            <span className="text-3xl mb-4 block">🤖</span>
            <h3 className="text-lg font-bold text-white">VOPSy</h3>
            <p className="text-sm text-slate-400 mt-1">Your AI Assistant</p>
          </a>
          <a href="/communications" className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all block">
            <span className="text-3xl mb-4 block">📧</span>
            <h3 className="text-lg font-bold text-white">Communications</h3>
            <p className="text-sm text-slate-400 mt-1">Emails and Messages</p>
          </a>
          <a href="/vault" className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all block">
            <span className="text-3xl mb-4 block">📁</span>
            <h3 className="text-lg font-bold text-white">Vault</h3>
            <p className="text-sm text-slate-400 mt-1">Documents and Templates</p>
          </a>
          <a href="/academy" className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all block">
            <span className="text-3xl mb-4 block">🎓</span>
            <h3 className="text-lg font-bold text-white">Academy</h3>
            <p className="text-sm text-slate-400 mt-1">Courses and Learning</p>
          </a>
          <a href="/studio" className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all block">
            <span className="text-3xl mb-4 block">🎨</span>
            <h3 className="text-lg font-bold text-white">Studio</h3>
            <p className="text-sm text-slate-400 mt-1">Content Creation</p>
          </a>
          <a href="/settings" className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 hover:border-orange-500/50 transition-all block">
            <span className="text-3xl mb-4 block">⚙️</span>
            <h3 className="text-lg font-bold text-white">Settings</h3>
            <p className="text-sm text-slate-400 mt-1">Account and Integrations</p>
          </a>
        </div>
      </main>
    </div>
  );
}
