'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'templates'>('documents');

  const templates = [
    { id: 'invoice', name: 'Invoice', icon: '💵', category: 'Financial' },
    { id: 'nda', name: 'Non-Disclosure Agreement', icon: '🔒', category: 'Legal' },
    { id: 'sow', name: 'Statement of Work', icon: '📋', category: 'Projects' },
    { id: 'businessplan', name: 'Business Plan', icon: '📊', category: 'Planning' },
    { id: 'grant', name: 'Grant Proposal', icon: '💰', category: 'Funding' },
    { id: 'contract', name: 'Service Contract', icon: '📜', category: 'Legal' },
    { id: 'meeting', name: 'Meeting Notes', icon: '📝', category: 'Operations' },
    { id: 'project', name: 'Project Brief', icon: '🎯', category: 'Projects' },
  ];

  const documents = [
    // Empty state - user hasn't created any documents yet
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Vault</h1>
          <p className="text-slate-400 mt-1">Your documents and templates</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'documents'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📁 My Documents
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'templates'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📋 Templates
          </button>
        </div>

        {activeTab === 'documents' && (
          <>
            {documents.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                <span className="text-6xl mb-4 block">📂</span>
                <h3 className="text-xl font-bold text-white mb-2">No Documents Yet</h3>
                <p className="text-slate-400 mb-6">
                  Create your first document using a template or the Communications page
                </p>
                <button
                  onClick={() => setActiveTab('templates')}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all"
                >
                  Browse Templates
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {/* Documents would be listed here */}
              </div>
            )}
          </>
        )}

        {activeTab === 'templates' && (
          <>
            {/* Categories */}
            {['Financial', 'Legal', 'Projects', 'Planning', 'Funding', 'Operations'].map((category) => {
              const categoryTemplates = templates.filter((t) => t.category === category);
              if (categoryTemplates.length === 0) return null;

              return (
                <div key={category} className="mb-8">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                    {category}
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {categoryTemplates.map((template) => (
                      <button
                        key={template.id}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/50 transition-all text-left"
                      >
                        <span className="text-3xl mb-3 block">{template.icon}</span>
                        <h4 className="font-bold text-white">{template.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">Click to use template</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
