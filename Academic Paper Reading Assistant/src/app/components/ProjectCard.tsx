import React from 'react';
import { motion } from 'motion/react';
import { MoreVertical, FileText, CheckCircle, BookOpen, TrendingUp, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../../data/projectData';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface ProjectCardProps {
  project: Project;
  onEdit?: () => void;
  onArchive?: () => void;
  onExport?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({ project, onEdit, onArchive, onExport, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  const readPercentage = (project.papersRead / project.totalPapers) * 100;
  const citationsPercentage = (project.criticalCitationsReviewed / project.totalCriticalCitations) * 100;

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
      className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer transition-all"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="font-semibold text-lg">{project.name}</h3>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(); }}>
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive?.(); }}>
              Archive
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onExport?.(); }}>
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.researchAreas.slice(0, 3).map((area) => (
          <span
            key={area}
            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
          >
            {area}
          </span>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
            <FileText className="w-5 h-5 text-gray-400" />
            {project.paperCount}
          </div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-orange-600">
            <BookOpen className="w-5 h-5" />
            {project.unreadCount}
          </div>
          <div className="text-xs text-gray-600">Unread</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
            <CheckCircle className="w-5 h-5" />
            {project.annotatedCount}
          </div>
          <div className="text-xs text-gray-600">Annotated</div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Papers Read</span>
            <span className="font-medium text-gray-900">
              {project.papersRead}/{project.totalPapers}
            </span>
          </div>
          <Progress value={readPercentage} className="h-2" style={{ 
            backgroundColor: '#E5E7EB',
          }} />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Critical Citations Reviewed</span>
            <span className="font-medium text-gray-900">
              {project.criticalCitationsReviewed}/{project.totalCriticalCitations}
            </span>
          </div>
          <Progress value={citationsPercentage} className="h-2" />
        </div>
      </div>

      {/* Quick Insights */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Top authors: {project.mostCitedAuthors.slice(0, 2).join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Network className="w-3.5 h-3.5" />
          <span>Key methods: {project.keyMethodologies.slice(0, 2).join(', ')}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Active {formatLastActivity(project.lastActivity)}
        </span>
        {project.aiSuggestionsEnabled && (
          <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
            AI Enabled
          </span>
        )}
      </div>
    </motion.div>
  );
}
