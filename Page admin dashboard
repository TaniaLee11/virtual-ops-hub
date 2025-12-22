'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminDashboard() {
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
      .select('email, full_name, role')
      .eq('user_id', session.user.id)
      .single();

    if (!profile || profile.role !== 'platform_owner') {
      router.push('/dashboard');
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
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <div>
              <h1 className="text-lg font-black text-white uppercase tracking-tight">Virtual OPS Hub</h1>
              <p className="text-xs text-orange-500">Platform Owner</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <button onClick={handleLogout} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            Welcome, {user?.full_name || 'Owner'}
          </h2>
          <p className="text-slate-400 mt-1">Platform Command Center</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
            <p className="text-3xl font-black text-white">0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Users</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6">
            <p className="text-3xl font-black text-white">0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Active Cohort</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6">
            <p className="text-3xl font-black text-white">0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Paid Subscribers</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
            <p className="text-3xl font-black text-white">$0</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Monthly Revenue</p>
          </div>
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Portal Management</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-600 rounded-2xl p-5">
            <h4 className="font-bold text-white">AI Free</h4>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">users</p>
          </div>
          <div className="bg-slate-900/50 border border-blue-500/50 rounded-2xl p-5">
            <h4 className="font-bold text-white">AI Assistant</h4>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">$34.99/mo</p>
          </div>
          <div className="bg-slate-900/50 border border-indigo-500/50 rounded-2xl p-5">
            <h4 className="font-bold text-white">AI Operations</h4>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">$99.99/mo</p>
          </div>
          <div className="bg-slate-900/50 border border-purple-500/50 rounded-2xl p-5">
            <h4 className="font-bold text-white">AI Enterprise</h4>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">$499+/mo</p>
          </div>
          <div className="bg-slate-900/50 border border-emerald-500/50 rounded-2xl p-5">
            <h4 className="font-bold text-white">AI Advisory</h4>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">users</p>
          </div>
          <div className="bg-slate-900/50 border border-amber-500/50 rounded-2xl p-5">
            <h4 className="font-bold text-white">Tax Client</h4>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">users</p>
          </div>
          <div className="bg-slate-900/50 border border-orange-500/50 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white">AI Cohort</h4>
              <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded">90-Day</span>
            </div>
            <p className="text-2xl font-black text-white mt-2">0</p>
            <p className="text-xs text-slate-500">trial users</p>
          </div>
        </div>

        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:border-orange-500/50 cursor-pointer transition-all">
            <span className="text-2xl mb-3 block">🎟️</span>
            <h4 className="font-bold text-white">Create Invite</h4>
            <p className="text-xs text-slate-400 mt-1">Generate cohort code</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:border-orange-500/50 cursor-pointer transition-all">
            <span className="text-2xl mb-3 block">📋</span>
            <h4 className="font-bold text-white">Audit Log</h4>
            <p className="text-xs text-slate-400 mt-1">View VOPSy actions</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:border-orange-500/50 cursor-pointer transition-all">
            <span className="text-2xl mb-3 block">📊</span>
            <h4 className="font-bold text-white">Export Data</h4>
            <p className="text-xs text-slate-400 mt-1">Download reports</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-5 hover:border-orange-500/50 cursor-pointer transition-all">
            <span className="text-2xl mb-3 block">🤖</span>
            <h4 className="font-bold text-white">AI Settings</h4>
            <p className="text-xs text-slate-400 mt-1">Configure VOPSy</p>
          </div>
        </div>
      </main>
    </div>
  );
}
