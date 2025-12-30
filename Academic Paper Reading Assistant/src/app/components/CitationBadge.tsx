import React from 'react';
import { motion } from 'motion/react';
import type { Citation } from '../../data/mockData';

interface CitationBadgeProps {
  citation: Citation | undefined;
  onClick?: () => void;
  className?: string;
}

export function CitationBadge({ citation, onClick, className = '' }: CitationBadgeProps) {
  // Guard against undefined citation
  if (!citation) {
    return null;
  }

  const getColorClasses = () => {
    switch (citation.citationPurpose) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200';
      case 'core-method':
        return 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200';
      case 'supporting':
        return 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200';
      case 'background':
        return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded border transition-colors duration-100 cursor-pointer ${getColorClasses()} ${className}`}
    >
      <span className="text-xs font-medium">{citation.authors?.[0]?.split(',')[0] || 'Unknown'}</span>
      <span className="text-xs opacity-70">{citation.year}</span>
      <span className="text-xs font-semibold">{citation.importanceScore}</span>
    </motion.button>
  );
}