import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockProjects, mockProjectPapers } from '../../data/projectData';
import { Button } from '../components/ui/button';
import { ReadingQueue } from '../components/project/ReadingQueue';

// Mock reading queue data
const mockQueueItems = [
  {
    paper: mockProjectPapers[0],
    addedDate: '2024-12-20',
    reason: 'Cited by 3 papers in your project',
    priority: 'high' as const,
    estimatedMinutes: 45,
    dependencies: ['Deep Learning Fundamentals', 'Attention Mechanisms', 'Protein Structure Basics'],
    dueDate: '2024-12-31'
  },
  {
    paper: mockProjectPapers[1],
    addedDate: '2024-12-22',
    reason: 'Core methodology paper for your research area',
    priority: 'high' as const,
    estimatedMinutes: 52,
    dependencies: ['Transformer Architecture Overview'],
  },
  {
    paper: mockProjectPapers[2],
    addedDate: '2024-12-24',
    reason: 'Recommended by AI based on your interests',
    priority: 'medium' as const,
    estimatedMinutes: 38,
    dependencies: [],
  },
  {
    paper: mockProjectPapers[3],
    addedDate: '2024-12-25',
    reason: 'Part of your foundational reading list',
    priority: 'medium' as const,
    estimatedMinutes: 60,
    dependencies: ['Historical Context of Protein Folding'],
  },
  {
    paper: mockProjectPapers[4],
    addedDate: '2024-12-27',
    reason: 'Similar methodology to papers you\'ve favorited',
    priority: 'low' as const,
    estimatedMinutes: 35,
    dependencies: [],
  },
];

export function ReadingQueueScreen() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [queueItems, setQueueItems] = useState(mockQueueItems);
  
  const project = mockProjects.find(p => p.id === projectId);

  const handleRemoveFromQueue = (paperId: string) => {
    setQueueItems(prev => prev.filter(item => item.paper.id !== paperId));
  };

  const handleUpdatePriority = (paperId: string, priority: 'high' | 'medium' | 'low') => {
    setQueueItems(prev => prev.map(item => 
      item.paper.id === paperId ? { ...item, priority } : item
    ));
  };

  const handleGenerateReadingPlan = () => {
    alert('AI Reading Plan Generator\n\nBased on your queue, we recommend:\n1. Read high-priority papers with dependencies first\n2. Schedule 2-3 papers per week\n3. Focus on Methods papers during your peak hours (2-4 PM)');
  };

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/project/${projectId}`)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <div>
                <h1 className="text-2xl font-bold">Reading Queue</h1>
                <p className="text-sm text-gray-600">{project.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <ReadingQueue
          projectId={projectId || ''}
          queueItems={queueItems}
          onRemove={handleRemoveFromQueue}
          onUpdatePriority={handleUpdatePriority}
          onGenerateReadingPlan={handleGenerateReadingPlan}
        />
      </div>
    </div>
  );
}
