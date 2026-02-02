'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import DashboardLayout from '@/components/DashboardLayout';

interface CohortInvite {
  id: string;
  email: string;
  status: 'pending' | 'sent' | 'accepted';
  sent_at: string | null;
  accepted_at: string | null;
  created_at: string;
}

export default function CohortManagementPage() {
  const supabase = createClientComponentClient();
  const [invites, setInvites] = useState<CohortInvite[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Cohort configuration
  const cohortConfig = {
    duration: '60 days',
    accessLevel: 'AI Advisory Level',
    features: [
      'Weekly 1-on-1 sessions with Tania Potter',
      'AI Operations Level system access',
      'Agentic AI operations performed by Vopsy AI Agent (Ops Director)',
      'Full access to Virtual OPS Hub',
      'Priority support and guidance'
    ]
  };

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    try {
      const { data, error } = await supabase
        .from('cohort_invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading invites:', error);
        // Table might not exist yet - that's okay
        setInvites([]);
        return;
      }
      setInvites(data || []);
    } catch (error) {
      console.error('Error loading invites:', error);
      setInvites([]);
    }
  };

  const sendInvite = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Check if invite already exists
      const { data: existing } = await supabase
        .from('cohort_invites')
        .select('*')
        .eq('email', newEmail)
        .single();

      if (existing) {
        setMessage({ type: 'error', text: 'Invite already exists for this email' });
        setLoading(false);
        return;
      }

      // Create new invite
      const { error } = await supabase
        .from('cohort_invites')
        .insert({
          email: newEmail,
          status: 'sent',
          sent_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setMessage({ type: 'success', text: `Invite sent to ${newEmail}` });
      setNewEmail('');
      loadInvites();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to send invite' });
    } finally {
      setLoading(false);
    }
  };

  const resendInvite = async (inviteId: string, email: string) => {
    try {
      const { error } = await supabase
        .from('cohort_invites')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', inviteId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setMessage({ type: 'success', text: `Invite resent to ${email}` });
      loadInvites();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to resend invite' });
    }
  };

  const deleteInvite = async (inviteId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete the invite for ${email}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cohort_invites')
        .delete()
        .eq('id', inviteId);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setMessage({ type: 'success', text: `Invite deleted for ${email}` });
      loadInvites();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete invite' });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      sent: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">
            AI Cohort Management
          </h1>
          <p className="text-slate-400 mt-1">Manage invite-only access to the AI Cohort program</p>
        </div>

        {/* Cohort Configuration Card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">AI Cohort Configuration</h2>
            <span className="text-sm bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full font-bold">
              {cohortConfig.duration} Access
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">
              Service Level
            </h3>
            <p className="text-white font-semibold">{cohortConfig.accessLevel}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3">
              Included Features
            </h3>
            <ul className="space-y-2">
              {cohortConfig.features.map((feature, index) => (
                <li key={index} className="flex items-start text-slate-300">
                  <span className="text-orange-500 mr-2">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Send Invite Section */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Send New Invite</h2>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendInvite()}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
            />
            <button
              onClick={sendInvite}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-all"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </div>

        {/* Invites List */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Invite Management</h2>
            <p className="text-sm text-slate-400 mt-1">
              {invites.length} total invite{invites.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sent At
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Accepted At
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {invites.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No invites yet. Send your first invite above.
                    </td>
                  </tr>
                ) : (
                  invites.map((invite) => (
                    <tr key={invite.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">
                        {invite.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(invite.status)}`}>
                          {invite.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {invite.sent_at ? new Date(invite.sent_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {invite.accepted_at ? new Date(invite.accepted_at).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {invite.status !== 'accepted' && (
                            <button
                              onClick={() => resendInvite(invite.id, invite.email)}
                              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                              Resend
                            </button>
                          )}
                          <button
                            onClick={() => deleteInvite(invite.id, invite.email)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
