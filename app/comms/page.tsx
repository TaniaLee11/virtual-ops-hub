'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function CommsPage() {
  const [activeTab, setActiveTab] = useState<'emails' | 'documents'>('emails');
  const [emailType, setEmailType] = useState('professional');
  const [emailTone, setEmailTone] = useState('formal');
  const [emailContent, setEmailContent] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const emailTypes = [
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'followup', name: 'Follow-up', icon: '🔄' },
    { id: 'introduction', name: 'Introduction', icon: '👋' },
    { id: 'proposal', name: 'Proposal', icon: '📋' },
    { id: 'thankyou', name: 'Thank You', icon: '🙏' },
  ];

  const documentTypes = [
    { id: 'businessplan', name: 'Business Plan', icon: '📊' },
    { id: 'proposal', name: 'Proposal', icon: '📝' },
    { id: 'contract', name: 'Contract', icon: '📜' },
    { id: 'report', name: 'Report', icon: '📈' },
    { id: 'grant', name: 'Grant Application', icon: '💰' },
  ];

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vopsy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a ${emailTone} ${emailType} email about: ${emailContent}. Keep it professional and concise.`,
        }),
      });
      const data = await response.json();
      setGeneratedEmail(data.response);
    } catch (error) {
      setGeneratedEmail('Error generating email. Please try again.');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Communications</h1>
          <p className="text-slate-400 mt-1">AI-powered email and document generation</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'emails'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📧 Email Assistant
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'documents'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📄 Document Generator
          </button>
        </div>

        {activeTab === 'emails' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Builder */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Email Builder</h3>

              {/* Email Type */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Email Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {emailTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEmailType(type.id)}
                      className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                        emailType === type.id
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      <span>{type.icon}</span>
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Tone
                </label>
                <select
                  value={emailTone}
                  onChange={(e) => setEmailTone(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm"
                >
                  <option value="formal">Formal</option>
                  <option value="friendly">Friendly</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="apologetic">Apologetic</option>
                </select>
              </div>

              {/* Content */}
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  What's this email about?
                </label>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Describe the purpose of your email..."
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm resize-none"
                />
              </div>

              <button
                onClick={generateEmail}
                disabled={loading || !emailContent.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-700 text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                {loading ? 'Generating...' : '✨ Generate Email'}
              </button>
            </div>

            {/* Generated Email */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Generated Email</h3>
                {generatedEmail && (
                  <button
                    onClick={() => navigator.clipboard.writeText(generatedEmail)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg"
                  >
                    📋 Copy
                  </button>
                )}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 min-h-[300px]">
                {generatedEmail ? (
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{generatedEmail}</p>
                ) : (
                  <p className="text-sm text-slate-500 italic">Your generated email will appear here...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid md:grid-cols-3 gap-4">
            {documentTypes.map((doc) => (
              <a
                key={doc.id}
                href={`/comms/document/${doc.id}`}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
              >
                <span className="text-4xl mb-4 block">{doc.icon}</span>
                <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                <p className="text-sm text-slate-400 mt-1">Generate AI-powered {doc.name.toLowerCase()}</p>
              </a>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
