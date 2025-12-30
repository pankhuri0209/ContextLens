import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TreeNode } from '../../../data/knowledgeTreeData';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface TimelineViewProps {
  nodes: TreeNode[];
  onNodeClick: (node: TreeNode) => void;
}

interface TimelineEvent {
  year: number;
  nodes: TreeNode[];
}

export function TimelineView({ nodes, onNodeClick }: TimelineViewProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Group nodes by year (extracted from createdAt)
  const timelineData: TimelineEvent[] = [];
  const yearMap = new Map<number, TreeNode[]>();

  nodes.forEach(node => {
    const year = new Date(node.createdAt).getFullYear();
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)!.push(node);
  });

  yearMap.forEach((nodes, year) => {
    timelineData.push({ year, nodes });
  });

  timelineData.sort((a, b) => a.year - b.year);

  const getNodeColor = (type: TreeNode['type']) => {
    switch (type) {
      case 'mechanism':
        return { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-700', emoji: '🔵' };
      case 'solution':
        return { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-700', emoji: '🟢' };
      case 'gap':
        return { bg: 'bg-red-100', border: 'border-red-400', text: 'text-red-700', emoji: '🔴' };
      default:
        return { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', emoji: '⚪' };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🌳 Knowledge Tree - Timeline View</h2>
        <p className="text-sm text-gray-600">
          Evolution of knowledge over time
        </p>
      </div>

      {/* Legend */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-6 text-sm flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-700">Color:</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔵</span>
            <span className="text-gray-700">Mechanism</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🟢</span>
            <span className="text-gray-700">Solution</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔴</span>
            <span className="text-gray-700">Gap</span>
          </div>
          <div className="ml-auto text-gray-600">
            Size = number of papers
          </div>
        </div>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="relative pl-12 pr-4">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300" />

          {/* Timeline events */}
          <div className="space-y-8">
            {timelineData.map((event, eventIndex) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: eventIndex * 0.1 }}
                className="relative"
              >
                {/* Year marker */}
                <div className="absolute -left-12 top-0">
                  <div className="flex items-center">
                    <motion.div
                      className="w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-md"
                      whileHover={{ scale: 1.2 }}
                    />
                  </div>
                </div>

                {/* Year label */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{event.year}</h3>
                  <p className="text-sm text-gray-600">
                    {event.nodes.length} {event.nodes.length === 1 ? 'development' : 'developments'}
                  </p>
                </div>

                {/* Nodes for this year */}
                <div className="space-y-3">
                  {event.nodes.map((node, nodeIndex) => {
                    const colors = getNodeColor(node.type);
                    const size = Math.min(60, 30 + node.paperCount * 3);

                    return (
                      <motion.button
                        key={node.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: eventIndex * 0.1 + nodeIndex * 0.05 }}
                        onClick={() => onNodeClick(node)}
                        className={`w-full text-left p-4 rounded-lg border-2 ${colors.border} ${colors.bg} hover:shadow-md transition-all cursor-pointer`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Node indicator */}
                          <div
                            className={`flex-shrink-0 flex items-center justify-center rounded-full ${colors.bg} border-2 ${colors.border}`}
                            style={{ width: size, height: size }}
                          >
                            <span className="text-2xl">{colors.emoji}</span>
                          </div>

                          {/* Node content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-semibold ${colors.text}`}>
                                {node.title}
                              </h4>
                              {node.isFoundational && (
                                <span className="text-lg flex-shrink-0">⭐</span>
                              )}
                            </div>

                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                              {node.what}
                            </p>

                            <div className="flex items-center gap-3 mt-3">
                              <Badge variant="outline" className="text-xs">
                                {node.paperCount} papers
                              </Badge>
                              {node.how.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {node.how.length} {node.how.length === 1 ? 'method' : 'methods'}
                                </Badge>
                              )}
                              {node.gaps.length > 0 && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-300">
                                  {node.gaps.length} {node.gaps.length === 1 ? 'gap' : 'gaps'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Current frontier marker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: timelineData.length * 0.1 }}
            className="relative mt-8 pb-4"
          >
            <div className="absolute -left-12 top-0">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-purple-600 border-4 border-white shadow-md animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-purple-700">Present</span>
              <span className="text-sm text-gray-600">— Current frontier</span>
            </div>
          </motion.div>
        </div>
      </ScrollArea>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          💡 <span className="font-medium">Tip:</span> Click any node to see detailed information. 
          Larger nodes indicate more papers contributing to that area.
        </p>
      </div>
    </div>
  );
}
