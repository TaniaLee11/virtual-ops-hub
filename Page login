'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) throw new Error(authError.message);
      if (!data.user) throw new Error('Authentication failed');

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      if (profile?.role === 'platform_owner') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/30">
            <span className="text-white font-black text-3xl">V</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            Virtual OPS Hub
          </h1>
          <p className="text-sm text-slate-400 mt-2">Powered by VOPSy</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Sign in to your account
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  className="w-full bg-slate-900/80 border border-slate-700 text-white px-4 py-4 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-6 rounded-xl text-sm uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-center text-sm text-slate-400">
              Have an invite code?{' '}
              <a href="/cohort" className="text-orange-500 font-bold hover:underline">
                Join the AI Cohort
              </a>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          2024 Virtual OPS Hub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
