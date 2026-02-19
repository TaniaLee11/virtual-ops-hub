'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function TaxOrganizerPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Tax Organizer</h1>
          <p className="text-slate-400 mt-1">Organize and track your tax documents and deadlines</p>
        </div>

        {/* Empty State */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
          <span className="text-6xl mb-4 block">📋</span>
          <h3 className="text-xl font-bold text-white mb-2">Tax Organizer</h3>
          <p className="text-slate-400 mb-6">
            Upload your tax documents and track important deadlines
          </p>
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all"
          >
            Upload Document
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
