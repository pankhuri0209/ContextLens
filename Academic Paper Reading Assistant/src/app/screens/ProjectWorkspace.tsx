import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter, Grid3x3, List, TrendingUp } from 'lucide-react';
import { mockProjects, mockProjectPapers, mockAISuggestions } from '../../data/projectData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PapersLibraryTab } from '../components/project/PapersLibraryTab';
import { AIAssistantTab } from '../components/project/AIAssistantTab';
import { InsightsTab } from '../components/project/InsightsTab';
import { KnowledgeTreeTab } from '../components/knowledge-tree/KnowledgeTreeTab';

export function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = mockProjects.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('papers');

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h1 className="text-2xl">{project.name}</h1>
                <p className="text-sm text-gray-600">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Papers:</span>
              <span className="font-semibold">{project.paperCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Read:</span>
              <span className="font-semibold">{project.papersRead}/{project.totalPapers}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Annotated:</span>
              <span className="font-semibold">{project.annotatedCount}</span>
            </div>
            {project.aiSuggestionsEnabled && (
              <div className="ml-auto">
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                  ✨ AI Enabled ({project.aiSuggestionFrequency})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="papers">Papers Library</TabsTrigger>
            <TabsTrigger value="ai">AI Research Assistant</TabsTrigger>
            <TabsTrigger value="insights">Insights & Analytics</TabsTrigger>
            <TabsTrigger value="knowledge-tree">🌳 Knowledge Tree</TabsTrigger>
          </TabsList>

          <TabsContent value="papers" className="mt-0 pt-6">
            <PapersLibraryTab projectId={id!} projectName={project.name} papers={project.papers} />
          </TabsContent>

          <TabsContent value="ai">
            <AIAssistantTab projectId={project.id} suggestions={mockAISuggestions} />
          </TabsContent>

          <TabsContent value="insights">
            <InsightsTab project={project} papers={mockProjectPapers} />
          </TabsContent>

          <TabsContent value="knowledge-tree">
            <KnowledgeTreeTab projectId={project.id} projectName={project.name} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}