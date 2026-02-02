'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/DashboardLayout';

export default function AdminDashboardPage() {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCohort: 0,
    paidSubscribers: 0,
    monthlyRevenue: 0,
  });

  const portalCounts = [
    { name: 'AI Free', count: 0, color: 'border-slate-500', price: null },
    { name: 'AI Assistant', count: 0, color: 'border-blue-500', price: '$34.99' },
    { name: 'AI Operations', count: 0, color: 'border-indigo-500', price: '$99.99' },
    { name: 'AI Enterprise', count: 0, color: 'border-purple-500', price: '$499+' },
    { name: 'AI Advisory', count: 0, color: 'border-emerald-500', price: null },
    { name: 'Tax Client', count: 0, color: 'border-amber-500', price: null },
    { name: 'AI Cohort', count: 0, color: 'border-orange-500', price: '60-day pass' },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-slate-400 mt-1">Owner dashboard • Full platform overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
            <p className="text-4xl font-black text-white">{stats.totalUsers}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Users</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6">
            <p className="text-4xl font-black text-white">{stats.activeCohort}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Active Cohort</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6">
            <p className="text-4xl font-black text-white">{stats.paidSubscribers}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Paid Subscribers</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
            <p className="text-4xl font-black text-white">${stats.monthlyRevenue}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Monthly Revenue</p>
          </div>
        </div>

        {/* Portal Management */}
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Portal Overview</h3>
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {portalCounts.map((portal) => (
            <a
              key={portal.name}
              href={`/admin/portals/${portal.name.toLowerCase().replace(' ', '-')}`}
              className={`bg-slate-900/50 border ${portal.color} rounded-2xl p-5 hover:bg-slate-800/50 transition-all`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-white">{portal.name}</h4>
                {portal.name === 'AI Cohort' && (
                  <span className="text-[10px] bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded">
                    60-Day
                  </span>
                )}
              </div>
              <p className="text-3xl font-black text-white">{portal.count}</p>
              <p className="text-xs text-slate-500 mt-1">
                {portal.price ? `${portal.price}/mo` : 'users'}
              </p>
            </a>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <a
            href="/admin/cohort"
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all"
          >
            <span className="text-3xl mb-3 block">🎟️</span>
            <h4 className="font-bold text-white">Cohort Invites</h4>
            <p className="text-xs text-slate-400 mt-1">Manage invite codes</p>
          </a>
          <a
            href="/admin/audit"
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all"
          >
            <span className="text-3xl mb-3 block">📋</span>
            <h4 className="font-bold text-white">Audit Log</h4>
            <p className="text-xs text-slate-400 mt-1">View all VOPSy actions</p>
          </a>
          <a
            href="/admin/exports"
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all"
          >
            <span className="text-3xl mb-3 block">📊</span>
            <h4 className="font-bold text-white">Export Data</h4>
            <p className="text-xs text-slate-400 mt-1">Download reports</p>
          </a>
          <a
            href="/settings/ai"
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all"
          >
            <span className="text-3xl mb-3 block">🤖</span>
            <h4 className="font-bold text-white">AI Settings</h4>
            <p className="text-xs text-slate-400 mt-1">Configure VOPSy</p>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
