'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function StudioPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'copywriter',
      name: 'AI Copywriter',
      description: 'Generate marketing copy, taglines, and ad content',
      icon: '✍️',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'social',
      name: 'Social Media',
      description: 'Create posts for all major platforms',
      icon: '📱',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'blog',
      name: 'Blog Writer',
      description: 'Generate blog posts and articles',
      icon: '📝',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'presentation',
      name: 'Presentation',
      description: 'Create slide decks and pitch materials',
      icon: '📊',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'video',
      name: 'Video Script',
      description: 'Write scripts for videos and podcasts',
      icon: '🎬',
      color: 'from-red-500 to-red-600',
    },
    {
      id: 'brand',
      name: 'Brand Kit',
      description: 'Generate brand names, taglines, and messaging',
      icon: '🎨',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Studio</h1>
          <p className="text-slate-400 mt-1">AI-powered content creation tools</p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`bg-slate-900/50 border rounded-2xl p-6 text-left transition-all ${
                selectedTool === tool.id
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{tool.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{tool.description}</p>
            </button>
          ))}
        </div>

        {/* Selected Tool Workspace */}
        {selectedTool && (
          <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              {tools.find((t) => t.id === selectedTool)?.name}
            </h3>
            <textarea
              placeholder="Describe what you want to create..."
              rows={4}
              className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl text-sm resize-none mb-4"
            />
            <div className="flex gap-3">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition-all">
                ✨ Generate
              </button>
              <button
                onClick={() => setSelectedTool(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-3 px-6 rounded-xl text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
