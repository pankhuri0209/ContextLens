import React from 'react';
import { Clock, Book, TrendingUp, Target, Flame, FileText, Eye, Bookmark, Award } from 'lucide-react';
import { motion } from 'motion/react';
import type { Project, ProjectPaper } from '../../../data/projectData';

interface ReadingAnalyticsProps {
  project: Project;
  papers: ProjectPaper[];
}

// Mock data for analytics
const mockReadingStats = {
  papersReadOverTime: [
    { date: '2024-12-01', count: 2 },
    { date: '2024-12-08', count: 3 },
    { date: '2024-12-15', count: 5 },
    { date: '2024-12-22', count: 4 },
    { date: '2024-12-29', count: 6 }
  ],
  averageReadingSpeed: 2.5, // pages per hour
  productiveHours: ['14:00-16:00', '20:00-22:00'],
  currentStreak: 7,
  longestStreak: 12,
  totalReadingTime: 1840, // minutes
  citationsExploredPerPaper: 8.3,
  notesPerPaper: 4.2,
  papersRevisited: 3,
  readingGoals: [
    {
      id: 'g1',
      title: 'Read 10 Methods papers this month',
      current: 7,
      target: 10,
      category: 'methods',
      deadline: '2025-01-31'
    },
    {
      id: 'g2',
      title: 'Complete foundational reading',
      current: 4,
      target: 5,
      category: 'foundational',
      deadline: '2025-01-15'
    }
  ],
  categoryBreakdown: [
    { category: 'Methods', count: 12, avgTime: 45 },
    { category: 'Knowledge', count: 8, avgTime: 38 },
    { category: 'Conclusion', count: 6, avgTime: 32 },
    { category: 'Foundational', count: 4, avgTime: 55 },
    { category: 'Review', count: 3, avgTime: 50 }
  ],
  insights: [
    {
      type: 'warning',
      title: 'Conclusion papers need deeper reading',
      description: 'You tend to skim Conclusion papers (avg 32 min vs 45 min for Methods). Try spending more time understanding empirical results.'
    },
    {
      type: 'success',
      title: 'Strong citation exploration',
      description: 'You explore 8.3 citations per paper on average, which is excellent for deep understanding.'
    },
    {
      type: 'tip',
      title: 'Peak productivity: 2-4 PM',
      description: 'Schedule important reading sessions during your most productive hours for better comprehension.'
    }
  ]
};

export function ReadingAnalytics({ project, papers }: ReadingAnalyticsProps) {
  const stats = mockReadingStats;
  const totalPapersRead = stats.categoryBreakdown.reduce((acc, cat) => acc + cat.count, 0);
  const avgReadingTimeMinutes = Math.floor(stats.totalReadingTime / totalPapersRead);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200"
        >
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Book className="w-5 h-5" />
            <span className="text-sm font-medium">Papers Read</span>
          </div>
          <p className="text-3xl font-bold text-blue-900 mb-1">{totalPapersRead}</p>
          <p className="text-xs text-blue-600">+6 this week</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200"
        >
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Reading Speed</span>
          </div>
          <p className="text-3xl font-bold text-purple-900 mb-1">{stats.averageReadingSpeed}</p>
          <p className="text-xs text-purple-600">pages/hour average</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200"
        >
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <p className="text-3xl font-bold text-orange-900 mb-1">{stats.currentStreak} days</p>
          <p className="text-xs text-orange-600">Best: {stats.longestStreak} days 🏆</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200"
        >
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Total Time</span>
          </div>
          <p className="text-3xl font-bold text-green-900 mb-1">
            {Math.floor(stats.totalReadingTime / 60)}h
          </p>
          <p className="text-xs text-green-600">{avgReadingTimeMinutes} min/paper avg</p>
        </motion.div>
      </div>

      {/* Reading Over Time Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">Papers Read Over Time</h3>
        <div className="flex items-end gap-4 h-48">
          {stats.papersReadOverTime.map((entry, idx) => {
            const maxCount = Math.max(...stats.papersReadOverTime.map(e => e.count));
            const heightPercent = (entry.count / maxCount) * 100;
            
            return (
              <div key={entry.date} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg relative group cursor-pointer"
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {entry.count} papers
                    </div>
                  </motion.div>
                </div>
                <span className="text-xs text-gray-600">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reading Behavior & Goals */}
      <div className="grid grid-cols-2 gap-6">
        {/* Comprehension Indicators */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold mb-4">Comprehension Indicators</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-gray-700">Citations explored/paper</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{stats.citationsExploredPerPaper}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700">Notes taken/paper</span>
              </div>
              <span className="text-lg font-bold text-purple-600">{stats.notesPerPaper}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-gray-700">Papers revisited</span>
              </div>
              <span className="text-lg font-bold text-orange-600">{stats.papersRevisited}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">
                <span className="font-semibold text-green-700">Great engagement!</span> Your citation exploration rate suggests deep understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Reading Goals */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Reading Goals</h3>
            <button className="text-sm text-blue-600 hover:underline">+ New Goal</button>
          </div>
          <div className="space-y-4">
            {stats.readingGoals.map(goal => {
              const progress = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{goal.title}</p>
                      <p className="text-xs text-gray-600">
                        {goal.current} of {goal.target} • {daysLeft} days left
                      </p>
                    </div>
                    {progress >= 100 && (
                      <Award className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className={`h-full rounded-full ${
                        progress >= 100 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : progress >= 70
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            View All Goals
          </button>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">Reading by Category</h3>
        <div className="space-y-3">
          {stats.categoryBreakdown.map((cat, idx) => {
            const maxCount = Math.max(...stats.categoryBreakdown.map(c => c.count));
            const widthPercent = (cat.count / maxCount) * 100;
            
            return (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{cat.category}</span>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>{cat.count} papers</span>
                    <span className="text-xs">avg {cat.avgTime} min</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Productivity Insights */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">Productivity Insights</h3>
        <div className="space-y-4">
          {stats.insights.map((insight, idx) => {
            const iconConfig = {
              success: { Icon: TrendingUp, color: 'green' },
              warning: { Icon: Target, color: 'orange' },
              tip: { Icon: Flame, color: 'blue' }
            };
            const { Icon, color } = iconConfig[insight.type as keyof typeof iconConfig];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  color === 'green' 
                    ? 'bg-green-50 border-green-200' 
                    : color === 'orange'
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  color === 'green' 
                    ? 'bg-green-100' 
                    : color === 'orange'
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    color === 'green' 
                      ? 'text-green-700' 
                      : color === 'orange'
                      ? 'text-orange-700'
                      : 'text-blue-700'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold mb-1 ${
                    color === 'green' 
                      ? 'text-green-900' 
                      : color === 'orange'
                      ? 'text-orange-900'
                      : 'text-blue-900'
                  }`}>
                    {insight.title}
                  </p>
                  <p className={`text-sm ${
                    color === 'green' 
                      ? 'text-green-800' 
                      : color === 'orange'
                      ? 'text-orange-800'
                      : 'text-blue-800'
                  }`}>
                    {insight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Best Reading Times */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Clock className="w-6 h-6 text-purple-700" />
          </div>
          <div>
            <h4 className="font-bold text-purple-900 mb-2">Your Peak Productivity Hours</h4>
            <p className="text-sm text-purple-800 mb-3">
              You read best during: <span className="font-semibold">{stats.productiveHours.join(' and ')}</span>
            </p>
            <p className="text-sm text-purple-700">
              💡 Try scheduling important reading sessions during these times for better comprehension and retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}