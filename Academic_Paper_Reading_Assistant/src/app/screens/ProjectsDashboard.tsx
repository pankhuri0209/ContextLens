import React, { useState } from 'react';
import { Plus, Grid3x3, List, Search, TrendingUp, Clock, Database, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { mockProjects } from '../../data/projectData';
import { ProjectCard } from '../components/ProjectCard';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { UserMenu } from '../components/UserMenu';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';

export function ProjectsDashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header with User Menu */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#2563EB]" />
            <span className="font-semibold text-xl">PhD Reader</span>
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2">My Research Projects</h1>
            <p className="text-gray-600">Organize and manage your PhD research across multiple projects</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search projects..." className="pl-10" />
            </div>

            {/* Projects Grid */}
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-6' : 'space-y-4'}>
              {mockProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}

              {/* Add New Project Card */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mockProjects.length * 0.1 }}
                onClick={() => setShowCreateModal(true)}
                className="border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center gap-4 hover:border-[#2563EB] hover:bg-blue-50 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#2563EB] transition-colors" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-gray-900 mb-1">Create New Project</h3>
                  <p className="text-sm text-gray-600">Start organizing your research</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Cross-Project Insights */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#2563EB]" />
                Cross-Project Insights
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Total Papers Across All Projects</div>
                  <div className="text-3xl font-bold text-gray-900">88</div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium mb-3">Most Common Research Areas</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Machine Learning</span>
                      <span className="font-medium">3 projects</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Deep Learning</span>
                      <span className="font-medium">2 projects</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="text-sm font-medium mb-3">Shared Papers</div>
                  <p className="text-sm text-gray-600">
                    5 papers appear in multiple projects
                  </p>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <h3 className="flex items-center gap-2 mb-4">
                <span className="text-lg">🤖</span>
                AI Recommendations
              </h3>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    3 new papers for "Transformer Models"
                  </div>
                  <p className="text-xs text-gray-600">
                    Based on your recent reading activity
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Related paper found in Project B
                  </div>
                  <p className="text-xs text-gray-600">
                    Might be relevant to "GNN Survey"
                  </p>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                View All Suggestions
              </Button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-gray-400" />
                Recent Activity
              </h3>

              <div className="space-y-4">
                {[
                  { project: 'Transformer Models', action: 'Added 2 papers', time: '2h ago' },
                  { project: 'GNN Survey', action: 'Categorized 5 papers', time: '5h ago' },
                  { project: 'Explainable AI', action: 'Completed reading', time: '1d ago' },
                ].map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {activity.project}
                      </div>
                      <div className="text-xs text-gray-600">{activity.action}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-gray-400" />
                Storage
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Papers</span>
                  <span className="font-medium text-gray-900">88 files</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Storage used</span>
                  <span className="font-medium text-gray-900">3.2 GB / 10 GB</span>
                </div>
                <Progress value={32} className="h-2 mt-3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onComplete={(project) => {
          console.log('Created project:', project);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
}