import React from 'react';
import { TrendingUp, Network, BookOpen, Download, Sparkles, FileText, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import type { Project, ProjectPaper } from '../../../data/projectData';
import { categoryConfig } from '../../../data/projectData';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { ReadingAnalytics } from './ReadingAnalytics';

interface InsightsTabProps {
  project: Project;
  papers: ProjectPaper[];
}

export function InsightsTab({ project, papers }: InsightsTabProps) {
  // Calculate category distribution
  const categoryData = Object.entries(categoryConfig).map(([key, config]) => {
    const count = papers.reduce((sum, paper) => {
      return sum + (paper.categories.includes(key as any) ? 1 : 0);
    }, 0);

    return {
      name: config.label,
      value: count,
      color: config.color,
    };
  }).filter(d => d.value > 0);

  // Mock reading progress data
  const readingProgressData = [
    { month: 'Sep', papers: 2 },
    { month: 'Oct', papers: 5 },
    { month: 'Nov', papers: 8 },
    { month: 'Dec', papers: 7 },
  ];

  // Top authors data
  const topAuthorsData = project.mostCitedAuthors.map((author, i) => ({
    author: author.split(',')[0],
    citations: [18, 15, 12][i] || 10,
  }));

  return (
    <Tabs defaultValue="project" className="space-y-6">
      <TabsList className="bg-white border border-gray-200">
        <TabsTrigger value="project">
          <Network className="w-4 h-4 mr-2" />
          Project Insights
        </TabsTrigger>
        <TabsTrigger value="reading">
          <BarChart3 className="w-4 h-4 mr-2" />
          Reading Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="project">
        <div className="space-y-6">
          {/* Visual Analytics */}
          <div className="grid grid-cols-2 gap-6">
            {/* Paper Type Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="mb-4">Paper Type Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: cat.color }} />
                      <span className="text-gray-700">{cat.name}</span>
                    </div>
                    <span className="font-medium">{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="mb-4">Reading Progress Over Time</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={readingProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Line type="monotone" dataKey="papers" stroke="#2563EB" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Most Cited Authors */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                Most Cited Authors
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topAuthorsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="author" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Bar dataKey="citations" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Methodology Map */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-gray-400" />
                Key Methodologies
              </h3>
              <div className="space-y-3">
                {project.keyMethodologies.map((method, i) => (
                  <div key={method}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-700">{method}</span>
                      <span className="font-medium">{[12, 8, 6][i]} papers</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${[85, 60, 45][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-900 mb-2">
                  Knowledge Gap Detected
                </div>
                <p className="text-sm text-blue-700">
                  Few papers on evaluation metrics. Consider adding more empirical studies.
                </p>
              </div>
            </div>
          </div>

          {/* Smart Summaries */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <h3 className="mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Key Methodologies in This Project
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="font-medium mb-1">Transformer Architectures</div>
                  <p className="text-gray-600">
                    12 papers discuss transformer models, with focus on attention mechanisms and self-attention layers
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="font-medium mb-1">MSA Processing</div>
                  <p className="text-gray-600">
                    8 papers cover multiple sequence alignment techniques for evolutionary information
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="font-medium mb-1">End-to-End Learning</div>
                  <p className="text-gray-600">
                    6 papers implement differentiable end-to-end approaches for structure prediction
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200 p-6">
              <h3 className="mb-4">Research Timeline</h3>
              <div className="space-y-4">
                {[
                  { year: 2017, event: 'Attention mechanism introduced', count: 2 },
                  { year: 2019, event: 'First end-to-end protein folding', count: 4 },
                  { year: 2021, event: 'AlphaFold breakthrough', count: 8 },
                  { year: 2023, event: 'Language model approaches', count: 5 },
                ].map((item) => (
                  <div key={item.year} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                        {item.count}
                      </div>
                      <div className="w-0.5 h-full bg-orange-300 mt-2" />
                    </div>
                    <div className="pb-4">
                      <div className="font-medium text-sm">{item.year}</div>
                      <div className="text-sm text-gray-600">{item.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-gray-400" />
              Export Options
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <Button variant="outline" className="flex-col h-auto py-4">
                <BookOpen className="w-6 h-6 mb-2" />
                <span>Literature Review Outline</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-4">
                <Network className="w-6 h-6 mb-2" />
                <span>Citation Network</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-4">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span>Reading List by Category</span>
              </Button>
              <Button variant="outline" className="flex-col h-auto py-4">
                <FileText className="w-6 h-6 mb-2" />
                <span>Methodology Table</span>
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reading">
        <ReadingAnalytics project={project} papers={papers} />
      </TabsContent>
    </Tabs>
  );
}