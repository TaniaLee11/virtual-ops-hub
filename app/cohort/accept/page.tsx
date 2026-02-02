'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AcceptCohortInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    acceptInvite();
  }, []);

  const acceptInvite = async () => {
    const code = searchParams.get('code');

    if (!code) {
      setStatus('error');
      setMessage('Invalid invite link - no code provided');
      return;
    }

    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login with return URL
      const returnUrl = `/cohort/accept?code=${code}`;
      router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
      return;
    }

    // Accept the invite
    try {
      const response = await fetch('/api/cohort/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: code })
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to accept invite');
        return;
      }

      setStatus('success');
      setMessage(data.message);
      setExpiresAt(data.expiresAt);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);

    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {status === 'loading' && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold text-white mb-2">Processing your invite...</h1>
            <p className="text-slate-400">Please wait while we activate your AI Cohort access</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-black text-white mb-4">Welcome to the AI Cohort!</h1>
            <p className="text-lg text-emerald-400 mb-6">{message}</p>
            
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                Your Access Includes
              </h2>
              <ul className="space-y-2 text-left">
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>60-day full access to Virtual OPS Hub</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>AI Advisory Level service</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Weekly 1-on-1 sessions with Tania Potter</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>AI Operations Level system access</span>
                </li>
                <li className="flex items-start text-slate-300">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span>Vopsy AI Agent (Ops Director) operations</span>
                </li>
              </ul>
            </div>

            {expiresAt && (
              <p className="text-sm text-slate-400 mb-6">
                Your access expires on {new Date(expiresAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}

            <p className="text-slate-400 text-sm">
              Redirecting to your dashboard in 3 seconds...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">❌</div>
            <h1 className="text-3xl font-black text-white mb-4">Oops! Something went wrong</h1>
            <p className="text-lg text-red-400 mb-6">{message}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Go to Login
              </button>
              <button
                onClick={() => router.push('/')}
                className="block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl transition-all"
              >
                Back to Home
              </button>
            </div>

            <p className="text-slate-400 text-sm mt-6">
              Need help? Contact <a href="mailto:tania@virtualopsassist.com" className="text-orange-500 hover:underline">tania@virtualopsassist.com</a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
