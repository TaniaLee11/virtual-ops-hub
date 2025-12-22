'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'progress'>('courses');

  const courses = [
    {
      id: 'getting-started',
      title: 'Getting Started with Virtual OPS Hub',
      description: 'Learn the basics of your AI-powered business assistant',
      lessons: 5,
      duration: '30 min',
      level: 'Beginner',
      progress: 0,
      icon: '🚀',
    },
    {
      id: 'vopsy-mastery',
      title: 'VOPSy Mastery',
      description: 'Unlock the full potential of your AI assistant',
      lessons: 8,
      duration: '45 min',
      level: 'Intermediate',
      progress: 0,
      icon: '🤖',
    },
    {
      id: 'integrations',
      title: 'Integration Deep Dive',
      description: 'Connect Google, Microsoft, and more',
      lessons: 6,
      duration: '35 min',
      level: 'Intermediate',
      progress: 0,
      icon: '🔗',
    },
    {
      id: 'automation',
      title: 'Business Automation',
      description: 'Automate repetitive tasks with AI',
      lessons: 10,
      duration: '60 min',
      level: 'Advanced',
      progress: 0,
      icon: '⚡',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Academy</h1>
          <p className="text-slate-400 mt-1">Learn how to get the most out of Virtual OPS Hub</p>
        </div>

        {/* Progress Summary */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase mb-1">Courses In Progress</p>
            <p className="text-3xl font-black text-white">0</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase mb-1">Completed</p>
            <p className="text-3xl font-black text-emerald-500">0</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5">
            <p className="text-xs text-slate-500 uppercase mb-1">Total Learning Time</p>
            <p className="text-3xl font-black text-orange-500">0h</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'courses'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📚 All Courses
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'progress'
                ? 'bg-orange-500 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            📈 My Progress
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-orange-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-2xl">
                  {course.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      course.level === 'Beginner' ? 'bg-emerald-500/20 text-emerald-500' :
                      course.level === 'Intermediate' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-purple-500/20 text-purple-500'
                    }`}>
                      {course.level}
                    </span>
                    <span className="text-xs text-slate-500">{course.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{course.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{course.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-slate-500">{course.lessons} lessons</span>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all">
                      Start Course
                    </button>
                  </div>
                </div>
              </div>
              {course.progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
