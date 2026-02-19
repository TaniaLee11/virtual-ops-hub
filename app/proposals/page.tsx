'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function ProposalsPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Proposals & Contracts</h1>
          <p className="text-slate-400 mt-1">Create, track, and manage your proposals and contracts</p>
        </div>

        {/* Empty State */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
          <span className="text-6xl mb-4 block">📄</span>
          <h3 className="text-xl font-bold text-white mb-2">No Proposals Yet</h3>
          <p className="text-slate-400 mb-6">
            Create your first proposal or contract to start tracking your deals
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all"
          >
            Create Proposal
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
