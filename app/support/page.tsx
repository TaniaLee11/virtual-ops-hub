'use client';

import DashboardLayout from '@/components/DashboardLayout';

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Support</h1>
          <p className="text-slate-400 mt-1">Get help and access resources</p>
        </div>

        {/* Support Options */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <span className="text-4xl mb-4 block">📚</span>
            <h3 className="text-xl font-bold text-white mb-2">Documentation</h3>
            <p className="text-slate-400 mb-4">
              Browse our comprehensive guides and tutorials
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
              View Docs
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <span className="text-4xl mb-4 block">💬</span>
            <h3 className="text-xl font-bold text-white mb-2">Contact Support</h3>
            <p className="text-slate-400 mb-4">
              Get in touch with our support team
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
              Contact Us
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <span className="text-4xl mb-4 block">🎓</span>
            <h3 className="text-xl font-bold text-white mb-2">Academy</h3>
            <p className="text-slate-400 mb-4">
              Learn best practices through our courses
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
              Go to Academy
            </button>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <span className="text-4xl mb-4 block">🤖</span>
            <h3 className="text-xl font-bold text-white mb-2">Ask VOPSy</h3>
            <p className="text-slate-400 mb-4">
              Get instant answers from your AI assistant
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all">
              Chat with VOPSy
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
