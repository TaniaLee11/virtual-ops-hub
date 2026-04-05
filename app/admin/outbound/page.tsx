'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/DashboardLayout';

interface PipelineStage {
  id: string;
  name: string;
  position: number;
  count?: number;
}

interface OutboundStatus {
  configured: boolean;
  pipeline: {
    id: string;
    name: string;
    stages: PipelineStage[];
  } | null;
  tagCounts: Record<string, number>;
  dailyTargets: { newOutreach: number; followUps: number; totalTouches: number };
  recentActivity: any[];
  error?: string;
}

export default function OutboundDashboardPage() {
  const [status, setStatus] = useState<OutboundStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupLoading, setSetupLoading] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/outbound/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setStatus({ configured: false, pipeline: null, tagCounts: {}, dailyTargets: { newOutreach: 20, followUps: 10, totalTouches: 30 }, recentActivity: [] });
    } finally {
      setLoading(false);
    }
  };

  const runSetup = async () => {
    setSetupLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/outbound/setup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setMessage('Pipeline, tags, and custom fields created successfully.');
        fetchStatus();
      } else {
        setMessage(`Setup error: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setMessage(`Setup failed: ${err.message}`);
    } finally {
      setSetupLoading(false);
    }
  };

  const runDailyExecution = async () => {
    setExecuteLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/outbound/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastCategoryIndex: -1 }),
      });
      const data = await res.json();
      if (data.success) {
        const r = data.result;
        setMessage(
          `Daily run complete: ${r.newOutreachSent} outreach, ${r.followUpsSent} follow-ups, ${r.totalTouches} total touches. Category: ${r.searchCategory}`
        );
        fetchStatus();
      } else {
        setMessage(`Execution error: ${data.error || data.message}`);
      }
    } catch (err: any) {
      setMessage(`Execution failed: ${err.message}`);
    } finally {
      setExecuteLoading(false);
    }
  };

  const stageColors: Record<string, string> = {
    'Cold Prospect': 'border-slate-500',
    'Outreach Sent': 'border-blue-500',
    'Follow-Up 1 Sent': 'border-blue-400',
    'Follow-Up 2 Sent': 'border-blue-300',
    'Follow-Up 3 Sent': 'border-yellow-500',
    'Responded': 'border-emerald-500',
    'Call Booked': 'border-green-500',
    'Proposal Sent': 'border-purple-500',
    'Closed — Won': 'border-orange-500',
    'Closed — Lost': 'border-red-500',
    'No Response — Archive': 'border-slate-600',
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              Outbound Command Center
            </h1>
            <p className="text-slate-400 mt-1">
              Agentic B2B outreach system — powered by VOPSy + GHL
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={runSetup}
              disabled={setupLoading}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg hover:border-orange-500/50 transition-all disabled:opacity-50 text-sm font-medium"
            >
              {setupLoading ? 'Setting up...' : 'Setup Pipeline'}
            </button>
            <button
              onClick={runDailyExecution}
              disabled={executeLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all disabled:opacity-50 text-sm font-bold"
            >
              {executeLoading ? 'Running...' : 'Run Daily Outbound'}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-6 p-4 bg-slate-900/50 border border-slate-700 rounded-xl text-sm text-slate-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-slate-400 text-center py-20">Loading outbound status...</div>
        ) : !status?.configured ? (
          <div className="bg-slate-900/50 border border-orange-500/30 rounded-2xl p-8 text-center">
            <p className="text-xl font-bold text-white mb-2">GHL Not Configured</p>
            <p className="text-slate-400 mb-4">
              Set GHL_API_KEY and GHL_LOCATION_ID in your environment variables, then click Setup Pipeline.
            </p>
          </div>
        ) : (
          <>
            {/* Daily Targets */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
                <p className="text-4xl font-black text-white">{status.dailyTargets.newOutreach}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Daily Outreach Target</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-2xl p-6">
                <p className="text-4xl font-black text-white">{status.dailyTargets.followUps}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Daily Follow-Up Target</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6">
                <p className="text-4xl font-black text-white">{status.dailyTargets.totalTouches}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Total Daily Touches</p>
              </div>
            </div>

            {/* Pipeline Stages */}
            {status.pipeline && (
              <>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">
                  Pipeline: {status.pipeline.name}
                </h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                  {(status.pipeline.stages || []).map((stage) => (
                    <div
                      key={stage.id || stage.name}
                      className={`bg-slate-900/50 border ${stageColors[stage.name] || 'border-slate-700'} rounded-2xl p-5`}
                    >
                      <h4 className="font-bold text-white text-sm">{stage.name}</h4>
                      <p className="text-3xl font-black text-white mt-2">{stage.count ?? 0}</p>
                      <p className="text-xs text-slate-500 mt-1">contacts</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Tag Counts */}
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">
              Active Tags
            </h3>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {Object.entries(status.tagCounts).map(([tag, count]) => (
                <div
                  key={tag}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-4"
                >
                  <p className="text-xs text-orange-500 font-mono">{tag}</p>
                  <p className="text-2xl font-black text-white mt-1">
                    {count === -1 ? '—' : count}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">
              Recent Executions
            </h3>
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              {status.recentActivity.length === 0 ? (
                <div className="p-6 text-center text-slate-500">
                  No executions yet. Click "Run Daily Outbound" to start.
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-xs text-slate-500 uppercase p-4">Date</th>
                      <th className="text-left text-xs text-slate-500 uppercase p-4">Action</th>
                      <th className="text-left text-xs text-slate-500 uppercase p-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {status.recentActivity.map((activity, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        <td className="p-4 text-sm text-slate-300">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-sm text-white font-medium">
                          {activity.action}
                        </td>
                        <td className="p-4 text-sm text-slate-400">
                          {(activity.data_touched || []).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
