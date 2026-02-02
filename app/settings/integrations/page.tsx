'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';

export default function IntegrationsPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, [supabase]);

  const connectGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error connecting to Google:', error);
      alert('Failed to connect to Google. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Integrations</h1>
          <p className="text-slate-400 mt-1">Connect your favorite tools to Virtual OPS Hub</p>
        </div>

        <div className="grid gap-6">
          {/* Google Integration */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
                G
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Google Workspace</h3>
                <p className="text-sm text-slate-400 text-balance">
                  Sync your emails, calendar, and drive for AI-powered insights.
                </p>
              </div>
            </div>
            <button
              onClick={connectGoogle}
              disabled={loading}
              className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>

          {/* Microsoft Integration (Placeholder) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between opacity-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                M
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Microsoft 365</h3>
                <p className="text-sm text-slate-400">
                  Coming soon: Integration with Outlook and OneDrive.
                </p>
              </div>
            </div>
            <button disabled className="px-6 py-2 bg-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
