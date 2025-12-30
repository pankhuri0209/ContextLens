import React from 'react';
import { motion } from 'motion/react';
import { categoryConfig, type PaperCategory } from '../../data/projectData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface CategoryTagProps {
  category: PaperCategory;
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  isPrimary?: boolean;
}

export function CategoryTag({ 
  category, 
  size = 'md', 
  removable = false, 
  onRemove, 
  onClick,
  isPrimary = false 
}: CategoryTagProps) {
  const config = categoryConfig[category];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-3 py-1 gap-1.5',
    lg: 'text-base px-4 py-1.5 gap-2'
  };

  const scale = isPrimary ? 1.1 : 1;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale, opacity: 1 }}
            whileHover={{ scale: scale * 1.05 }}
            style={{ backgroundColor: `${config.color}15`, borderColor: config.color }}
            className={`inline-flex items-center rounded-full border-2 ${sizeClasses[size]} ${
              onClick ? 'cursor-pointer hover:shadow-sm' : ''
            } ${isPrimary ? 'font-semibold' : 'font-medium'} transition-all`}
            onClick={onClick}
          >
            <span className={size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm'}>
              {config.icon}
            </span>
            <span style={{ color: config.color }}>{config.label}</span>
            {removable && onRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="ml-1 hover:bg-black/10 rounded-full p-0.5"
                style={{ color: config.color }}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
