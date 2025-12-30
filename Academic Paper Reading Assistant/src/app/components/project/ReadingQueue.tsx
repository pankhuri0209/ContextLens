import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, TrendingUp, TrendingDown, Play, Trash2, Calendar, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import type { ProjectPaper, PaperCategory } from '../../../data/projectData';
import { categoryConfig } from '../../../data/projectData';
import { Button } from '../ui/button';

interface QueueItem {
  paper: ProjectPaper;
  addedDate: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  estimatedMinutes: number;
  dependencies: string[]; // IDs of papers that cite this one
}

interface ReadingQueueProps {
  projectId: string;
  queueItems: QueueItem[];
  onRemove: (paperId: string) => void;
  onUpdatePriority: (paperId: string, priority: 'high' | 'medium' | 'low') => void;
  onGenerateReadingPlan: () => void;
}

export function ReadingQueue({ 
  projectId, 
  queueItems, 
  onRemove, 
  onUpdatePriority,
  onGenerateReadingPlan 
}: ReadingQueueProps) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'priority' | 'time' | 'dependency'>('priority');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const priorityConfig = {
    high: { color: '#EF4444', label: 'High', icon: TrendingUp },
    medium: { color: '#F59E0B', label: 'Medium', icon: TrendingUp },
    low: { color: '#10B981', label: 'Low', icon: TrendingDown }
  };

  const sortedQueue = [...queueItems].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      // Secondary sort by dependencies
      return b.dependencies.length - a.dependencies.length;
    } else if (sortBy === 'time') {
      return a.estimatedMinutes - b.estimatedMinutes;
    } else { // dependency
      return b.dependencies.length - a.dependencies.length;
    }
  });

  const totalEstimatedTime = queueItems.reduce((acc, item) => acc + item.estimatedMinutes, 0);
  const highPriorityCount = queueItems.filter(item => item.priority === 'high').length;

  const toggleSelection = (paperId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(paperId)) {
      newSelection.delete(paperId);
    } else {
      newSelection.add(paperId);
    }
    setSelectedItems(newSelection);
  };

  const handleBatchRemove = () => {
    selectedItems.forEach(paperId => onRemove(paperId));
    setSelectedItems(new Set());
  };

  if (queueItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Your reading queue is empty</h3>
        <p className="text-gray-600 mb-6">
          Add papers from your library to prioritize your reading
        </p>
        <Button onClick={() => navigate(`/project/${projectId}`)}>
          Browse Papers Library
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Total Time</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            ~{Math.floor(totalEstimatedTime / 60)}h {totalEstimatedTime % 60}m
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 text-red-700 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">High Priority</span>
          </div>
          <p className="text-2xl font-bold text-red-900">{highPriorityCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Papers Queued</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">{queueItems.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sortBy === 'priority' ? 'default' : 'outline'}
              onClick={() => setSortBy('priority')}
            >
              Priority
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'time' ? 'default' : 'outline'}
              onClick={() => setSortBy('time')}
            >
              Reading Time
            </Button>
            <Button
              size="sm"
              variant={sortBy === 'dependency' ? 'default' : 'outline'}
              onClick={() => setSortBy('dependency')}
            >
              Dependencies
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedItems.size > 0 && (
            <>
              <span className="text-sm text-gray-600">{selectedItems.size} selected</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleBatchRemove}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={onGenerateReadingPlan}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate Reading Plan
          </Button>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {sortedQueue.map((item, index) => {
          const PriorityIcon = priorityConfig[item.priority].icon;
          const isSelected = selectedItems.has(item.paper.id);

          return (
            <motion.div
              key={item.paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border rounded-xl p-5 transition-all ${
                isSelected 
                  ? 'border-blue-500 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(item.paper.id)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />

                {/* Queue Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-700">{index + 1}</span>
                </div>

                {/* Paper Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 leading-tight">
                        {item.paper.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.paper.authors.slice(0, 3).join(', ')}
                        {item.paper.authors.length > 3 && ` +${item.paper.authors.length - 3} more`}
                      </p>
                    </div>

                    {/* Priority Badge */}
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => {
                          const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
                          const currentIndex = priorities.indexOf(item.priority);
                          const nextPriority = priorities[(currentIndex + 1) % 3];
                          onUpdatePriority(item.paper.id, nextPriority);
                        }}
                        className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all hover:opacity-80"
                        style={{
                          backgroundColor: `${priorityConfig[item.priority].color}20`,
                          color: priorityConfig[item.priority].color,
                          border: `1px solid ${priorityConfig[item.priority].color}40`
                        }}
                      >
                        <PriorityIcon className="w-3 h-3" />
                        {priorityConfig[item.priority].label}
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {item.paper.categories.map(cat => {
                      const config = categoryConfig[cat];
                      return (
                        <span
                          key={cat}
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${config.color}15`,
                            color: config.color
                          }}
                        >
                          {config.icon} {config.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Reason & Metadata */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                    <p className="text-sm text-blue-900">
                      <span className="font-semibold">Why it's queued:</span> {item.reason}
                    </p>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~{item.estimatedMinutes} min</span>
                    </div>
                    {item.dependencies.length > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Cited by {item.dependencies.length} papers in project</span>
                      </div>
                    )}
                    {item.dueDate && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Calendar className="w-4 h-4" />
                        <span>Due {new Date(item.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Relevance:</span>
                      <span className="text-blue-600 font-semibold">
                        {item.paper.relevanceScore}/100
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/project/${projectId}/read/${item.paper.id}`)}
                    className="whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Reading
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemove(item.paper.id)}
                    className="whitespace-nowrap text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>

              {/* Dependencies Preview */}
              {item.dependencies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-600 mb-1">
                    📚 Read this before: {item.dependencies.slice(0, 2).join(', ')}
                    {item.dependencies.length > 2 && ` +${item.dependencies.length - 2} more`}
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
