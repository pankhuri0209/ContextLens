import React from 'react';
import { motion } from 'motion/react';
import { TreeNode, NodeType } from '../../../data/knowledgeTreeData';
import { FileText } from 'lucide-react';

interface KnowledgeTreeNodeProps {
  node: TreeNode;
  isSelected: boolean;
  onClick: () => void;
  scale: number;
}

const nodeTypeConfig: Record<NodeType, { color: string; bgColor: string; borderColor: string; emoji: string }> = {
  problem: {
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#EF4444',
    emoji: '🔴'
  },
  solution: {
    color: '#059669',
    bgColor: '#D1FAE5',
    borderColor: '#10B981',
    emoji: '🟢'
  },
  mechanism: {
    color: '#2563EB',
    bgColor: '#DBEAFE',
    borderColor: '#3B82F6',
    emoji: '🔵'
  },
  gap: {
    color: '#DC2626',
    bgColor: '#FEE2E2',
    borderColor: '#EF4444',
    emoji: '🔴'
  }
};

export function KnowledgeTreeNode({ node, isSelected, onClick, scale }: KnowledgeTreeNodeProps) {
  const config = nodeTypeConfig[node.type];
  const nodeSize = Math.max(80, Math.min(140, 80 + node.paperCount * 5));

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        left: node.position.x,
        top: node.position.y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        transformOrigin: 'center',
        zIndex: isSelected ? 10 : 1
      }}
    >
      <motion.button
        onClick={onClick}
        className="relative cursor-pointer focus:outline-none group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ width: nodeSize, height: nodeSize }}
      >
        {/* Node background */}
        <div
          className={`w-full h-full rounded-full border-3 shadow-lg transition-all ${
            isSelected ? 'ring-4 ring-purple-400 ring-offset-2' : ''
          }`}
          style={{
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
            borderWidth: '3px'
          }}
        >
          <div className="flex flex-col items-center justify-center h-full p-3 text-center">
            <span className="text-lg mb-1">{config.emoji}</span>
            <p
              className="font-medium leading-tight"
              style={{ 
                fontSize: nodeSize > 100 ? '13px' : '11px',
                color: config.color 
              }}
            >
              {node.title}
            </p>
          </div>
        </div>

        {/* Paper count badge */}
        <div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1 bg-white border-2"
          style={{ borderColor: config.borderColor }}
        >
          <FileText className="w-3 h-3" style={{ color: config.color }} />
          <span style={{ color: config.color }}>{node.paperCount}</span>
        </div>

        {/* Foundational star */}
        {node.isFoundational && (
          <div className="absolute -top-1 -right-1 text-xl">⭐</div>
        )}

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
          <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-xl">
            <div className="font-semibold">{node.title}</div>
            <div className="text-gray-300 mt-1">{node.paperCount} papers • Click for details</div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
}
