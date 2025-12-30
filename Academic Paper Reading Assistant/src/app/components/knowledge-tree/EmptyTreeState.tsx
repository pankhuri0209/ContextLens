import React from 'react';
import { motion } from 'motion/react';
import { TreeDeciduous, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyTreeStateProps {
  onBuildTree: () => void;
  paperCount: number;
}

export function EmptyTreeState({ onBuildTree, paperCount }: EmptyTreeStateProps) {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg" style={{ height: '600px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md px-8"
      >
        {/* Animated Tree Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <TreeDeciduous className="w-24 h-24 text-green-600 mx-auto" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30"
            />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Your Knowledge Tree is Empty
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Start building your research map by analyzing papers in your project. 
          The tree will automatically organize knowledge by problems, solutions, and gaps.
        </p>

        {/* Stats */}
        {paperCount > 0 && (
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>
                <span className="font-semibold text-blue-600">{paperCount}</span> papers 
                ready to analyze
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onBuildTree}
            size="lg"
            className="w-full"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Build Knowledge Tree
          </Button>

          <p className="text-xs text-gray-500">
            This may take a few moments depending on the number of papers
          </p>
        </div>

        {/* Features List */}
        <div className="mt-8 text-left">
          <p className="text-sm font-medium text-gray-700 mb-3">What you'll get:</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Visual map organized by research domains</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Automatic problem-solution relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Research gaps highlighted for opportunities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Export as structured literature review</span>
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
