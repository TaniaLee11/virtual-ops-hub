'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';

export default function IntegrationsPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
  }, [supabase]);

  const connectGoogle = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `https://virtualopsassist.com/auth/callback`,
          scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/calendar',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            login_hint: 'tania@virtualopsassist.com', // Force hint for the correct account
          },
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Error connecting to Google:', error);
      // Fix for [object Object] error: extract the message string
      const message = error.message || error.error_description || 'An unknown error occurred';
      setErrorMessage(message);
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

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
            <strong>Connection Error:</strong> {errorMessage}
          </div>
        )}

        <div className="grid gap-6">
          {/* Google Integration */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
                <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Google Workspace</h3>
                <p className="text-sm text-slate-400 text-balance">
                  Connect your <span className="text-white font-medium">tania@virtualopsassist.com</span> account for AI-powered insights.
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
