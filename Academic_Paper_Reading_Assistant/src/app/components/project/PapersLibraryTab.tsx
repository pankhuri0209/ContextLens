import React, { useState } from 'react';
import { Plus, Search, Filter, Grid3x3, List, ChevronDown, FileText, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import type { ProjectPaper, PaperCategory } from '../../../data/projectData';
import { categoryConfig } from '../../../data/projectData';
import { CategoryTag } from '../CategoryTag';
import { RelevanceScore } from '../RelevanceScore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { Checkbox } from '../ui/checkbox';
import { UploadPapersModal } from './UploadPapersModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface PapersLibraryTabProps {
  projectId: string;
  projectName: string;
  papers: ProjectPaper[];
}

export function PapersLibraryTab({ projectId, projectName, papers }: PapersLibraryTabProps) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategories, setSelectedCategories] = useState<PaperCategory[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredPapers = papers.filter((paper) => {
    if (selectedCategories.length === 0) return true;
    return paper.categories.some((cat) => selectedCategories.includes(cat));
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return '✓';
      case 'in-progress':
        return '○';
      case 'key-paper':
        return '★';
      default:
        return '□';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'read':
        return 'Read';
      case 'in-progress':
        return 'In Progress';
      case 'key-paper':
        return 'Key Paper';
      default:
        return 'Unread';
    }
  };

  // Count papers by category
  const categoryCounts = papers.reduce((acc, paper) => {
    paper.categories.forEach((cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Left Sidebar - Filters */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter by Category
          </h3>

          <div className="space-y-2">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const count = categoryCounts[key] || 0;
              if (key === 'uncategorized' && count === 0) return null;

              return (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(key as PaperCategory)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCategories([...selectedCategories, key as PaperCategory]);
                      } else {
                        setSelectedCategories(selectedCategories.filter((c) => c !== key));
                      }
                    }}
                  />
                  <span className="text-lg">{config.icon}</span>
                  <span className="text-sm flex-1">{config.label}</span>
                  <span className="text-xs text-gray-500">({count})</span>
                </label>
              );
            })}
          </div>

          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategories([])}
              className="w-full mt-3"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium mb-3">Quick Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Papers</span>
              <span className="font-semibold">{papers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Categorized</span>
              <span className="font-semibold">
                {papers.filter((p) => p.categories.length > 0).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Relevance</span>
              <span className="font-semibold">
                {Math.round(papers.reduce((sum, p) => sum + p.relevanceScore, 0) / papers.length)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Papers List */}
      <div className="col-span-3 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search papers..." className="pl-9" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Papers
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsUploadModalOpen(true)}>Upload PDF</DropdownMenuItem>
              <DropdownMenuItem>Add by DOI/URL</DropdownMenuItem>
              <DropdownMenuItem>AI Suggest Papers</DropdownMenuItem>
              <DropdownMenuItem>Import from BibTeX</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              <Grid3x3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Papers List */}
        <div className="space-y-3">
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedPapers.includes(paper.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedPapers([...selectedPapers, paper.id]);
                      } else {
                        setSelectedPapers(selectedPapers.filter((id) => id !== paper.id));
                      }
                    }}
                    className="mt-1"
                  />

                  {/* Thumbnail/Icon */}
                  <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{paper.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {paper.authors.join(', ')} • {paper.venue} {paper.year}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RelevanceScore score={paper.relevanceScore} reasoning={paper.aiReasoning} />
                      </div>
                    </div>

                    {/* Categories and Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {paper.categories.map((category) => (
                        <CategoryTag key={category} category={category} size="sm" />
                      ))}
                      {paper.customTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Status and Progress */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span>{getStatusIcon(paper.status)}</span>
                        <span className="text-gray-600">{getStatusLabel(paper.status)}</span>
                      </div>

                      {paper.status === 'in-progress' && (
                        <div className="flex items-center gap-2 flex-1 max-w-xs">
                          <Progress value={paper.readProgress} className="h-1.5" />
                          <span className="text-xs text-gray-500">{paper.readProgress}%</span>
                        </div>
                      )}

                      <div className="ml-auto flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/project/${projectId}/read/${paper.id}`)}
                        >
                          Read
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedPaper(expandedPaper === paper.id ? null : paper.id)}
                        >
                          {expandedPaper === paper.id ? '▲' : '▼'}
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedPaper === paper.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="space-y-3 text-sm">
                          <div>
                            <div className="font-medium mb-1">AI Reasoning</div>
                            <p className="text-gray-600">{paper.aiReasoning}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="font-medium mb-1">Citations</div>
                              <p className="text-gray-600">{paper.citationCount.toLocaleString()}</p>
                            </div>
                            <div>
                              <div className="font-medium mb-1">Added</div>
                              <p className="text-gray-600">
                                {new Date(paper.dateAdded).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {paper.doi && (
                            <div>
                              <div className="font-medium mb-1">DOI</div>
                              <p className="text-gray-600 font-mono text-xs">{paper.doi}</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedPapers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-lg shadow-lg p-4 flex items-center gap-4"
          >
            <span className="font-medium">{selectedPapers.length} selected</span>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm">Categorize</Button>
              <Button variant="secondary" size="sm">Add Tags</Button>
              <Button variant="secondary" size="sm">Move</Button>
              <Button variant="secondary" size="sm">Remove</Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPapers([])}
              className="text-white hover:text-white"
            >
              Clear
            </Button>
          </motion.div>
        )}
      </div>

      {/* Upload Papers Modal */}
      <UploadPapersModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projectId={projectId}
        projectName={projectName}
        onComplete={(newPapers) => {
          // In a real app, this would update the backend and refetch
          console.log('Papers uploaded:', newPapers);
          setIsUploadModalOpen(false);
        }}
      />
    </div>
  );
}