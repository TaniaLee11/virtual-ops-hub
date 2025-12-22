'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*, organizations(*)')
        .eq('user_id', session.user.id)
        .single();
      setUser(profile);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Welcome, {user?.full_name || 'User'}
          </h1>
          <p className="text-slate-400 mt-1">Your Hub Dashboard</p>
        </div>

        {/* 4 Widget Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Widget 1: Financial Control */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Financial Control</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase mb-1">Revenue</p>
                <p className="text-2xl font-black text-emerald-500">$0</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <p className="text-xs text-slate-500 uppercase mb-1">Expenses</p>
                <p className="text-2xl font-black text-red-500">$0</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Connect integrations to see real data</p>
          </div>

          {/* Widget 2: KPI Pulse */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">KPI Pulse</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Tasks Completed</span>
                <span className="text-sm font-bold text-white">0 / 0</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">AI Actions Today</span>
                <span className="text-sm font-bold text-white">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Documents Created</span>
                <span className="text-sm font-bold text-white">0</span>
              </div>
            </div>
          </div>

          {/* Widget 3: Operational Roadmap */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Operational Roadmap</h3>
              <span className="text-2xl">🗺️</span>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-sm text-slate-300">Connect your first integration</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-sm text-slate-300">Chat with VOPSy</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-sm text-slate-300">Create your first document</span>
              </div>
            </div>
          </div>

          {/* Widget 4: Proactive Directives */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Proactive Directives</h3>
              <span className="text-2xl">🤖</span>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4">
              <p className="text-sm text-orange-400 font-medium mb-2">VOPSy Suggestion</p>
              <p className="text-sm text-slate-300">
                Get started by connecting your Google or Microsoft account to unlock AI-powered insights.
              </p>
              <a href="/settings/integrations" className="text-xs text-orange-500 hover:underline mt-2 inline-block">
                Connect Now →
              </a>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/vopsy" className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-orange-500/50 transition-all text-center">
            <span className="text-2xl mb-2 block">🤖</span>
            <span className="text-sm text-white font-medium">Chat with VOPSy</span>
          </a>
          <a href="/comms" className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-orange-500/50 transition-all text-center">
            <span className="text-2xl mb-2 block">📧</span>
            <span className="text-sm text-white font-medium">Draft Email</span>
          </a>
          <a href="/vault" className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-orange-500/50 transition-all text-center">
            <span className="text-2xl mb-2 block">📄</span>
            <span className="text-sm text-white font-medium">New Document</span>
          </a>
          <a href="/academy" className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 hover:border-orange-500/50 transition-all text-center">
            <span className="text-2xl mb-2 block">🎓</span>
            <span className="text-sm text-white font-medium">Learn</span>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
